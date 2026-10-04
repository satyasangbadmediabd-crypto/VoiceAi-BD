import React from 'react';
import { BrandLogo } from './BrandLogo';
import { useApp } from '../context/AppContext';
import { isUserAdmin } from '../utils/adminAuth';
import { ShieldCheck, PhoneCall, Heart, Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, websiteSettings, user } = useApp();

  const handleProtectedNav = (route: string) => {
    if (user) {
      navigate(route);
    } else {
      window.dispatchEvent(new CustomEvent('voiceai_open_login'));
    }
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#060911] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div onClick={() => navigate('/')} className="cursor-pointer inline-block">
              <BrandLogo size="lg" showTagline={true} />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {websiteSettings?.siteTagline || 'বাংলাদেশের শীর্ষস্থানীয় আধুনিক ক্লাউড টেলিফোনি ও কাস্টমার রিসেপশন প্ল্যাটফর্ম। প্রতিটি ফোন কলে মিষ্টি ও সাবলীল বাংলায় গ্রাহক সেবা, সেলস ও অর্ডার নিশ্চিত করে।'}
            </p>
            <div className="space-y-1 text-xs text-slate-400">
              {websiteSettings?.supportPhone && <p className="font-mono">হটলাইন: <strong className="text-cyan-300">{websiteSettings.supportPhone}</strong></p>}
              {websiteSettings?.supportEmail && <p className="font-mono">ইমেইল: <span className="text-slate-300">{websiteSettings.supportEmail}</span></p>}
              {websiteSettings?.officeAddress && <p>ঠিকানা: {websiteSettings.officeAddress}</p>}
            </div>
            <div className="flex items-center gap-2 text-xs text-cyan-300/90 bg-cyan-950/40 border border-cyan-800/40 rounded-xl p-3 max-w-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>বিকাশ ও নগদ পেমেন্ট গেটওয়ে সাপোর্টেড • কাস্টম ডোমেইন ও সাবডোমেন রেডি</span>
            </div>
          </div>

          {/* Col 3: Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3.5">
              প্রোডাক্ট
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleProtectedNav('/agents')} className="hover:text-white transition-colors cursor-pointer">
                  ফোন প্রতিনিধি ও স্টাফ
                </button>
              </li>
              <li>
                <button onClick={() => handleProtectedNav('/knowledge')} className="hover:text-white transition-colors cursor-pointer">
                  বিজনেস স্ক্রিপ্ট ও তথ্য ভাণ্ডার
                </button>
              </li>
              <li>
                <button onClick={() => handleProtectedNav('/phones')} className="hover:text-white transition-colors cursor-pointer">
                  +880 হটলাইন ও অফিস নম্বর
                </button>
              </li>
              <li>
                <button onClick={() => handleProtectedNav('/calls')} className="hover:text-white transition-colors cursor-pointer">
                  কল রেকর্ডিং ও তাৎক্ষণিক বিবরণ
                </button>
              </li>
              <li>
                <button onClick={() => handleProtectedNav('/leads')} className="hover:text-white transition-colors cursor-pointer">
                  কাস্টমার লিড ও CRM
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3.5">
              সলিউশন
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">
                ২৪/৭ ভার্চুয়াল রিসেপশনিস্ট
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                ই-কমার্স ও ডেলিভারি হেল্পলাইন
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                ক্লিনিক ও ডক্টর সিরিয়াল বুকিং
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                হোটেল ও ট্রাভেল রিজার্ভেশন
              </li>
              {isUserAdmin(user) && (
                <li>
                  <button onClick={() => navigate('/admin')} className="text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold cursor-pointer">
                    <span>Admin Panel</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 5: Company & Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3.5">
              কোম্পানি
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">
                About VoiceAI BD
              </li>
              <li>
                <button onClick={() => handleProtectedNav('/billing')} className="hover:text-white transition-colors cursor-pointer">
                  Pricing & Plans
                </button>
              </li>
              <li>
                <button onClick={() => handleProtectedNav('/settings')} className="hover:text-white transition-colors cursor-pointer">
                  API Documentation
                </button>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Terms of Service
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {websiteSettings?.siteName || 'VoiceAI BD'}. সর্বস্বত্ব সংরক্ষিত। Made with 🇧🇩 for Bangladeshi Tech Innovation.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => {
                sessionStorage.removeItem('voiceai_intro_seen');
                window.dispatchEvent(new CustomEvent('voiceai_replay_intro'));
              }}
              className="hover:text-cyan-300 transition-colors text-xs font-mono underline decoration-cyan-500/50 cursor-pointer"
            >
              ✨ ওপেনিং অ্যানিমেশন দেখুন
            </button>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Engine Online (22ms)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
