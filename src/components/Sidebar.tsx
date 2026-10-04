import React from 'react';
import { BrandLogo } from './BrandLogo';
import { useApp } from '../context/AppContext';
import { isUserAdmin } from '../utils/adminAuth';
import {
  LayoutDashboard,
  Headphones,
  Phone,
  BookOpen,
  PhoneCall,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  ShieldAlert,
  LogOut,
  PhoneForwarded,
  UserCheck,
  Cpu,
  Shield,
  Zap,
  ChevronRight,
  Globe
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentRoute, navigate, user, logout, openCallSimulator, agents } = useApp();

  const primaryNav = [
    { label: 'মূল ওয়েবসাইট (Website)', route: '/', icon: Globe },
    { label: 'ড্যাশবোর্ড (Dashboard)', route: '/dashboard', icon: LayoutDashboard },
    { label: 'ফোন প্রতিনিধি (Staff)', route: '/agents', icon: Headphones, badge: agents.length.toString() },
    { label: 'কল হিস্ট্রি ও রেকর্ডিং', route: '/calls', icon: PhoneCall },
    { label: 'কাস্টমার লিড ও CRM', route: '/leads', icon: Users },
    { label: 'বিজনেস স্ক্রিপ্ট ও তথ্য', route: '/knowledge', icon: BookOpen },
    { label: 'হটলাইন ও অফিস নম্বর', route: '/phones', icon: Phone },
    { label: 'অ্যানালিটিক্স ও রিপোর্ট', route: '/analytics', icon: BarChart3 },
  ];

  const workspaceNav = [
    { label: 'লাইভ টেস্ট কল স্টুডিও', route: '/agent-testing', icon: Zap, badge: 'Live' },
    { label: 'পিবিএক্স, সিআরএম ও এপিআই', route: '/integrations', icon: Cpu },
    { label: 'টিম ও স্টাফ পারমিশন', route: '/team', icon: UserCheck },
    { label: 'বিলিং, মিনিট ও পেমেন্ট', route: '/billing', icon: CreditCard },
    { label: 'সিস্টেম সেটিংস', route: '/settings', icon: Settings },
  ];

  const adminNav = [
    { label: 'কাস্টমার অ্যাডমিন', route: '/admin', icon: Shield, tag: 'Biz' },
    { label: 'সুপার অ্যাডমিন প্যানেল', route: '/super-admin', icon: ShieldAlert, tag: 'Master' },
  ];

  const handleNav = (route: string) => {
    navigate(route);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#050811]/95 backdrop-blur-md border-r border-slate-800/80 flex flex-col transition-transform duration-180 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with Brand Logo & Telecom status */}
        <div className="h-15 px-4 border-b border-slate-800/80 flex items-center justify-between">
          <div onClick={() => handleNav('/')} className="cursor-pointer">
            <BrandLogo size="sm" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">ONLINE</span>
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white lg:hidden p-1 ml-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Action Trigger: Voice Simulator */}
        <div className="p-3">
          <button
            onClick={() => {
              if (onClose) onClose();
              openCallSimulator();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-blue-950/60 to-cyan-950/60 hover:from-blue-900/60 hover:to-cyan-900/60 border border-cyan-800/40 text-cyan-200 text-xs font-semibold shadow-xs transition-all cursor-pointer group"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <PhoneForwarded className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
            <span>সরাসরি টেস্ট কল (Test Call)</span>
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-1 space-y-4">
          {/* Primary Section */}
          <div className="space-y-0.5">
            <div className="px-2 pb-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Primary
            </div>
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 font-semibold shadow-xs'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Separator */}
          <div className="border-t border-slate-800/80" />

          {/* Workspace Section */}
          <div className="space-y-0.5">
            <div className="px-2 pb-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Workspace
            </div>
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 font-semibold shadow-xs'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Administration Section - Strictly restricted to owner/admin only */}
          {isUserAdmin(user) && (
            <>
              <div className="border-t border-slate-800/80" />
              <div className="space-y-0.5">
                <div className="px-2 pb-1 text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Administration</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-800/50">
                    Owner
                  </span>
                </div>
                {adminNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.route;
                  return (
                    <button
                      key={item.route}
                      onClick={() => handleNav(item.route)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-orange-600/15 text-orange-400 border-l-2 border-orange-500 font-semibold shadow-xs'
                          : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[9px] font-mono bg-slate-900 text-orange-300 px-1 py-0.2 rounded border border-orange-900/60">
                        {item.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Minutes Quota Telemetry Widget */}
        <div className="p-2.5 mx-2.5 mb-2 rounded-lg bg-[#080d1a] border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="text-[10px] text-slate-400 font-mono">Quota: {user?.plan || 'Starter'}</span>
            <span className="text-[10px] font-mono font-bold text-cyan-400">
              {user?.minutesUsed || 82}/{user?.minutesLimit || 100}m
            </span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{
                width: `${Math.min(100, (((user?.minutesUsed || 82) / (user?.minutesLimit || 100)) * 100))}%`
              }}
            />
          </div>
          <button
            onClick={() => handleNav('/billing')}
            className="mt-1.5 text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>Upgrade Capacity</span>
            <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* User profile & logout footer */}
        <div className="p-2.5 border-t border-slate-800/80 bg-[#050811] flex items-center justify-between">
          <div
            onClick={() => handleNav('/settings')}
            className="flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded bg-blue-950/80 border border-blue-800/60 flex items-center justify-center font-mono font-bold text-xs text-blue-400 flex-shrink-0">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">{user?.name || 'তানভীর আহমেদ'}</p>
              <p className="text-[10px] text-slate-400 truncate font-mono">{user?.email || 'admin@aiskillhub.bd'}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              handleNav('/');
            }}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
            title="লগআউট"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
