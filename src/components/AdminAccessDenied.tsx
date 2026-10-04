import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRIMARY_ADMIN_EMAIL } from '../utils/adminAuth';

export const AdminAccessDenied: React.FC = () => {
  const { navigate, user } = useApp();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#140803]/95 border border-rose-600/50 p-6 sm:p-8 text-center space-y-5 shadow-2xl shadow-rose-950/50 backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-600/60 flex items-center justify-center mx-auto text-rose-400 shadow-xl shadow-rose-950/50">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-950/90 border border-rose-800 text-rose-300 text-[10px] font-black uppercase tracking-wider">
            Admin Access Restricted
          </span>
          <h3 className="text-xl font-black text-white">অ্যাক্সেস সংরক্ষিত</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
            এই অ্যাডমিন প্যানেলটি শুধুমাত্র প্রধান অ্যাডমিন (<strong className="text-orange-400 font-semibold">{PRIMARY_ADMIN_EMAIL}</strong>)-এর জন্য সংরক্ষিত। অন্য কোনো ব্যবহারকারী এই প্যানেলে প্রবেশ করতে পারবেন না।
          </p>
          <div className="p-3 rounded-xl bg-black/40 border border-rose-900/40 text-[11px] text-slate-400">
            বর্তমান একাউন্ট: <span className="text-white font-mono">{user?.email || user?.phone || 'অপরিচিত ব্যবহারকারী'}</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ড্যাশবোর্ড ওভারভিউ-তে ফিরে যান</span>
          </button>
        </div>
      </div>
    </div>
  );
};
