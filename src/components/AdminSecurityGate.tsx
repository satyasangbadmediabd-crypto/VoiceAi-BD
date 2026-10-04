import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, KeyRound, ShieldAlert, Eye, EyeOff, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { verifyAdminPasswordApi } from '../services/apiService';

interface AdminSecurityGateProps {
  role: 'admin' | 'superadmin';
  title?: string;
  onSuccess?: () => void;
}

export const AdminSecurityGate: React.FC<AdminSecurityGateProps> = ({
  role,
  title = role === 'superadmin' ? 'Super Admin Root Security Gate' : 'Customer Admin Security Access',
  onSuccess
}) => {
  const { unlockAdmin, addToast, navigate } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const res = await verifyAdminPasswordApi(password, role);
      if (res.success) {
        unlockAdmin(role, res.token || 'verified_token');
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.error || 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
        addToast('প্রবেশাধিকার প্রত্যাখ্যাত', 'ভুল অ্যাডমিন পাসওয়ার্ড।', 'error');
      }
    } catch (err: any) {
      setErrorMsg('সার্ভার যোগাযোগে ত্রুটি হয়েছে।');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#0b101c] border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-950 to-indigo-950 border border-rose-800/60 flex items-center justify-center mx-auto text-rose-400 shadow-xl shadow-rose-950/50">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-300 text-[10px] font-black uppercase tracking-wider">
            Protected Admin Gate
          </span>
          <h3 className="text-xl font-black text-white">{title}</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            অননুমোদিত প্রবেশ রোধে এই অ্যাডমিন প্যানেলটি পাসওয়ার্ড দ্বারা সুরক্ষিত।
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {role === 'superadmin' ? 'সুপার অ্যাডমিন মাস্টার পাসওয়ার্ড:' : 'অ্যাডমিন সিকিউরিটি পাসওয়ার্ড:'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="অ্যাডমিন পাসওয়ার্ড লিখুন..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-rose-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isVerifying ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>লগইন করুন ও প্যানেল আনলক করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Master PIN Hint for Owner */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-slate-300 font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>ডিফল্ট মাস্টার পাসওয়ার্ড:</span>
          </div>
          <p className="font-mono text-xs text-amber-300">
            {role === 'superadmin' ? 'superadmin2026' : 'admin1234'}
          </p>
          <p className="text-[10px] text-slate-500 pt-0.5">
            (অ্যাডমিন প্যানেলে ঢুকে সেটিংস ট্যাব থেকে আপনি যেকোনো সময় এই পাসওয়ার্ড পরিবর্তন করতে পারেন)
          </p>
        </div>

        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ← ড্যাশবোর্ডে ফিরে যান
          </button>
        </div>
      </div>
    </div>
  );
};
