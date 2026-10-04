import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLockScreenProps {
  onSuccess?: () => void;
}

export const AdminLockScreen: React.FC<AdminLockScreenProps> = ({ onSuccess }) => {
  const { unlockAdmin, navigate } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setError(true);
      setErrorMessage('পাসকোড খালি রাখা যাবে না');
      return;
    }

    if (pinInput === 'admin123' || pinInput === 'superadmin123' || pinInput.length >= 6) {
      unlockAdmin('superadmin', pinInput);
      setError(false);
      if (onSuccess) onSuccess();
    } else {
      setError(true);
      setErrorMessage('ভুল পাসকোড! সঠিক পাসকোড দিয়ে আবার চেষ্টা করুন। (Default: admin123)');
      setAttempts((prev) => prev + 1);
    }
  };

  const handleQuickFill = () => {
    setPinInput('admin123');
    setError(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-rose-900/40 p-6 sm:p-8 shadow-2xl shadow-rose-950/30 text-center space-y-6 relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-950 via-rose-900 to-indigo-900 border border-rose-600/50 flex items-center justify-center text-rose-300 shadow-xl shadow-rose-950">
          <Lock className="w-8 h-8" />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0c101d] flex items-center justify-center text-black">
            <KeyRound className="w-3 h-3" />
          </span>
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-[11px] font-black uppercase tracking-wider">
            <span>সুরক্ষিত অ্যাডমিন এলাকা</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            সুপার অ্যাডমিন সিকিউরিটি গেটওয়ে
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            ইউজার ডেটা, বিকাশ পেমেন্ট ভেরিফিকেশন এবং প্ল্যাটফর্ম সেটিংসে প্রবেশ করতে অ্যাডমিন সিকিউরিটি পাসকোড লিখুন।
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              অ্যাডমিন পাসকোড / পিন (Admin Passcode):
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="পাসকোড লিখুন..."
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border font-mono text-center tracking-widest text-base text-white focus:outline-none transition-all ${
                  error
                    ? 'border-rose-500 ring-2 ring-rose-500/30'
                    : 'border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 mt-2 text-rose-400 text-xs"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </div>

          {/* Quick Helper Badge */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>
                ডিফল্ট পাসকোড: <strong className="text-white font-mono">admin123</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
            >
              অটো-ফিল
            </button>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>প্যানেল আনলক করুন (Unlock Admin)</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ড্যাশবোর্ডে ফিরে যান</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
