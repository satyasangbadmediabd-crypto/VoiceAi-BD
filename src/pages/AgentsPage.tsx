import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Agent } from '../types';
import {
  Bot,
  PlusCircle,
  PhoneCall,
  Edit,
  Trash2,
  Phone,
  BookOpen,
  CheckCircle2,
  Sliders,
  Sparkles,
  Search,
  Power,
  Code2
} from 'lucide-react';
import { AgentIntegrationModal } from '../components/AgentIntegrationModal';
import { Card3D } from '../components/Card3D';
import { AnimatedText } from '../components/AnimatedText';

export const AgentsPage: React.FC = () => {
  const { agents, toggleAgentActive, deleteAgent, openCallSimulator, navigate, updateAgent } = useApp();
  const [search, setSearch] = useState('');
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [integratingAgent, setIntegratingAgent] = useState<Agent | null>(null);

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.businessName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;
    updateAgent(editingAgent.id, {
      name: editingAgent.name,
      businessName: editingAgent.businessName,
      instructions: editingAgent.instructions,
      personality: editingAgent.personality,
      friendliness: editingAgent.friendliness,
      professionalism: editingAgent.professionalism
    });
    setEditingAgent(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-amber-600" />
            <AnimatedText text="AI Voice Agents Console" variant="words" as="span" />
          </h2>
          <AnimatedText
            text="আপনার সকল ভয়েস এজেন্টের স্ট্যাটাস, নলেজ ও লাইন কনফিগারেশন পরিচালনা করুন (মেইন সার্ভার স্টোরেজে সংরক্ষিত)"
            variant="rise"
            as="p"
            delay={0.15}
            className="text-xs text-slate-600 mt-0.5"
          />
        </div>

        <button
          onClick={() => navigate('/agents/create')}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন এজেন্ট তৈরি করুন</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="এজেন্টের নাম দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-xs"
          />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 font-mono font-medium">
            MAIN STORAGE SYNC: ON
          </span>
          <span className="text-slate-600">
            মোট এজেন্ট: <strong className="text-slate-900">{agents.length}টি</strong>
          </span>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAgents.map((agent) => (
          <Card3D
            key={agent.id}
            depth={8}
            glowColor="rgba(245, 158, 11, 0.15)"
            className="p-5 bg-white border border-slate-200 flex flex-col justify-between shadow-xs rounded-2xl relative group"
          >
            <div>
              {/* Header inside card */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">{agent.businessName}</p>
                  </div>
                </div>

                {/* Active Toggle Switch */}
                <button
                  onClick={() => toggleAgentActive(agent.id)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    agent.isActive
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-slate-100 border-slate-300 text-slate-500'
                  }`}
                  title={agent.isActive ? 'সক্রিয় (পজ করতে ক্লিক করুন)' : 'নিষ্ক্রিয় (চালু করতে ক্লিক করুন)'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                  {agent.type}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200">
                  {agent.language}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                  {agent.personality}
                </span>
              </div>

              {/* Instructions preview */}
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-[11px] text-slate-700 leading-relaxed line-clamp-3 mb-4 font-mono">
                {agent.instructions}
              </div>

              {/* Meta stats */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-3 border-t border-slate-100 mb-4">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span className="truncate font-mono">{agent.phoneNumber || 'নম্বর ছাড়া'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{agent.knowledgeBaseCount || 4} ডকুমেন্টস</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => openCallSimulator(agent)}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>টেস্ট কল</span>
              </button>

              <button
                onClick={() => setIntegratingAgent(agent)}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="ওয়েবসাইট বা অ্যাপে কানেক্ট করার কোড নিন"
              >
                <Code2 className="w-3.5 h-3.5 text-amber-600" />
                <span>কানেক্ট</span>
              </button>

              <button
                onClick={() => setEditingAgent(agent)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                title="এডিট করুন"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (confirm(`আপনি কি নিশ্চিতভাবে "${agent.name}" মুছে ফেলতে চান?`)) {
                    deleteAgent(agent.id);
                  }
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer border border-slate-200"
                title="ডিলিট করুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card3D>
        ))}
      </div>

      {/* Edit Agent Modal */}
      {editingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-5 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">এজেন্ট সেটিংস এডিট করুন</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                Main Server Storage
              </span>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Agent Name:</label>
                <input
                  type="text"
                  value={editingAgent.name}
                  onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Business Name:</label>
                <input
                  type="text"
                  value={editingAgent.businessName}
                  onChange={(e) => setEditingAgent({ ...editingAgent, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">ভয়েস এজেন্ট কী বলবে ও কীভাবে উত্তর দিবে (Instructions):</label>
                <textarea
                  rows={6}
                  value={editingAgent.instructions}
                  onChange={(e) => setEditingAgent({ ...editingAgent, instructions: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  এখানে পরিবর্তন করলে সরাসরি মেইন সার্ভার ডাটাবেজ এবং Vapi-তে রিয়েলটাইমে আপডেট হবে।
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAgent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  মেইন স্টোরেজে সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Agent Integration & Embed Modal */}
      {integratingAgent && (
        <AgentIntegrationModal
          agent={integratingAgent}
          isOpen={Boolean(integratingAgent)}
          onClose={() => setIntegratingAgent(null)}
        />
      )}
    </div>
  );
};
