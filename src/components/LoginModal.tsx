import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User,
  Building,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  Globe,
  AlertCircle,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, navigate } = useApp();

  const [authTab, setAuthTab] = useState<'methods' | 'email' | 'phone'>('methods');
  const [isSignUp, setIsSignUp] = useState(false);

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Phone & OTP form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState<'input_phone' | 'input_otp'>('input_phone');
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [phoneUserName, setPhoneUserName] = useState('');

  // Social Auth Modals & States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [customFbEmail, setCustomFbEmail] = useState('');
  const [showCustomFbInput, setShowCustomFbInput] = useState(false);

  // Success state after login
  const [loginSuccessData, setLoginSuccessData] = useState<{
    name: string;
    emailOrPhone: string;
    provider: string;
  } | null>(null);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpStep === 'input_otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, otpTimer]);

  if (!isOpen) return null;

  // Complete login and launch in new tab
  const completeLoginAndOpenNewTab = (userData: Partial<UserProfile>) => {
    login(userData);
    setLoginSuccessData({
      name: userData.name || 'User',
      emailOrPhone: userData.email || userData.phone || '',
      provider: userData.authProvider || 'google'
    });

    // Open dashboard in new tab
    try {
      const newTab = window.open('/dashboard', '_blank');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        // Fallback if popup blocked
        console.warn('Popup blocked, dashboard can be opened manually');
      }
    } catch (e) {
      console.warn('Window open error:', e);
    }
  };

  // Google Login Handler
  const handleSelectGoogleAccount = (acc: { name: string; email: string; avatar: string }) => {
    setShowGoogleModal(false);
    completeLoginAndOpenNewTab({
      name: acc.name,
      businessName: `${acc.name.split(' ')[0]} Enterprise`,
      email: acc.email,
      phone: '+880 1712-345678',
      avatar: acc.avatar,
      authProvider: 'google',
      plan: 'Business',
      minutesUsed: 140,
      minutesLimit: 1000,
      joinedDate: new Date().toLocaleDateString('en-GB')
    });
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@')) return;
    const namePart = customGoogleEmail.split('@')[0];
    setShowGoogleModal(false);
    completeLoginAndOpenNewTab({
      name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      businessName: `${namePart} Enterprise BD`,
      email: customGoogleEmail,
      phone: '+880 1712-345678',
      authProvider: 'google',
      plan: 'Business',
      minutesUsed: 140,
      minutesLimit: 1000,
      joinedDate: new Date().toLocaleDateString('en-GB')
    });
  };

  // Facebook Login Handler
  const handleSelectFacebookAccount = (acc: { name: string; email: string; avatar: string }) => {
    setShowFacebookModal(false);
    completeLoginAndOpenNewTab({
      name: acc.name,
      businessName: `${acc.name.split(' ')[0]} Media BD`,
      email: acc.email,
      phone: '+880 1819-876543',
      avatar: acc.avatar,
      authProvider: 'facebook',
      plan: 'Business',
      minutesUsed: 140,
      minutesLimit: 1000,
      joinedDate: new Date().toLocaleDateString('en-GB')
    });
  };

  // Phone OTP Handlers
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanNum.length < 10) return;
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpStep('input_otp');
      setOtpTimer(60);
      setOtpCode(['1', '2', '3', '4', '5', '6']);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      const cleanPhone = phoneNumber.startsWith('0') ? `+88${phoneNumber}` : `+880${phoneNumber}`;
      completeLoginAndOpenNewTab({
        name: phoneUserName.trim() || 'মোবাইল ব্যবহারকারী',
        businessName: 'স্মার্ট কোম্পানি বিডি',
        phone: cleanPhone,
        email: `${phoneNumber.replace(/[^0-9]/g, '')}@voiceai.bd`,
        authProvider: 'phone',
        plan: 'Business',
        minutesUsed: 140,
        minutesLimit: 1000,
        joinedDate: new Date().toLocaleDateString('en-GB')
      });
    }, 600);
  };

  // Email Submit Handler
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (isSignUp) {
      signup({
        name: name || 'নতুন উদ্যোক্তা',
        businessName: businessName || 'আমার কোম্পানি',
        phone: '+880 1712-345678',
        email: email,
        plan: 'Starter'
      });
      try {
        window.open('/dashboard', '_blank');
      } catch {}
      onClose();
    } else {
      completeLoginAndOpenNewTab({
        name: email.split('@')[0] || 'উদ্যোক্তা',
        businessName: 'স্মার্ট এন্টারপ্রাইজ BD',
        phone: '+880 1712-345678',
        email: email,
        authProvider: 'email',
        plan: 'Business',
        minutesUsed: 140,
        minutesLimit: 1000,
        joinedDate: new Date().toLocaleDateString('en-GB')
      });
    }
  };

  // 1-Click Quick Demo
  const handleQuickDemo = () => {
    completeLoginAndOpenNewTab({
      name: 'কাউসার আহমেদ',
      businessName: 'AI Skill Hub BD',
      phone: '+880 1712-345678',
      email: 'satyasangbad.media.bd@gmail.com',
      authProvider: 'google',
      plan: 'Business',
      minutesUsed: 140,
      minutesLimit: 1000,
      joinedDate: new Date().toLocaleDateString('en-GB')
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e0703]/95 border border-orange-500/30 text-slate-100 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Warm ambient background glow inside modal */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If already successfully logged in and launched in new tab */}
        {loginSuccessData ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">লগইন সফল হয়েছে!</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-1">
                স্বাগতম, {loginSuccessData.name} ({loginSuccessData.emailOrPhone})
              </p>
              <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
                আপনার VoiceAI BD ড্যাশবোর্ড একটি নতুন ব্রাউজার ট্যাবে সফলভাবে চালু করা হয়েছে।
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-200 text-xs text-left flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>
                পপআপ ব্লকার থাকলে নিচের বাটনে ক্লিক করে সরাসরি ড্যাশবোর্ডে প্রবেশ করতে পারেন।
              </span>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    window.open('/dashboard', '_blank');
                  } catch {}
                  navigate('/dashboard');
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>নতুন ট্যাবে ড্যাশবোর্ড খুলুন</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  navigate('/dashboard');
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                বর্তমান ট্যাবে ড্যাশবোর্ড দেখুন
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-[11px] text-orange-300 font-medium mb-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>VoiceAI BD সিকিউর অথেন্টিকেশন</span>
              </div>
              <h3 className="text-xl font-black text-white">
                {isSignUp ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'অ্যাকাউন্টে লগইন করুন'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Google, Facebook, মোবাইল নম্বর OTP বা ইমেইল দিয়ে প্রবেশ করুন
              </p>
            </div>

            {/* Quick 1-Click Demo Shortcut */}
            <div className="mb-4 p-2.5 rounded-xl bg-gradient-to-r from-orange-950/80 via-amber-950/60 to-slate-900 border border-orange-500/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-orange-200">
                <Sparkles className="w-4 h-4 text-orange-400 animate-pulse shrink-0" />
                <span className="font-semibold text-[11px] text-slate-200">টেস্ট ডেমো দিয়ে দেখতে চান?</span>
              </div>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-[11px] transition-all cursor-pointer shadow-sm"
              >
                ১-ক্লিক ডেমো
              </button>
            </div>

            {/* Tabs for Methods */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-orange-500/20 mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthTab('methods')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  authTab === 'methods'
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-md shadow-orange-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                সোশ্যাল লগইন
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('phone')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  authTab === 'phone'
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-md shadow-orange-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📱 মোবাইল OTP
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('email')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  authTab === 'email'
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-md shadow-orange-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ✉️ ইমেইল
              </button>
            </div>

            {/* TAB 1: SOCIAL (Google & Facebook) */}
            {authTab === 'methods' && (
              <div className="space-y-3">
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span className="text-slate-900">Google দিয়ে এগিয়ে যান</span>
                </button>

                {/* Facebook Sign In Button */}
                <button
                  type="button"
                  onClick={() => setShowFacebookModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
                >
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook দিয়ে এগিয়ে যান</span>
                </button>

                {/* Direct quick buttons for Phone & Email */}
                <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthTab('phone')}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-orange-500/20 text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>নম্বর ও ওটিপি</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('email')}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-orange-500/20 text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-orange-400" />
                    <span>ইমেইল ও পাসওয়ার্ড</span>
                  </button>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-orange-950/30 border border-orange-500/20 text-[11px] text-slate-400 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Google বা Facebook আইডি দিয়ে লগইন করার পর স্বয়ংক্রিয়ভাবে নতুন ট্যাবে ড্যাশবোর্ড ওপেন হবে।
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: PHONE & OTP */}
            {authTab === 'phone' && (
              <div>
                {otpStep === 'input_phone' ? (
                  <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-medium text-slate-300 mb-1.5">
                        আপনার পুরো নাম (ঐচ্ছিক):
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={phoneUserName}
                          onChange={(e) => setPhoneUserName(e.target.value)}
                          placeholder="কাউসার আহমেদ"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-orange-500/30 text-slate-200 focus:outline-none focus:border-orange-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-300 mb-1.5">
                        বাংলাদেশি মোবাইল নম্বর:
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 border border-orange-500/30 text-slate-300 font-mono text-xs shrink-0 select-none">
                          <span>🇧🇩</span>
                          <span>+880</span>
                        </div>
                        <div className="relative flex-1">
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="1712-345678"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-orange-500/30 text-slate-200 focus:outline-none focus:border-orange-500 font-mono text-xs"
                            required
                            autoFocus
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSendingOtp ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>ওটিপি কোড পাঠানো হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <span>৬-সংখ্যার OTP কোড পাঠান</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                    <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-500/40 text-orange-200 text-xs flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">কোড পাঠানো হয়েছে:</p>
                        <p className="font-mono text-orange-400 text-[11px]">+880 {phoneNumber}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpStep('input_phone')}
                        className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                      >
                        নম্বর বদলান
                      </button>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-300 mb-2 text-center">
                        ৬-সংখ্যার ভেরিফিকেশন ওটিপি লিখুন:
                      </label>
                      <div className="flex justify-center gap-2">
                        {otpCode.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`modal-otp-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const val = e.target.value.slice(-1);
                              const newArr = [...otpCode];
                              newArr[idx] = val;
                              setOtpCode(newArr);
                              if (val && idx < 5) {
                                const next = document.getElementById(`modal-otp-${idx + 1}`);
                                if (next) next.focus();
                              }
                            }}
                            className="w-10 h-11 text-center font-mono text-lg font-bold rounded-xl bg-black/80 border border-orange-500/40 text-white focus:outline-none focus:border-orange-400"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        {otpTimer > 0 ? `পুনরায় কোড পাঠান: ${otpTimer}s` : 'কোড পাননি?'}
                      </span>
                      <button
                        type="button"
                        disabled={otpTimer > 0}
                        onClick={() => {
                          setOtpTimer(60);
                          setOtpCode(['1', '2', '3', '4', '5', '6']);
                        }}
                        className="text-orange-400 hover:text-orange-300 font-semibold disabled:opacity-40 cursor-pointer"
                      >
                        পুনরায় পাঠান
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>যাচাই করা হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <span>ওটিপি যাচাই ও নতুন ট্যাবে ড্যাশবোর্ড খুলুন</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: EMAIL */}
            {authTab === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-xs">
                {isSignUp && (
                  <>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">আপনার নাম:</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="মোঃ তানভীর আহমেদ"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-orange-500/30 text-slate-200 focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-300 mb-1">প্রতিষ্ঠানের নাম:</label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="AI Skill Hub BD"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-orange-500/30 text-slate-200 focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-medium text-slate-300 mb-1">ইমেইল এড্রেস:</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@business.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-orange-500/30 text-slate-200 focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">পাসওয়ার্ড:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-black/60 border border-orange-500/30 text-slate-200 focus:outline-none focus:border-orange-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isSignUp ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন ও নতুন ট্যাবে খুলুন'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                  >
                    {isSignUp ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন' : 'নতুন ব্যবহারকারী? সাইন আপ করুন'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* GOOGLE ACCOUNT SELECTION MODAL */}
      {/* ======================================================== */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Header */}
            <div className="text-center mb-5">
              <svg className="w-7 h-7 mx-auto mb-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <h3 className="text-base font-bold text-slate-900">একটি গুগল অ্যাকাউন্ট বেছে নিন</h3>
              <p className="text-xs text-slate-500">VoiceAI BD এর সাথে সাইন ইন করুন</p>
            </div>

            {/* Google Accounts List */}
            <div className="space-y-2 mb-4">
              <div
                onClick={() =>
                  handleSelectGoogleAccount({
                    name: 'Satya Sangbad Media',
                    email: 'satyasangbad.media.bd@gmail.com',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
                  })
                }
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center shrink-0">
                  S
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">Satya Sangbad Media</p>
                  <p className="text-[11px] text-slate-500 truncate">satyasangbad.media.bd@gmail.com</p>
                </div>
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>

              <div
                onClick={() =>
                  handleSelectGoogleAccount({
                    name: 'কাউসার আহমেদ',
                    email: 'kauser.voiceaibd@gmail.com',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
                  })
                }
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                  K
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">কাউসার আহমেদ</p>
                  <p className="text-[11px] text-slate-500 truncate">kauser.voiceaibd@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Custom Google account */}
            {!showCustomGoogleInput ? (
              <button
                type="button"
                onClick={() => setShowCustomGoogleInput(true)}
                className="w-full py-2 px-3 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-center cursor-pointer"
              >
                + অন্য যেকোনো জিমেইল দিয়ে লগইন করুন
              </button>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-2 mt-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="আপনার_ইমেইল@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  লগইন করুন ও নতুন ট্যাবে খুলুন
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FACEBOOK MODAL */}
      {/* ======================================================== */}
      {showFacebookModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#18191a] text-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-800">
            <button
              onClick={() => setShowFacebookModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white">Facebook দিয়ে লগইন</h3>
              <p className="text-xs text-slate-400">VoiceAI BD এর সাথে সংযুক্ত করুন</p>
            </div>

            <div className="space-y-2 mb-4">
              <div
                onClick={() =>
                  handleSelectFacebookAccount({
                    name: 'Satya Sangbad Media (Facebook)',
                    email: 'facebook.user@voiceai.bd',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
                  })
                }
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 bg-[#242526] hover:bg-[#3a3b3c] cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white font-bold flex items-center justify-center shrink-0">
                  f
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">Satya Sangbad BD</p>
                  <p className="text-[11px] text-slate-400 truncate">ফেসবুক প্রোফাইল দিয়ে চালিয়ে যান</p>
                </div>
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            </div>

            <p className="mt-4 text-[10px] text-slate-500 text-center">
              লগইন সম্পন্ন হলে স্বয়ংক্রিয়ভাবে নতুন ট্যাবে ড্যাশবোর্ড চালু হবে।
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
