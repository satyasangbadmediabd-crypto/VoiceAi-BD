import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddPhoneModal } from '../components/AddPhoneModal';
import {
  Phone,
  PlusCircle,
  Link,
  Unlink,
  Settings,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Signal,
  Server
} from 'lucide-react';

export const PhoneNumbersPage: React.FC = () => {
  const { phoneNumbers, agents, connectPhoneToAgent, disconnectPhone, addToast } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [connectingPhoneId, setConnectingPhoneId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [configuringPhone, setConfiguringPhone] = useState<any>(null);

  const handleConnectConfirm = (phoneId: string) => {
    if (!selectedAgentId) return;
    connectPhoneToAgent(phoneId, selectedAgentId);
    setConnectingPhoneId(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Phone className="w-6 h-6 text-indigo-400" />
            <span>Phone Numbers</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            +880 ভার্চুয়াল নম্বর এবং টেলিকম এসআইপি ট্রাঙ্ক কানেকশন
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-950 flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Phone Number</span>
        </button>
      </div>

      {/* Note about Demo & Real SIP */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 text-indigo-200 flex items-start gap-3 text-xs leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">টেলিকমিউনিকেশন নির্দেশিকা: </span>
          <span>
            Real SIP connection requires a supported telephony provider and valid SIP credentials. This is a functional demo UI showing how Bangladeshi +880 lines route to VoiceAI BD agents.
          </span>
        </div>
      </div>

      {/* Numbers List */}
      <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Active & Available Numbers</h3>
          <span className="text-xs text-slate-400">মোট: {phoneNumbers.length}টি নম্বর</span>
        </div>

        <div className="divide-y divide-slate-800">
          {phoneNumbers.map((phone) => {
            const isConnected = phone.status === 'Connected';

            return (
              <div
                key={phone.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors"
              >
                {/* Left Number Details */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 font-mono font-bold flex-shrink-0">
                    🇧🇩
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-base font-bold text-white tracking-wide">
                        {phone.number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                          isConnected
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        <span>{phone.status}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>প্রোভাইডার: <strong className="text-slate-200">{phone.provider}</strong></span>
                      <span>•</span>
                      <span>
                        এজেন্ট:{' '}
                        {isConnected ? (
                          <strong className="text-indigo-300">{phone.connectedAgentName}</strong>
                        ) : (
                          <span className="text-slate-500 italic">Not Connected</span>
                        )}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {phone.sipEndpoint || 'sip.telecom-bd.com'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isConnected ? (
                    <button
                      onClick={() => disconnectPhone(phone.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Unlink className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setConnectingPhoneId(phone.id)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  )}

                  <button
                    onClick={() => setConfiguringPhone(phone)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connect Agent Selector Modal */}
      {connectingPhoneId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-slate-700 p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">নম্বরটি কোন এজেন্টের সাথে কানেক্ট করবেন?</h3>
            <p className="text-xs text-slate-400">
              ইনকামিং কল আসলে নির্ধারিত এজেন্ট স্বয়ংক্রিয়ভাবে উত্তর দেবে।
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">এজেন্ট বেছে নিন:</label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.businessName})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setConnectingPhoneId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => handleConnectConfirm(connectingPhoneId)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                কানেক্ট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Phone Modal */}
      {configuringPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-slate-700 p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">SIP Trunk Configuration</h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                <p className="text-slate-400">Phone: <span className="text-white">{configuringPhone.number}</span></p>
                <p className="text-slate-400">Endpoint: <span className="text-indigo-300">{configuringPhone.sipEndpoint || 'sip.btclgateway.bd:5060'}</span></p>
                <p className="text-slate-400">Codec: <span className="text-emerald-400">G.711u / Opus (HD Audio)</span></p>
                <p className="text-slate-400">TLS Encryption: <span className="text-indigo-400">Enabled (SRTP)</span></p>
              </div>
              <p className="text-[11px] text-slate-400">
                টেলিকম রাউটিং প্রটোকল এবং আইপি হোয়াইটলিস্টিং ডেমো প্যানেলে সক্রিয়।
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setConfiguringPhone(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Phone Number Modal */}
      <AddPhoneModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
