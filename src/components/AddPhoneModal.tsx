import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PhoneNumber } from '../types';
import { X, Phone, ShieldCheck, AlertCircle, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AddPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPhoneModal: React.FC<AddPhoneModalProps> = ({ isOpen, onClose }) => {
  const { addPhoneNumber } = useApp();
  const [number, setNumber] = useState('+880 9666-778899');
  const [provider, setProvider] = useState<PhoneNumber['provider']>('IP Telephony Provider');
  const [sipEndpoint, setSipEndpoint] = useState('sip.dhakatelecom.net:5060');
  const [sipUser, setSipUser] = useState('voiceai_user_880');
  const [sipPass, setSipPass] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPhoneNumber({
      number,
      provider,
      sipEndpoint
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-slate-700/80 shadow-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Add Phone Number</h3>
              <p className="text-[11px] text-slate-400">নতুন +880 বিজনেস নম্বর যুক্ত করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {/* Note about demo vs real SIP */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-indigo-900/50 text-indigo-300/90 flex items-start gap-2 text-[11px] leading-relaxed">
            <InfoIcon className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>সতর্কতা:</strong> Real SIP connection requires a supported telephony provider and valid SIP credentials. This is a functional demo UI.
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Country:</label>
            <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 flex items-center justify-between">
              <span>Bangladesh</span>
              <span className="text-base">🇧🇩</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Number:</label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                +880
              </span>
              <input
                type="text"
                value={number.replace('+880 ', '')}
                onChange={(e) => setNumber(`+880 ${e.target.value}`)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                placeholder="96XX-XXXXXX"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Provider:</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as PhoneNumber['provider'])}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="SIP Provider">SIP Provider</option>
              <option value="IP Telephony Provider">IP Telephony Provider (BTCL / Amber / Link3)</option>
              <option value="Custom SIP">Custom SIP Gateway</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">SIP Endpoint URL:</label>
            <input
              type="text"
              value={sipEndpoint}
              onChange={(e) => setSipEndpoint(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">SIP Username:</label>
              <input
                type="text"
                value={sipUser}
                onChange={(e) => setSipUser(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">SIP Password:</label>
              <input
                type="password"
                value={sipPass}
                onChange={(e) => setSipPass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নম্বর সেভ করুন</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path strokeWidth="2" d="M12 16v-4m0-4h.01" />
  </svg>
);
