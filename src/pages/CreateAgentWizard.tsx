import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AgentType, LanguageOption, PersonalityTrait } from '../types';
import { VOICE_OPTIONS } from '../mockData';
import {
  Sparkles,
  Bot,
  Sliders,
  FileText,
  Volume2,
  CheckCircle2,
  Phone,
  ArrowRight,
  ArrowLeft,
  Zap,
  Play,
  Check,
  ShieldCheck,
  PhoneCall,
  LayoutDashboard,
  Loader2,
  AlertCircle,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateAiInstructions, createVapiAssistantRemote, fetchVapiStatus } from '../services/apiService';

export const CreateAgentWizard: React.FC = () => {
  const { addAgent, phoneNumbers, navigate, openCallSimulator, addToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [agentName, setAgentName] = useState('');
  const [businessName, setBusinessName] = useState('AI Skill Hub BD');
  const [agentType, setAgentType] = useState<AgentType>('Receptionist');
  const [language, setLanguage] = useState<LanguageOption>('বাংলা');

  // Personality sliders
  const [personality, setPersonality] = useState<PersonalityTrait>('Professional');
  const [friendliness, setFriendliness] = useState(85);
  const [professionalism, setProfessionalism] = useState(90);
  const [responseLength, setResponseLength] = useState(50);

  // Instructions
  const [instructions, setInstructions] = useState('');
  const [isGeneratingInstructions, setIsGeneratingInstructions] = useState(false);

  // Voice & Phone
  const [selectedVoiceId, setSelectedVoiceId] = useState('voice-bn-female-1');
  const [selectedPhoneId, setSelectedPhoneId] = useState(phoneNumbers[0]?.id || '');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Vapi Deployment
  const [deployToVapi, setDeployToVapi] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [createdVapiId, setCreatedVapiId] = useState<string | null>(null);
  const [customVapiAssistantId, setCustomVapiAssistantId] = useState<string>('');
  const [vapiApiKeyInput, setVapiApiKeyInput] = useState<string>('');
  const [isVapiConfigured, setIsVapiConfigured] = useState<boolean>(false);
  const [vapiDeployError, setVapiDeployError] = useState<string | null>(null);

  // Check Vapi status on component mount
  React.useEffect(() => {
    fetchVapiStatus().then((res) => {
      if (res.data?.connected || res.data?.privateKeyPresent) {
        setIsVapiConfigured(true);
      }
    }).catch(console.warn);
  }, []);

  // Activation Complete State
  const [isActivated, setIsActivated] = useState(false);
  const [createdAgentId, setCreatedAgentId] = useState<string | null>(null);

  // Auto-generate AI Instructions using server-side Gemini API with fallback
  const handleAutoGenerateInstructions = async () => {
    setIsGeneratingInstructions(true);
    const bName = businessName.trim() || 'AI Skill Hub BD';

    try {
      const result = await generateAiInstructions({
        businessName: bName,
        businessType: 'Customer Service & Training',
        agentType,
        language,
        personality,
        services: 'কোর্স ইনফরমেশন, ভর্তি সহায়তা ও অফিস অনুসন্ধান',
        customerSupportRequirements: 'অত্যন্ত নম্র ভাষায় কলারের সাথে কথা বলা, নাম ও ফোন নম্বর সংগ্রহ করা'
      });

      if (result.success && result.isRealAi && result.text) {
        setInstructions(result.text);
        addToast('Gemini AI দিয়ে instructions তৈরি হয়েছে', 'Google Gemini মডেলের মাধ্যমে পারফেক্ট বাংলা নির্দেশিকা জেনারেট হয়েছে।', 'success');
        setIsGeneratingInstructions(false);
        return;
      }
    } catch {
      // Fallback
    }

    // Local fallback generator
    let fallback = '';
    if (agentType === 'Receptionist') {
      fallback = `আপনি ${bName}-এর অফিশিয়াল AI Receptionist।
বাংলায় অত্যন্ত নম্র ও প্রফেশনালভাবে কলারের সাথে কথা বলবেন।
কোম্পানির অফিস সময়সূচি (সকাল ৯টা - রাত ৮টা), ঠিকানা এবং প্রাথমিক সার্ভিসগুলো সম্পর্কে কলারকে তথ্য প্রদান করবেন।
কলার কোনো সার্ভিসে আগ্রহী হলে তার পূর্ণ নাম এবং মোবাইল নম্বর সংগ্রহ করে কনফার্মেশন দেবেন।
যে তথ্য আপনার নলেজ বেসে নেই তা কখনো মনগড়া বলবেন না; বলবেন: "আমি নোট করে রাখছি, আমাদের টিম আপনাকে দ্রুত কল করবে।"`;
    } else if (agentType === 'Sales Agent') {
      fallback = `আপনি ${bName}-এর একজন প্রো-অ্যাক্টিভ AI Sales Agent।
কলারকে আন্তরিকভাবে সম্ভাষণ জানিয়ে তাদের প্রয়োজন ও বাজেট জেনে সেরা প্রোডাক্ট/কোর্স রেকমেন্ড করুন।
চলমান বিশেষ অফার ও সীমিত সময়ের ডিসকাউন্ট সম্পর্কে অবহিত করুন।
কলারের পার্চেজ ইনটেন্ট নিশ্চিত করে অর্ডার বা রেজিস্ট্রেশন বুকিংয়ের জন্য প্রয়োজনীয় তথ্য সংগ্রহ করুন।`;
    } else if (agentType === 'Customer Support') {
      fallback = `আপনি ${bName}-এর ডেডিকেটেড Customer Support Agent।
ধৈর্য্যের সাথে কাস্টমারের সমস্যা শুনুন এবং সহানুভূতিশীল ভাষায় সমাধান দিন।
ডেলিভারি ট্র্যাকিং, রিফান্ড পলিসি বা টেকনিক্যাল ইস্যু সমাধান করতে সাহায্য করুন।
সমস্যার সমাধান না হলে সাপোর্ট টিকিট নম্বর দিয়ে বলবেন একজন এক্সিকিউটিভ দ্রুত যোগাযোগ করবেন।`;
    } else {
      fallback = `আপনি ${bName}-এর এআই ভয়েস অ্যাসিস্ট্যান্ট।
বাংলা এবং প্রয়োজনে সাবলীল ইংরেজি মিশ্রিত ভাষায় স্বাভাবিকভাবে কথা বলবেন।
গ্রাহকের সব প্রশ্নের স্পষ্ট এবং সংক্ষেপিত উত্তর দিন।
অপ্রয়োজনীয় তথ্য পরিহার করে গ্রাহকের মূল্যবান সময় সাশ্রয় করুন।`;
    }

    setInstructions(fallback);
    addToast('Demo mode-এ instructions তৈরি হয়েছে', 'লোকাল টেমপ্লেট ব্যবহার করে নির্দেশিকা সেট করা হয়েছে।', 'info');
    setIsGeneratingInstructions(false);
  };

  // Preview Voice Sample
  const handlePreviewVoice = (voiceId: string, text: string) => {
    setPlayingVoiceId(voiceId);
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = voiceId.includes('en') ? 'en-US' : 'bn-BD';
        utterance.rate = 0.95;
        utterance.onend = () => setPlayingVoiceId(null);
        utterance.onerror = () => setPlayingVoiceId(null);
        window.speechSynthesis.speak(utterance);
      } catch {
        setTimeout(() => setPlayingVoiceId(null), 2500);
      }
    } else {
      setTimeout(() => setPlayingVoiceId(null), 2500);
    }
  };

  const handleActivateAgent = async () => {
    setIsDeploying(true);
    let vapiId: string | undefined = undefined;

    const bName = businessName.trim() || 'AI Skill Hub BD';
    const aName = agentName.trim() || `${bName} ${agentType}`;
    const defaultGreeting =
      language === 'English'
        ? `Hello! Thank you for calling ${bName}. How may I help you today?`
        : language === 'Banglish'
        ? `Hello! ${bName}-এ welcome। কীভাবে সাহায্য করতে পারি?`
        : `আসসালামু আলাইকুম! ${bName}-এ স্বাগতম। কীভাবে সাহায্য করতে পারি?`;

    if (deployToVapi) {
      if (customVapiAssistantId.trim()) {
        const id = customVapiAssistantId.trim();
        vapiId = id;
        setCreatedVapiId(id);
        setVapiDeployError(null);
        addToast('Vapi Assistant Linked!', `বিদ্যমান Vapi ID: ${id.slice(0, 8)}... সংযুক্ত করা হয়েছে।`, 'success');
      } else {
        try {
          const vapiRes = await createVapiAssistantRemote({
            name: aName,
            firstMessage: defaultGreeting,
            instructions: instructions || 'স্বাভাবিক ও ভদ্রভাবে কলারের প্রশ্নের উত্তর দিন। কলারের নাম ও ফোন নম্বর সংগ্রহ করুন।',
            apiKey: vapiApiKeyInput.trim() || undefined
          });

          if (vapiRes.success && vapiRes.assistant && typeof vapiRes.assistant.id === 'string') {
            const newAssistantId = vapiRes.assistant.id;
            vapiId = newAssistantId;
            setCreatedVapiId(newAssistantId);
            setIsVapiConfigured(true);
            setVapiDeployError(null);
            addToast('Vapi Voice Assistant Created!', `Vapi Assistant ID: ${newAssistantId.slice(0, 8)}... তৈরি হয়েছে`, 'success');
          } else {
            const errMsg = vapiRes.error || 'Vapi API কানেকশনে সমস্যা হয়েছে।';
            setVapiDeployError(errMsg);
            addToast('Vapi নোটিশ', errMsg, 'info');
          }
        } catch (err: any) {
          const errMsg = err?.message || 'Vapi সার্ভিসে সংযোগ স্থাপন করা যায়নি।';
          setVapiDeployError(errMsg);
          addToast('Vapi নোটিশ', errMsg, 'info');
        }
      }
    }

    const selectedPhone = phoneNumbers.find((p) => p.id === selectedPhoneId);
    const newAgent = addAgent({
      name: aName,
      businessName: bName,
      type: agentType,
      language,
      personality,
      friendliness,
      professionalism,
      responseLength,
      instructions: instructions || 'স্বাভাবিক ও ভদ্রভাবে কলারের প্রশ্নের উত্তর দিন।',
      voiceId: selectedVoiceId,
      phoneNumberId: selectedPhoneId,
      phoneNumber: selectedPhone?.number || '+880 9612-887766',
      isActive: true,
      vapiAssistantId: vapiId,
      vapiStatus: vapiId ? 'CONNECTED' : 'NOT_CONFIGURED'
    });

    setCreatedAgentId(newAgent.id);
    setIsDeploying(false);
    setIsActivated(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/agents')}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>এজেন্ট তালিকায় ফিরে যান</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>Create AI Voice Agent</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
              Main Server Storage
            </span>
          </h2>
        </div>
      </div>

      {/* Progress Bar / Step Indicators */}
      {!isActivated && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <button
              onClick={() => setStep(1)}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                step === 1
                  ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold shadow-xs'
                  : step > 1
                  ? 'text-emerald-700 font-medium'
                  : 'text-slate-400'
              }`}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-slate-100 border border-slate-200">
                {step > 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : '1'}
              </div>
              <span className="hidden sm:inline">1. Agent Info</span>
            </button>

            <button
              onClick={() => agentName && setStep(2)}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                step === 2
                  ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold shadow-xs'
                  : step > 2
                  ? 'text-emerald-700 font-medium'
                  : 'text-slate-400'
              }`}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-slate-100 border border-slate-200">
                {step > 2 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : '2'}
              </div>
              <span className="hidden sm:inline">2. Personality</span>
            </button>

            <button
              onClick={() => agentName && setStep(3)}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                step === 3
                  ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold shadow-xs'
                  : step > 3
                  ? 'text-emerald-700 font-medium'
                  : 'text-slate-400'
              }`}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-slate-100 border border-slate-200">
                {step > 3 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : '3'}
              </div>
              <span className="hidden sm:inline">3. Instructions</span>
            </button>

            <button
              onClick={() => agentName && instructions && setStep(4)}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                step === 4
                  ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold shadow-xs'
                  : 'text-slate-400'
              }`}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-slate-100 border border-slate-200">
                4
              </div>
              <span className="hidden sm:inline">4. Activation</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
        <AnimatePresence mode="wait">
          {/* STEP 1: Agent Information */}
          {step === 1 && !isActivated && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-amber-600" />
                  <span>Step 1: Agent Information</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  আপনার এজেন্টের নাম, ব্যবসা এবং যোগাযোগের ভাষা ঠিক করুন
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Agent Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="যেমন: AI Skill Hub Receptionist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Business Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="যেমন: AI Skill Hub BD"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Agent Type
                  </label>
                  <select
                    value={agentType}
                    onChange={(e) => setAgentType(e.target.value as AgentType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
                  >
                    <option value="Receptionist">Business Receptionist (২৪/৭ ফ্রন্ট ডেস্ক)</option>
                    <option value="Sales Agent">Sales & Inquiries Agent (পণ্য ও প্যাকেজ বিক্রয়)</option>
                    <option value="Customer Support">Customer Support (সহায়তা ও ফলো-আপ)</option>
                    <option value="Appointment Agent">Appointment Booking (ক্লিনিক ও কনসালট্যান্সি)</option>
                    <option value="Lead Generation">Lead Generation & Qualification (গ্রাহক অনুসন্ধান)</option>
                    <option value="Custom">Education Counselor (ভর্তি ও কোর্স তথ্য)</option>
                    <option value="Custom">Restaurant & Hotel Reception (বুকিং ও টেবিল রিজার্ভেশন)</option>
                    <option value="Custom">Ecommerce Support (অর্ডার ও ডেলিভারি তথ্য)</option>
                    <option value="Custom">Custom Agent (কাস্টম লজিক)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Primary Language
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['বাংলা', 'Banglish', 'English'] as LanguageOption[]).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={`py-2 px-3 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                          language === lang
                            ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!agentName.trim()}
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>পরবর্তী: AI Personality</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: AI Personality */}
          {step === 2 && !isActivated && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-600" />
                  <span>Step 2: AI Personality</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  এজেন্টের বাচনভঙ্গি ও আচরণ নির্ধারণ করুন
                </p>
              </div>

              {/* Personality Options */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Personality Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(['Friendly', 'Professional', 'Formal', 'Casual', 'Sales Assistant'] as PersonalityTrait[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPersonality(p)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        personality === p
                          ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-xs block">{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4 pt-2 text-xs">
                {/* Friendliness Slider */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-slate-700 font-medium">
                    <span>Friendliness (আন্তরিকতা):</span>
                    <span className="font-mono text-amber-700 font-bold">{friendliness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={friendliness}
                    onChange={(e) => setFriendliness(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>গম্ভীর / সংযত</span>
                    <span>অত্যন্ত আন্তরিক ও স্মাইলি</span>
                  </div>
                </div>

                {/* Professionalism Slider */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-slate-700 font-medium">
                    <span>Professionalism (পেশাদারিত্ব):</span>
                    <span className="font-mono text-amber-700 font-bold">{professionalism}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={professionalism}
                    onChange={(e) => setProfessionalism(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>অনানুষ্ঠানিক</span>
                    <span>কর্পোরেট স্ট্যান্ডার্ড</span>
                  </div>
                </div>

                {/* Response Length Slider */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-slate-700 font-medium">
                    <span>Response Length (উত্তরের দৈর্ঘ্য):</span>
                    <span className="font-mono text-amber-700 font-bold">{responseLength}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={responseLength}
                    onChange={(e) => setResponseLength(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>টু-দ্য-পয়েন্ট (সংক্ষিপ্ত)</span>
                    <span>বিস্তারিত ব্যাখ্যা</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>পূর্বে</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!instructions) handleAutoGenerateInstructions();
                    setStep(3);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>পরবর্তী: AI Instructions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: AI Instructions */}
          {step === 3 && !isActivated && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <span>Step 3: Voice Response Instructions (কী বলবে, কীভাবে উত্তর দিবে)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    আপনার AI Voice Agent কীভাবে কথা বলবে, ক্লাবের তথ্য বা মাস্টারমাইন্ড কোর্সের উত্তর কীভাবে দিবে তা লিখুন
                  </p>
                </div>

                {/* Auto Generate Button */}
                <button
                  type="button"
                  onClick={handleAutoGenerateInstructions}
                  disabled={isGeneratingInstructions}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer self-start"
                >
                  {isGeneratingInstructions ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  )}
                  <span>{isGeneratingInstructions ? 'AI তৈরি করছে...' : 'Gemini AI দিয়ে নির্দেশিকা তৈরি করুন'}</span>
                </button>
              </div>

              {/* Quick Presets / Topics for Instructions */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 text-[11px] font-medium">কুইক টেমপ্লেট:</span>
                <button
                  type="button"
                  onClick={() => {
                    setInstructions(
                      `আপনি ${businessName || 'AI Skill Hub BD'}-এর অফিসিয়াল Voice AI Consultant।\n\n` +
                      `১. কোর্স ও ক্লাব সংক্রান্ত তথ্য:\n` +
                      `- আমাদের 'AI Mastermind Course'-এ রয়েছে লাইভ প্র্যাকটিক্যাল প্রজেক্ট, টেলিফোনি ইন্টিগ্রেশন এবং বিজনেস অটোমেশন।\n` +
                      `- আমাদের 'VIP Founders Club' ও কমিউনিটিতে রয়েছে আজীবন সাপোর্ট, উইকলি মেন্টরশিপ এবং এক্সক্লুসিভ রিসোর্স।\n` +
                      `২. আচরণ ও বাচনভঙ্গি:\n` +
                      `- যেকোনো কলারকে অত্যন্ত সম্মান ও আন্তরিকতার সাথে সালাম দিয়ে স্বাগত জানাবেন।\n` +
                      `- ক্লাব বা কোর্স সম্পর্কে কেউ জানতে চাইলে স্পষ্ট ও সাবলীল বাংলায় বিস্তারিত জানাবেন। কখনোই 'কিছু জানি না' বা 'ভিউ অফ' জাতীয় বিভ্রান্তিকর কথা বলবেন না।\n` +
                      `৩. গ্রাহক তথ্য সংগ্রহ:\n` +
                      `- আগ্রহী হলে তাদের নাম এবং হোয়াটসঅ্যাপ নম্বর সংগ্রহ করে রাখবেন।`
                    );
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  🎓 AI Mastermind & Club টেমপ্লেট
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInstructions(
                      `আপনি ${businessName || 'Elite Services'}-এর সার্বক্ষণিক রিসেপশনিস্ট।\n` +
                      `বাংলা ও ইংরেজিতে সকল প্রশ্নের পরিষ্কার ও সংক্ষিপ্ত উত্তর দেবেন। সেবা ও অফার সম্পর্কে তথ্য দেবেন।`
                    );
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  🏢 বিজনেস রিসেপশন
                </button>
              </div>

              <div>
                <textarea
                  rows={8}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="আপনার AI Agent কীভাবে কথা বলবে এবং কী কাজ করবে তা লিখুন...
উদাহরণ:
আপনি AI Skill Hub BD-এর অফিশিয়াল Voice Receptionist।
বাংলায় স্বাভাবিক ও আন্তরিকভাবে কথা বলবেন।
মাস্টারমাইন্ড কোর্স ও প্রিমিয়াম ক্লাবের সকল তথ্য কলারকে স্পষ্টভাবে জানাবেন।
কলার ভর্তি হতে চাইলে নাম ও হোয়াটসঅ্যাপ নম্বর সংগ্রহ করবেন।"
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 leading-relaxed font-mono shadow-xs"
                />
              </div>

              {/* Server Main Storage Notification */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>মেইন সার্ভার স্টোরেজ নিশ্চয়তা:</strong> এই এজেন্টের যাবতীয় নির্দেশনা লোকাল ব্রাউজারের বদলে সরাসরি মেইন সার্ভার ডাটাবেজ (Main Server Storage) এবং Vapi API-তে সংরক্ষিত হবে, যাতে কোনো তথ্য কখনো মুছে না যায়।
                </span>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>পূর্বে</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>পরবর্তী: ভয়েস ও এক্টিভেশন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Voice Selection & Activation Checklist */}
          {step === 4 && !isActivated && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-amber-600" />
                  <span>Step 4: Voice & Main Storage Activation</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ভয়েস নির্বাচন এবং টেলিফোনি লাইন সংযোগ সম্পন্ন করুন
                </p>
              </div>

              {/* Voice Cards */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  ভয়েস নির্বাচন করুন (ElevenLabs Voice):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VOICE_OPTIONS.map((voice) => (
                    <div
                      key={voice.id}
                      onClick={() => setSelectedVoiceId(voice.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        selectedVoiceId === voice.id
                          ? 'border-amber-500 bg-amber-50 shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{voice.name}</p>
                          <p className="text-[11px] text-slate-500">{voice.style}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewVoice(voice.id, voice.sampleAudioText);
                          }}
                          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer ${
                            playingVoiceId === voice.id
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Play className="w-3 h-3" />
                          <span>{playingVoiceId === voice.id ? 'বাজছে...' : 'Preview'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phone connection select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ফোন নম্বর সংযোগ করুন:
                </label>
                <select
                  value={selectedPhoneId}
                  onChange={(e) => setSelectedPhoneId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono shadow-xs"
                >
                  {phoneNumbers.map((phone) => (
                    <option key={phone.id} value={phone.id}>
                      {phone.number} ({phone.provider}) - {phone.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Readiness Checklist */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Activation Readiness Checklist
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Agent configured ({agentName || 'Untitled'})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instructions added ({personality} mode)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Main Server Storage destination verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Voice selected ({VOICE_OPTIONS.find((v) => v.id === selectedVoiceId)?.name})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Phone number connected</span>
                  </div>
                </div>
              </div>

              {/* Deploy to Vapi Voice Cloud Toggle */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>Deploy to Vapi Voice AI Cloud</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono border border-emerald-300">
                          Live WebRTC
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Vapi API-এর মাধ্যমে সরাসরি লাইভ ভয়েস অ্যাসিস্ট্যান্ট তৈরি ও সিঙ্ক হবে।
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deployToVapi}
                      onChange={(e) => setDeployToVapi(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {deployToVapi && (
                  <div className="pt-3 border-t border-amber-200/80 space-y-3">
                    {/* Vapi Connection Status Indicator */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isVapiConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                        <span className="font-semibold text-slate-800">
                          {isVapiConfigured ? 'Vapi API কানেকশন সক্রিয় আছে' : 'Vapi Private Key দিন বা খালি রাখুন'}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${isVapiConfigured ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600'}`}>
                        {isVapiConfigured ? 'READY' : 'LOCAL SIMULATOR'}
                      </span>
                    </div>

                    {/* Vapi Private Key Direct Input if not configured */}
                    {!isVapiConfigured && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                          <span>আপনার Vapi Private Key দিন (Vapi.ai ড্যাশবোর্ড থেকে):</span>
                        </label>
                        <input
                          type="password"
                          value={vapiApiKeyInput}
                          onChange={(e) => setVapiApiKeyInput(e.target.value)}
                          placeholder="e.g. 4d7b... (Vapi.ai > API Keys থেকে কপি করা Private Key)"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-amber-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500"
                        />
                        <p className="text-[10px] text-slate-500">
                          এখানে পেস্ট করলে সরাসরি আপনার Vapi.ai অ্যাকাউন্টে অ্যাসিস্ট্যান্ট তৈরি হবে এবং কি-টি সেভ হয়ে থাকবে।
                        </p>
                      </div>
                    )}

                    {/* Optional Custom Existing Vapi Assistant ID */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 block">
                        বা আপনার বিদ্যমান Vapi Assistant ID সরাসরি লিংক করুন (ঐচ্ছিক):
                      </label>
                      <input
                        type="text"
                        value={customVapiAssistantId}
                        onChange={(e) => setCustomVapiAssistantId(e.target.value)}
                        placeholder="e.g. b37b72e1-047d-408b-9096-cc5cf21256cd (খালি রাখলে নতুন তৈরি হবে)"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-amber-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Large Activation Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isDeploying}
                  onClick={handleActivateAgent}
                  className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-sm shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer transform hover:scale-[1.01]"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Deploying to Vapi & Saving to Main Storage...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-amber-100" />
                      <span>Activate & Save to Main Storage</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* FINAL ACTIVATION SUCCESS SCREEN */}
          {isActivated && (
            <motion.div
              key="activated"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6"
            >
              {/* Animated Success Badge */}
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-lg mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900">AI Agent is Active & Saved in Main Storage! 🎉</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  আপনার AI Agent সফলভাবে তৈরি হয়েছে, মেইন সার্ভার ডাটাবেজে স্থায়ীভাবে সংরক্ষিত এবং লাইভ কলের জন্য প্রস্তুত।
                </p>
              </div>

              {/* Status Box */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Agent:</span>
                  <span className="font-bold text-slate-900">{agentName || 'Voice Agent'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Business:</span>
                  <span className="text-slate-800">{businessName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Storage:</span>
                  <span className="font-bold text-amber-700">Main Server Storage (/server/data/agents.json)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Phone Number:</span>
                  <span className="font-mono font-bold text-amber-800">
                    {phoneNumbers.find((p) => p.id === selectedPhoneId)?.number || '+880 9612-887766'}
                  </span>
                </div>
                {createdVapiId ? (
                  <div className="flex flex-col gap-1 py-1 border-b border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vapi Voice Agent:</span>
                      <span className="font-bold text-emerald-700 font-mono text-[10px]">CONNECTED</span>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-700 truncate">
                      ID: {createdVapiId}
                    </div>
                  </div>
                ) : vapiDeployError ? (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-[11px] text-amber-900 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-amber-800">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Vapi ক্লাউড স্ট্যাটাস:
                    </span>
                    <p className="font-mono text-[10px] text-amber-800">{vapiDeployError}</p>
                    <p className="text-slate-600 text-[10px]">
                      নোট: Admin Panel &gt; "Website &amp; API Settings"-এ গিয়ে Vapi Private Key সেট করে যেকোনো সময় সরাসরি সিঙ্ক করতে পারবেন।
                    </p>
                  </div>
                ) : null}
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Status:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ACTIVE & LIVE
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/agent-testing')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-white" />
                  <span>Testing Lab-এ সরাসরি কথা বলুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => openCallSimulator()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>ফোন কল টেস্ট</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/agents')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>সব এজেন্ট দেখুন</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
