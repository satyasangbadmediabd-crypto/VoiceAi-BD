import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { VOICE_OPTIONS } from '../mockData';
import { VoiceOption } from '../types';
import {
  Volume2,
  Play,
  Square,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Radio,
  Sliders,
  RefreshCw,
  Zap,
  Globe,
  Loader2
} from 'lucide-react';
import { fetchApiStatus, fetchElevenLabsVoices, synthesizeSpeechElevenLabs } from '../services/apiService';

export const VoiceSelectionPage: React.FC = () => {
  const { agents, updateAgent, addToast } = useApp();
  const [selectedVoiceId, setSelectedVoiceId] = useState('voice-bn-female-1');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const [isElevenLabsLive, setIsElevenLabsLive] = useState(false);
  const [voices, setVoices] = useState<VoiceOption[]>(VOICE_OPTIONS);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any ongoing audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingVoiceId(null);
    setIsSynthesizing(false);
  };

  // Load API status and voices
  useEffect(() => {
    let mounted = true;

    async function initVoices() {
      setIsLoadingVoices(true);
      const status = await fetchApiStatus();
      if (!mounted) return;

      if (status.elevenlabs.configured) {
        setIsElevenLabsLive(true);
        const elVoices = await fetchElevenLabsVoices();
        if (mounted && elVoices.configured && elVoices.voices.length > 0) {
          // Prepend high-priority ElevenLabs voices while keeping localized demo presets
          const formatted: VoiceOption[] = elVoices.voices.slice(0, 8).map((v) => ({
            id: v.id,
            name: v.name,
            gender: v.gender || 'Female',
            style: v.style || 'Hyper-realistic neural voice',
            language: v.language || 'Bangla / Multilingual',
            sampleAudioText: 'আসসালামু আলাইকুম! VoiceAI BD-তে স্বাগতম। আমি আপনার প্রতিষ্ঠানের এআই ভয়েস এজেন্ট।',
            accent: v.accent || 'Natural',
            previewUrl: v.previewUrl
          }));

          // Merge with localized demo options
          setVoices([...formatted, ...VOICE_OPTIONS]);
          if (formatted[0]) {
            setSelectedVoiceId(formatted[0].id);
          }
        }
      } else {
        setIsElevenLabsLive(false);
        setVoices(VOICE_OPTIONS);
      }

      setIsLoadingVoices(false);
    }

    initVoices();

    return () => {
      mounted = false;
      stopAudio();
    };
  }, []);

  // Play Preview Voice using ElevenLabs TTS server proxy, with fallback
  const handlePlayPreview = async (voice: VoiceOption) => {
    if (playingVoiceId === voice.id) {
      stopAudio();
      return;
    }

    stopAudio();
    setPlayingVoiceId(voice.id);

    const sampleText = voice.sampleAudioText || 'আসসালামু আলাইকুম! VoiceAI BD প্ল্যাটফর্মে আপনাকে স্বাগতম।';

    // If ElevenLabs API is live, call server TTS endpoint: /api/elevenlabs/tts
    if (isElevenLabsLive) {
      setIsSynthesizing(true);
      try {
        const result = await synthesizeSpeechElevenLabs(sampleText, voice.id, 'eleven_multilingual_v2');
        setIsSynthesizing(false);

        if (result.success && result.audioUrl) {
          const audio = new Audio(result.audioUrl);
          audioRef.current = audio;
          audio.onended = () => setPlayingVoiceId(null);
          audio.onerror = () => {
            setPlayingVoiceId(null);
            playFallbackSpeech(voice, sampleText);
          };
          audio.play().catch(() => playFallbackSpeech(voice, sampleText));
          return;
        } else {
          addToast('ভয়েস জেনারেশন সতর্কতা', 'Voice generation unavailable. Demo voice mode চালু করা হয়েছে।', 'warning');
          playFallbackSpeech(voice, sampleText);
          return;
        }
      } catch {
        setIsSynthesizing(false);
        addToast('ভয়েস জেনারেশন সতর্কতা', 'Voice generation unavailable. Demo voice mode চালু করা হয়েছে।', 'warning');
        playFallbackSpeech(voice, sampleText);
        return;
      }
    }

    // Demo Mode audio fallback
    playFallbackSpeech(voice, sampleText);
  };

  const playFallbackSpeech = (voice: VoiceOption, text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = voice.language.toLowerCase().includes('english') ? 'en-US' : 'bn-BD';
        utterance.rate = 0.95;
        utterance.pitch = voice.gender === 'Male' ? 0.9 : 1.1;
        utterance.onend = () => setPlayingVoiceId(null);
        utterance.onerror = () => setPlayingVoiceId(null);
        window.speechSynthesis.speak(utterance);
      } catch {
        setTimeout(() => setPlayingVoiceId(null), 3000);
      }
    } else {
      setTimeout(() => setPlayingVoiceId(null), 3000);
    }
  };

  const handleApplyVoiceToAgent = () => {
    if (!selectedAgentId) return;
    const targetAgent = agents.find((a) => a.id === selectedAgentId);
    const chosenVoice = voices.find((v) => v.id === selectedVoiceId) || VOICE_OPTIONS[0];
    if (targetAgent && chosenVoice) {
      updateAgent(selectedAgentId, { voiceId: selectedVoiceId });
      addToast('ভয়েস সফলভাবে সেট হয়েছে', `"${chosenVoice.name}" এখন ${targetAgent.name}-এর কণ্ঠস্বর।`, 'success');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-indigo-400" />
            <span>Choose your AI Voice</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            বাংলা ও ইংরেজির জন্য হাইপার-রিয়ালিস্টিক ভয়েস মডেল নির্বাচন করুন
          </p>
        </div>

        {/* ElevenLabs Provider Status Badge: LIVE API or DEMO MODE */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Voice Provider:</span>
          {isElevenLabsLive ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE API
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              DEMO MODE
            </span>
          )}
        </div>
      </div>

      {/* Voice Status Alert Info */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
          <span>
            {isElevenLabsLive
              ? 'ElevenLabs API সক্রিয়। Preview বাটনে ক্লিক করলে সার্ভার-সাইড TTS-এর মাধ্যমে রিয়েল অডিও তৈরি হবে।'
              : 'ElevenLabs API কী কনফিগার করা না থাকায় লোকাল ডেমো মোডে ভয়েস প্রিভিউ প্লে হচ্ছে।'}
          </span>
        </div>
        <div className="text-[11px] text-indigo-300 font-medium">
          {voices.length} টি ভয়েস উপলব্ধ
        </div>
      </div>

      {/* Voice Cards Grid */}
      {isLoadingVoices ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d1322] border border-slate-800">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">ভয়েস ক্যাটালগ লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {voices.map((voice) => {
            const isSelected = selectedVoiceId === voice.id;
            const isPlaying = playingVoiceId === voice.id;
            const isElevenLabsNative = voice.id.length > 15; // ElevenLabs IDs are long alphanumeric hashes

            return (
              <div
                key={voice.id}
                className={`rounded-2xl p-5 border transition-all relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#11182c] to-[#0c1220] border-indigo-500 shadow-xl shadow-indigo-950/40'
                    : 'bg-[#0d1322] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white">{voice.name}</h3>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700 text-[10px] font-semibold">
                          Selected
                        </span>
                      )}
                      {isElevenLabsNative && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-950/70 text-purple-300 border border-purple-800/80 text-[10px] font-medium">
                          ElevenLabs
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-indigo-300 font-medium mt-0.5">{voice.style}</p>
                    <p className="text-[11px] text-slate-400">
                      ভাষা: {voice.language} • অ্যাকসেন্ট: {voice.accent}
                    </p>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700 shrink-0">
                    {voice.gender}
                  </span>
                </div>

                {/* Sample Audio Text box */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 mb-4 text-xs text-slate-300 italic font-mono leading-relaxed">
                  "{voice.sampleAudioText}"
                </div>

                {/* Audio Waveform Animation when playing */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-1 h-6">
                    {[20, 50, 90, 40, 70, 100, 60, 30, 80, 50, 20].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlaying ? 'bg-indigo-400' : 'bg-slate-700 h-1'
                        }`}
                        style={{
                          height: isPlaying ? `${Math.max(4, h * (0.3 + Math.random() * 0.7))}%` : '4px'
                        }}
                      />
                    ))}
                    {isPlaying && (
                      <span className="text-[10px] text-indigo-400 font-mono ml-2 animate-pulse">
                        {isSynthesizing ? 'Synthesizing voice...' : 'Playing voice sample...'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Play Preview Voice Button */}
                    <button
                      type="button"
                      onClick={() => handlePlayPreview(voice)}
                      disabled={isSynthesizing && playingVoiceId === voice.id}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>থামুন</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Preview Voice</span>
                        </>
                      )}
                    </button>

                    {/* Select Voice Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedVoiceId(voice.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isSelected ? 'নির্বাচিত' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign to Agent Strip */}
      <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-white">নির্বাচিত ভয়েস কোনো এজেন্টে অ্যাসাইন করতে চান?</h3>
          <p className="text-xs text-slate-400">
            নিচের ড্রপডাউন থেকে আপনার যে কোনো তৈরি করা এজেন্টের জন্য এই ভয়েস নির্বাচন করুন
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.businessName})
              </option>
            ))}
          </select>

          <button
            onClick={handleApplyVoiceToAgent}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md cursor-pointer whitespace-nowrap"
          >
            ভয়েস সেভ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
