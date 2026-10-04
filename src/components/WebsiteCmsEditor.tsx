import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  fetchWebsiteSettingsApi,
  saveWebsiteSettingsApi,
  testVapiServer,
  testGeminiServer,
  WebsiteSettingsData
} from '../services/apiService';
import {
  Globe,
  Sparkles,
  KeyRound,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Radio,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Cpu,
  Layers,
  Check,
  Eye,
  EyeOff,
  BellRing,
  Smartphone,
  Plus,
  Trash2,
  Share2,
  Sliders
} from 'lucide-react';

interface WebsiteCmsEditorProps {
  onSaved?: () => void;
}

export const WebsiteCmsEditor: React.FC<WebsiteCmsEditorProps> = ({ onSaved }) => {
  const { addToast, updateWebsiteSettings } = useApp();
  const [activeSection, setActiveSection] = useState<
    'brand' | 'announcement' | 'hero' | 'mockup' | 'features' | 'pricing' | 'contact' | 'api'
  >('brand');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [settings, setSettings] = useState<WebsiteSettingsData>({
    siteName: 'VoiceAI BD',
    siteTagline: 'বাংলাদেশের ব্যবসার জন্য 24/7 AI Voice Telephony & Customer Automation Platform',
    brandSlogan: 'Voice Telephony & Smart Customer Automation',
    supportPhone: '+880 1712-345678',
    supportEmail: 'support@voiceaibd.com',
    officeAddress: 'ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ',
    footerNotice: 'VoiceAI BD — 24/7 AI Voice Telephony & Customer Automation Platform for Bangladesh',

    announcementActive: true,
    announcementText: 'বাংলাদেশের প্রথম স্বয়ংক্রিয় এআই ভয়েস কলিং ও টেলিফোনি প্ল্যাটফর্ম এখন লাইভ!',
    announcementBadge: 'নতুন আপডেট',

    badgeText: 'VOICEAI BD 3D TELEPHONY • 24/7 লাইভ',
    heroTitlePrefix: 'স্বাভাবিক বাংলায় কথা বলা',
    heroTitleHighlight: 'AI Voice Agent',
    heroSubtitle: 'কোনো কল ড্রপ বা ওয়েটিং নয়! কাস্টমারের প্রশ্ন শুনবে, পণ্যের স্টক জানাবে, ডাক্তারের সিরিয়াল বুক করবে এবং লিড সংগ্রহ করবে। যেকোনো ব্রাউজার এবং +880 ফোন নম্বরে সরাসরি কার্যকর।',
    typewriterPhrases: [
      'আপনার কাস্টমারের প্রতিটি ফোন কলের উত্তর দেবে...',
      '২৪/৭ নিরবচ্ছিন্ন সেলস ও টেবিল বুকিং হ্যান্ডেল করবে...',
      'মিষ্টি ও স্বাভাবিক দেশীয় বাংলায় কথা বলবে...',
      'অর্ডার ও অ্যাপয়েন্টমেন্ট সরাসরি ডাটাবেজে জমা করবে...'
    ],

    primaryCtaText: 'ফ্রি Agent তৈরি করুন',
    secondaryCtaText: 'লাইভ কল টেস্ট শুনুন',

    mockupCallerName: 'কাউসার আহমেদ (ধানমন্ডি)',
    mockupBusinessName: 'AI Skill Hub BD',
    mockupTranscript: 'আসসালামু আলাইকুম! AI Skill Hub BD-তে স্বাগতম। আমাদের AI Mastermind কোর্স ও প্রিমিয়াম ক্লাবের এডমিশন চলছে। কীভাবে সাহায্য করতে পারি?',

    featuresHeading: 'কেন বাংলাদেশের হাজারো ব্যবসা VoiceAI BD বেছে নিচ্ছে',
    featuresSubheading: 'সাধারণ চ্যাটবট নয়, এটি মানুষের মতোই সাবলীল বাংলায় কথা বলে এবং কাস্টমার সন্তুষ্টি বাড়ায়',

    roiDefaultSalary: 25000,
    roiDefaultCalls: 80,

    whatsappNumber: '+880 1712-345678',
    facebookUrl: 'https://facebook.com',
    linkedinUrl: 'https://linkedin.com',

    vapiPrivateKey: '',
    vapiPublicKey: '',
    vapiAssistantId: 'b37b72e1-047d-408b-9096-cc5cf21256cd',
    geminiApiKey: '',
    elevenLabsApiKey: '',

    starterName: 'Starter',
    starterPrice: 1999,
    starterMinutes: 200,
    businessName: 'Business Pro',
    businessPrice: 4999,
    businessMinutes: 800,
    enterpriseName: 'Enterprise',
    enterprisePrice: 9999,
    enterpriseMinutes: 2500
  });

  // Key Visibility
  const [showVapiPrivate, setShowVapiPrivate] = useState(false);
  const [showGemini, setShowGemini] = useState(false);

  // Test states
  const [testingVapi, setTestingVapi] = useState(false);
  const [vapiTestResult, setVapiTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchWebsiteSettingsApi().then((res) => {
      if (res.success && res.data) {
        setSettings((prev) => ({
          ...prev,
          ...res.data,
          typewriterPhrases: res.data?.typewriterPhrases?.length
            ? res.data.typewriterPhrases
            : prev.typewriterPhrases
        }));
      }
      setLoading(false);
    });
  }, []);

  const handlePhraseChange = (index: number, value: string) => {
    const updated = [...settings.typewriterPhrases];
    updated[index] = value;
    setSettings({ ...settings, typewriterPhrases: updated });
  };

  const handleAddPhrase = () => {
    setSettings({
      ...settings,
      typewriterPhrases: [...settings.typewriterPhrases, 'নতুন কার্যকর বাংলা সেবা বাক্য...']
    });
  };

  const handleRemovePhrase = (index: number) => {
    if (settings.typewriterPhrases.length <= 1) {
      addToast('সতর্কতা', 'কমপক্ষে একটি বাক্য থাকা আবশ্যক।', 'warning');
      return;
    }
    const updated = settings.typewriterPhrases.filter((_, i) => i !== index);
    setSettings({ ...settings, typewriterPhrases: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveWebsiteSettingsApi(settings);
      if (res.success) {
        addToast('ওয়েবসাইট সেটিংস সংরক্ষিত!', 'আপনার নতুন কনটেন্ট ও এপিআই কি সার্ভারে সংরক্ষিত হয়েছে।', 'success');
        if (res.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
          updateWebsiteSettings(res.data);
        }
        if (onSaved) onSaved();
      } else {
        addToast('ত্রুটি', res.error || 'সেটিংস সেভ করা যায়নি।', 'error');
      }
    } catch {
      addToast('ব্যর্থ', 'সার্ভার রেসপন্স করেনি।', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestVapi = async () => {
    setTestingVapi(true);
    setVapiTestResult(null);
    try {
      const res = await testVapiServer();
      setVapiTestResult(res);
      if (res.success) {
        addToast('Vapi হ্যান্ডশেক সফল!', res.message, 'success');
      } else {
        addToast('Vapi সংযোগ ব্যর্থ', res.message, 'error');
      }
    } finally {
      setTestingVapi(false);
    }
  };

  const handleTestGemini = async () => {
    setTestingGemini(true);
    setGeminiTestResult(null);
    try {
      const res = await testGeminiServer();
      setGeminiTestResult(res);
      if (res.success) {
        addToast('Gemini API সক্রিয়!', res.message, 'success');
      } else {
        addToast('Gemini API ত্রুটি', res.message, 'error');
      }
    } finally {
      setTestingGemini(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
        <span>ওয়েবসাইট কনফিগারেশন লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0a1226] via-[#091530] to-[#060c1d] border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>WEBSITE CMS & API CONTROL (A TO Z)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>ওয়েবসাইটের A to Z পরিবর্তন ও কনফিগারেশন</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            কোড এডিট না করেই ওয়েবসাইটের ব্র্যান্ড, এনাউন্সমেন্ট বার, হিরো সেকশন, টাইপরাইটার অ্যানিমেশন, ৩ডি মকআপ, প্রাইসিং ও এপিআই কি এক ক্লিকে পরিবর্তন করুন
          </p>
          <div className="mt-2.5 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>১০০% লাইভ সিঙ্ক: আপনি যা সেভ করবেন, সমস্ত ভিজিটর ও কাস্টমাররা তা তৎক্ষণাৎ লাইভ দেখতে পাবেন।</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>সেভ হচ্ছে...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>পরিবর্তন সেভ করুন</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Subtabs (A to Z categories) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveSection('brand')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSection === 'brand'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>ব্র্যান্ড ও সাইট</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('announcement')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSection === 'announcement'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>টপ এনাউন্সমেন্ট</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('hero')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSection === 'hero'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>হিরো ও টাইপরাইটার</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('mockup')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSection === 'mockup'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>৩ডি ফোন মকআপ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('features')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSection === 'features'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>ফিচারসমূহ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('pricing')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSection === 'pricing'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>প্যাকেজ ও ফি</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('contact')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSection === 'contact'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>যোগাযোগ ও সোশ্যাল</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('api')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSection === 'api'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Vapi ও AI API কি</span>
          {settings.hasVapiPrivateKey && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>
      </div>

      {/* ========================================================
          TAB 1: BRAND & SITE INFO
      ======================================================== */}
      {activeSection === 'brand' && (
        <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-900/40 space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>সাধারণ ব্র্যান্ড ও পরিচয় সেটিংস</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">সাইটের নাম (Platform Name):</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-medium"
                placeholder="VoiceAI BD"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">ব্র্যান্ড স্লোগান (Slogan):</label>
              <input
                type="text"
                value={settings.brandSlogan}
                onChange={(e) => setSettings({ ...settings, brandSlogan: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-medium"
                placeholder="Voice Telephony & Smart Customer Automation"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-slate-300 font-semibold block">প্ল্যাটফর্ম ট্যাগলাইন (Tagline):</label>
              <input
                type="text"
                value={settings.siteTagline}
                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-medium"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-slate-300 font-semibold block">ফুটার নোটিস (Footer Text):</label>
              <input
                type="text"
                value={settings.footerNotice}
                onChange={(e) => setSettings({ ...settings, footerNotice: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: TOP ANNOUNCEMENT BANNER
      ======================================================== */}
      {activeSection === 'announcement' && (
        <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-900/40 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BellRing className="w-4 h-4 text-cyan-400" />
              <span>টপ এনাউন্সমেন্ট বার (Header Announcement Bar)</span>
            </h4>

            {/* Toggle switch */}
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-slate-300">
                {settings.announcementActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Off)'}
              </span>
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 relative"></div>
            </label>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">এনাউন্সমেন্ট ব্যাজ ট্যাগ (e.g. নতুন আপডেট / অফার):</label>
              <input
                type="text"
                value={settings.announcementBadge || ''}
                onChange={(e) => setSettings({ ...settings, announcementBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-cyan-300 focus:border-cyan-500 outline-none font-bold"
                placeholder="নতুন আপডেট"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">এনাউন্সমেন্ট বার্তা (Announcement Message):</label>
              <input
                type="text"
                value={settings.announcementText || ''}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-medium"
                placeholder="বাংলাদেশের প্রথম স্বয়ংক্রিয় এআই ভয়েস কলিং প্ল্যাটফর্ম এখন লাইভ!"
              />
            </div>

            {/* Live Preview Box */}
            <div className="p-3 rounded-xl bg-[#050811] border border-cyan-800/40 text-xs">
              <span className="text-[10px] text-slate-500 block mb-1 font-mono uppercase">লাইভ প্রিভিউ:</span>
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-950/80 via-indigo-950/80 to-slate-950 text-cyan-200 border border-cyan-800/40 flex items-center justify-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/40">
                  {settings.announcementBadge || 'নতুন'}
                </span>
                <span>{settings.announcementText || 'আপনার এনাউন্সমেন্ট টেক্সট'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: HERO & DYNAMIC WRITING ANIMATION
      ======================================================== */}
      {activeSection === 'hero' && (
        <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-900/40 space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>ল্যান্ডিং পেজ হেডলাইন ও লাইভ টাইপরাইটার রাইটিং অ্যানিমেশন</span>
          </h4>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">টপ লাইভ ব্যাজ টেক্সট:</label>
              <input
                type="text"
                value={settings.badgeText}
                onChange={(e) => setSettings({ ...settings, badgeText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-cyan-300 font-mono focus:border-cyan-500 outline-none"
                placeholder="VOICEAI BD 3D TELEPHONY • 24/7 লাইভ"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">মূল শিরোনাম (প্রথম অংশ):</label>
                <input
                  type="text"
                  value={settings.heroTitlePrefix}
                  onChange={(e) => setSettings({ ...settings, heroTitlePrefix: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-bold"
                  placeholder="স্বাভাবিক বাংলায় কথা বলা"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">হাইলাইট শিরোনাম (গ্রেডিয়েন্ট টেক্সট):</label>
                <input
                  type="text"
                  value={settings.heroTitleHighlight}
                  onChange={(e) => setSettings({ ...settings, heroTitleHighlight: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-cyan-300 focus:border-cyan-500 outline-none font-bold"
                  placeholder="AI Voice Agent"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">হিরো সাবটাইটেল (বিস্তারিত বিবরণ):</label>
              <textarea
                rows={3}
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-slate-200 focus:border-cyan-500 outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">প্রাইমারি CTA বাটন টেক্সট:</label>
                <input
                  type="text"
                  value={settings.primaryCtaText || 'ফ্রি Agent তৈরি করুন'}
                  onChange={(e) => setSettings({ ...settings, primaryCtaText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">সেকেন্ডারি CTA বাটন টেক্সট:</label>
                <input
                  type="text"
                  value={settings.secondaryCtaText || 'লাইভ কল টেস্ট শুনুন'}
                  onChange={(e) => setSettings({ ...settings, secondaryCtaText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-bold"
                />
              </div>
            </div>

            {/* Typewriter Rotating Phrases */}
            <div className="p-4 rounded-xl bg-[#050811] border border-cyan-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] font-mono block">
                    রাইটিং অ্যানিমেশন বাক্যসমূহ (Dynamic Typewriter Phrases):
                  </span>
                  <span className="text-[10px] text-slate-400">এই বাক্যগুলো পর্যায়ক্রমে স্ক্রিনে টাইপিং ইফেক্টে প্রদর্শিত হবে</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddPhrase}
                  className="px-3 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন বাক্য যোগ করুন</span>
                </button>
              </div>

              {settings.typewriterPhrases.map((phrase, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-300 text-center text-xs font-mono font-bold leading-6 shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={phrase}
                    onChange={(e) => handlePhraseChange(idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
                    placeholder={`বাক্য ${idx + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhrase(idx)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: 3D PHONE MOCKUP PREVIEW
      ======================================================== */}
      {activeSection === 'mockup' && (
        <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-900/40 space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>ল্যান্ডিং পেজের ৩ডি ফোন মকআপ কন্টেন্ট (3D Phone Mockup)</span>
          </h4>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">মকআপে প্রদর্শিত প্রতিষ্ঠানের নাম:</label>
              <input
                type="text"
                value={settings.mockupBusinessName || ''}
                onChange={(e) => setSettings({ ...settings, mockupBusinessName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-bold"
                placeholder="AI Skill Hub BD"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">মকআপে কলারের নাম ও এলাকা:</label>
              <input
                type="text"
                value={settings.mockupCallerName || ''}
                onChange={(e) => setSettings({ ...settings, mockupCallerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-medium"
                placeholder="কাউসার আহমেদ (ধানমন্ডি)"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">মকআপের ডায়লগ স্পিচ বাবল (এজেন্টের মুখের কথা):</label>
              <textarea
                rows={3}
                value={settings.mockupTranscript || ''}
                onChange={(e) => setSettings({ ...settings, mockupTranscript: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-cyan-200 focus:border-cyan-500 outline-none leading-relaxed font-sans"
                placeholder="আসসালামু আলাইকুম! স্বাগতম। কীভাবে সাহায্য করতে পারি?"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: FEATURES SECTION
      ======================================================== */}
      {activeSection === 'features' && (
        <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-900/40 space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>ফিচার সেকশন সেটিংস (Features Heading & Intro)</span>
          </h4>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">ফিচার সেকশন প্রধান শিরোনাম:</label>
              <input
                type="text"
                value={settings.featuresHeading || ''}
                onChange={(e) => setSettings({ ...settings, featuresHeading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-bold text-sm"
                placeholder="কেন বাংলাদেশের হাজারো ব্যবসা VoiceAI BD বেছে নিচ্ছে"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">ফিচার সেকশন সাব-শিরোনাম:</label>
              <input
                type="text"
                value={settings.featuresSubheading || ''}
                onChange={(e) => setSettings({ ...settings, featuresSubheading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-slate-300 focus:border-cyan-500 outline-none font-medium"
                placeholder="সাধারণ চ্যাটবট নয়, এটি মানুষের মতোই সাবলীল বাংলায় কথা বলে এবং কাস্টমার সন্তুষ্টি বাড়ায়"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">ROI ক্যালকুলেটর গড় মাসিক স্টাফ বেতন (৳):</label>
                <input
                  type="number"
                  value={settings.roiDefaultSalary || 25000}
                  onChange={(e) => setSettings({ ...settings, roiDefaultSalary: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-cyan-300 font-mono focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">ROI ক্যালকুলেটর দৈনিক গড় কল সংখ্যা:</label>
                <input
                  type="number"
                  value={settings.roiDefaultCalls || 80}
                  onChange={(e) => setSettings({ ...settings, roiDefaultCalls: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-cyan-300 font-mono focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 6: PRICING & PLANS (BDT)
      ======================================================== */}
      {activeSection === 'pricing' && (
        <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-900/40 space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <span>প্যাকেজ ও প্রাইসিং কনফিগারেশন (BDT)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Starter */}
            <div className="p-4 rounded-xl bg-[#050811] border border-slate-800 space-y-3">
              <input
                type="text"
                value={settings.starterName || 'Starter'}
                onChange={(e) => setSettings({ ...settings, starterName: e.target.value })}
                className="font-bold text-white block text-sm bg-transparent border-b border-slate-800 pb-1 w-full outline-none focus:border-cyan-500"
              />
              <div className="space-y-1">
                <label className="text-slate-400 block text-[11px]">মাসিক মূল্য (৳):</label>
                <input
                  type="number"
                  value={settings.starterPrice}
                  onChange={(e) => setSettings({ ...settings, starterPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono font-bold text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 block text-[11px]">কল মিনিট সীমা:</label>
                <input
                  type="number"
                  value={settings.starterMinutes}
                  onChange={(e) => setSettings({ ...settings, starterMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            {/* Business */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-3">
              <input
                type="text"
                value={settings.businessName || 'Business Pro'}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="font-bold text-cyan-300 block text-sm bg-transparent border-b border-cyan-700 pb-1 w-full outline-none focus:border-cyan-400"
              />
              <div className="space-y-1">
                <label className="text-slate-400 block text-[11px]">মাসিক মূল্য (৳):</label>
                <input
                  type="number"
                  value={settings.businessPrice}
                  onChange={(e) => setSettings({ ...settings, businessPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono font-bold text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 block text-[11px]">কল মিনিট সীমা:</label>
                <input
                  type="number"
                  value={settings.businessMinutes}
                  onChange={(e) => setSettings({ ...settings, businessMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            {/* Enterprise */}
            <div className="p-4 rounded-xl bg-[#050811] border border-slate-800 space-y-3">
              <input
                type="text"
                value={settings.enterpriseName || 'Enterprise'}
                onChange={(e) => setSettings({ ...settings, enterpriseName: e.target.value })}
                className="font-bold text-indigo-300 block text-sm bg-transparent border-b border-slate-800 pb-1 w-full outline-none focus:border-indigo-400"
              />
              <div className="space-y-1">
                <label className="text-slate-400 block text-[11px]">মাসিক মূল্য (৳):</label>
                <input
                  type="number"
                  value={settings.enterprisePrice}
                  onChange={(e) => setSettings({ ...settings, enterprisePrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono font-bold text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 block text-[11px]">কল মিনিট সীমা:</label>
                <input
                  type="number"
                  value={settings.enterpriseMinutes}
                  onChange={(e) => setSettings({ ...settings, enterpriseMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 7: CONTACT & SOCIAL
      ======================================================== */}
      {activeSection === 'contact' && (
        <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-900/40 space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>যোগাযোগ ও সোশ্যাল মিডিয়া প্রোফাইল</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>হেল্পলাইন ফোন (+880...):</span>
              </label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-mono"
                placeholder="+880 1712-345678"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>হোয়াটসঅ্যাপ নম্বর (WhatsApp):</span>
              </label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-emerald-400 focus:border-cyan-500 outline-none font-mono"
                placeholder="+880 1712-345678"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>সাপোর্ট ইমেইল:</span>
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-mono"
                placeholder="support@voiceaibd.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>অফিস ঠিকানা (Address):</span>
              </label>
              <input
                type="text"
                value={settings.officeAddress}
                onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none font-medium"
                placeholder="ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">ফেসবুক পেজ লিংক (Facebook URL):</label>
              <input
                type="text"
                value={settings.facebookUrl || ''}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">লিংকডইন প্রোফাইল লিংক (LinkedIn URL):</label>
              <input
                type="text"
                value={settings.linkedinUrl || ''}
                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-white focus:border-cyan-500 outline-none"
                placeholder="https://linkedin.com/company/yourbrand"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 8: VAPI & AI API CONTROL
      ======================================================== */}
      {activeSection === 'api' && (
        <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-900/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>Vapi & AI টেলিফোনি ইন্টিগ্রেশন কি (API Keys)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                আপনার Vapi.ai প্রাইভেট কি এখানে দিলে সরাসরি Vapi অ্যাসিস্ট্যান্ট তৈরি ও পরিচালনা হবে
              </p>
            </div>

            {/* Vapi Connection Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
                settings.hasVapiPrivateKey
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                  : 'bg-rose-950/80 text-rose-400 border-rose-800/60'
              }`}>
                <span className={`w-2 h-2 rounded-full ${settings.hasVapiPrivateKey ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span>{settings.hasVapiPrivateKey ? 'VAPI KEY CONNECTED' : 'KEY MISSING'}</span>
              </span>
            </div>
          </div>

          {/* Vapi Keys */}
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#040813] border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block text-sm">Vapi Private Key (API Secret)</span>
                  <span className="text-[11px] text-slate-400">
                    vapi.ai ড্যাশবোর্ড থেকে প্রাপ্ত প্রাইভেট কি (Bearer Token)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTestVapi}
                  disabled={testingVapi}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-800 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {testingVapi ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Radio className="w-3.5 h-3.5" />
                  )}
                  <span>Vapi কানেকশন টেস্ট</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showVapiPrivate ? 'text' : 'password'}
                  value={settings.vapiPrivateKey || ''}
                  onChange={(e) => setSettings({ ...settings, vapiPrivateKey: e.target.value })}
                  placeholder={settings.hasVapiPrivateKey ? '•••••••••••••••• (কি কনফিগার করা আছে, পরিবর্তন করতে নতুন কি লিখুন)' : 'e.g. 5d89f412-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#080d1e] border border-slate-800 text-cyan-300 font-mono focus:border-cyan-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowVapiPrivate(!showVapiPrivate)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showVapiPrivate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {vapiTestResult && (
                <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                  vapiTestResult.success ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}>
                  {vapiTestResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{vapiTestResult.message}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">Vapi Public Key (Client WebRTC):</label>
                <input
                  type="text"
                  value={settings.vapiPublicKey || ''}
                  onChange={(e) => setSettings({ ...settings, vapiPublicKey: e.target.value })}
                  placeholder="e.g. 8f62cxxx-xxxx-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-cyan-300 font-mono focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">Default Vapi Assistant ID:</label>
                <input
                  type="text"
                  value={settings.vapiAssistantId || ''}
                  onChange={(e) => setSettings({ ...settings, vapiAssistantId: e.target.value })}
                  placeholder="b37b72e1-047d-408b-9096-cc5cf21256cd"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050811] border border-slate-800 text-cyan-300 font-mono focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Gemini API Key */}
            <div className="p-4 rounded-xl bg-[#040813] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block text-sm">Google Gemini API Key</span>
                  <span className="text-[11px] text-slate-400">
                    স্বয়ংক্রিয় বাংলা প্রম্পট জেনারেশন ও কনভারসেশনাল NLU ইঞ্জিন
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTestGemini}
                  disabled={testingGemini}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/70 border border-indigo-800 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {testingGemini ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Gemini টেস্ট</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showGemini ? 'text' : 'password'}
                  value={settings.geminiApiKey || ''}
                  onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                  placeholder={settings.hasGeminiApiKey ? '•••••••••••••••• (সার্ভারে সক্রিয়)' : 'AIzaSy...'}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#080d1e] border border-slate-800 text-indigo-300 font-mono focus:border-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowGemini(!showGemini)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {geminiTestResult && (
                <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                  geminiTestResult.success ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}>
                  {geminiTestResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{geminiTestResult.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Button at Bottom */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>সেটিংস ও কনটেন্ট সেভ করুন</span>
        </button>
      </div>
    </form>
  );
};
