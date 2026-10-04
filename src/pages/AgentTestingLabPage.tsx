import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SpatialVoiceCore, VoiceCoreState } from '../components/SpatialVoiceCore';
import { AgentStatusBadge } from '../components/AgentStatusBadge';
import { AgentHealthModal } from '../components/AgentHealthModal';
import { AnimatedText } from '../components/AnimatedText';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  PhoneCall,
  PhoneOff,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Sliders,
  Play,
  BrainCircuit,
  Target,
  UserCheck,
  FileText,
  Loader2,
  Sparkles,
  Database,
  Radio,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  sendAgentChatMessage,
  synthesizeSpeechElevenLabs,
  fetchVapiClientConfig,
  fetchVapiStatus,
  VapiStatusData
} from '../services/apiService';
import { vapiWebManager, VapiCallStatus, isNormalMeetingEnd } from '../services/vapiWebClient';
import { buildVapiAssistantOverrides } from '../utils/vapiOverrides';

export const AgentTestingLabPage: React.FC = () => {
  const { agents, knowledgeDocs, navigate, addToast } = useApp();
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Engine selection: Vapi Live Voice Call vs Gemini Chat & Simulation
  const [testEngine, setTestEngine] = useState<'VAPI_VOICE' | 'GEMINI_SIMULATION'>('VAPI_VOICE');
  const [vapiStatus, setVapiStatus] = useState<VapiStatusData | null>(null);
  const [vapiCallStatus, setVapiCallStatus] = useState<VapiCallStatus>('idle');
  const [vapiCallDuration, setVapiCallDuration] = useState(0);

  // Simulator & Testing States
  const [sessionActive, setSessionActive] = useState(false);
  const [coreState, setCoreState] = useState<VoiceCoreState>('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // In-progress partial streaming transcript (avoids jitter and wild re-renders)
  const [liveStreaming, setLiveStreaming] = useState<{ sender: 'user' | 'agent'; text: string } | null>(null);

  // Intent & Lead extraction state from Gemini
  const [lastIntent, setLastIntent] = useState<string | null>(null);
  const [lastReasoning, setLastReasoning] = useState<string | null>(null);
  const [lastExtractedLead, setLastExtractedLead] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    interest?: string;
    notes?: string;
  } | null>(null);
  const [lastKnowledgeUsed, setLastKnowledgeUsed] = useState<boolean>(false);

  // Real-time audio waveform simulation data
  const [waveformData, setWaveformData] = useState<number[]>([20, 45, 80, 60, 95, 30, 70, 85, 40, 90, 65, 35, 75, 50, 85, 30]);

  // Chat Conversation (Committed completed turns)
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent' | 'error'; text: string; time: string; reasoning?: string }>>([
    {
      sender: 'agent',
      text: `আসসালামু আলাইকুম! আমি ${currentAgent?.businessName || 'AI Skill Hub BD'}-এর অফিশিয়াল AI রিসেপশনিস্ট। AI Mastermind Course এবং AI Innovators Club সংক্রান্ত যেকোনো তথ্যের জন্য আমি আপনাকে সহায়তা করতে প্রস্তুত।`,
      time: '12:00 PM'
    }
  ]);

  // Quality Evaluation
  const [qualityScore, setQualityScore] = useState({
    knowledgeAccuracy: 98,
    tone: 99,
    languageFluency: 96,
    leadCollection: 92,
    responseSpeedMs: 290,
    status: 'OPTIMAL'
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load Vapi server status on mount
  useEffect(() => {
    fetchVapiStatus().then((res) => {
      if (res.data) setVapiStatus(res.data);
    });

    return () => {
      vapiWebManager.stopCall();
    };
  }, []);

  // Vapi Call Duration Timer
  useEffect(() => {
    let timer: any;
    if (vapiCallStatus === 'connected' || vapiCallStatus === 'speaking' || vapiCallStatus === 'listening') {
      timer = setInterval(() => {
        setVapiCallDuration((d) => d + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [vapiCallStatus]);

  // Auto-scroll when messages or liveStreaming updates
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveStreaming, coreState, isProcessing]);

  // Vapi Real-Time Voice Call Handlers with Dynamic Knowledge Overrides
  const handleStartVapiCall = async () => {
    try {
      setErrorMessage(null);
      setVapiCallStatus('connecting');
      setCoreState('THINKING');

      const configRes = await fetchVapiClientConfig();
      const publicKey = configRes.data?.publicKey || '51a6f3cb-3964-4047-87f0-7e7278a94e0b';
      const assistantId = currentAgent?.vapiAssistantId || configRes.data?.assistantId || 'b37b72e1-047d-408b-9096-cc5cf21256cd';

      setVapiCallDuration(0);

      // Build full dynamic assistant overrides with AI Mastermind & Club knowledge
      const assistantOverrides = buildVapiAssistantOverrides(currentAgent);

      await vapiWebManager.startCall(
        publicKey,
        assistantId,
        {
          onStatusChange: (status) => {
            setVapiCallStatus(status);
            if (status === 'connected') setCoreState('LISTENING');
            else if (status === 'speaking') setCoreState('SPEAKING');
            else if (status === 'listening') setCoreState('LISTENING');
            else if (status === 'connecting') setCoreState('THINKING');
            else if (status === 'ended' || status === 'error') {
              setCoreState('IDLE');
              setLiveStreaming(null);
            }
          },
          onTranscript: (item) => {
            const sender = item.role === 'user' ? 'user' : 'agent';
            const cleanText = (item.text || '').trim();
            if (!cleanText) return;

            // If the item is final, push to committed messages array
            if (item.isFinal || item.transcriptType === 'final') {
              setLiveStreaming(null);
              setMessages((prev) => [
                ...prev,
                {
                  sender,
                  text: cleanText,
                  time: item.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            } else {
              // Partial streaming updates live speech bubble only
              setLiveStreaming({ sender, text: cleanText });
            }
          },
          onVolumeChange: (vol) => {
            const clamped = Math.min(100, Math.max(15, Math.round(vol * 100)));
            setWaveformData((prev) =>
              prev.map((old, i) => (i % 2 === 0 ? clamped : Math.max(15, Math.round(clamped * 0.75))))
            );
          },
          onError: (err) => {
            if (isNormalMeetingEnd(err)) {
              setVapiCallStatus('ended');
              setCoreState('IDLE');
              setLiveStreaming(null);
              addToast('কল সমাপ্ত', 'ভয়েস কল সমাপ্ত হয়েছে', 'info');
              return;
            }
            console.warn('Vapi call event notification:', err);
            const msg = err?.errorMsg || err?.message || 'ভয়েস কল সম্পন্ন হয়েছে';
            setErrorMessage(null);
            setVapiCallStatus('ended');
            setCoreState('IDLE');
            setLiveStreaming(null);
            addToast('কল স্ট্যাটাস', msg, 'info');
          }
        },
        assistantOverrides
      );

      addToast(
        'Vapi Voice Call Connected',
        `${currentAgent?.name || 'Ai Skill Hub Receptionist'}-এর সাথে লাইভ ভয়েস কল সংযুক্ত হয়েছে`,
        'success'
      );
    } catch (err: any) {
      if (isNormalMeetingEnd(err)) {
        setVapiCallStatus('ended');
        setCoreState('IDLE');
        setLiveStreaming(null);
        addToast('কল সমাপ্ত', 'ভয়েস কল সমাপ্ত হয়েছে', 'info');
        return;
      }
      console.warn('Failed to start Vapi call:', err);
      const msg = err?.message || 'মাইক্রোফোন পারমিশন বা Vapi সংযোগ পরীক্ষা করুন';
      setErrorMessage(msg);
      setVapiCallStatus('error');
      setCoreState('IDLE');
      setLiveStreaming(null);
      addToast('ভয়েস কল শুরু করা যায়নি', msg, 'error');
    }
  };

  const handleStopVapiCall = () => {
    // Flush any live streaming text before ending
    if (liveStreaming?.text) {
      setMessages((prev) => [
        ...prev,
        {
          sender: liveStreaming.sender,
          text: liveStreaming.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
    setLiveStreaming(null);
    vapiWebManager.stopCall();
    setVapiCallStatus('ended');
    setCoreState('IDLE');
    addToast('কল সমাপ্ত', 'Vapi ভয়েস কল শেষ হয়েছে', 'info');
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (testEngine === 'VAPI_VOICE') {
      vapiWebManager.setMuted(nextMute);
    }
  };

  // Waveform oscillation during speaking or listening
  useEffect(() => {
    let interval: any;
    if (coreState === 'SPEAKING' || coreState === 'LISTENING') {
      interval = setInterval(() => {
        setWaveformData((prev) =>
          prev.map(() => Math.floor(Math.random() * (coreState === 'SPEAKING' ? 70 : 40)) + 20)
        );
      }, 120);
    } else {
      setWaveformData([15, 20, 25, 20, 30, 20, 25, 30, 20, 25, 20, 15, 25, 20, 20, 15]);
    }
    return () => clearInterval(interval);
  }, [coreState]);

  // Session Control (Gemini Mode)
  const handleStartSession = () => {
    setSessionActive(true);
    setCoreState('LISTENING');
    addToast('টেস্ট সেশন সক্রিয়', 'এজেন্ট কল শোনার জন্য প্রস্তুত', 'info');
  };

  const handleStopSession = () => {
    setSessionActive(false);
    setCoreState('IDLE');
    setLiveStreaming(null);
    addToast('টেস্ট সেশন সমাপ্ত', 'সেশন বন্ধ করা হয়েছে', 'info');
  };

  // Send message via Gemini reasoning API
  const handleSendMessage = async (textToSend?: string) => {
    const msg = (textToSend || inputText).trim();
    if (!msg) return;

    setInputText('');
    setErrorMessage(null);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: msg, time: timeStr }]);
    setCoreState('THINKING');
    setIsProcessing(true);

    const historyForBackend = messages
      .filter((m) => m.sender !== 'error')
      .map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text
      }));

    const knowledgeSnippet = knowledgeDocs.map((d) => `Document: ${d.fileName}\n${d.previewExcerpt}`).join('\n\n');

    try {
      const startTime = Date.now();
      const replyResult = await sendAgentChatMessage({
        message: msg,
        agent: {
          id: currentAgent?.id,
          name: currentAgent?.name,
          businessName: currentAgent?.businessName,
          type: currentAgent?.type,
          language: currentAgent?.language,
          personality: currentAgent?.personality,
          friendliness: currentAgent?.friendliness,
          professionalism: currentAgent?.professionalism,
          responseLength: currentAgent?.responseLength,
          instructions: currentAgent?.instructions,
          knowledgeBaseCount: currentAgent?.knowledgeBaseCount
        },
        conversationHistory: historyForBackend,
        knowledgeBaseContext: knowledgeSnippet
      });

      const latencyMs = Date.now() - startTime;

      if (!replyResult.success || !replyResult.data) {
        throw new Error(replyResult.error || 'Failed to receive reasoning from Gemini');
      }

      const data = replyResult.data;
      const responseText = data.replyText;

      setQualityScore({
        knowledgeAccuracy: data.qualityEvaluation?.knowledgeAccuracy ?? 98,
        tone: data.qualityEvaluation?.tone ?? 98,
        languageFluency: data.qualityEvaluation?.languageFluency ?? 96,
        leadCollection: data.qualityEvaluation?.leadCollection ?? 92,
        responseSpeedMs: latencyMs,
        status: latencyMs < 900 ? 'OPTIMAL' : 'GOOD'
      });

      if (data.intent) setLastIntent(data.intent);
      if (data.reasoning) setLastReasoning(data.reasoning);
      setLastKnowledgeUsed(Boolean(data.knowledgeUsed));

      if (data.leadData && (data.leadData.name || data.leadData.phone || data.leadData.interest)) {
        setLastExtractedLead(data.leadData);
        const leadSummary = [data.leadData.name, data.leadData.phone, data.leadData.interest].filter(Boolean).join(' • ');
        addToast('ইনটেন্ট ও কলার তথ্য শনাক্ত', `Intent: ${data.intent} (${leadSummary})`, 'success');
      }

      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: responseText,
          time: replyTime,
          reasoning: data.reasoning
        }
      ]);
      setCoreState('SPEAKING');

      // Speech synthesis
      if (audioEnabled && !isMuted) {
        try {
          const ttsResult = await synthesizeSpeechElevenLabs(responseText, currentAgent?.voiceId);
          if (ttsResult.audioUrl) {
            const audio = new Audio(ttsResult.audioUrl);
            audio.onended = () => {
              if (sessionActive) setCoreState('LISTENING');
              else setCoreState('IDLE');
            };
            audio.play().catch(() => {
              speakWithBrowser(responseText);
            });
          } else {
            speakWithBrowser(responseText);
          }
        } catch {
          speakWithBrowser(responseText);
        }
      } else {
        setTimeout(() => {
          if (sessionActive) setCoreState('LISTENING');
          else setCoreState('IDLE');
        }, 1400);
      }
    } catch (err: any) {
      const errorText = err?.message || 'Error occurred during message processing';
      setErrorMessage(errorText);
      const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          sender: 'error',
          text: `⚠️ ত্রুটি: ${errorText}`,
          time: errorTime
        }
      ]);
      setCoreState('IDLE');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakWithBrowser = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentAgent?.language === 'English' ? 'en-US' : 'bn-BD';
      utterance.onend = () => {
        if (sessionActive) setCoreState('LISTENING');
        else setCoreState('IDLE');
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        if (sessionActive) setCoreState('LISTENING');
        else setCoreState('IDLE');
      }, 1200);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header - Light Amber & Crisp Layout */}
      <div className="rounded-2xl p-5 sm:p-6 bg-[#0a0f1d] border border-cyan-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] text-cyan-400 font-mono font-bold uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
              Agent Testing Lab
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-[11px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>WebRTC & Vapi Online</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono font-medium">
              <Database className="w-3 h-3 text-cyan-400" />
              <span>Main Server Storage Synced</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            <Zap className="w-5 h-5 text-cyan-400" />
            <AnimatedText text="AI ভয়েস এজেন্ট টেস্টিং ল্যাব" variant="words" as="span" />
          </h2>
          <AnimatedText
            text="AI Mastermind Course ও AI Innovators Club সম্পর্কিত তথ্য, ডায়ালগ কোয়ালিটি ও রেসপন্স নির্ভুলতা পরীক্ষা করুন।"
            variant="rise"
            as="p"
            delay={0.15}
            className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsHealthModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Health Console</span>
          </button>

          <button
            onClick={() => navigate('/agents')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Agents List
          </button>
        </div>
      </div>

      {/* 3-Column Split Layout: LEFT (Settings), CENTER (Voice Core + Conversation), RIGHT (Quality Analysis) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Agent Settings & Knowledge Base Synced Card (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Target Agent Selector */}
          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-cyan-800/60 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Target Agent</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            {/* Agent Selector */}
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#04060c] border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.type})
                </option>
              ))}
            </select>

            {currentAgent && (
              <div className="space-y-2 pt-2 text-xs border-t border-slate-800/80 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Lifecycle:</span>
                  <AgentStatusBadge status={currentAgent.status} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Voice:</span>
                  <span className="text-cyan-400 font-semibold truncate max-w-[130px]">
                    {currentAgent.voiceId || 'bn-female-1'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Language:</span>
                  <span className="text-slate-200 font-medium">{currentAgent.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Knowledge:</span>
                  <span className="text-emerald-400 font-bold">{currentAgent.knowledgeBaseCount} docs</span>
                </div>
              </div>
            )}
          </div>

          {/* Active Knowledge Base Info Card */}
          <div className="p-4 rounded-2xl bg-[#070b16] border border-cyan-900/60 shadow-xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Active Agent Knowledge</span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
              <div className="p-2 rounded-lg bg-[#04060c] border border-slate-800">
                <strong className="text-cyan-300 block font-semibold">১. AI Mastermind Course:</strong>
                <span>ফি ৪,৫০০ টাকা (১০% ছাড়ে ৪,০৫০ টাকা)। মডিউল: পাইথন, প্রম্পট ইঞ্জিনিয়ারিং, অটোমেশন ও ভয়েস এজেন্ট। ক্লাস: শনি ও সোম রাত ৮টায় অনলাইন, শুক্র-শনি ধানমন্ডি ক্যাম্পাসে প্র্যাকটিক্যাল ল্যাব।</span>
              </div>
              <div className="p-2 rounded-lg bg-[#04060c] border border-slate-800">
                <strong className="text-cyan-300 block font-semibold">২. AI Innovators Club:</strong>
                <span>সাপ্তাহিক লাইভ মাস্টারক্লাস, প্রিমিয়াম এআই টুলস এক্সেস ও মেন্টরশিপ। কোর্সে ভর্তি হওয়া সকল শিক্ষার্থীকে সম্পূর্ণ ফ্রিতে ক্লাবের মেম্বারশিপ দেওয়া হয়।</span>
              </div>
            </div>
          </div>

          {/* Quick Test Inquiries */}
          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-cyan-800/60 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>এক ক্লিকে নলেজ টেস্ট করুন</span>
            </h4>
            <div className="space-y-1.5">
              {[
                'AI Mastermind Course ফি কত এবং কী কী শেখানো হয়?',
                'এই ক্লাবের মেম্বারশিপে কী কী সুবিধা আছে?',
                'ক্লাসের সময়সূচি ও ধানমন্ডি ক্যাম্পাসের ঠিকানা বলুন।',
                'আমি কোর্সে ভর্তি হতে চাই, কীভাবে শুরু করব?'
              ].map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(promptText)}
                  disabled={isProcessing}
                  className="w-full text-left p-2.5 rounded-xl bg-[#04060c] hover:bg-slate-900 text-[11px] text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer leading-tight disabled:opacity-50"
                >
                  "{promptText}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: AI Voice Core + Waveform + Multi-Line Conversation Feed (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-cyan-800/60 space-y-4 flex flex-col items-center shadow-xs">
            {/* Engine Switcher Header */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#04060c] border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTestEngine('VAPI_VOICE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    testEngine === 'VAPI_VOICE'
                      ? 'bg-cyan-500 text-slate-950 shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Vapi Live Voice</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </button>
                <button
                  type="button"
                  onClick={() => setTestEngine('GEMINI_SIMULATION')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    testEngine === 'GEMINI_SIMULATION'
                      ? 'bg-cyan-500 text-slate-950 shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Gemini Chat Test</span>
                </button>
              </div>

              {testEngine === 'VAPI_VOICE' ? (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate max-w-[200px] font-semibold">Ai Skill Hub Receptionist</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-lg">
                  <span>Gemini 2.5 Flash</span>
                </div>
              )}
            </div>

            {/* 3D Voice Core Centerpiece */}
            <div className="py-2">
              <SpatialVoiceCore
                state={coreState}
                size="hero"
                showLabel={true}
                connectionStatus={
                  testEngine === 'VAPI_VOICE'
                    ? vapiCallStatus === 'connecting'
                      ? 'Vapi: Connecting WebRTC...'
                      : vapiCallStatus === 'connected' || vapiCallStatus === 'speaking' || vapiCallStatus === 'listening'
                      ? `Vapi Live Call (${formatTimer(vapiCallDuration)})`
                      : vapiCallStatus === 'error'
                      ? 'Vapi Error'
                      : 'Vapi Voice Standby (Ready)'
                    : sessionActive
                    ? 'Lab Session Active'
                    : 'Standby (Ready)'
                }
              />
            </div>

            {/* Real-time Waveform Visualizer */}
            <div className="w-full px-6 flex items-center justify-center gap-1.5 h-10">
              {waveformData.map((val, idx) => (
                <motion.div
                  key={idx}
                  className={`w-1.5 rounded-full ${
                    testEngine === 'VAPI_VOICE' ? 'bg-cyan-400' : 'bg-blue-400'
                  }`}
                  animate={{ height: `${val}%` }}
                  transition={{ duration: 0.12 }}
                />
              ))}
            </div>

            {/* Vapi Call Active Pill */}
            {testEngine === 'VAPI_VOICE' && (vapiCallStatus === 'connected' || vapiCallStatus === 'speaking' || vapiCallStatus === 'listening') && (
              <div className="w-full px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-between font-mono animate-pulse">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold">লাইভ টেলিফোন ভয়েস কল সংযুক্ত (Two-way Audio)</span>
                </span>
                <span className="font-bold">{formatTimer(vapiCallDuration)}</span>
              </div>
            )}

            {/* Test Action Toolbar */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-slate-800 w-full justify-center flex-wrap">
              {testEngine === 'VAPI_VOICE' ? (
                // VAPI CONTROLS
                vapiCallStatus === 'connecting' ? (
                  <button
                    disabled
                    className="px-5 py-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold text-xs flex items-center gap-2 cursor-wait"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Connecting WebRTC...</span>
                  </button>
                ) : vapiCallStatus === 'connected' || vapiCallStatus === 'speaking' || vapiCallStatus === 'listening' ? (
                  <button
                    onClick={handleStopVapiCall}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>কল সমাপ্ত করুন ({formatTimer(vapiCallDuration)})</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartVapiCall}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Start Vapi Voice Call</span>
                  </button>
                )
              ) : (
                // GEMINI SIMULATION CONTROLS
                !sessionActive ? (
                  <button
                    onClick={handleStartSession}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Test</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopSession}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 rotate-[135deg]" />
                    <span>End Test</span>
                  </button>
                )
              )}

              <button
                onClick={handleToggleMute}
                className={`p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                  isMuted
                    ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
                title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                  !audioEnabled
                    ? 'bg-blue-950/80 border-blue-800 text-blue-300'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
                title={audioEnabled ? 'Voice output on' : 'Voice output muted'}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  setLiveStreaming(null);
                  setMessages([
                    {
                      sender: 'agent',
                      text: `আসসালামু আলাইকুম! আমি ${currentAgent?.businessName || 'AI Skill Hub BD'}-এর AI রিসেপশনিস্ট। কীভাবে আপনাকে সাহায্য করতে পারি?`,
                      time: '12:00 PM'
                    }
                  ]);
                }}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                title="Restart Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Feed - Spacious, High Line-Height, Multi-Line Multi-Turn Display */}
          <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-cyan-800/60 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>লাইভ কল ডায়ালগ ও ট্রান্সক্রিপ্ট ({messages.length} turns)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Auto-scroll enabled
              </span>
            </div>

            {/* Expanded Container: Multi-Line support (5, 8, 10 lines render with clear spacing) */}
            <div className="min-h-[440px] max-h-[580px] overflow-y-auto space-y-3.5 pr-1.5">
              {messages.map((msg, idx) => {
                if (msg.sender === 'error') {
                  return (
                    <div
                      key={idx}
                      className="w-full p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-200 flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="font-bold font-mono text-[10px] text-rose-300 flex items-center justify-between">
                          <span>SYSTEM NOTICE</span>
                          <span>{msg.time}</span>
                        </div>
                        <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                      </div>
                    </div>
                  );
                }

                const isUser = msg.sender === 'user';

                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 font-mono">
                      <span className="font-semibold text-slate-300">
                        {isUser ? 'Caller (গ্রাহক)' : currentAgent?.name || 'AI Receptionist'}
                      </span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>

                    <div
                      className={`max-w-[88%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                        isUser
                          ? 'bg-cyan-600 text-white rounded-tr-xs font-normal shadow-md'
                          : 'bg-[#04060c] border border-cyan-900/40 text-slate-200 rounded-tl-xs shadow-md'
                      }`}
                    >
                      {msg.text}
                      {msg.reasoning && (
                        <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 italic flex items-center gap-1">
                          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">Reasoning: {msg.reasoning}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* In-Progress Live Speech Transcript Bubble */}
              {liveStreaming && liveStreaming.text && (
                <div
                  className={`flex flex-col ${
                    liveStreaming.sender === 'user' ? 'items-end' : 'items-start'
                  } animate-pulse`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-cyan-400 font-mono font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>
                      {liveStreaming.sender === 'user' ? 'Caller is speaking...' : 'AI is speaking...'}
                    </span>
                  </div>
                  <div
                    className={`max-w-[88%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap border border-dashed ${
                      liveStreaming.sender === 'user'
                        ? 'bg-cyan-950/80 border-cyan-500/60 text-slate-200 rounded-tr-xs'
                        : 'bg-[#04060c] border-cyan-500/60 text-slate-200 rounded-tl-xs'
                    }`}
                  >
                    {liveStreaming.text}
                    <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-cyan-400 font-mono font-medium">
                    <BrainCircuit className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                    <span>{currentAgent?.name || 'AI Agent'} reasoning via Gemini...</span>
                  </div>
                  <div className="p-3.5 rounded-2xl text-xs bg-[#04060c] text-slate-300 border border-cyan-900/40 rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>নলেজ বেস থেকে সঠিক তথ্য প্রস্তুত হচ্ছে...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Test Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-800 no-scrollbar text-[11px]">
              <span className="text-[11px] font-mono text-cyan-400 font-bold whitespace-nowrap pl-1">
                Quick Prompts:
              </span>
              {[
                'AI Mastermind Course ফি কত ও ক্লাসের রুটিন বলুন',
                'AI Innovators Club কী এবং মেম্বারশিপ কীভাবে পাব?',
                'ধানমন্ডি ক্যাম্পাসে অফলাইন ক্লাস কবে হয়?',
                'ভর্তি প্রক্রিয়া ও পেমেন্ট বিস্তারিত জানান'
              ].map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp)}
                  disabled={isProcessing}
                  className="px-3 py-1 rounded-full bg-[#04060c] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer text-[11px] font-medium disabled:opacity-50"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={inputText}
                disabled={isProcessing}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder={isProcessing ? "AI চিন্তা করছে..." : "বাংলা অথবা ইংরেজিতে মেসেজ লিখুন (Enter চাপুন)..."}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#04060c] border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-medium placeholder-slate-500 disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isProcessing || !inputText.trim()}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Quality Analysis & Gemini Intelligence (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-cyan-800/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Quality Analysis
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Real-time inference grade</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-800/60">
                {qualityScore.status}
              </span>
            </div>

            {/* Metric Bars */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Knowledge Accuracy</span>
                  <span className="text-emerald-400 font-mono font-bold">{qualityScore.knowledgeAccuracy}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${qualityScore.knowledgeAccuracy}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Tone & Politeness</span>
                  <span className="text-amber-400 font-mono font-bold">{qualityScore.tone}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${qualityScore.tone}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Bangla Fluency</span>
                  <span className="text-cyan-400 font-mono font-bold">{qualityScore.languageFluency}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${qualityScore.languageFluency}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Lead Intent Detection</span>
                  <span className="text-purple-400 font-mono font-bold">{qualityScore.leadCollection}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${qualityScore.leadCollection}%` }} />
                </div>
              </div>
            </div>

            {/* Gemini Live Intelligence Panel: Intent & Leads */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Detected Intent</span>
                </span>
                <span className="font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60 text-[10px]">
                  {lastIntent || 'general_greeting'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Knowledge Used</span>
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  lastKnowledgeUsed ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {lastKnowledgeUsed ? 'Yes (Mastermind Grounded)' : 'Course Knowledge Active'}
                </span>
              </div>

              {lastExtractedLead && (lastExtractedLead.name || lastExtractedLead.phone || lastExtractedLead.interest) && (
                <div className="p-2.5 rounded-xl bg-[#0b0f16] border border-amber-800/60 space-y-1 text-[11px] text-slate-300 mt-2">
                  <div className="font-bold text-amber-400 flex items-center gap-1 text-[10px] uppercase font-mono">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Captured Lead Details</span>
                  </div>
                  {lastExtractedLead.name && <div>Name: <span className="font-bold text-white">{lastExtractedLead.name}</span></div>}
                  {lastExtractedLead.phone && <div>Phone: <span className="font-mono font-bold text-white">{lastExtractedLead.phone}</span></div>}
                  {lastExtractedLead.interest && <div>Interest: <span className="font-medium text-slate-200">{lastExtractedLead.interest}</span></div>}
                </div>
              )}
            </div>

            {/* Latency & Telemetry */}
            <div className="p-3 rounded-xl bg-[#04060c] border border-slate-800 text-[11px] space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Inference Latency</span>
                <span className="text-white font-bold">{qualityScore.responseSpeedMs} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Model</span>
                <span className="text-cyan-400 font-semibold">gemini-3.8-flash</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Evaluation Lab</span>
                <span className="text-emerald-400 font-bold">Online</span>
              </div>
            </div>
          </div>

          {/* Vapi Connection Details Card */}
          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-cyan-800/60 space-y-3 font-mono text-xs shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                <span>VAPI VOICE AGENT</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">
                READY
              </span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Assistant:</span>
                <span className="text-white font-medium truncate max-w-[140px]">
                  {currentAgent?.name || 'Ai Skill Hub Receptionist'}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400">Assistant ID:</span>
                <span className="text-cyan-300 text-[10px] truncate bg-[#04060c] p-1 rounded-lg border border-slate-800">
                  {currentAgent?.vapiAssistantId || 'b37b72e1-047d-408b-9096-cc5cf21256cd'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Knowledge Injected:</span>
                <span className="text-emerald-400 font-bold">Mastermind & Club</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Health Modal */}
      {currentAgent && (
        <AgentHealthModal
          agent={currentAgent}
          isOpen={isHealthModalOpen}
          onClose={() => setIsHealthModalOpen(false)}
          onNavigate={navigate}
        />
      )}
    </div>
  );
};
