import React from 'react';
import { AgentStatus } from '../types';

interface AgentStatusBadgeProps {
  status: AgentStatus;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const AgentStatusBadge: React.FC<AgentStatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true
}) => {
  const normalized = status.toUpperCase();

  const config: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
    DRAFT: {
      bg: 'bg-slate-900/80',
      text: 'text-slate-400',
      border: 'border-slate-800',
      dot: 'bg-slate-500',
      label: 'Draft (খসড়া)'
    },
    TESTING: {
      bg: 'bg-cyan-950/60',
      text: 'text-cyan-300',
      border: 'border-cyan-800/60',
      dot: 'bg-cyan-400',
      label: 'Testing (ল্যাব টেস্ট)'
    },
    READY: {
      bg: 'bg-blue-950/60',
      text: 'text-blue-300',
      border: 'border-blue-800/60',
      dot: 'bg-blue-400',
      label: 'Ready to Deploy'
    },
    DEPLOYING: {
      bg: 'bg-amber-950/60',
      text: 'text-amber-300',
      border: 'border-amber-800/60',
      dot: 'bg-amber-400',
      label: 'Deploying...'
    },
    LIVE: {
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-300',
      border: 'border-emerald-800/60',
      dot: 'bg-emerald-400',
      label: 'Live (সক্রিয়)'
    },
    ACTIVE: {
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-300',
      border: 'border-emerald-800/60',
      dot: 'bg-emerald-400',
      label: 'Live'
    },
    PAUSED: {
      bg: 'bg-slate-900/90',
      text: 'text-slate-400',
      border: 'border-slate-700/80',
      dot: 'bg-slate-500',
      label: 'Paused (স্থগিত)'
    },
    ARCHIVED: {
      bg: 'bg-stone-950/80',
      text: 'text-stone-400',
      border: 'border-stone-800',
      dot: 'bg-stone-600',
      label: 'Archived'
    },
    ERROR: {
      bg: 'bg-red-950/60',
      text: 'text-red-300',
      border: 'border-red-800/60',
      dot: 'bg-red-400',
      label: 'Action Required'
    }
  };

  const item = config[normalized] || config.DRAFT;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border shadow-xs ${padding} ${item.bg} ${item.text} ${item.border}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${item.dot} ${
            normalized === 'LIVE' || normalized === 'ACTIVE' ? 'animate-pulse' : ''
          }`}
        />
      )}
      <span>{item.label}</span>
    </span>
  );
};
