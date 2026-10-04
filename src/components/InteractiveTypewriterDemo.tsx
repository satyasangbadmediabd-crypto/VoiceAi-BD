import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card3D } from './Card3D';
import { Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle2, User, Bot, PhoneCall } from 'lucide-react';

interface DialogueScenario {
  id: string;
  title: string;
  category: string;
  caller: string;
  userPrompt: string;
  aiResponse: string;
  intent: string;
  actionTaken: string;
}

const SCENARIOS: DialogueScenario[] = [
  {
    id: 'ecommerce',
    title: 'ই-কমার্স ডেলিভারি ট্র্যাকিং',
    category: 'E-Commerce & Retail',
    caller: '+880 1712-984210',
    userPrompt: 'ভাইয়া, আমার গতকালকের শার্টের অর্ডারটা কি আজকে ডেলিভারি হবে?',
    aiResponse: 'জ্বি স্যার! আপনার অর্ডার নম্বর #BD-8841 বর্তমানে ধানমন্ডি হাব থেকে ডেলিভারি রাইডারের কাছে হস্তান্তর হয়েছে। আশা করছি দুপুর ৩টার মধ্যেই আপনি পার্সেলটি হাতে পাবেন।',
    intent: 'Order Delivery Status & ETA',
    actionTaken: 'RedX Tracking API Checked & SMS Sent'
  },
  {
    id: 'clinic',
    title: 'ডক্টর চেম্বার সিরিয়াল বুকিং',
    category: 'Healthcare & Clinics',
    caller: '+880 1845-667788',
    userPrompt: 'আজকে কি মেডিসিন বিশেষজ্ঞ ডক্টর রফিকুল ইসলামের চেম্বার খোলা আছে? সিরিয়াল কীভাবে দেব?',
    aiResponse: 'আসসালামু আলাইকুম! জ্বি, স্যার আজ সন্ধ্যা ৭টা থেকে বসবেন। বর্তমানে ৮ নম্বর সিরিয়াল খালি আছে। আপনার পুরো নাম এবং রোগীর বয়স জানালে এখনই সিরিয়াল কনফার্ম করে দিচ্ছি।',
    intent: 'Doctor Serial Reservation',
    actionTaken: 'Doctor Chamber Slot Reserved & SMS Token Issued'
  },
  {
    id: 'food',
    title: 'রেস্টুরেন্ট অর্ডার ও হোম ডেলিভারি',
    category: 'Food & Restaurants',
    caller: '+880 1911-334455',
    userPrompt: 'বনানীতে ২টা বিফ তেহারি আর ১টা স্পেশাল বোরহানি কি আধা ঘণ্টার মধ্যে হোম ডেলিভারি দেওয়া যাবে?',
    aiResponse: 'অবশ্যই স্যার! বনানী ব্রাঞ্চ থেকে মাত্র ২৫ মিনিটে আপনার লোকেশনে পৌঁছে যাবে। মোট বিল ৪৮০ টাকা। আপনি কি ক্যাশ অন ডেলিভারি নাকি বিকাশে অগ্রিম পে করতে স্বাচ্ছন্দ্য বোধ করবেন?',
    intent: 'Food Order & Dispatch',
    actionTaken: 'Kitchen POS Notified & Rider Assigned'
  },
  {
    id: 'lead',
    title: 'রিয়েল এস্টেট ও প্রপার্টি সেলস',
    category: 'Real Estate & Inbound Leads',
    caller: '+880 1622-445566',
    userPrompt: 'উত্তরা সেক্টর ১১-তে আপনাদের যে ৩ বেডের রেডি ফ্ল্যাটটা আছে, সেটার সাইজ এবং প্রতি স্কয়ার ফিট রেট কত?',
    aiResponse: 'ধন্যবাদ আগ্রহের জন্য! ফ্ল্যাটটি ১৮৫০ স্কয়ার ফিটের, সাউথ ফেসিং। প্রতি স্কয়ার ফিট ৮,৫০০ টাকা। আপনি চাইলে আগামীকাল বিকাল ৪টায় আমাদের সাইট পরিদর্শনের জন্য অ্যাপয়েন্টমেন্ট বুক করে দিচ্ছি।',
    intent: 'High-Value Inbound Lead Qualification',
    actionTaken: 'CRM Lead Created & Sales Manager Notified'
  }
];

export const InteractiveTypewriterDemo: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<DialogueScenario>(SCENARIOS[0]);
  const [typedUser, setTypedUser] = useState('');
  const [typedAi, setTypedAi] = useState('');
  const [typingStage, setTypingStage] = useState<'user' | 'thinking' | 'ai' | 'done'>('user');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Restart typewriter animation on scenario change
  useEffect(() => {
    let isCancelled = false;
    setTypedUser('');
    setTypedAi('');
    setTypingStage('user');
    setIsPlayingAudio(false);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const userText = selectedScenario.userPrompt;
    const aiText = selectedScenario.aiResponse;

    let userIdx = 0;
    const userInterval = setInterval(() => {
      if (isCancelled) return;
      if (userIdx < userText.length) {
        setTypedUser(userText.slice(0, userIdx + 1));
        userIdx++;
      } else {
        clearInterval(userInterval);
        setTypingStage('thinking');

        // Thinking pause before AI response
        setTimeout(() => {
          if (isCancelled) return;
          setTypingStage('ai');
          let aiIdx = 0;
          const aiInterval = setInterval(() => {
            if (isCancelled) return;
            if (aiIdx < aiText.length) {
              setTypedAi(aiText.slice(0, aiIdx + 1));
              aiIdx++;
            } else {
              clearInterval(aiInterval);
              setTypingStage('done');
            }
          }, 32);
        }, 650);
      }
    }, 40);

    return () => {
      isCancelled = true;
      clearInterval(userInterval);
    };
  }, [selectedScenario]);

  // Audio Playback
  const handlePlayVoice = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedScenario.aiResponse);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 5000);
    }
  };

  const handleReplay = () => {
    // Re-trigger by cloning object reference
    setSelectedScenario({ ...selectedScenario });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Scenario Selector Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {SCENARIOS.map((sc) => {
          const isActive = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-[#080d1a]/80 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* 3D Interactive Dialogue Terminal */}
      <Card3D depth={8} glowColor="rgba(6, 182, 212, 0.25)">
        <div className="p-5 sm:p-7 space-y-6">
          {/* Top Bar: Caller & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <PhoneCall className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white tracking-wide">
                    INBOUND CALL: {selectedScenario.caller}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                    LIVE BANGLA
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {selectedScenario.category} · Latency 280ms
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayVoice}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>থামান</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>বাংলায় শুনুন</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReplay}
                title="পুনরায় অ্যানিমেশন দেখুন"
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dialogue Space: Caller Prompt & AI Typewriter Output */}
          <div className="space-y-4">
            {/* 1. Customer Inbound Query */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-sm bg-[#0a0f1d] border border-slate-800/80 p-4">
                <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                  <span>গ্রাহক (Customer Voice Input)</span>
                  <span className="text-cyan-400/80">Speech-to-Text Transcribed</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                  {typedUser}
                  {typingStage === 'user' && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 rounded-xs animate-pulse align-middle" />
                  )}
                </p>
              </div>
            </div>

            {/* 2. Reasoning / Thinking State */}
            {typingStage === 'thinking' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 pl-12 text-xs font-mono text-cyan-400/90 py-1"
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Gemini 2.5 Neural Engine: জ্ঞানকোষ বিশ্লেষণ ও উত্তর তৈরি হচ্ছে...</span>
              </motion.div>
            )}

            {/* 3. AI Agent Natural Speech-to-Type Response */}
            {(typingStage === 'ai' || typingStage === 'done') && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shrink-0 mt-0.5 shadow-md shadow-cyan-500/20">
                  <Bot className="w-4.5 h-4.5 text-slate-950" />
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-sm bg-gradient-to-b from-[#0e172a] to-[#0a1020] border border-cyan-500/30 p-4 shadow-inner">
                  <div className="text-[11px] font-mono text-cyan-300 mb-1.5 flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      VoiceAI Agent (স্বাভাবিক বাংলা ভয়েস)
                    </span>
                    <span className="text-[10px] text-slate-400">48kHz Audio Stream</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed">
                    {typedAi}
                    {typingStage === 'ai' && (
                      <span className="inline-block w-2 h-4.5 ml-1 bg-cyan-400 rounded-xs shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse align-middle" />
                    )}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Taken / CRM Metadata Card */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-mono text-[11px] text-slate-500">স্বয়ংক্রিয় একশন:</span>
              <span className="text-cyan-300 font-medium">{selectedScenario.actionTaken}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CRM & Telephony Synced</span>
            </div>
          </div>
        </div>
      </Card3D>
    </div>
  );
};
