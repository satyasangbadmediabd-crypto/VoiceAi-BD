import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { isUserAdmin } from '../utils/adminAuth';
import {
  Search,
  Bot,
  PhoneCall,
  Users,
  Phone,
  ArrowRight,
  X,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    closeGlobalSearch,
    agents,
    calls,
    leads,
    phoneNumbers,
    platformUsers,
    user,
    navigate,
    openCallSimulator
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'agents' | 'calls' | 'leads' | 'phones' | 'users'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isGlobalSearchOpen]);

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedAgents = (activeFilter === 'all' || activeFilter === 'agents')
      ? agents.filter((a) => a.name.toLowerCase().includes(q) || a.businessName.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)).map((a) => ({
          type: 'agent' as const,
          id: a.id,
          title: a.name,
          subtitle: `${a.businessName} • ${a.language} • ${a.type}`,
          route: `/agents/${a.id}`,
          status: a.status
        }))
      : [];

    const matchedCalls = (activeFilter === 'all' || activeFilter === 'calls')
      ? calls.filter((c) => c.caller.toLowerCase().includes(q) || c.agentName.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)).map((c) => ({
          type: 'call' as const,
          id: c.id,
          title: `Call: ${c.caller}`,
          subtitle: `${c.agentName} • ${c.duration} • ${c.status}`,
          route: '/calls',
          status: c.status
        }))
      : [];

    const matchedLeads = (activeFilter === 'all' || activeFilter === 'leads')
      ? leads.filter((l) => l.name.toLowerCase().includes(q) || l.phone.toLowerCase().includes(q) || l.interest.toLowerCase().includes(q)).map((l) => ({
          type: 'lead' as const,
          id: l.id,
          title: `Lead: ${l.name}`,
          subtitle: `${l.phone} • ${l.interest} • Score: ${l.score || 85}/100`,
          route: '/leads',
          status: l.status
        }))
      : [];

    const matchedPhones = (activeFilter === 'all' || activeFilter === 'phones')
      ? phoneNumbers.filter((p) => p.number.toLowerCase().includes(q) || p.provider.toLowerCase().includes(q) || (p.connectedAgentName && p.connectedAgentName.toLowerCase().includes(q))).map((p) => ({
          type: 'phone' as const,
          id: p.id,
          title: `Number: ${p.number}`,
          subtitle: `${p.provider} • Assigned: ${p.connectedAgentName || 'None'}`,
          route: '/phones',
          status: p.status
        }))
      : [];

    const matchedUsers = (isUserAdmin(user) && (activeFilter === 'all' || activeFilter === 'users'))
      ? platformUsers.filter((u) => u.name.toLowerCase().includes(q) || u.business.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).map((u) => ({
          type: 'user' as const,
          id: u.id,
          title: `User: ${u.name}`,
          subtitle: `${u.business} • ${u.plan} Plan • ${u.status}`,
          route: '/super-admin',
          status: u.status
        }))
      : [];

    return [...matchedAgents, ...matchedCalls, ...matchedLeads, ...matchedPhones, ...matchedUsers];
  }, [query, activeFilter, agents, calls, leads, phoneNumbers, platformUsers]);

  if (!isGlobalSearchOpen) return null;

  const handleSelect = (route: string) => {
    closeGlobalSearch();
    if (user) {
      navigate(route);
    } else {
      window.dispatchEvent(new CustomEvent('voiceai_open_login'));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="w-full max-w-2xl rounded-2xl bg-[#0d1322] border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Search Header */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/60">
            <Search className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="এজেন্ট, কল হিস্ট্রি, লিড, বা ফোন নম্বর সার্চ করুন..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-slate-800/80 bg-[#0a0f1d] flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'agents', label: 'Agents' },
              { id: 'calls', label: 'Calls' },
              { id: 'leads', label: 'Leads' },
              { id: 'phones', label: 'Numbers' },
              { id: 'users', label: 'Platform Users' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeFilter === f.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-800/40">
            {query.trim() === '' ? (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <Search className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">যে কোনো নাম, ফোন নম্বর, বা টপিক লিখে সার্চ করুন</p>
                <div className="flex justify-center gap-2 pt-2">
                  <span
                    onClick={() => setQuery('AI Skill')}
                    className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-indigo-500 cursor-pointer"
                  >
                    AI Skill Hub
                  </span>
                  <span
                    onClick={() => setQuery('+880')}
                    className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-indigo-500 cursor-pointer"
                  >
                    +880 Numbers
                  </span>
                  <span
                    onClick={() => setQuery('Rahim')}
                    className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-indigo-500 cursor-pointer"
                  >
                    Rahim Leads
                  </span>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <p className="text-xs">"{query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি।</p>
              </div>
            ) : (
              results.map((item, idx) => (
                <div
                  key={`${item.type}-${item.id}-${idx}`}
                  onClick={() => handleSelect(item.route)}
                  className="p-3 rounded-xl hover:bg-slate-800/60 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 group-hover:border-indigo-500 transition-colors">
                      {item.type === 'agent' && <Bot className="w-4 h-4" />}
                      {item.type === 'call' && <PhoneCall className="w-4 h-4" />}
                      {item.type === 'lead' && <Users className="w-4 h-4" />}
                      {item.type === 'phone' && <Phone className="w-4 h-4" />}
                      {item.type === 'user' && <ShieldAlert className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {item.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>VoiceAI BD Global Entity Indexer</span>
            </span>
            <span>{results.length} results found</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
