import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Building,
  Bell,
  Link2,
  Key,
  ShieldCheck,
  CheckCircle2,
  Save,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, addToast } = useApp();

  const [businessName, setBusinessName] = useState(user?.businessName || 'AI Skill Hub BD');
  const [ownerName, setOwnerName] = useState(user?.name || 'তানভীর আহমেদ');
  const [supportEmail, setSupportEmail] = useState('support@aiskillhub.bd');
  const [supportPhone, setSupportPhone] = useState('+880 1712-345678');

  // Notification states
  const [notifySMS, setNotifySMS] = useState(true);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  // CRM / Webhook
  const [webhookUrl, setWebhookUrl] = useState('https://api.mycrm.com/webhooks/voiceai-bd-leads');
  const [googleSheetsSync, setGoogleSheetsSync] = useState(true);

  // API Keys
  const [showApiKey, setShowApiKey] = useState(false);
  const apiKeyDemo = 'vbd_live_99214ab8f2e190c68997a';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('সেটিংস আপডেট হয়েছে', 'আপনার ব্যবসায়িক প্রোফাইল ও নোটিফিকেশন সংরক্ষিত হয়েছে।');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKeyDemo);
    addToast('কপি করা হয়েছে', 'API Key ক্লিপবোর্ডে কপি করা হয়েছে।');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-400" />
          <span>Platform Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          আপনার প্রোফাইল, নোটিফিকেশন অ্যালার্ট এবং সিআরএম ইন্টিগ্রেশন
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Business Profile */}
        <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Business Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Business Name:</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Owner / Contact Name:</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Contact Email:</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Notification Phone:</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">নতুন লিড নোটিফিকেশন সেটিংস</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-white block">WhatsApp Alert (তাৎক্ষণিক)</span>
                <span className="text-[11px] text-slate-400">
                  কল শেষ হওয়ার সাথে সাথে কলারের বিবরণ আপনার হোয়াটসঅ্যাপ নম্বরে পাঠানো হবে
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyWhatsApp}
                onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-white block">SMS Notification</span>
                <span className="text-[11px] text-slate-400">
                  জরুরী হট লিড হলে সরাসরি আপনার মোবাইল ফোনে এসএমএস পৌঁছে যাবে
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifySMS}
                onChange={(e) => setNotifySMS(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-white block">Email Summary Report</span>
                <span className="text-[11px] text-slate-400">
                  প্রতিদিন সন্ধ্যায় সকল কল হিস্ট্রি ও লিডের সমন্বিত পিডিএফ রিপোর্ট
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Integrations & Webhooks */}
        <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">CRM & Webhook Integrations</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Webhook Endpoint URL:</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-crm.com/api/webhooks"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                কল শেষ হলে এই ওয়েবহুকে POST রিকোয়েস্টে JSON ট্রান্সক্রিপ্ট ও লিড ডেটা যাবে।
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Google Sheets Auto-Sync</p>
                <p className="text-[11px] text-slate-400">
                  আপনার গুগল ড্রাইভে সরাসরি নতুন কাস্টমার লিডের সারি তৈরি হবে
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">API Credentials (Demo)</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Sandboxed
            </span>
          </div>

          <div className="text-xs space-y-2">
            <label className="block text-slate-300 font-semibold">VoiceAI BD API Key:</label>
            <div className="flex items-center gap-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                readOnly
                value={apiKeyDemo}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="দেখুন / লুকান"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleCopyKey}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                title="কপি করুন"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-950 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>পরিবর্তন সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
