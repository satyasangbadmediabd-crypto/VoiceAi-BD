import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Radio, Zap, Volume2, ShieldCheck } from 'lucide-react';

interface AppOpeningIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const AppOpeningIntro: React.FC<AppOpeningIntroProps> = ({
  onComplete,
  forceShow = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    { title: 'INITIALIZING BANGLA NEURAL AUDIO CORE...', subtitle: 'বাংলা নিউরাল ভয়েস ইঞ্জিন সক্রিয় হচ্ছে...' },
    { title: 'CONNECTING +880 SIP TELEPHONY PIPELINE...', subtitle: 'বাংলাদেশি ভয়েস নেটওয়ার্ক সিঙ্ক হচ্ছে...' },
    { title: 'VOICEAI BD STUDIO 3D ONLINE', subtitle: 'স্বাগতম! আপনার ভয়েস এজেন্ট প্রস্তুত।' }
  ];

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('voiceai_intro_seen');
    if (!hasSeenIntro || forceShow) {
      setIsVisible(true);
      setStep(0);

      const t1 = setTimeout(() => setStep(1), 600);
      const t2 = setTimeout(() => setStep(2), 1400);
      const t3 = setTimeout(() => {
        handleDismiss();
      }, 2300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [forceShow]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('voiceai_intro_seen', 'true');
    if (onComplete) onComplete();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#02050e] text-white overflow-hidden select-none"
        style={{ perspective: 1200 }}
      >
        {/* 3D Deep Space Atmospheric Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-cyan-500/20 via-indigo-600/20 to-emerald-500/20 blur-[140px] rounded-full animate-pulse" />
          {/* Cyber matrix grid */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #00f0ff 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* 3D Kinetic Gyroscopic Hologram Stage */}
        <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80">
          {/* Outer Gyro Ring 1 */}
          <motion.div
            animate={{ rotateX: [60, 60, 60], rotateZ: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-cyan-400/40"
            style={{ transformStyle: 'preserve-3d', boxShadow: '0 0 25px rgba(6,182,212,0.25)' }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff]" />
          </motion.div>

          {/* Gyro Ring 2 */}
          <motion.div
            animate={{ rotateY: [65, 65, 65], rotateZ: [360, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-indigo-400/40"
            style={{ transformStyle: 'preserve-3d', boxShadow: '0 0 20px rgba(99,102,241,0.25)' }}
          >
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
          </motion.div>

          {/* Gyro Ring 3 */}
          <motion.div
            animate={{ rotateX: [35, 35, 35], rotateY: [45, 45, 45], rotateZ: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-emerald-400/50"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </motion.div>

          {/* 3D Core Sphere with Active Soundwave Matrix */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#09152b] via-[#0e1a38] to-[#040814] border-2 border-cyan-400/60 p-1 flex flex-col items-center justify-center shadow-[0_0_45px_rgba(6,182,212,0.4)]"
          >
            {/* Core Soundwaves */}
            <div className="flex items-center gap-1 sm:gap-1.5 h-10">
              {[22, 42, 60, 85, 50, 68, 35].map((h, i) => (
                <motion.span
                  key={i}
                  animate={{ height: [h * 0.25, h * 0.45, h * 0.3] }}
                  transition={{ duration: 0.5 + (i % 3) * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1 sm:w-1.5 bg-gradient-to-t from-cyan-400 via-teal-300 to-indigo-300 rounded-full"
                />
              ))}
            </div>
            <span className="text-[9px] font-mono text-cyan-300 font-bold mt-1 tracking-wider uppercase">
              3D CORE
            </span>
          </motion.div>
        </div>

        {/* Dynamic Writing Sequence */}
        <div className="mt-6 text-center space-y-2 relative z-10 px-4 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>VoiceAI Bangladesh • 3D Telephony OS</span>
          </div>

          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white font-sans mt-2">
            {steps[step].title}
          </h2>

          <p className="text-xs sm:text-sm font-medium text-cyan-200/90 tracking-wide font-sans">
            {steps[step].subtitle}
          </p>

          {/* Progress Bar */}
          <div className="w-48 sm:w-64 h-1 bg-slate-800 rounded-full mx-auto mt-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500"
              initial={{ width: '10%' }}
              animate={{ width: step === 0 ? '35%' : step === 1 ? '75%' : '100%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={handleDismiss}
          className="absolute bottom-8 px-5 py-2 rounded-full bg-[#0a1122]/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono border border-cyan-900/60 hover:border-cyan-400 transition-all cursor-pointer shadow-lg active:scale-95"
        >
          Skip Intro / সরাসরি প্রবেশ &rarr;
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
