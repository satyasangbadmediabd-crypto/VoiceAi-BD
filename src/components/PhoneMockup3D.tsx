import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, PhoneOff, Mic, Volume2, Shield, Sparkles, MessageSquare, Radio } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PhoneMockup3DProps {
  onCallAnswered?: () => void;
}

export const PhoneMockup3D: React.FC<PhoneMockup3DProps> = ({ onCallAnswered }) => {
  const { openCallSimulator, websiteSettings } = useApp();
  const [callActive, setCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const businessTitle = websiteSettings?.mockupBusinessName || 'CarePoint Medical AI';
  const callerInfo = websiteSettings?.mockupCallerName || '+880 9612-887766';
  const defaultTranscript = websiteSettings?.mockupTranscript || 'আসসালামু আলাইকুম! VoiceAI BD-তে স্বাগতম। আপনাকে কীভাবে সাহায্য করতে পারি?';

  const [activeSpeech, setActiveSpeech] = useState<string>(defaultTranscript);

  React.useEffect(() => {
    if (websiteSettings?.mockupTranscript) {
      setActiveSpeech(websiteSettings.mockupTranscript);
    }
  }, [websiteSettings?.mockupTranscript]);

  const handleAnswer = () => {
    setCallActive(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(activeSpeech);
      u.lang = 'bn-BD';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
    if (onCallAnswered) onCallAnswered();
  };

  const handleEnd = () => {
    setCallActive(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative flex items-center justify-center p-2 sm:p-6"
    >
      {/* 3D Floating Perspective Phone Body */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotateX: [6, 4, 6],
          rotateY: [-8, -4, -8]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.9), 0 0 50px -10px rgba(6, 182, 212, 0.35)'
        }}
        className="relative w-[300px] sm:w-[330px] rounded-[42px] p-3 bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 border border-slate-700/80"
      >
        {/* Phone Outer Edge Glare Reflection */}
        <div className="absolute inset-0 rounded-[42px] border border-cyan-400/20 pointer-events-none" />

        {/* Screen Bezel */}
        <div className="relative rounded-[32px] bg-[#050814] overflow-hidden border border-slate-800 flex flex-col h-[520px] justify-between p-5 text-white">
          {/* Dynamic Island / Speaker Notch */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>10:24 AM</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-emerald-400 font-bold">5G</span>
              <span className="w-3.5 h-2 border border-slate-400 rounded-xs flex items-center p-0.5">
                <span className="w-full h-full bg-emerald-400 rounded-2xs" />
              </span>
            </div>
          </div>

          {/* Telephony Call Status Header */}
          <div className="text-center mt-3 space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              {callActive ? 'কল চলছে • 00:14' : 'ইনকামিং বিজনেস কল'}
            </span>
            <h3 className="text-base font-bold text-white tracking-wide pt-1">
              {businessTitle}
            </h3>
            <p className="text-xs font-mono text-cyan-400/90">{callerInfo}</p>
          </div>

          {/* Center: 3D Holographic Calling Waves */}
          <div className="relative flex flex-col items-center justify-center my-auto">
            {/* Concentric pulsing sound aura */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-36 h-36 rounded-full border border-cyan-400/40"
            />
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="absolute w-36 h-36 rounded-full border border-indigo-500/30"
            />

            {/* Avatar Circle with Audio Spectrum */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 p-0.5 shadow-[0_0_35px_rgba(6,182,212,0.5)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#080d1e] flex flex-col items-center justify-center p-2">
                <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
                {/* Micro Audio Spectrum */}
                <div className="flex items-center gap-1 h-4 mt-1">
                  {[12, 24, 32, 18, 28].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: callActive ? [h * 0.4, h, h * 0.5] : [4, 8, 4] }}
                      transition={{ duration: 0.4 + i * 0.1, repeat: Infinity }}
                      className="w-1 bg-cyan-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Bangla Speech bubble */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-cyan-900/50 max-w-[240px] text-center shadow-lg">
              <p className="text-[11px] text-cyan-100 font-sans leading-relaxed">
                "{activeSpeech}"
              </p>
              <div className="flex items-center justify-center gap-2 mt-1.5 text-[9px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>NATIVE BANGLA NLP</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions: Call Controls */}
          <div className="pt-2 pb-1">
            {!callActive ? (
              <div className="flex items-center justify-around">
                <button
                  onClick={() => openCallSimulator()}
                  className="flex flex-col items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span>টেস্ট রুম</span>
                </button>

                <button
                  onClick={handleAnswer}
                  className="flex flex-col items-center gap-1 text-[11px] text-emerald-300 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.5)] group-hover:scale-105 active:scale-95 transition-transform">
                    <Phone className="w-6 h-6 fill-current animate-bounce" />
                  </div>
                  <span className="font-bold">রিসিভ করুন</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-11 h-11 rounded-full border flex items-center justify-center ${
                      isMuted ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleEnd}
                    className="w-13 h-13 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 active:scale-95 transition-transform"
                  >
                    <PhoneOff className="w-5 h-5 fill-current" />
                  </button>

                  <button
                    onClick={() => openCallSimulator()}
                    className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 flex items-center justify-center"
                    title="Open Full Screen Simulator"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 font-mono">
                  সরাসরি কথা বলতে লাল বাটন অথবা টেস্ট ল্যাব ব্যবহার করুন
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
