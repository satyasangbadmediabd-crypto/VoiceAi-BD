import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  X,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OnboardingBanner: React.FC = () => {
  const { onboardingSteps, toggleOnboardingStep, dismissOnboarding, setDismissOnboarding, navigate } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  if (dismissOnboarding) return null;

  const completedCount = onboardingSteps.filter((s) => s.completed).length;
  const totalCount = onboardingSteps.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-indigo-950/60 via-[#0d1424] to-purple-950/40 border border-indigo-800/50 p-4 sm:p-5 shadow-xl relative overflow-hidden mb-6">
      {/* Background subtle glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-900/80 border border-indigo-700 text-indigo-300 text-[10px] font-bold tracking-wider uppercase">
              Onboarding Checklist
            </span>
            <span className="text-xs font-semibold text-white">
              {completedCount} / {totalCount} Completed ({percentage}%)
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>আপনার AI Voice Agent সেটআপ সম্পন্ন করুন</span>
          </h3>
          <p className="text-xs text-slate-400">
            ৭টি সহজ ধাপে আপনার ব্যবসার জন্য সক্রিয় AI ভয়েস হেল্পলাইন প্রস্তুত করুন
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'লুকান' : 'ধাপগুলো দেখুন'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setDismissOnboarding(true)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="ব্যানার বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full h-2 bg-slate-900 rounded-full overflow-hidden relative z-10">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Expanded Checklist Steps */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10"
          >
            {onboardingSteps.map((step) => (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-2.5 ${
                  step.completed
                    ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                    : 'bg-indigo-950/30 border-indigo-800/60 text-white'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <button
                    onClick={() => toggleOnboardingStep(step.id)}
                    className="mt-0.5 text-indigo-400 hover:text-emerald-400 transition-colors flex-shrink-0 cursor-pointer"
                    title={step.completed ? 'অসম্পূর্ণ করুন' : 'সম্পন্ন মার্ক করুন'}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold">
                        {step.stepNumber}
                      </span>
                      <h4 className={`text-xs font-bold truncate ${step.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(step.route)}
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer"
                  title="যান"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
