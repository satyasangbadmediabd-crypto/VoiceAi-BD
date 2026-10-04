import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRICING_PLANS } from '../mockData';
import {
  Sparkles,
  PhoneCall,
  Bot,
  ArrowRight,
  CheckCircle2,
  PhoneForwarded,
  FileText,
  Users,
  ShieldCheck,
  Calendar,
  Headphones,
  TrendingUp,
  Cpu,
  Layers,
  Zap,
  Building2,
  Utensils,
  GraduationCap,
  ShoppingBag,
  Stethoscope,
  Plane,
  Home,
  MessageSquare,
  BarChart3,
  HelpCircle,
  Play,
  Volume2,
  Radio,
  Activity,
  Terminal,
  Shield,
  Clock,
  Database,
  Lock,
  LayoutDashboard
} from 'lucide-react';
import { isUserAdmin } from '../utils/adminAuth';
import { motion, AnimatePresence } from 'motion/react';
import { SpatialVoiceCore, VoiceCoreState } from '../components/SpatialVoiceCore';
import { AnimatedText } from '../components/AnimatedText';
import { Card3D } from '../components/Card3D';
import { TypewriterAnimation } from '../components/TypewriterAnimation';
import { PhoneMockup3D } from '../components/PhoneMockup3D';
import { RoiCalculator } from '../components/RoiCalculator';
import { LoginModal } from '../components/LoginModal';
import { ChevronDown, ExternalLink } from 'lucide-react';

// 4 Distinct Bengali Voice Models
const SAMPLE_VOICES = [
  {
    id: 'riyad',
    name: 'রিয়াদ (Riyad)',
    role: 'অফিসিয়াল কর্পোরেট রিসেপশনিস্ট',
    gender: 'পুরুষ (Male)',
    phrase: 'শুভ সকাল! আমাদের প্রতিষ্ঠানে যোগাযোগ করার জন্য ধন্যবাদ, আপনাকে কীভাবে সাহায্য করতে পারি?'
  },
  {
    id: 'nusrat',
    name: 'নুসরাত (Nusrat)',
    role: 'সিনিয়র কাস্টমার রিলেশনস',
    gender: 'মহিলা (Female)',
    phrase: 'হ্যালো! আপনার অর্ডার বা সার্ভিস সংক্রান্ত যেকোনো অনুসন্ধানে আমি প্রস্তুত আছি।'
  },
  {
    id: 'tanveer',
    name: 'তানভীর (Tanveer)',
    role: 'সেলস ও প্রমোশন স্পেশালিস্ট',
    gender: 'পুরুষ (Male)',
    phrase: 'আসসালামু আলাইকুম! আমাদের নতুন ডিসকাউন্ট অফার ও প্যাকেজ সম্পর্কে জানতে চান?'
  },
  {
    id: 'sumaiya',
    name: 'সুমাইয়া (Sumaiya)',
    role: 'ক্লিনিক ও অ্যাপয়েন্টমেন্ট কোঅর্ডিনেটর',
    gender: 'মহিলা (Female)',
    phrase: 'স্বাগতম! ডাক্তারের সিরিয়াল বুকিং বা রিপোর্ট ডেলিভারি টাইম জানতে সাহায্য করছি।'
  }
];

export const LandingPage: React.FC = () => {
  const { navigate, user, openCallSimulator, openCheckout, websiteSettings } = useApp();
  const [heroCoreState, setHeroCoreState] = useState<VoiceCoreState>('SPEAKING');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Vapi style interactive states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedAgentType, setSelectedAgentType] = useState('Customer Support');

  // Listen to open login event from navbar or actions
  useEffect(() => {
    const handleOpenLogin = () => setIsLoginModalOpen(true);
    window.addEventListener('voiceai_open_login', handleOpenLogin);
    return () => window.removeEventListener('voiceai_open_login', handleOpenLogin);
  }, []);

  // Listen to custom event from navbar/footer
  useEffect(() => {
    const handleTriggerCall = () => openCallSimulator();
    window.addEventListener('voiceai_trigger_call', handleTriggerCall);
    return () => window.removeEventListener('voiceai_trigger_call', handleTriggerCall);
  }, [openCallSimulator]);

  // Handle Play Voice Audition Preview
  const handlePlayVoice = (voiceId: string, phrase: string) => {
    if (playingVoiceId === voiceId) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingVoiceId(null);
      setHeroCoreState('IDLE');
      return;
    }

    setPlayingVoiceId(voiceId);
    setHeroCoreState('SPEAKING');

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.95;
      utterance.pitch = voiceId === 'nusrat' || voiceId === 'sumaiya' ? 1.15 : 0.92;
      utterance.onend = () => {
        setPlayingVoiceId(null);
        setHeroCoreState('IDLE');
      };
      utterance.onerror = () => {
        setTimeout(() => {
          setPlayingVoiceId(null);
          setHeroCoreState('IDLE');
        }, 3200);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setPlayingVoiceId(null);
        setHeroCoreState('IDLE');
      }, 3200);
    }
  };

  const dynamicPhrases = websiteSettings?.typewriterPhrases?.length
    ? websiteSettings.typewriterPhrases
    : [
        'আপনার কাস্টমারের প্রতিটি ফোন কলের উত্তর দেবে...',
        '২৪/৭ নিরবচ্ছিন্ন সেলস ও টেবিল বুকিং হ্যান্ডেল করবে...',
        'মিষ্টি ও স্বাভাবিক দেশীয় বাংলায় কথা বলবে...',
        'অর্ডার ও অ্যাপয়েন্টমেন্ট সরাসরি ডাটাবেজে জমা করবে...'
      ];

  return (
    <div className="min-h-screen text-slate-100 selection:bg-orange-500/30 selection:text-white pb-16">
      {/* Top Announcement Bar (VapiCon style) */}
      <aside aria-label="Announcement" className="bg-[#0b1710]/90 text-emerald-300 border-b border-emerald-800/40 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
            <span className="font-semibold text-slate-200">
              {websiteSettings?.announcementText || 'আধুনিক ক্লাউড টেলিফোনি ও কাস্টমার রিসেপশন সিস্টেম • যেকোনো ব্যবসায় মুহূর্তেই চালু করুন'}
            </span>
            <span className="text-emerald-400 font-bold">•</span>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer"
            >
              এখনই অ্যাকাউন্ট খুলুন
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          1. HERO SECTION: SMART TELEPHONY & CUSTOMER RECEPTION
      ======================================================== */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Warm energetic orange ambient glow flares */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-4xl space-y-6 text-left">
          {/* Tech Spec Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-300 text-xs font-mono font-semibold shadow-lg shadow-orange-950/50">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>স্মার্ট ক্লাউড টেলিফোনি • গ্রাহকের প্রতিটি কলে মানুষের মতো মিষ্টি কথোপকথন</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Main Huge Typography */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-sans">
              স্মার্ট ফোন রিসেপশন <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                আপনার ব্যবসার প্রতিটি কলে
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              দিন কিংবা রাত—গ্রাহকের একটি কলও মিস হবে না। সেলস, কাস্টমার সাপোর্ট এবং অ্যাপয়েন্টমেন্ট বুকিংয়ের পূর্ণাঙ্গ স্বয়ংক্রিয় ফোন সমাধান।
            </p>
          </div>

          {/* CTA Buttons (Open Dashboard, Admin Panel & Call Test) */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-950" />
              <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            {isUserAdmin(user) && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-orange-950/80 hover:bg-orange-900 border border-orange-500/50 text-orange-300 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>Admin Panel</span>
              </button>
            )}

            <button
              onClick={() => openCallSimulator()}
              className="px-6 py-3 rounded-full bg-[#180a04] hover:bg-[#220d05] text-white font-bold text-sm border border-orange-500/40 hover:border-orange-400 transition-all cursor-pointer shadow-md"
            >
              সরাসরি টেস্ট কল শুনুন
            </button>
          </div>

          {/* Interactive Live Voice Call Bar (as shown in user screenshot) */}
          <div className="pt-3 max-w-md">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#140803]/90 border border-orange-500/30 backdrop-blur-md shadow-2xl">
              {/* Agent Type Dropdown */}
              <div className="relative flex-1">
                <select
                  value={selectedAgentType}
                  onChange={(e) => setSelectedAgentType(e.target.value)}
                  className="w-full bg-transparent text-white text-xs font-semibold px-4 py-2.5 rounded-xl appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="Customer Support" className="bg-[#140803] text-white">কাস্টমার সাপোর্ট ও হেল্পডেস্ক</option>
                  <option value="Sales Agent" className="bg-[#140803] text-white">সেলস ও লিড কনফার্মেশন</option>
                  <option value="Appointment Booking" className="bg-[#140803] text-white">অ্যাপয়েন্টমেন্ট ও টেবিল বুকিং</option>
                  <option value="Doctor Serial" className="bg-[#140803] text-white">ডাক্তার সিরিয়াল হেল্পলাইন</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Start call button */}
              <button
                onClick={() => openCallSimulator()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>কল শুরু করুন</span>
              </button>
            </div>

            {/* Dotted underline micro-caption */}
            <p className="mt-2 text-[11px] text-slate-400 font-mono text-center sm:text-left">
              <span className="border-b border-dotted border-slate-500 pb-0.5">মাইক্রোফোন পারমিশন দিয়ে কথা বলে অভিজ্ঞতা নিন</span>
            </p>
          </div>
        </div>

        {/* Enterprise Trust Section matching screenshot */}
        <div className="mt-20 pt-10 border-t border-orange-500/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Ring Testimonial */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg font-sans">
              <span>amazon</span>
              <span className="text-slate-500 font-normal">|</span>
              <span className="text-orange-400">ring</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "When Ring customers call in, they expect fast, high-quality support. We went from <strong className="text-white font-semibold">zero to production in two weeks</strong>, and <strong className="text-white font-semibold">100% of our inbound volume</strong> now runs through Vapi. Most importantly, we've maintained our customer satisfaction scores."
            </p>
          </div>

          {/* Right: Trusted at Enterprise Scale Logos */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold block">
              TRUSTED AT ENTERPRISE SCALE
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 items-center opacity-70">
              <div className="p-3 rounded-xl bg-black/40 border border-orange-500/20 text-center font-bold text-slate-300 text-xs">
                amazon
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-orange-500/20 text-center font-bold text-slate-300 text-xs">
                ring
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-orange-500/20 text-center font-bold text-slate-300 text-xs">
                INTUIT
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-orange-500/20 text-center font-bold text-slate-300 text-xs">
                twilio
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. LIVE BANGLA VOICE AUDITION (Soundboard & 3D Core)
      ======================================================== */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-8 bg-[#070b18]/90 border border-cyan-500/30 shadow-[0_15px_45px_rgba(0,0,0,0.7)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan-900/40">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>3D ACOUSTIC AUDITION MATRIX</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                ৪টি স্বতন্ত্র বাংলা কণ্ঠের লাইভ অডিশন
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                ক্লিক করে শুনুন আপনার ব্যবসার জন্য কোন কণ্ঠটি সবচেয়ে মানানসই
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">DSP Core State:</span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-xs font-bold">
                {heroCoreState}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
            {/* Left: 4 Voice Cards (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SAMPLE_VOICES.map((v) => {
                const isPlaying = playingVoiceId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => handlePlayVoice(v.id, v.phrase)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                      isPlaying
                        ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] scale-[1.02]'
                        : 'bg-[#050813] border-slate-800 hover:border-cyan-800/80 hover:bg-[#070c1e]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {v.name}
                        </h4>
                        <span className="text-[11px] text-cyan-400/90 font-mono block">
                          {v.role}
                        </span>
                      </div>

                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform ${
                        isPlaying ? 'bg-cyan-400 text-slate-950 shadow-md' : 'bg-slate-800 text-cyan-300'
                      }`}>
                        {isPlaying ? (
                          <div className="flex items-end gap-0.5 h-3.5">
                            <span className="w-1 h-3.5 bg-slate-950 rounded-full animate-bounce" />
                            <span className="w-1 h-2 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-3.5 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                      "{v.phrase}"
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{v.gender}</span>
                      <span className="text-emerald-400">Natural Neural TTS</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: 3D Spatial Audio Sphere (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#040814] border border-cyan-900/40">
              <SpatialVoiceCore
                state={heroCoreState}
                size="lg"
                showLabel={true}
                connectionStatus="DSP Voice Active"
              />
              <p className="text-[11px] text-slate-400 font-mono mt-3 text-center">
                3D স্পেশিয়াল অডিও সিন্থেসিস ও রিয়েল-টাইম বাংলা অ্যাকোস্টিক ইঞ্জিন
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. REALTIME CONVERSATION TRANSCRIPT TERMINAL
      ======================================================== */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#070b18] border border-cyan-500/30 overflow-hidden shadow-2xl">
          {/* Terminal Titlebar */}
          <div className="px-5 py-3 bg-[#040711] border-b border-cyan-900/40 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold">
                TELEPHONY CONSOLE • LIVE BANGLA CALL TRANSCRIPT
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-400 border border-emerald-800/50">
                ACTIVE CALL 00:28
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Caller Info (4 cols) */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-[#040814] border border-cyan-900/30 space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">
                  এজেন্ট ও হটলাইন
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  রেস্তোরাঁ ও হসপিটালিটি AI
                </h4>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">
                  ফোন নম্বর
                </span>
                <p className="text-xs font-mono font-bold text-cyan-300">+880 9612-887766</p>
                <p className="text-[11px] text-slate-400">গুলশান ব্রাঞ্চ • টেবিল রিজার্ভেশন</p>
              </div>

              <button
                onClick={() => openCallSimulator()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>সরাসরি কথা বলে দেখুন</span>
              </button>
            </div>

            {/* Center: Live Dialogue Transcript (5 cols) */}
            <div className="md:col-span-5 space-y-3.5">
              {/* Customer Bubble */}
              <div className="p-4 rounded-2xl bg-[#040814] border border-slate-800 text-slate-200 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>কলার (+880 1712...)</span>
                  <span>10:24 AM</span>
                </div>
                <p className="text-xs sm:text-sm text-white font-sans">
                  "ভাই, আজকে রাতে আপনাদের রেস্তোরাঁয় ৪ জনের জন্য ফ্যামিলি টেবিল বুক করা যাবে?"
                </p>
              </div>

              {/* AI Agent Reply Bubble */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-50 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-cyan-300 font-mono">
                  <span className="flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> VoiceAI Agent
                  </span>
                  <span>10:24 AM (240ms)</span>
                </div>
                <p className="text-xs sm:text-sm text-cyan-100 font-sans leading-relaxed">
                  "অবশ্যই স্যার! আজকে রাত ৮টা এবং ৯টায় আমাদের ৪ জনের ফ্যামিলি টেবিল খালি রয়েছে। আপনার কোন সময়টি সুবিধা হবে?"
                </p>
              </div>
            </div>

            {/* Right: Telemetry & Intent (3 cols) */}
            <div className="md:col-span-3 p-5 rounded-2xl bg-[#040814] border border-cyan-900/30 space-y-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">ইনটেন্ট শনাক্তকরণ</span>
                <span className="text-xs font-bold text-emerald-400">Table Reservation (99.8%)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">লিড স্ট্যাটাস</span>
                <span className="text-xs font-bold text-cyan-300">Qualified Lead</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">প্রসেসিং গতি</span>
                <span className="text-xs font-bold text-blue-400">220ms (Realtime)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. INTERACTIVE ROI CALCULATOR
      ======================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RoiCalculator />
      </section>

      {/* ========================================================
          5. 3D BENTO GRID: PLATFORM CAPABILITIES
      ======================================================== */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
            NEXT-GEN PLATFORM ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {websiteSettings?.featuresHeading || 'প্রফেশনাল সফটওয়্যার ও ৩ডি ফিচারসমূহ'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {websiteSettings?.featuresSubheading || 'বাস্তব ফোন কলের উত্তর দেওয়া, তথ্য জানানো এবং গ্রাহক পরিচালনার পূর্ণাঙ্গ আধুনিক সুবিধা'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'স্বাভাবিক বাংলা ও বাংলিশ',
              icon: Bot,
              desc: 'দেশীয় উচ্চারণ, আঞ্চলিক ভঙ্গি এবং মিশ্র ভাষায় কলারের কথা নির্ভুলভাবে বুঝতে ও মানুষের মতো মিষ্টি গলায় উত্তর দিতে পারে।'
            },
            {
              title: 'Knowledge Base (RAG)',
              icon: FileText,
              desc: 'আপনার আপলোড করা সার্ভিস চার্জ, সময়সূচি ও নিয়মাবলী অনুযায়ী ১০০% নির্ভুল উত্তর দেয়।'
            },
            {
              title: 'স্মার্ট লিড ও CRM সিঙ্ক',
              icon: Users,
              desc: 'আগ্রহী কলারের নাম, ফোন নম্বর, চাহিদা ও সম্ভাব্য বাজেট স্বয়ংক্রিয়ভাবে CRM ড্যাশবোর্ডে সংরক্ষণ করে।'
            },
            {
              title: '+880 ফোন লাইন ইন্টিগ্রেশন',
              icon: PhoneForwarded,
              desc: 'বর্তমান ব্যবসায়িক নম্বর থেকে কল ফরোয়ার্ড অথবা সরাসরি নতুন ভার্চুয়াল +880 SIP নম্বর কানেক্ট করার সুবিধা।'
            },
            {
              title: 'কল অডিও ও পূর্ণ ট্রান্সক্রিপ্ট',
              icon: MessageSquare,
              desc: 'প্রতিটি কলের পূর্ণাঙ্গ অডিও প্লেব্যাক এবং লিখিত বাংলা বিবরণী যেকোনো সময় ব্রাউজারে শুনতে ও দেখতে পারবেন।'
            },
            {
              title: 'একযোগে আনলিমিটেড কল',
              icon: Cpu,
              desc: 'ব্যস্ত পিক-আওয়ারে কোনো কলারকে অপেক্ষমাণ না রেখে একযোগে শত শত ইনকামিং কল তাৎক্ষণিক গ্রহণ করে।'
            },
            {
              title: 'Agent Testing Lab',
              icon: Zap,
              desc: 'টেলিফোনি লাইনে কানেক্ট করার আগে ব্রাউজারে সরাসরি কথা বলে এজেন্টের মান যাচাই করার নিরাপদ ল্যাব।'
            },
            {
              title: 'বিকাশ ও নগদ স্বয়ংক্রিয় বিলিং',
              icon: ShieldCheck,
              desc: 'বিকাশ ও নগদ পার্সোনাল/মার্চেন্ট পেমেন্টের স্বয়ংক্রিয় রিসিট যাচাই ও অ্যাডমিন ট্র্যাকিং সিস্টেম।'
            }
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <Card3D
                key={i}
                depth={8}
                glowColor="rgba(6, 182, 212, 0.25)"
                className="p-5 bg-[#070b18] border-cyan-900/40 hover:border-cyan-500/50"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-3 shadow-md">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{feat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{feat.desc}</p>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          6. BANGLADESH LOCAL BUSINESS BLUEPRINTS
      ======================================================== */}
      <section id="solutions" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-900/30">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
            BANGLADESH INDUSTRY BLUEPRINTS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            বাংলাদেশের ব্যবসার বাস্তব সমাধান
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            ডাক্তার থেকে শুরু করে ই-কমার্স—বিভিন্ন খাতের সফল ও পরীক্ষিত ব্যবহার
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              category: 'ক্লিনিক ও ডায়াগনস্টিক',
              icon: Stethoscope,
              business: 'CarePoint Clinic, ধানমন্ডি',
              workflow: 'ডাক্তারের শিডিউল ও ভিজিট ফি নিশ্চিতকরণ, সিরিয়াল বুকিং ও টেস্ট রিপোর্ট ডেলিভারির স্ট্যাটাস দ্রুত প্রদান করে।'
            },
            {
              category: 'হোটেল ও রিসোর্ট',
              icon: Building2,
              business: 'GreenView Resort, শ্রীমঙ্গল',
              workflow: 'রুম বুকিং অনুসন্ধান, চেক-ইন পলিসি ও স্পেশাল উইকএন্ড প্যাকেজ ডিটেইলস স্বাভাবিকভাবে জানায়।'
            },
            {
              category: 'রেস্তোরাঁ ও ক্যাফে',
              icon: Utensils,
              business: 'Sultans Feast, গুলশান',
              workflow: 'টেবিল রিজার্ভেশন, আজকের শেফ স্পেশাল আইটেম ও ক্যাটারিং অর্ডার ক্যাপচার করে।'
            },
            {
              category: 'এডুকেশন ও কোচিং',
              icon: GraduationCap,
              business: 'AI Skill Hub, উত্তরা',
              workflow: 'কোর্স ফি, নতুন ব্যাচের শিডিউল ও শিক্ষার্থীদের আগ্রহের ডেটা স্বয়ংক্রিয়ভাবে সংগ্রহ করে।'
            },
            {
              category: 'ই-কমার্স ও রিটেল',
              icon: ShoppingBag,
              business: 'SmartGadget BD, বনানী',
              workflow: 'প্রোডাক্ট স্টক, ক্যাশ অন ডেলিভারি এরিয়া ও রিটার্ন পলিসি সম্পর্কিত সকল প্রশ্নের তাৎক্ষণিক উত্তর।'
            },
            {
              category: 'রিয়েল এস্টেট ও ডেভেলপার',
              icon: Home,
              business: 'Premier Properties, বারিধারা',
              workflow: 'ফ্ল্যাট ও প্লট প্রজেক্ট বিবরণী, স্কয়ার ফিট রেট ও সাইট ভিজিট অ্যাপয়েন্টমেন্ট শিডিউলিং।'
            }
          ].map((uc, i) => {
            const Icon = uc.icon;
            return (
              <div key={i} className="p-5 rounded-2xl bg-[#070b18] border border-cyan-900/40 space-y-2.5 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">{uc.category}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">{uc.business}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{uc.workflow}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          7. PRICING & BKASH BILLING SETUP
      ======================================================== */}
      <section id="pricing" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-900/30">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
            TRANSPARENT BD PRICING & BILLING
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            সাশ্রয়ী ও স্বচ্ছ প্যাকেজ
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            বিকাশ ও নগদে তাৎক্ষণিক পেমেন্ট করে কয়েক মিনিটেই অ্যাকাউন্ট চালু করুন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => {
            const dynamicPrice = plan.id === 'starter'
              ? (websiteSettings?.starterPrice ?? plan.price)
              : plan.id === 'business'
              ? (websiteSettings?.businessPrice ?? plan.price)
              : (websiteSettings?.enterprisePrice ?? plan.price);

            const dynamicName = plan.id === 'starter'
              ? (websiteSettings?.starterName || plan.name)
              : plan.id === 'business'
              ? (websiteSettings?.businessName || plan.name)
              : (websiteSettings?.enterpriseName || plan.name);

            const dynamicMinutes = plan.id === 'starter'
              ? (websiteSettings?.starterMinutes ?? 200)
              : plan.id === 'business'
              ? (websiteSettings?.businessMinutes ?? 800)
              : (websiteSettings?.enterpriseMinutes ?? 2500);

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                  plan.recommended
                    ? 'bg-gradient-to-b from-[#09152b] via-[#071024] to-[#040814] border-2 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.25)]'
                    : 'bg-[#070b18] border border-cyan-900/40 hover:border-cyan-700/60'
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 text-[10px] font-black px-3.5 py-0.5 rounded-full uppercase tracking-wider font-mono shadow-md">
                    সেরা পছন্দ (Popular)
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{dynamicName}</h3>
                  <div className="mb-4 font-mono">
                    <span className="text-3xl font-black text-cyan-300">৳{dynamicPrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-400"> / মাস</span>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-800 mb-6">
                    <div className="flex items-start gap-2.5 text-xs text-cyan-200 font-semibold font-mono">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{dynamicMinutes} কল মিনিট অন্তর্ভুক্ত</span>
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => openCheckout({ ...plan, name: dynamicName, price: dynamicPrice, priceLabel: `৳${dynamicPrice.toLocaleString('en-IN')} / মাস` })}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      plan.recommended
                        ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black shadow-lg shadow-cyan-500/25 active:scale-95'
                        : 'bg-[#050813] hover:bg-slate-800 text-slate-200 border border-slate-700 active:scale-95'
                    }`}
                  >
                    বিকাশ / নগদে শুরু করুন
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          8. FREQUENTLY ASKED QUESTIONS (FAQ)
      ======================================================== */}
      <section id="faq" className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-cyan-900/30">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
            KNOWLEDGE & HELP
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            সাধারণ প্রশ্নোত্তর
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'AI Agent কি সম্পূর্ণ বাংলায় স্বাভাবিকভাবে কথা বলতে পারে?',
              a: 'হ্যাঁ, VoiceAI BD উন্নত জেনারেটিভ স্পিচ ও NLU ইঞ্জিন ব্যবহার করে যা শুদ্ধ প্রমিত বাংলা এবং প্রচলিত বাংলিশ (Banglish) উভয়েই স্বাভাবিক সাবলীলতায় বুঝতে ও মানুষের মতো মিষ্টি কণ্ঠে কথা বলতে পারে।'
            },
            {
              q: 'আমার বর্তমান ব্যবসায়িক নম্বর কি ব্যবহার করা যাবে?',
              a: 'হ্যাঁ! আপনি আপনার বর্তমান +880 গ্রামীণফোন, রবি, বাংলালিংক বা টেলিটক নম্বর থেকে কল ফরোয়ার্ডিং চালু করে অথবা ভার্চুয়াল SIP ট্রাঙ্কের মাধ্যমে সরাসরি এজেন্টের সাথে যুক্ত করতে পারবেন।'
            },
            {
              q: 'বিকাশ বা নগদে টাকা পাঠালে কীভাবে বিলিং ভেরিফাই হবে?',
              a: 'চেকআউট পেজে উল্লেখিত বিকাশ/নগদ পার্সোনাল বা মার্চেন্ট নম্বরে সেন্ড মানি/পেমেন্ট করার পর ট্রানজেকশন আইডি (TrxID) ইনপুট দিলে অ্যাডমিন প্যানেল থেকে তাৎক্ষণিক প্ল্যান সক্রিয় হয়ে যাবে।'
            },
            {
              q: 'এজেন্ট কি ভুল তথ্য দেওয়ার ঝুঁকি থাকে?',
              a: 'না। এজেন্ট শুধুমাত্র আপনার আপলোড করা Knowledge Base (যেমন ক্যাটালগ, FAQ, প্রম্পট) অনুসারে নির্ভুল উত্তর প্রদান করে। সীমার বাইরের তথ্যের ক্ষেত্রে এজেন্ট কলটি সরাসরি আপনার স্টাফের কাছে ফরোয়ার্ড করে দেয়।'
            },
            {
              q: 'একযোগে কতগুলো কল হ্যান্ডেল করা যায়?',
              a: 'ক্লাউড স্কেলে একযোগে শত শত ইনকামিং কল রিসিভ করা সম্ভব। কোনো কাস্টমার ব্যস্ত লাইন বা কল ড্রপের সম্মুখীন হবে না।'
            }
          ].map((faq, i) => (
            <div
              key={i}
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              className="p-4 rounded-2xl bg-[#070b18] border border-cyan-900/40 space-y-2 cursor-pointer transition-colors hover:border-cyan-500/40"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <span className="text-cyan-400 font-mono text-sm">
                  {activeFaq === i ? '−' : '+'}
                </span>
              </div>
              {(activeFaq === i || activeFaq === null) && (
                <p className="text-xs text-slate-300 pl-6 leading-relaxed font-sans">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          9. HIGH CONVERTING BOTTOM CALL TO ACTION
      ======================================================== */}
      <section className="py-14 sm:py-20 border-t border-cyan-900/30 bg-[#040713] px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-500/15 to-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>NO CODING REQUIRED • INSTANT SETUP</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white">
            আপনার ব্যবসার জন্য বাংলা AI Voice Agent চালু করুন আজই
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            কাস্টমারের প্রতিটি কল রিসিভ করে সেলস বৃদ্ধি করুন এবং অপারেশনাল খরচ কমিয়ে আনুন।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => navigate(user ? '/agents/create' : '/signup')}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <span>ফ্রি অ্যাকাউন্ট তৈরি করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openCallSimulator()}
              className="px-6 py-3.5 rounded-2xl bg-[#080d1d] hover:bg-slate-800 border border-cyan-800/60 text-cyan-300 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-cyan-400" />
              <span>লাইভ ডেমো কল টেস্ট</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-mono pt-4">
            VoiceAI BD — 24/7 AI Voice Telephony & Customer Automation Platform
          </p>
        </div>
      </section>

      {/* Global Interactive Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};
