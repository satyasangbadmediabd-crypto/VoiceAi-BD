import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Cpu,
  Phone,
  Layers,
  MessageSquare,
  Key,
  CheckCircle2,
  AlertCircle,
  Settings,
  ExternalLink,
  Copy,
  RefreshCw,
  Plus,
  Trash2,
  Sparkles,
  X,
  Check,
  Send,
  Zap,
  Globe
} from 'lucide-react';
import { IntegrationItem } from '../types';

export const IntegrationsPage: React.FC = () => {
  const { integrations, toggleIntegrationStatus, updateIntegrationConfig, addToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<
    'ALL' | 'Voice Providers' | 'Telephony / SIP' | 'CRM & Automations' | 'Messaging & Alerts' | 'API & Webhooks'
  >('ALL');

  // Config Drawer / Modal state
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationItem | null>(null);
  const [formFields, setFormFields] = useState<Record<string, string>>({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // API Key Management state
  const [apiKeys, setApiKeys] = useState<Array<{ id: string; name: string; key: string; created: string; lastUsed: string }>>([
    {
      id: 'key-1',
      name: 'Production Webhook & CRM Key',
      key: 'vb_live_8f3a9e22b1094c489d',
      created: '12 Jan 2025',
      lastUsed: '2 mins ago'
    },
    {
      id: 'key-2',
      name: 'Development Testing Key',
      key: 'vb_test_47c81d09e13a409f',
      created: '05 Feb 2025',
      lastUsed: 'Yesterday'
    }
  ]);

  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);

  // Webhook Tester state
  const [testWebhookUrl, setTestWebhookUrl] = useState('https://api.mycrm.com/voiceai/events');
  const [testPayload, setTestPayload] = useState(JSON.stringify({
    event: 'call.completed',
    agent: 'AI Skill Hub Receptionist',
    caller: '+8801712345678',
    lead_captured: true,
    score: 95
  }, null, 2));
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  const filteredIntegrations = integrations.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  const handleOpenConfig = (item: IntegrationItem) => {
    setSelectedIntegration(item);
    const initialValues: Record<string, string> = {};
    item.configFields.forEach((f) => {
      initialValues[f.key] = f.value || '';
    });
    setFormFields(initialValues);
  };

  const handleSaveConfig = () => {
    if (!selectedIntegration) return;
    Object.entries(formFields).forEach(([key, val]) => {
      updateIntegrationConfig(selectedIntegration.id, key, val);
    });
    toggleIntegrationStatus(selectedIntegration.id, 'Connected');
    addToast('ইন্টিগ্রেশন কনফিগারেশন সংরক্ষিত', `${selectedIntegration.name} সফলভাবে সংযুক্ত হয়েছে।`);
    setSelectedIntegration(null);
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setTimeout(() => {
      setIsTestingConnection(false);
      addToast('কানেকশন টেস্ট সফল!', `${selectedIntegration?.name} API হ্যান্ডশেক সফল হয়েছে (Ping: 48ms)।`, 'success');
    }, 800);
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const generated = `vb_live_${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 8)}`;
    setApiKeys((prev) => [
      ...prev,
      {
        id: `key-${Date.now()}`,
        name: newKeyName,
        key: generated,
        created: 'আজ',
        lastUsed: 'Never'
      }
    ]);
    setNewKeyName('');
    setShowNewKeyModal(false);
    addToast('নতুন API Key তৈরি হয়েছে!', 'কীটি আপনার সিআরএম বা স্ক্রিপ্টে যুক্ত করুন।');
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    addToast('API Key বাতিল করা হয়েছে', '', 'info');
  };

  const handleTestWebhookSend = () => {
    setIsSendingWebhook(true);
    setTimeout(() => {
      setIsSendingWebhook(false);
      addToast('সিমুলেটেড Webhook সফলভাবে ডেলিভার হয়েছে!', 'HTTP 200 OK Response Received from endpoint.', 'success');
    }, 700);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              Integrations & API Ecosystem
            </span>
            <span className="text-xs text-slate-400">টেলিকম, এআই মডেল, সিআরএম ও মেসেজিং সংযোগ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1">
            <Cpu className="w-6 h-6 text-indigo-400" />
            <span>ইন্টিগ্রেশন ও ডেভেলপার API</span>
          </h2>
        </div>

        {/* Action button */}
        <button
          onClick={() => setShowNewKeyModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-indigo-950 self-start sm:self-auto"
        >
          <Key className="w-4 h-4" />
          <span>নতুন API Key তৈরি করুন</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'ALL', label: 'All Integrations' },
          { id: 'Voice Providers', label: 'Voice Providers' },
          { id: 'Telephony / SIP', label: 'Telephony / SIP' },
          { id: 'CRM & Automations', label: 'CRM & Automations' },
          { id: 'Messaging & Alerts', label: 'Messaging & Alerts' },
          { id: 'API & Webhooks', label: 'API Management & Webhooks' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* INTEGRATIONS GRID (when not solely API & Webhooks) */}
      {activeCategory !== 'API & Webhooks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">{item.category}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Connected'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : item.status === 'Config Required'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  {item.status === 'Connected' ? 'Active sync' : 'Simulated ready'}
                </span>

                <button
                  onClick={() => handleOpenConfig(item)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <Settings className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Configure</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* API MANAGEMENT & WEBHOOK SECTION */}
      {(activeCategory === 'ALL' || activeCategory === 'API & Webhooks') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              <span>API Credentials & Webhook Endpoint Management</span>
            </h3>
          </div>

          {/* API Keys Table */}
          <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden text-xs">
            <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-white">Active API Keys</span>
              <span className="text-slate-400 text-[11px]">Use in `Authorization: Bearer &lt;TOKEN&gt;`</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Secret Key</th>
                    <th className="p-3.5">Created</th>
                    <th className="p-3.5">Last Used</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-white">{key.name}</td>
                      <td className="p-3.5 font-mono text-indigo-300">
                        {key.key.substring(0, 10)}•••••••••••••
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(key.key);
                            addToast('API Key কপি করা হয়েছে!', key.name);
                          }}
                          className="ml-2 text-slate-400 hover:text-white inline p-1"
                          title="কপি করুন"
                        >
                          <Copy className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                      <td className="p-3.5 text-slate-400">{key.created}</td>
                      <td className="p-3.5 text-slate-400">{key.lastUsed}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Revoke Key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Webhook Dispatch Tester */}
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Webhook Event Tester & Endpoint</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  কল সম্পন্ন বা লিড ক্যাপচার হলে আপনার সার্ভারে রিয়েল-টাইম POST রিকুয়েস্ট পাঠানোর সিমুলেশন করুন।
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Webhook Endpoint URL</label>
                <input
                  type="url"
                  value={testWebhookUrl}
                  onChange={(e) => setTestWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Sample Event Payload (JSON)</label>
                <textarea
                  rows={5}
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={handleTestWebhookSend}
                  disabled={isSendingWebhook}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-950"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingWebhook ? 'Sending Event...' : 'Test Webhook Dispatch (Simulated)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Config Drawer / Modal for Integrations */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0d1322] border border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedIntegration.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {selectedIntegration.name} Configuration
                  </h3>
                  <p className="text-[10px] text-slate-400">{selectedIntegration.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIntegration(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-indigo-300 text-[11px]">
                আপনার {selectedIntegration.name} ক্রিডেনশিয়াল প্রদান করে সেভ করুন। ডেমো সিস্টেমে এটি এনক্রিপ্টেড টেস্ট কানেকশন হিসেবে নিবন্ধিত হবে।
              </div>

              {selectedIntegration.configFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {field.label} {field.required && <span className="text-rose-400">*</span>}
                  </label>
                  <input
                    type={field.type === 'password' ? 'password' : 'text'}
                    value={formFields[field.key] || ''}
                    onChange={(e) =>
                      setFormFields({ ...formFields, [field.key]: e.target.value })
                    }
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin text-indigo-400' : ''}`} />
                  <span>Test Connection</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedIntegration(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                  >
                    সেভ ও কানেক্ট করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New API Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                <span>নতুন API Key তৈরি করুন</span>
              </h3>
              <button
                onClick={() => setShowNewKeyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateKey} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Key Description / Client Name *</label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="উদাঃ Zapier Integration Key"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                এই কী দিয়ে VoiceAI BD-এর কল হিস্ট্রি, লিড ডেটা এবং এজেন্ট নিয়ন্ত্রণ API কল করা যাবে।
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewKeyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
