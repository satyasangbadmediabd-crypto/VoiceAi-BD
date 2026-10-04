import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShieldCheck, PhoneCall, CreditCard, Cpu, MessageSquare, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DemoModeModal: React.FC = () => {
  const { isDemoModeModalOpen, closeDemoModeModal } = useApp();

  if (!isDemoModeModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg rounded-2xl bg-[#0d1322] border border-slate-700 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>VoiceAI BD - Architecture</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 text-[10px] font-bold">
                  GEMINI LIVE AI • ACTIVE
                </span>
              </h3>
            </div>
            <button
              onClick={closeDemoModeModal}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-indigo-200 leading-relaxed">
              <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>লাইভ AI ইঞ্জিন ও সিস্টেম ওভারভিউ</span>
              </p>
              VoiceAI BD-এর Agent Testing Lab সরাসরি Google Gemini Live AI ব্যাকএন্ড এবং সার্ভার-সাইড সিক্রেট দ্বারা পরিচালিত হচ্ছে। কোন নকল বা সিমুলেটেড রেসপন্স ব্যবহার করা হয় না।
              শুধুমাত্র বাস্তব টেলিফোনি (+880 SIP Trunk) এবং পেমেন্ট গেটওয়ে (bKash/Nagad) স্যান্ডবক্স টেস্ট মোডে রাখা হয়েছে।
            </div>

            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider pt-2">
              সিস্টেমে যা যা সক্রিয় রয়েছে:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-bold">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>লাইভ Gemini AI ভয়েস</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Google Gemini মডেলের রিয়েল-টাইম বাংলা ইনফারেন্স, ইনটেন্ট ডিটেকশন ও স্পিচ সিন্থেসিস।
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>Knowledge Base RAG</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  পিডিএফ আপলোড করে এজেন্টের প্রশ্ন-উত্তরের মেমরি ইনস্ট্যান্ট কনফিগার করুন।
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-bold">
                  <CreditCard className="w-4 h-4 text-pink-400" />
                  <span>বিকাশ/নগদ পেমেন্ট</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  স্বয়ংক্রিয় সাবস্ক্রিপশন আপগ্রেড, ভয়েস মিনিট রিচার্জ ও ইনভয়েস জেনারেশন।
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-bold">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span>লিড স্কোরিং ও সিআরএম</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  কল শেষে গ্রাহকের ফোন নম্বর, আগ্রহ ও AI স্কোর (৯৪/১০০) স্বয়ংক্রিয় সংরক্ষণ।
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>লোকাল স্টোরেজে সকল পরিবর্তন সুরক্ষিত থাকে</span>
              </span>
              <span className="text-indigo-400 font-mono">v2.4.0-demo</span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-end">
            <button
              onClick={closeDemoModeModal}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              বুঝেছি, ডেমো শুরু করুন
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
