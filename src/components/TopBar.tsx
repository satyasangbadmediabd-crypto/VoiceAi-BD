import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  PhoneCall,
  HelpCircle,
  X,
  CheckCircle2,
  Shield,
  ShieldAlert,
  Info,
  Globe
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

interface TopBarProps {
  onToggleSidebar: () => void;
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, title }) => {
  const {
    user,
    openCallSimulator,
    navigate,
    openDemoModeModal,
    openGlobalSearch,
    notifications
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#050811]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left section: mobile hamburger & Page title / Search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <h1 className="text-base font-bold text-white hidden sm:block whitespace-nowrap mr-2">
            {title}
          </h1>
        )}

        {/* Global Search trigger */}
        <div
          onClick={openGlobalSearch}
          className="relative w-full max-w-xs cursor-pointer group"
        >
          <Search className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
          <div className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 group-hover:border-slate-700 transition-colors flex items-center justify-between select-none">
            <span>সার্চ করুন (স্টাফ, কল, কাস্টমার লিড)...</span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right section: Landing page button, Demo Mode Pill, Test Agent Action, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Link to Landing Page */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-950/70 hover:bg-orange-900/90 border border-orange-500/40 text-[11px] text-orange-200 font-semibold transition-colors cursor-pointer"
          title="ওয়েবসাইট / ল্যান্ডিং পেজে যান"
        >
          <Globe className="w-3.5 h-3.5 text-orange-400" />
          <span className="hidden sm:inline">ল্যান্ডিং পেজ</span>
        </button>

        {/* Telephony & Live Voice Status */}
        <button
          onClick={openDemoModeModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800/60 text-[11px] text-emerald-400 font-medium transition-colors cursor-pointer"
          title="টেলিফোনি ও সিস্টেম আর্কিটেকচার"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden md:inline font-semibold">ভয়েস লাইন (Online)</span>
          <span className="md:hidden font-semibold">Online</span>
          <Info className="w-3 h-3 text-emerald-400 opacity-75" />
        </button>

        {/* Quick Test Call trigger */}
        <button
          onClick={() => openCallSimulator()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">টেস্ট কল</span>
        </button>

        {/* Notification dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* Profile Avatar */}
        <div
          onClick={() => navigate('/settings')}
          className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400 cursor-pointer hover:border-blue-500 transition-colors"
          title={user?.name || 'Profile'}
        >
          {user?.name ? user.name[0] : 'U'}
        </div>
      </div>
    </header>
  );
};
