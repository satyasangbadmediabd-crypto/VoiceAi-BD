import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Bot,
  Zap,
  PhoneCall,
  LayoutDashboard,
  Database,
  Radio
} from 'lucide-react';

export const MobileAppDock: React.FC = () => {
  const { currentRoute, navigate, openCallSimulator } = useApp();

  const navItems = [
    {
      id: 'studio',
      label: 'Studio',
      icon: Radio,
      active: currentRoute === '/',
      onClick: () => navigate('/')
    },
    {
      id: 'agents',
      label: 'Agents',
      icon: Bot,
      active: currentRoute === '/agents' || currentRoute.startsWith('/agents/'),
      onClick: () => navigate('/agents')
    },
    {
      id: 'dialer',
      label: 'Call AI',
      icon: PhoneCall,
      highlight: true,
      active: false,
      onClick: () => openCallSimulator()
    },
    {
      id: 'lab',
      label: 'Test Lab',
      icon: Zap,
      active: currentRoute === '/agent-testing',
      onClick: () => navigate('/agent-testing')
    },
    {
      id: 'dashboard',
      label: 'Console',
      icon: LayoutDashboard,
      active: currentRoute === '/dashboard' || currentRoute === '/calls' || currentRoute === '/leads',
      onClick: () => navigate('/dashboard')
    }
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070a14]/95 backdrop-blur-xl border-t border-cyan-500/20 px-2 py-1.5 shadow-[0_-8px_32px_rgba(0,0,0,0.9)] pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="relative -top-4 flex flex-col items-center justify-center p-3 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/50 active:scale-95 transition-transform"
                title="AI Voice Call Simulator"
              >
                <Icon className="w-5 h-5 text-slate-950 fill-current" />
                <span className="sr-only">Call AI</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                item.active
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.active ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="text-[10px] font-medium tracking-tight mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
