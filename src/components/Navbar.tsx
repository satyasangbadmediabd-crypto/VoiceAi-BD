import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { useApp } from '../context/AppContext';
import { isUserAdmin } from '../utils/adminAuth';
import { Menu, X, ArrowRight, UserCheck, ChevronDown, Sparkles, ExternalLink, Lock, LogOut, ShieldCheck, User } from 'lucide-react';

interface NavbarProps {
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const { navigate, user, currentRoute, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleLoginClick = () => {
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      window.dispatchEvent(new CustomEvent('voiceai_open_login'));
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    if (currentRoute !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-orange-500/20 bg-[#0a0502]/95 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Vapi Brand Logo */}
        <div className="flex items-center gap-3">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <BrandLogo size="md" />
          </div>
        </div>

        {/* Center: Vapi Navigation Menus (Solutions ⌄, Platform ⌄, Customers, Pricing, Careers, Resources ⌄) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
          {/* Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('solutions')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              onClick={() => scrollToSection('solutions')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-2"
            >
              <span>Solutions</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openDropdown === 'solutions' && (
              <div className="absolute top-full left-0 w-60 p-2 rounded-2xl bg-[#120804] border border-orange-500/30 shadow-2xl space-y-1 animate-in fade-in duration-150">
                <button
                  onClick={() => scrollToSection('solutions')}
                  className="w-full text-left p-2 rounded-xl hover:bg-orange-500/10 text-slate-200 hover:text-orange-300 text-xs block cursor-pointer"
                >
                  <p className="font-bold text-white">কাস্টমার সাপোর্ট ও হেল্পডেস্ক</p>
                  <p className="text-[10px] text-slate-400">২৪/৭ কাস্টমার সার্ভিসের জন্য স্বয়ংক্রিয় ফোন হেল্পলাইন</p>
                </button>
                <button
                  onClick={() => scrollToSection('solutions')}
                  className="w-full text-left p-2 rounded-xl hover:bg-orange-500/10 text-slate-200 hover:text-orange-300 text-xs block cursor-pointer"
                >
                  <p className="font-bold text-white">সেলস ও লিড জেনারেশন</p>
                  <p className="text-[10px] text-slate-400">ইনবাউন্ড অনুসন্ধান ও সরাসরি সেলস কনফার্মেশন</p>
                </button>
                <button
                  onClick={() => scrollToSection('solutions')}
                  className="w-full text-left p-2 rounded-xl hover:bg-orange-500/10 text-slate-200 hover:text-orange-300 text-xs block cursor-pointer"
                >
                  <p className="font-bold text-white">অ্যাপয়েন্টমেন্ট ও বুকিং</p>
                  <p className="text-[10px] text-slate-400">ডাক্তার সিরিয়াল ও রেস্টুরেন্ট টেবিল বুকিং</p>
                </button>
              </div>
            )}
          </div>

          {/* Platform Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('platform')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              onClick={() => scrollToSection('features')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-2"
            >
              <span>Platform</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openDropdown === 'platform' && (
              <div className="absolute top-full left-0 w-60 p-2 rounded-2xl bg-[#120804] border border-orange-500/30 shadow-2xl space-y-1 animate-in fade-in duration-150">
                <button
                  onClick={() => scrollToSection('features')}
                  className="w-full text-left p-2 rounded-xl hover:bg-orange-500/10 text-slate-200 hover:text-orange-300 text-xs block cursor-pointer"
                >
                  <p className="font-bold text-white">ক্লাউড টেলিফোনি ও PBX</p>
                  <p className="text-[10px] text-slate-400">SIP ট্রাঙ্ক, WebRTC ও +880 ফোন সাপোর্ট</p>
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="w-full text-left p-2 rounded-xl hover:bg-orange-500/10 text-slate-200 hover:text-orange-300 text-xs block cursor-pointer"
                >
                  <p className="font-bold text-white">স্পিচ ও ভয়েস ইঞ্জিন</p>
                  <p className="text-[10px] text-slate-400">স্বাভাবিক দেশীয় বাংলা ভাষা প্রক্রিয়াকরণ</p>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => scrollToSection('reviews')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Customers
          </button>

          <button
            onClick={() => scrollToSection('pricing')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Pricing
          </button>

          <button
            onClick={() => scrollToSection('faq')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Careers
          </button>

          {/* Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('resources')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              onClick={() => scrollToSection('faq')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-2"
            >
              <span>Resources</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openDropdown === 'resources' && (
              <div className="absolute top-full left-0 w-56 p-2 rounded-2xl bg-[#120804] border border-orange-500/30 shadow-2xl space-y-1 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    setOpenDropdown(null);
                    if (user) {
                      navigate('/agent-testing');
                    } else {
                      handleLoginClick();
                    }
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-orange-500/10 text-slate-200 hover:text-orange-300 text-xs block cursor-pointer"
                >
                  <p className="font-bold text-white">লাইভ টেস্ট কল স্টুডিও</p>
                  <p className="text-[10px] text-slate-400">সরাসরি কথা বলে মান যাচাই</p>
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="w-full text-left p-2 rounded-xl hover:bg-orange-500/10 text-slate-200 hover:text-orange-300 text-xs block cursor-pointer"
                >
                  <p className="font-bold text-white">ইউজার গাইড ও FAQ</p>
                  <p className="text-[10px] text-slate-400">সাধারণ প্রশ্ন ও ব্যবহারের নিয়ম</p>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions: Authenticated state vs Guest Login */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              {isUserAdmin(user) && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/50 text-xs font-bold text-orange-300 transition-colors cursor-pointer shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>Admin Panel</span>
                </button>
              )}

              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-orange-950 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-950" />
                <span>ড্যাশবোর্ড</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-orange-500/20 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="লগআউট করুন"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                <span>লগআউট</span>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-orange-200 hover:text-white bg-orange-950/70 hover:bg-orange-900/90 border border-orange-500/50 hover:border-orange-400 transition-all cursor-pointer shadow-sm shadow-orange-950/60"
              >
                <Lock className="w-3 h-3 text-orange-400" />
                <span>Log In / লগইন</span>
              </button>
              <button
                onClick={handleLoginClick}
                className="px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                Get started
              </button>
            </>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-black/40 border border-orange-500/30 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-orange-500/20 bg-[#0e0703] px-4 py-3 space-y-2 text-xs font-semibold">
          <button
            onClick={() => scrollToSection('solutions')}
            className="block w-full text-left py-2 text-slate-300 hover:text-white"
          >
            Solutions
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-slate-300 hover:text-white"
          >
            Platform
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="block w-full text-left py-2 text-slate-300 hover:text-white"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="block w-full text-left py-2 text-slate-300 hover:text-white"
          >
            Resources
          </button>
          <div className="pt-2 border-t border-orange-500/20 space-y-2">
            {user ? (
              <div className="space-y-2">
                {isUserAdmin(user) && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/admin');
                    }}
                    className="w-full py-2.5 rounded-xl bg-orange-600/20 border border-orange-500/50 text-center text-orange-300 font-bold flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-orange-400" />
                    <span>Admin Panel</span>
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-center font-black flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4 text-slate-950" />
                    <span>ড্যাশবোর্ড</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-black/50 border border-orange-500/20 text-slate-300 text-center font-medium flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4 text-slate-400" />
                    <span>লগআউট</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLoginClick();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-orange-950/80 border border-orange-500/40 text-center text-orange-200 font-bold flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Log In / লগইন</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLoginClick();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white text-slate-950 text-center font-bold"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
