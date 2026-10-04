import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  PhoneOff,
  Phone,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Send,
  CheckCircle2,
  Info,
  ShieldCheck,
  Headphones,
  PhoneCall,
  Flame,
  FileText,
  X,
  Check,
  Zap,
  Loader2,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  fetchApiStatus,
  generateConversationReply,
  synthesizeSpeechElevenLabs,
  fetchVapiClientConfig
} from '../services/apiService';
import { vapiWebManager, isNormalMeetingEnd } from '../services/vapiWebClient';
import { buildVapiAssistantOverrides } from '../utils/vapiOverrides';

type CallStage =
  | 'incoming'
  | 'connecting'
  | 'connected'
  | 'conversation'
  | 'lead_detected'
  | 'ending'
  | 'completed';

export const CallSimulatorModal: React.FC = () => {
  const { isCallSimulatorOpen, closeCallSimulator, activeTestAgent, addCallLog, addLead, addToast } = useApp();

  const [stage, setStage] = useState<CallStage>('incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Simulator mode toggle: VAPI_LIVE vs REAL_AI vs SIMULATED
  const [simulatorMode, setSimulatorMode] = useState<'VAPI_LIVE' | 'REAL_AI' | 'SIMULATED'>('VAPI_LIVE');
  const [apiStatus, setApiStatus] = useState({ geminiLive: false, elevenLabsLive: false });

  // Conversation transcript state
  const [messages, setMessages] = useState<Array<{ speaker: 'AI' | 'Caller'; text: string; time: string; isRealAi?: boolean }>>([]);
  const [liveTranscript, setLiveTranscript] = useState<{ speaker: 'AI' | 'Caller'; text: string } | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [extractedLead, setExtractedLead] = useState<{ name: string; phone: string; interest: string } | null>(null);

  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const isEndingCallRef = useRef(false);

  const agentName = activeTestAgent?.name || 'Ai Skill Hub Receptionist';
  const businessName = activeTestAgent?.businessName || 'AI Skill Hub BD';
  const callerNumber = '+880 1712-345678';

  // Format timer 00:42
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Preset conversation turns tailored to AI Mastermind & Club
  const QUICK_QUESTIONS = [
    'AI Mastermind Course সম্পর্কে জানতে চাই।',
    'এই ক্লাব সম্বন্ধে বিস্তারিত বলুন।',
    'কোর্স ফি কত এবং কোনো ডিসকাউন্ট আছে কি?',
    'অনলাইন নাকি অফলাইন ব্যাচে ক্লাস হবে?',
    'আমার নাম তানভীর আহমেদ, ভর্তি কনফার্ম করতে চাই (+8801712345678)।',
    'অফিসের ঠিকানা এবং হেল্পলাইন সময়সূচি কী?'
  ];

  // Stop any active audio playback
  const stopAllAudio = () => {
    vapiWebManager.stopCall();
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      audioElementRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
  };

  // Initialize call & fetch server API status when modal opens
  useEffect(() => {
    if (isCallSimulatorOpen) {
      isEndingCallRef.current = false;
      setStage('incoming');
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeakerOn(true);
      setExtractedLead(null);
      setMessages([]);
      setLiveTranscript(null);
      setIsAiThinking(false);

      // Check server API status
      fetchApiStatus().then((status) => {
        const geminiLive = status.gemini.configured;
        const elevenLabsLive = status.elevenlabs.configured;
        setApiStatus({ geminiLive, elevenLabsLive });
      });
    } else {
      stopAllAudio();
    }

    return () => stopAllAudio();
  }, [isCallSimulatorOpen]);

  // Timer tick while in call
  useEffect(() => {
    let interval: any;
    if (stage === 'connected' || stage === 'conversation' || stage === 'lead_detected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage]);

  // Auto scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveTranscript, isAiThinking]);

  // Voice synthesis helper
  const playSpeech = async (text: string) => {
    if (!isSpeakerOn) return;
    stopAllAudio();

    if (simulatorMode === 'REAL_AI' && apiStatus.elevenLabsLive) {
      try {
        setIsAiSpeaking(true);
        const result = await synthesizeSpeechElevenLabs(text, activeTestAgent?.voiceId);
        if (result.success && result.audioUrl) {
          const audio = new Audio(result.audioUrl);
          audioElementRef.current = audio;
          audio.onended = () => setIsAiSpeaking(false);
          audio.onerror = () => {
            setIsAiSpeaking(false);
            playBrowserSpeech(text);
          };
          audio.play().catch(() => {
            setIsAiSpeaking(false);
            playBrowserSpeech(text);
          });
          return;
        }
      } catch {
        // Fallback to browser synthesis
      }
    }

    playBrowserSpeech(text);
  };

  const playBrowserSpeech = (text: string) => {
    if (!isSpeakerOn || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = activeTestAgent?.language === 'English' ? 'en-US' : 'bn-BD';
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsAiSpeaking(false);
    }
  };

  // Handle accepting incoming call with Vapi Assistant Overrides
  const handleAcceptCall = async () => {
    if (simulatorMode === 'VAPI_LIVE') {
      setStage('connecting');
      try {
        const config = await fetchVapiClientConfig();
        const publicKey = config.data?.publicKey || '51a6f3cb-3964-4047-87f0-7e7278a94e0b';
        const assistantId = config.data?.assistantId || 'b37b72e1-047d-408b-9096-cc5cf21256cd';

        // Inject dynamic assistant overrides with complete course & club knowledge
        const overrides = buildVapiAssistantOverrides(activeTestAgent);

        await vapiWebManager.startCall(
          publicKey,
          assistantId,
          {
            onCallStart: () => {
              setStage('connected');
              setTimeout(() => setStage('conversation'), 600);
              addToast('Vapi কল সংযুক্ত', 'Ai Skill Hub Receptionist-এর সাথে কথা বলুন', 'success');
            },
            onStatusChange: (status) => {
              if (status === 'connected') {
                setStage('conversation');
              } else if (status === 'speaking') {
                setIsAiSpeaking(true);
              } else if (status === 'listening') {
                setIsAiSpeaking(false);
              } else if (status === 'ended') {
                handleEndCall();
              }
            },
            onTranscript: (item) => {
              const speaker = item.role === 'user' ? 'Caller' : 'AI';
              const cleanText = (item.text || '').trim();
              if (!cleanText) return;

              // Check if final or partial
              if (item.isFinal || item.transcriptType === 'final') {
                setLiveTranscript(null);
                setMessages((prev) => [
                  ...prev,
                  {
                    speaker,
                    text: cleanText,
                    time: formatTimer(callDuration),
                    isRealAi: true
                  }
                ]);
              } else {
                setLiveTranscript({ speaker, text: cleanText });
              }
            },
            onError: (err) => {
              if (isNormalMeetingEnd(err)) {
                handleEndCall();
                return;
              }
              console.warn('Vapi error in simulator:', err);
              addToast('ভয়েস কল সমাপ্ত', err?.message || 'কল সম্পন্ন হয়েছে', 'info');
              handleEndCall();
            }
          },
          overrides
        );
      } catch (err: any) {
        console.error('Failed to start Vapi live call:', err);
        addToast('Vapi কানেক্ট ব্যর্থ', 'মাইক্রোফোন এক্সেস বা নেটওয়ার্ক পরীক্ষা করুন', 'error');
        setStage('incoming');
      }
      return;
    }

    // Default simulation or Real AI mode
    setStage('connecting');
    setTimeout(() => {
      setStage('connected');
      setTimeout(() => {
        setStage('conversation');

        // Dynamic greeting
        const greeting = `আসসালামু আলাইকুম! ${businessName}-এ আপনাকে স্বাগতম। আমি AI রিসেপশনিস্ট। AI Mastermind Course অথবা AI Innovators Club সংক্রান্ত কোনো তথ্য জানতে চাচ্ছেন কি?`;
        setMessages([
          {
            speaker: 'AI',
            text: greeting,
            time: '00:01',
            isRealAi: simulatorMode === 'REAL_AI'
          }
        ]);
        playSpeech(greeting);
      }, 700);
    }, 1000);
  };

  // Process user input
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || customInput).trim();
    if (!text) return;

    if (isMuted) {
      addToast('মাইক্রোফোন মিউট করা আছে', 'কথা বলতে মাইক আনমিউট করুন।', 'warning');
      return;
    }

    const callerMsg = {
      speaker: 'Caller' as const,
      text,
      time: formatTimer(callDuration)
    };

    setMessages((prev) => [...prev, callerMsg]);
    setCustomInput('');

    // Check if caller provides admission details / lead info
    const lower = text.toLowerCase();
    const hasLeadIntent =
      lower.includes('নাম') ||
      lower.includes('ভর্তি') ||
      lower.includes('+880') ||
      lower.includes('017') ||
      lower.includes('018') ||
      lower.includes('019') ||
      lower.includes('তানভীর');

    if (hasLeadIntent && !extractedLead) {
      setStage('lead_detected');
      const newLeadData = {
        name: text.includes('তানভীর') ? 'তানভীর আহমেদ' : 'সাকিব আহমেদ',
        phone: callerNumber,
        interest: 'AI Mastermind Course (Admission Inquiry)'
      };
      setExtractedLead(newLeadData);
      addLead({
        name: newLeadData.name,
        phone: newLeadData.phone,
        interest: newLeadData.interest,
        agentId: activeTestAgent?.id || 'agent-1',
        agentName: agentName,
        status: 'HOT',
        score: 95,
        notes: 'কল সিমুলেটরের মাধ্যমে সংগৃহীত লিড।'
      });
    }

    // REAL AI DEMO MODE (Gemini API)
    if (simulatorMode === 'REAL_AI') {
      setIsAiThinking(true);

      try {
        const replyResult = await generateConversationReply({
          userMessage: text,
          agentName,
          businessName,
          instructions: activeTestAgent?.instructions || '',
          language: activeTestAgent?.language || 'বাংলা',
          callerNumber,
          conversationHistory: messages
        });

        setIsAiThinking(false);

        if (replyResult.success && replyResult.isRealAi && replyResult.text) {
          const aiResponse = replyResult.text;
          setMessages((prev) => [
            ...prev,
            {
              speaker: 'AI',
              text: aiResponse,
              time: formatTimer(callDuration + 1),
              isRealAi: true
            }
          ]);
          playSpeech(aiResponse);
          return;
        } else {
          const errorMsg = replyResult.error || 'Gemini processing failed';
          addToast('Gemini Backend Error', errorMsg, 'error');
          setMessages((prev) => [
            ...prev,
            {
              speaker: 'AI',
              text: `⚠️ [Gemini Backend Error]: ${errorMsg}`,
              time: formatTimer(callDuration + 1),
              isRealAi: false
            }
          ]);
          return;
        }
      } catch (err: any) {
        setIsAiThinking(false);
        const errorMsg = err?.message || 'Gemini API connection error';
        addToast('Gemini Backend Error', errorMsg, 'error');
        setMessages((prev) => [
          ...prev,
          {
            speaker: 'AI',
            text: `⚠️ [Gemini Backend Error]: ${errorMsg}`,
            time: formatTimer(callDuration + 1),
            isRealAi: false
          }
        ]);
        return;
      }
    }

    // SIMULATED DEMO (Rule-based engine with Mastermind & Club Knowledge)
    setIsAiThinking(true);
    setTimeout(() => {
      setIsAiThinking(false);
      let aiResponse = '';

      if (lower.includes('ক্লাব') || lower.includes('club') || lower.includes('মেম্বার') || lower.includes('কমিউনিটি')) {
        aiResponse = 'আমাদের AI Innovators Club হলো শিক্ষার্থী ও এআই প্রফেশনালদের একটি এক্সক্লুসিভ ক্লাব। এই ক্লাবের মেম্বাররা প্রতি সপ্তাহে লাইভ মাস্টারক্লাস, প্রিমিয়াম এআই টুলস এক্সেস, কমিউনিটি নেটওয়ার্কিং ও ক্যারিয়ার মেন্টরশিপ সাপোর্ট পেয়ে থাকেন। AI Mastermind Course-এ ভর্তি হওয়া প্রতিটি শিক্ষার্থীকে এই ক্লাবের মেম্বারশিপ সম্পূর্ণ বিনামূল্যে প্রদান করা হয়।';
      } else if (lower.includes('মাস্টারমাইন্ড') || lower.includes('mastermind') || lower.includes('কোর্স') || lower.includes('সিলেবাস') || lower.includes('কারিকুলাম')) {
        aiResponse = 'আমাদের AI Mastermind Course-এ পাইথন প্রোগ্রামিং, প্রম্পট ইঞ্জিনিয়ারিং, অটোমেশন এবং লাইভ ভয়েস এজেন্ট ডেভেলপমেন্ট শেখানো হয়। কোর্স ফি মাত্র ৪,৫০০ টাকা (১০% স্পেশাল অফারে ৪,০৫০ টাকা)। আপনি কি অনলাইন নাকি ধানমন্ডি ক্যাম্পাসে অফলাইন ব্যাচে করতে চান?';
      } else if (lower.includes('ফি') || lower.includes('fee') || lower.includes('টাকা') || lower.includes('ডিসকাউন্ট')) {
        aiResponse = 'আমাদের AI Mastermind Course ফি ৪,৫০০ টাকা। বর্তমানে চলমান স্পেশাল অফারে ১০% ডিসকাউন্টে মাত্র ৪,০৫০ টাকায় ভর্তি হওয়া যাচ্ছে। আপনি কি এখনই ভর্তি কনফার্ম করতে চান?';
      } else if (lower.includes('অনলাইন') || lower.includes('অফলাইন') || lower.includes('ব্যাচ') || lower.includes('ক্লাস')) {
        aiResponse = 'আমাদের শুক্র ও শনিবার ধানমন্ডি ক্যাম্পাসে অফলাইন প্র্যাকটিক্যাল ক্লাস হয় এবং সপ্তাহে দুই দিন রাত ৮টায় জুমে অনলাইন ক্লাস অনুষ্ঠিত হয়। আপনি কোনটি প্রিফার করেন?';
      } else if (hasLeadIntent) {
        aiResponse = 'অনেক ধন্যবাদ! আমি আপনার নাম ও ফোন নম্বর এডমিশন সিস্টেমে এন্ট্রি করে নিয়েছি। আমাদের সিনিয়র এডমিশন কাউন্সেলর আজই আপনার সাথে যোগাযোগ করবেন।';
      } else if (lower.includes('ঠিকানা') || lower.includes('সময়সূচি') || lower.includes('অফিস')) {
        aiResponse = 'আমাদের প্রধান অফিস বাড়ি #৪৫, রোড #৭/এ, ধানমন্ডি, ঢাকা। আমাদের হেল্পলাইন প্রতিদিন সকাল ৯টা থেকে রাত ১০টা পর্যন্ত সক্রিয় থাকে।';
      } else {
        aiResponse = `ধন্যবাদ আপনার অনুসন্ধানের জন্য! ${businessName}-এর AI Mastermind Course (ফি ৪,০৫০ টাকা) এবং AI Innovators Club সংক্রান্ত সকল তথ্য দিতে আমি প্রস্তুত। আপনার সুবিধাজনক সময় ও মোবাইল নম্বরটি কি জানাবেন?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          speaker: 'AI',
          text: aiResponse,
          time: formatTimer(callDuration + 1),
          isRealAi: false
        }
      ]);

      playSpeech(aiResponse);
    }, 750);
  };

  // End call flow
  const handleEndCall = () => {
    if (isEndingCallRef.current || stage === 'ending' || stage === 'completed') return;
    isEndingCallRef.current = true;
    stopAllAudio();
    // Flush any live transcript
    if (liveTranscript?.text) {
      setMessages((prev) => [
        ...prev,
        {
          speaker: liveTranscript.speaker,
          text: liveTranscript.text,
          time: formatTimer(callDuration),
          isRealAi: true
        }
      ]);
    }
    setLiveTranscript(null);

    setStage('ending');

    setTimeout(() => {
      setStage('completed');

      addCallLog({
        caller: callerNumber,
        agentId: activeTestAgent?.id || 'agent-1',
        agentName,
        duration: formatTimer(callDuration),
        durationSeconds: callDuration,
        language: activeTestAgent?.language || 'বাংলা',
        date: new Date().toLocaleDateString('bn-BD'),
        status: extractedLead ? 'Qualified Lead' : 'Resolved',
        summary:
          extractedLead
            ? `গ্রাহক ${extractedLead.name} (${extractedLead.phone}) AI Mastermind Course ও ক্লাবে ভর্তি হতে আগ্রহী।`
            : 'AI Mastermind Course ফি ও ক্লাব মেম্বারশিপ সংক্রান্ত সফল টেলিফোন সংলাপ।',
        transcript:
          messages.length > 0
            ? messages
            : [{ speaker: 'AI', text: 'কল শুরু হয়েছে।', time: '00:01' }],
        leadCollected: extractedLead
          ? {
              name: extractedLead.name,
              phone: extractedLead.phone,
              interest: extractedLead.interest,
              intent: 'Immediate Admission'
            }
          : undefined
      });

      addToast('কল সমাপ্ত হয়েছে', `স্থায়িত্ব: ${formatTimer(callDuration)} | কল লগ ও ট্রান্সক্রিপ্ট সংরক্ষিত।`, 'success');
    }, 800);
  };

  if (!isCallSimulatorOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="w-full max-w-lg rounded-3xl bg-[#0a0f1d] border border-cyan-800/60 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        >
          {/* Top Banner: Mode Selector & Knowledge Indicator */}
          <div className="bg-[#060a14] px-4 py-2.5 border-b border-cyan-900/40 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <div className="flex items-center p-0.5 rounded-lg bg-[#030610] border border-slate-800 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setSimulatorMode('VAPI_LIVE')}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    simulatorMode === 'VAPI_LIVE'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PhoneCall className="w-3 h-3 text-slate-950" />
                  <span>VAPI LIVE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorMode('REAL_AI')}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    simulatorMode === 'REAL_AI'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  <span>REAL AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorMode('SIMULATED')}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    simulatorMode === 'SIMULATED'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SIMULATED
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                {simulatorMode === 'VAPI_LIVE'
                  ? 'Vapi WebRTC Live Voice'
                  : simulatorMode === 'REAL_AI'
                  ? 'Gemini Live Engine'
                  : 'Simulated Engine'}
              </span>
              <button
                onClick={closeCallSimulator}
                className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* STAGE 1: INCOMING CALL */}
          {stage === 'incoming' && (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 flex-1 bg-[#080d1a]">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 animate-ping absolute inset-0 opacity-40" />
                <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-500/20 relative z-10">
                  <PhoneCall className="w-10 h-10 animate-bounce" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
                  ইনকামিং কাস্টমার কল...
                </span>
                <h3 className="text-2xl font-black text-white font-mono pt-2">
                  {callerNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  Dhaka, Bangladesh • Routing to <strong className="text-white">{agentName}</strong>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0b0f16] border border-cyan-900/40 text-xs text-slate-300 w-full max-w-sm shadow-xs">
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  গ্রাহক আপনার হেল্পলাইন নম্বরে কল দিয়েছেন। AI মাস্টারমাইন্ড ও ক্লাব তথ্যের সাথে এজেন্ট কল রিসিভ করতে প্রস্তুত।
                </p>
              </div>

              {/* Accept / Decline */}
              <div className="flex items-center gap-6 pt-2">
                <button
                  onClick={closeCallSimulator}
                  className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  title="কল বাতিল করুন"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>

                <button
                  onClick={handleAcceptCall}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer animate-pulse"
                  title="কল রিসিভ করুন"
                >
                  <Phone className="w-7 h-7" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: CONNECTING */}
          {stage === 'connecting' && (
            <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 flex-1 bg-[#080d1a]">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 animate-spin">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">
                SIP গেটওয়ে ও ভয়েস ইঞ্জিন কানেক্ট হচ্ছে...
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                [Vapi Assistant Overrides Injected] • [AI Mastermind Course Loaded]
              </p>
            </div>
          )}

          {/* STAGE 3, 4, 5: ACTIVE CONVERSATION */}
          {(stage === 'connected' || stage === 'conversation' || stage === 'lead_detected') && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#080d1a]">
              {/* Agent Call Header */}
              <div className="p-4 bg-[#050811] border-b border-cyan-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[180px]">
                      {agentName}
                    </h4>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{formatTimer(callDuration)} • Connected</span>
                    </p>
                  </div>
                </div>

                {stage === 'lead_detected' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-[10px] font-bold text-emerald-400 animate-bounce">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lead Captured (95/100)</span>
                  </div>
                )}
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="py-2.5 px-5 bg-[#04060c] border-b border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    {isAiThinking
                      ? 'AI thinking & querying...'
                      : isAiSpeaking
                      ? 'AI Speaking...'
                      : isMuted
                      ? 'Muted'
                      : 'Listening to caller...'}
                  </span>
                  {isAiThinking && <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />}
                </div>

                <div className="flex items-center gap-1 h-5">
                  {[40, 75, 95, 60, 85, 30, 90, 50, 80, 100, 45, 65].map((val, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isAiSpeaking
                          ? 'bg-cyan-400'
                          : isAiThinking
                          ? 'bg-blue-400 animate-pulse'
                          : isMuted
                          ? 'bg-slate-700'
                          : 'bg-emerald-400'
                      }`}
                      style={{
                        height:
                          isAiSpeaking || !isMuted
                            ? `${Math.max(20, ((val * (callDuration % 5 + 2)) % 100))}%`
                            : '20%'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Conversation Transcript Area - Multi-Line & Multi-Turn Friendly */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-60 max-h-[380px] text-xs bg-[#030610]">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${
                      msg.speaker === 'AI' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {msg.speaker === 'AI' && (
                      <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        msg.speaker === 'AI'
                          ? 'bg-[#080d1a] border border-cyan-900/40 text-slate-200 rounded-tl-none shadow-md'
                          : 'bg-cyan-600 text-white font-normal rounded-tr-none shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                        <span className="flex items-center gap-1 font-semibold">
                          <span>{msg.speaker === 'AI' ? agentName : 'Caller'}</span>
                          {msg.isRealAi && (
                            <span className="text-[9px] px-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                              Live
                            </span>
                          )}
                        </span>
                        <span className="font-mono">{msg.time}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}

                {/* Partial Streaming Utterance */}
                {liveTranscript && (
                  <div
                    className={`flex items-start gap-2.5 ${
                      liveTranscript.speaker === 'AI' ? 'justify-start' : 'justify-end'
                    } animate-pulse`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap border border-dashed ${
                        liveTranscript.speaker === 'AI'
                          ? 'bg-[#080d1a] border-cyan-500/60 text-slate-200 rounded-tl-none'
                          : 'bg-cyan-800/60 border-cyan-400 text-white rounded-tr-none'
                      }`}
                    >
                      <p>{liveTranscript.text}</p>
                    </div>
                  </div>
                )}

                {isAiThinking && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#080d1a] border border-cyan-900/40 text-slate-300 text-xs w-fit">
                    <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span className="italic">AI উত্তর প্রস্তুত করছে...</span>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="p-2 border-t border-slate-800/80 bg-[#050811] overflow-x-auto flex items-center gap-1.5 text-[11px] no-scrollbar">
                <span className="text-[10px] font-bold text-cyan-400 whitespace-nowrap pl-1">
                  Quick Prompts:
                </span>
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    disabled={isAiThinking}
                    className="px-2.5 py-1 rounded-full bg-[#080d1a] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer text-[11px] disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Message Input Bar */}
              <div className="p-3 bg-[#050811] border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isAiThinking}
                  placeholder="বাংলায় বা ইংরেজিতে কথা বলুন..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#080d1a] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!customInput.trim() || isAiThinking}
                  className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold cursor-pointer transition-colors"
                  title="পাঠান"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* In-Call Controls */}
              <div className="p-3 bg-[#050811] border-t border-slate-800 flex items-center justify-around">
                {/* Mute Toggle */}
                <button
                  onClick={() => {
                    const next = !isMuted;
                    setIsMuted(next);
                    if (simulatorMode === 'VAPI_LIVE') {
                      vapiWebManager.setMuted(next);
                    }
                  }}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex flex-col items-center gap-1 text-[10px] ${
                    isMuted
                      ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                {/* Speaker Toggle */}
                <button
                  onClick={() => {
                    if (isSpeakerOn) stopAllAudio();
                    setIsSpeakerOn(!isSpeakerOn);
                  }}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex flex-col items-center gap-1 text-[10px] ${
                    !isSpeakerOn
                      ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{isSpeakerOn ? 'Speaker On' : 'Speaker Off'}</span>
                </button>

                {/* End Call */}
                <button
                  onClick={handleEndCall}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>কল শেষ করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 6: ENDING */}
          {stage === 'ending' && (
            <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 flex-1 bg-[#080d1a]">
              <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 animate-pulse">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                কল সমাপ্ত হচ্ছে...
              </h3>
              <p className="text-xs text-slate-400">
                AI সামারি তৈরি, লিড স্কোরিং এবং CRM ডাটা সিঙ্ক হচ্ছে...
              </p>
            </div>
          )}

          {/* STAGE 7: COMPLETED */}
          {stage === 'completed' && (
            <div className="p-6 flex flex-col space-y-4 flex-1 overflow-y-auto bg-[#080d1a]">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  কল সফলভাবে সম্পন্ন হয়েছে
                </h3>
                <p className="text-xs text-slate-400">
                  মোট সময়কাল: <strong className="text-white">{formatTimer(callDuration)}</strong> • কলার:{' '}
                  <strong className="text-white">{callerNumber}</strong>
                </p>
              </div>

              {/* Lead summary card if captured */}
              {extractedLead && (
                <div className="p-4 rounded-2xl bg-[#0b0f16] border border-amber-800/60 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span>Hot Lead Captured (AI Score: 95/100)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">
                      CRM Synced
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1 text-[11px]">
                    <div>
                      নাম: <strong className="text-white">{extractedLead.name}</strong>
                    </div>
                    <div>
                      ফোন: <strong className="text-white">{extractedLead.phone}</strong>
                    </div>
                    <div className="col-span-2">
                      আগ্রহ: <strong className="text-white">{extractedLead.interest}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Transcript Preview */}
              <div className="p-4 rounded-2xl bg-[#050811] border border-slate-800 text-xs space-y-2">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>কল ট্রান্সক্রিপ্ট প্রিভিউ ({messages.length} exchanges)</span>
                </h4>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-[11px] text-slate-300">
                  {messages.map((m, i) => (
                    <p key={i}>
                      <strong className={m.speaker === 'AI' ? 'text-cyan-400' : 'text-white'}>
                        {m.speaker}:
                      </strong>{' '}
                      {m.text}
                    </p>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleAcceptCall()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  আবার টেস্ট কল দিন
                </button>

                <button
                  onClick={closeCallSimulator}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md transition-colors"
                >
                  সম্পন্ন করুন
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
