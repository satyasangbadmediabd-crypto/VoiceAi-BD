import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, DollarSign, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RoiCalculator: React.FC = () => {
  const { navigate, openCheckout } = useApp();
  const [callsPerMonth, setCallsPerMonth] = useState(2500);
  const [staffCount, setStaffCount] = useState(2);
  const [salaryPerStaff, setSalaryPerStaff] = useState(20000);

  // Financial calculations in BDT
  const currentStaffCost = staffCount * salaryPerStaff;
  // Estimated VoiceAI BD subscription (e.g. Professional Plan ~ ৳ 6,999)
  const voiceAiCost = callsPerMonth > 5000 ? 14999 : callsPerMonth > 1500 ? 6999 : 2499;
  const monthlySavings = Math.max(0, currentStaffCost - voiceAiCost);
  const yearlySavings = monthlySavings * 12;
  const savingsPercent = Math.round((monthlySavings / (currentStaffCost || 1)) * 100);

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#070d1d] via-[#091226] to-[#040813] border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan-900/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-xs font-mono text-cyan-300">
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span>ROI & SAVINGS SIMULATOR</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
            আপনার ব্যবসা প্রতি মাসে কত টাকা সাশ্রয় করবে?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            কল সেন্টার কর্মী এবং রিসেপশনিস্ট খরচের তুলনায় VoiceAI BD-এর সাশ্রয় দেখুন
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">সম্ভাব্য খরচ হ্রাস</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {savingsPercent}% সাশ্রয়
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Monthly Calls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">মাসিক ইনকামিং কল সংখ্যা:</span>
              <span className="font-mono font-bold text-cyan-300 text-sm bg-cyan-950/70 px-2.5 py-0.5 rounded border border-cyan-800/40">
                {callsPerMonth.toLocaleString()} টি কল
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="250"
              value={callsPerMonth}
              onChange={(e) => setCallsPerMonth(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>৫০০ কল</span>
              <span>৭,৫০০ কল</span>
              <span>১৫,০০০+ কল</span>
            </div>
          </div>

          {/* Slider 2: Current Staff count */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">বর্তমানে কল রিসিভকারী স্টাফ সংখ্যা:</span>
              <span className="font-mono font-bold text-cyan-300 text-sm bg-cyan-950/70 px-2.5 py-0.5 rounded border border-cyan-800/40">
                {staffCount} জন
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={staffCount}
              onChange={(e) => setStaffCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>১ জন</span>
              <span>৫ জন</span>
              <span>১০ জন</span>
            </div>
          </div>

          {/* Slider 3: Average Staff Salary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">জনপ্রতি গড় মাসিক বেতন:</span>
              <span className="font-mono font-bold text-cyan-300 text-sm bg-cyan-950/70 px-2.5 py-0.5 rounded border border-cyan-800/40">
                ৳ {salaryPerStaff.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="12000"
              max="45000"
              step="1000"
              value={salaryPerStaff}
              onChange={(e) => setSalaryPerStaff(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>৳ ১২,০০০</span>
              <span>৳ ২৫,০০০</span>
              <span>৳ ৪৫,০০০</span>
            </div>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>২৪/৭ রাতদিন কল রিসিভ</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>০% মিসড কল বা ওয়েটিং</span>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-[#040711] border border-cyan-500/40 relative">
          <div className="space-y-4">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
              ESTIMATED COST COMPARISON
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">বর্তমান স্টাফ বেতন খরচ:</span>
                <span className="font-mono font-bold text-rose-400">
                  ৳ {currentStaffCost.toLocaleString()} / মাস
                </span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40">
                <span className="text-cyan-300">VoiceAI BD সফটওয়্যার খরচ:</span>
                <span className="font-mono font-bold text-cyan-300">
                  ৳ {voiceAiCost.toLocaleString()} / মাস
                </span>
              </div>
            </div>

            {/* Savings Highlight */}
            <div className="p-4 rounded-xl bg-gradient-to-tr from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 text-center space-y-1">
              <span className="text-xs text-emerald-300 font-semibold block">
                আপনার ব্যবসায়ের নীট মাসিক সাশ্রয়:
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                ৳ {monthlySavings.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 font-mono block">
                বাৎসরিক সম্ভাব্য সাশ্রয়: ৳ {yearlySavings.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/signup')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <span>সাশ্রয়ী প্ল্যানে আজই শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
