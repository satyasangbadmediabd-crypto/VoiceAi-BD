import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/BrandLogo';
import {
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
  Globe,
  AlertCircle,
  X,
  Check,
  KeyRound
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthPageProps {
  mode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode: initialMode = 'login' }) => {
  const { login, signup, addToast } = useApp();

  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [authTab, setAuthTab] = useState<'email' | 'phone'>('email');

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [emailFormError, setEmailFormError] = useState('');

  // Phone & OTP form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState<'input_phone' | 'input_otp'>('input_phone');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [phoneUserName, setPhoneUserName] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Social Auth Modals
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [customFbEmail, setCustomFbEmail] = useState('');
  const [customFbPass, setCustomFbPass] = useState('');

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

  // Handle Google Login
  const handleSelectGoogleAccount = (acc: { name: string; email: string; avatar: string }) => {
    login({
      name: acc.name,
      businessName: acc.email.includes('satyasangbad') ? 'সত্য সংবাদ মিডিয়া BD' : `${acc.name.split(' ')[0]} Enterprise`,
      email: acc.email,
      phone: '+880 1712-345678',
      avatar: acc.avatar,
      authProvider: 'google',
      plan: 'Business',
      minutesUsed: 140,
      minutesLimit: 1000,
      joinedDate: new Date().toLocaleDateString('en-GB')
    });
    setShowGoogleModal(false);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
      addToast('ভুল ইমেইল', 'অনুগ্রহ করে সঠিক Gmail এড্রেস দিন।', 'error');
      return;
    }
    const namePart = customGoogleEmail.split('@')[0];
    login({
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
    setShowGoogleModal(false);
  };

  // Handle Facebook Login
  const handleSelectFacebookAccount = (acc: { name: string; email: string; avatar: string }) => {
    login({
      name: acc.name,
      businessName: `${acc.name.split(' ')[0]} Media & Tech`,
      email: acc.email,
      phone: '+880 1819-876543',
      avatar: acc.avatar,
      authProvider: 'facebook',
      plan: 'Business',
      minutesUsed: 140,
      minutesLimit: 1000,
      joinedDate: new Date().toLocaleDateString('en-GB')
    });
    setShowFacebookModal(false);
  };

  const handleCustomFbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFbEmail) {
      addToast('তথ্য আবশ্যক', 'ফেসবুক ইমেইল বা ফোন নম্বর প্রদান করুন।', 'error');
      return;
    }
    const displayName = customFbEmail.includes('@')
      ? customFbEmail.split('@')[0]
      : `User ${customFbEmail.slice(-4)}`;
    login({
      name: displayName,
      businessName: 'ডিজিটাল এজেন্সি BD',
      email: customFbEmail.includes('@') ? customFbEmail : `${customFbEmail}@facebook.com`,
      phone: '+880 1819-876543',
      authProvider: 'facebook',
      plan: 'Business',
      minutesUsed: 140,
      minutesLimit: 1000,
      joinedDate: new Date().toLocaleDateString('en-GB')
    });
    setShowFacebookModal(false);
  };

  // Handle Phone OTP Send
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanNum.length < 10) {
      setPhoneError('সঠিক ১০ বা ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন');
      return;
    }
    setPhoneError('');
    setIsSendingOtp(true);

    // Generate real random 6-digit verification code
    const realCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(realCode);

    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpStep('input_otp');
      setOtpTimer(60);
      setOtpCode(['', '', '', '', '', '']);

      // Realistic SMS Notification Toast
      addToast(
        'নতুন SMS কোড এসেছে 📱',
        `আপনার VoiceAI BD ভেরিফিকেশন ওটিপি: ${realCode}`,
        'info'
      );
    }, 700);
  };

  // Handle OTP Digit Input
  const handleOtpDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newCode = [...otpCode];
    newCode[index] = val;
    setOtpCode(newCode);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length !== 6) {
      setPhoneError('অনুগ্রহ করে সম্পূর্ণ ৬ ডিজিটের ওটিপি কোড লিখুন।');
      return;
    }

    if (generatedOtp && fullCode !== generatedOtp) {
      setPhoneError('ভুল ওটিপি কোড! অনুগ্রহ করে সঠিক কোড দিন অথবা পুনরায় পাঠান।');
      return;
    }

    setPhoneError('');
    setIsVerifyingOtp(true);

    setTimeout(() => {
      setIsVerifyingOtp(false);
      const cleanPhone = phoneNumber.startsWith('0') ? `+88${phoneNumber}` : `+880${phoneNumber}`;
      login({
        name: phoneUserName.trim() || 'মোবাইল গ্রাহক',
        businessName: 'স্মার্ট বিজনেস বিডি',
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

  // Handle Email Submit (Login or Signup)
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailFormError('');

    if (!email || !email.includes('@')) {
      setEmailFormError('অনুগ্রহ করে সঠিক ইমেইল এড্রেস লিখুন।');
      return;
    }

    if (!password || password.length < 6) {
      setEmailFormError('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setEmailFormError('পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না!');
        return;
      }

      signup({
        name: name.trim() || 'নতুন উদ্যোক্তা',
        businessName: businessName.trim() || 'আমার কোম্পানি',
        phone: userPhone.trim() || '+880 1700-000000',
        email: email.trim(),
        authProvider: 'email',
        plan: 'Starter'
      });
    } else {
      login({
        name: email.split('@')[0] || 'উদ্যোক্তা',
        businessName: 'স্মার্ট এন্টারপ্রাইজ BD',
        phone: '+880 1712-345678',
        email: email.trim(),
        authProvider: 'email',
        plan: 'Business',
        minutesUsed: 140,
        minutesLimit: 1000,
        joinedDate: new Date().toLocaleDateString('en-GB')
      });
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-orange-500/30 selection:text-white">
      {/* Radiant Orange Cosmic Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-orange-600/20 via-amber-600/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <div className="inline-block mb-3">
          <BrandLogo size="lg" showTagline={true} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isSignUp ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          {isSignUp
            ? 'VoiceAI BD-তে স্বাগতম! শুরু করতে আপনার তথ্য দিন।'
            : 'চালিয়ে যেতে আপনার অ্যাকাউন্টে সাইন ইন করুন।'}
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-[#120803]/95 backdrop-blur-2xl py-7 px-5 sm:px-8 shadow-2xl rounded-2xl border border-orange-500/30 relative">
          {/* Top Toggle: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-black/50 rounded-xl border border-orange-500/20 mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setEmailFormError('');
              }}
              className={`py-2.5 rounded-lg transition-all cursor-pointer ${
                !isSignUp
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md shadow-orange-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              লগইন (Sign In)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setEmailFormError('');
              }}
              className={`py-2.5 rounded-lg transition-all cursor-pointer ${
                isSignUp
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md shadow-orange-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              নতুন অ্যাকাউন্ট (Sign Up)
            </button>
          </div>

          {/* Social Logins: Google & Facebook */}
          <div className="space-y-2.5">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01]"
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
              <span>Google দিয়ে এগিয়ে যান</span>
            </button>

            {/* Facebook Sign In Button */}
            <button
              type="button"
              onClick={() => setShowFacebookModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01]"
            >
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook দিয়ে এগিয়ে যান</span>
            </button>
          </div>

          {/* Clean Divider */}
          <div className="relative flex py-3.5 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-3 text-slate-500 text-[11px] font-medium">অথবা</span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          {/* Clean Auth Method Toggle (Email vs Phone) */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-orange-500/20 mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthTab('email')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authTab === 'email'
                  ? 'bg-orange-500/20 text-orange-200 border border-orange-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-orange-400" />
              <span>ইমেইল দিয়ে</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthTab('phone')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authTab === 'phone'
                  ? 'bg-orange-500/20 text-orange-200 border border-orange-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>মোবাইল ও OTP</span>
            </button>
          </div>

          {/* ========================================================
              TAB 2: EMAIL & PASSWORD AUTH
          ======================================================== */}
          {authTab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-xs">
              {emailFormError && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{emailFormError}</span>
                </div>
              )}

              {isSignUp && (
                <>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">আপনার পুরো নাম:</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="মোঃ কাউসার আহমেদ"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
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
                        placeholder="আমার বিজনেস লিমিটেড"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">মোবাইল নম্বর (+880):</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="+880 1712-345678"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs font-mono"
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
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
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block font-medium text-slate-300 mb-1">পাসওয়ার্ড নিশ্চিত করুন:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-orange-500"
                    />
                    <span>লগইন মনে রাখুন</span>
                  </label>
                  <span className="text-orange-400 hover:underline cursor-pointer text-[11px]">
                    পাসওয়ার্ড ভুলে গেছেন?
                  </span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-950 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                >
                  <span>{isSignUp ? 'নতুন অ্যাকাউন্ট খুলুন ও প্রবেশ করুন' : 'লগইন করুন ও প্রবেশ করুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              TAB 3: PHONE & OTP AUTH
          ======================================================== */}
          {authTab === 'phone' && (
            <div>
              {phoneError && (
                <div className="mb-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{phoneError}</span>
                </div>
              )}

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
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1.5">
                      বাংলাদেশি মোবাইল নম্বর:
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-black/80 border border-orange-500/30 text-slate-200 font-mono text-xs shrink-0 select-none">
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
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono text-xs"
                          required
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                      <span>অপারেটর:</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/40 border border-orange-500/20 text-orange-300 font-mono">GP</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/40 border border-orange-500/20 text-orange-300 font-mono">BL</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/40 border border-orange-500/20 text-orange-300 font-mono">Robi</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/40 border border-orange-500/20 text-orange-300 font-mono">Teletalk</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>ওটিপি কোড তৈরি হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <span>ওটিপি (OTP) কোড পাঠান</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                  <div className="text-center p-3 rounded-xl bg-orange-950/40 border border-orange-500/30">
                    <p className="text-xs text-orange-200">
                      আমরা <strong className="text-white font-mono">+880 {phoneNumber}</strong> নম্বরে ৬ সংখ্যার ওটিপি পাঠিয়েছি
                    </p>
                    <button
                      type="button"
                      onClick={() => setOtpStep('input_phone')}
                      className="text-[11px] text-orange-400 hover:underline mt-1 cursor-pointer"
                    >
                      নম্বর পরিবর্তন করতে চান?
                    </button>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-2 text-center">
                      ৬ সংখ্যার ওটিপি কোড লিখুন:
                    </label>
                    <div className="flex justify-between gap-1.5 max-w-xs mx-auto">
                      {otpCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-input-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                          className="w-10 h-12 text-center text-lg font-black rounded-xl bg-black/80 border border-orange-500/40 text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 font-mono"
                          required
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>
                      {otpTimer > 0 ? (
                        <>পুনরায় পাঠাতে অপেক্ষা: <strong className="text-orange-400 font-mono">{otpTimer}s</strong></>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-orange-400 hover:underline font-bold cursor-pointer"
                        >
                          কোড পুনরায় পাঠান
                        </button>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (generatedOtp) {
                          setOtpCode(generatedOtp.split(''));
                        }
                      }}
                      className="text-amber-400 hover:underline font-semibold cursor-pointer"
                    >
                      অটো-ফিল কোড
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>ওটিপি যাচাই করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <span>যাচাই সম্পন্ন করে প্রবেশ করুন</span>
                        <Check className="w-4 h-4 stroke-[3]" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          GOOGLE ACCOUNT SELECTOR MODAL
      ======================================================== */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24">
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
              <h3 className="text-base font-bold text-slate-900">একটি অ্যাকাউন্ট বেছে নিন</h3>
              <p className="text-xs text-slate-500">VoiceAI BD এর সাথে সাইন ইন করুন</p>
            </div>

            <div className="space-y-2 mb-4">
              {/* Primary Admin Account */}
              <div
                onClick={() =>
                  handleSelectGoogleAccount({
                    name: 'Satya Sangbad Media (Admin)',
                    email: 'satyasangbad.media.bd@gmail.com',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
                  })
                }
                className="flex items-center gap-3 p-3 rounded-xl border border-orange-200 bg-orange-50/50 hover:bg-orange-100/60 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
                  S
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 truncate">Satya Sangbad Media</p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-200 text-orange-900 font-bold">Admin</span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate font-mono">satyasangbad.media.bd@gmail.com</p>
                </div>
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>

              {/* General User Demo */}
              <div
                onClick={() =>
                  handleSelectGoogleAccount({
                    name: 'কাউসার আহমেদ',
                    email: 'kauser.user@gmail.com',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
                  })
                }
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
                  K
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">কাউসার আহমেদ (গ্রাহক)</p>
                  <p className="text-[11px] text-slate-500 truncate font-mono">kauser.user@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Custom Google account option */}
            {!showCustomGoogleInput ? (
              <button
                type="button"
                onClick={() => setShowCustomGoogleInput(true)}
                className="w-full py-2.5 px-3 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-center cursor-pointer border border-dashed border-blue-300"
              >
                + আপনার নিজস্ব Gmail অ্যাকাউন্ট লিখুন
              </button>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-2 mt-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="আপনার_ইমেইল@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  এই জিমেইল দিয়ে সাইন ইন করুন
                </button>
              </form>
            )}

            <p className="mt-4 text-[10px] text-slate-400 text-center leading-relaxed">
              Google আপনার নাম, ইমেইল এবং ছবি VoiceAI BD এর সাথে শেয়ার করবে।
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          FACEBOOK ACCOUNT SELECTOR MODAL
      ======================================================== */}
      {showFacebookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18191a] text-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-800">
            <button
              onClick={() => setShowFacebookModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center mx-auto mb-2 shadow-md">
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white">Facebook দিয়ে লগইন</h3>
              <p className="text-xs text-slate-400">VoiceAI BD এর সাথে নিরাপদ সংযোগ</p>
            </div>

            <form onSubmit={handleCustomFbSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">ফেসবুক মোবাইল নম্বর বা ইমেইল:</label>
                <input
                  type="text"
                  value={customFbEmail}
                  onChange={(e) => setCustomFbEmail(e.target.value)}
                  placeholder="017xxxxxxxx বা user@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#1877F2]"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">ফেসবুক পাসওয়ার্ড:</label>
                <input
                  type="password"
                  value={customFbPass}
                  onChange={(e) => setCustomFbPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#1877F2]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer mt-1"
              >
                Facebook দিয়ে চালিয়ে যান
              </button>
            </form>

            <p className="mt-4 text-[10px] text-slate-500 text-center">
              VoiceAI BD আপনার অনুমতি ছাড়া ফেসবুকে কোনো তথ্য পোস্ট করবে না।
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
