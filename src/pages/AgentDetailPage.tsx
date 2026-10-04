import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  ArrowLeft,
  Phone,
  BookOpen,
  PhoneCall,
  Users,
  Copy,
  Play,
  Pause,
  History,
  FileText,
  Save,
  CheckCircle2,
  Sparkles,
  Flame,
  Volume2,
  Trash2,
  Check,
  ChevronRight,
  ExternalLink,
  Edit3,
  Activity,
  Zap
} from 'lucide-react';
import { AgentStatus } from '../types';
import { AgentStatusBadge } from '../components/AgentStatusBadge';
import { AgentHealthModal } from '../components/AgentHealthModal';

export const AgentDetailPage: React.FC = () => {
  const {
    currentRoute,
    navigate,
    agents,
    phoneNumbers,
    knowledgeDocs,
    calls,
    leads,
    updateAgent,
    updateAgentStatus,
    duplicateAgent,
    addAgentVersion,
    deleteAgent,
    openCallSimulator,
    openConfirmDialog,
    addToast
  } = useApp();

  // Extract agent ID from route e.g. /agents/agent-1
  const agentId = currentRoute.replace('/agents/', '');
  const agent = useMemo(() => {
    return agents.find((a) => a.id === agentId) || agents[0];
  }, [agents, agentId]);

  const [activeTab, setActiveTab] = useState<'overview' | 'instructions' | 'versions' | 'knowledge' | 'calls'>('overview');
  const [editedInstructions, setEditedInstructions] = useState(agent?.instructions || '');
  const [versionSummary, setVersionSummary] = useState('');
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  if (!agent) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-4">
        <Bot className="w-12 h-12 mx-auto text-slate-600" />
        <p>এজেন্ট পাওয়া যায়নি।</p>
        <button
          onClick={() => navigate('/agents')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          সকল এজেন্টে ফিরে যান
        </button>
      </div>
    );
  }

  // Specific agent metrics
  const agentCalls = calls.filter((c) => c.agentId === agent.id || c.agentName === agent.name);
  const agentLeads = leads.filter((l) => l.agentId === agent.id || l.agentName === agent.name);
  const assignedPhone = phoneNumbers.find((p) => p.connectedAgentId === agent.id || p.id === agent.phoneNumberId);

  const handleSaveInstructions = () => {
    updateAgent(agent.id, { instructions: editedInstructions });
    addAgentVersion(
      agent.id,
      versionSummary.trim() || 'প্রম্পট ও নির্দেশাবলী আপডেট করা হয়েছে',
      ['Updated business instructions', 'Saved system prompt rules'],
      editedInstructions
    );
    setVersionSummary('');
    setIsEditingInstructions(false);
  };

  const handleRollbackVersion = (instructions: string, versionNum: number) => {
    setEditedInstructions(instructions);
    updateAgent(agent.id, { instructions });
    addAgentVersion(
      agent.id,
      `সংস্করণ #${versionNum} এ রোলব্যাক করা হয়েছে`,
      [`Restored prompt from Version ${versionNum}`],
      instructions
    );
    addToast(`সংস্করণ #${versionNum}-এ প্রত্যাবর্তন সফল`, 'এজেন্টের প্রম্পট পূর্বের অবস্থায় ফিরিয়ে নেওয়া হয়েছে।');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top breadcrumbs & navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/agents')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল এজেন্টে ফিরে যান</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHealthModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Health Check</span>
          </button>

          <button
            onClick={() => navigate('/agent-testing')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Testing Lab</span>
          </button>

          <button
            onClick={() => duplicateAgent(agent.id)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>ডুপ্লিকেট</span>
          </button>

          <button
            onClick={() => openCallSimulator(agent)}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-indigo-950"
          >
            <Play className="w-3.5 h-3.5" />
            <span>লাইভ টেস্ট</span>
          </button>
        </div>
      </div>

      {/* Main Agent Header Card with Full 7-State Lifecycle */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/60 via-[#0d1424] to-purple-950/40 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 flex-shrink-0">
            <Bot className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-white">{agent.name}</h2>
              {/* Lifecycle status selector */}
              <select
                value={agent.status || (agent.isActive ? 'LIVE' : 'PAUSED')}
                onChange={(e) => updateAgentStatus(agent.id, e.target.value as AgentStatus)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-indigo-300 focus:outline-none cursor-pointer"
              >
                <option value="DRAFT">Draft (খসড়া)</option>
                <option value="TESTING">Testing (ল্যাব টেস্ট)</option>
                <option value="READY">Ready to Deploy</option>
                <option value="DEPLOYING">Deploying...</option>
                <option value="LIVE">Live (সক্রিয়)</option>
                <option value="PAUSED">Paused (স্থগিত)</option>
                <option value="ARCHIVED">Archived (আর্কাইভ)</option>
              </select>
            </div>

            <p className="text-xs text-slate-400">
              {agent.businessName} • {agent.type} • Voice: <strong className="text-white">{agent.voiceId}</strong> • Created: <span className="font-mono">{agent.createdAt}</span>
            </p>
          </div>
        </div>

        {/* Assigned Phone number snippet */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            Assigned Phone Hotline
          </span>
          <p className="font-mono font-bold text-white text-sm flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>{assignedPhone?.number || agent.phoneNumber || 'কোনো নম্বর যুক্ত নেই'}</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: Bot },
          { id: 'instructions', label: 'Instructions & Prompt', icon: FileText },
          { id: 'versions', label: `Version History (${agent.versions?.length || 1})`, icon: History },
          { id: 'knowledge', label: `Knowledge Docs (${agent.knowledgeBaseCount || 0})`, icon: BookOpen },
          { id: 'calls', label: `Calls (${agentCalls.length})`, icon: PhoneCall }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Total Inbound Calls</span>
              <p className="text-2xl font-black text-white">{agentCalls.length || agent.totalCalls}</p>
              <p className="text-[11px] text-indigo-400">Lifetime interactions</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Voice Minutes Spent</span>
              <p className="text-2xl font-black text-white">{agent.totalMinutes || 12} mins</p>
              <p className="text-[11px] text-emerald-400">Avg 1m 55s per session</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Leads Captured</span>
              <p className="text-2xl font-black text-white">{agentLeads.length || agent.leads || 0}</p>
              <p className="text-[11px] text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> High conversion rate
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Knowledge Items</span>
              <p className="text-2xl font-black text-white">{agent.knowledgeBaseCount || 1}</p>
              <p className="text-[11px] text-purple-400">Indexed for Semantic RAG</p>
            </div>
          </div>

          {/* Quick Details Card */}
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>এজেন্ট প্রোফাইল ও কনফিগারেশন সারসংক্ষেপ</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px]">ভাষা ও উচ্চারণ ধরন</span>
                <p className="font-bold text-white text-sm">{agent.language}</p>
                <p className="text-[11px] text-slate-400">বাংলা উচ্চারণ ও আঞ্চলিক প্রমিত স্বরভঙ্গি</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px]">ভয়েস মডেল আইডি</span>
                <p className="font-bold text-white text-sm">{agent.voiceId}</p>
                <p className="text-[11px] text-slate-400">ElevenLabs Neural Bangla Voice Model</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSTRUCTIONS & PROMPT */}
      {activeTab === 'instructions' && (
        <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>সিস্টেম নির্দেশাবলী ও প্রম্পট (Prompt & Knowledge Rules)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                এজেন্ট কলারের সাথে কীভাবে কথা বলবে, কোন তথ্য দিবে এবং কোন পরিস্থিতিতে লিড সংগ্রহ করবে তা নির্ধারণ করুন।
              </p>
            </div>

            <button
              onClick={() => setIsEditingInstructions(!isEditingInstructions)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isEditingInstructions ? 'ভিউ মোড' : 'সম্পাদনা করুন'}</span>
            </button>
          </div>

          {isEditingInstructions ? (
            <div className="space-y-3">
              <textarea
                rows={10}
                value={editedInstructions}
                onChange={(e) => setEditedInstructions(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-indigo-700/60 text-white font-mono text-xs leading-relaxed focus:outline-none"
              />

              <div>
                <label className="block text-slate-400 mb-1">ভার্সন নোট / পরিবর্তনের কারণ</label>
                <input
                  type="text"
                  value={versionSummary}
                  onChange={(e) => setVersionSummary(e.target.value)}
                  placeholder="উদাঃ নতুন ঈদ ডিসকাউন্ট ও ভর্তি অফার যোগ করা হয়েছে"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsEditingInstructions(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleSaveInstructions}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>সেভ ও নতুন ভার্সন তৈরি করুন</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-slate-200 whitespace-pre-wrap leading-relaxed font-sans text-xs">
              {agent.instructions}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VERSION HISTORY */}
      {activeTab === 'versions' && (
        <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>এজেন্ট ভার্সন হিস্ট্রি ও রোলব্যাক (Version History)</span>
            </h3>
          </div>

          <div className="space-y-3">
            {(agent.versions || [
              {
                version: 1,
                date: agent.createdAt,
                summary: 'প্রাথমিক সংস্করণ তৈরি ও সক্রিয়করণ',
                changes: ['Agent created', `Voice: ${agent.voiceId}`],
                instructions: agent.instructions
              }
            ]).map((v) => (
              <div
                key={v.version}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 text-[10px] font-bold">
                      Version {v.version}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{v.date}</span>
                  </div>
                  <p className="font-bold text-white text-xs pt-1">{v.summary}</p>
                  <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5 pt-0.5">
                    {v.changes.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {v.instructions && v.instructions !== agent.instructions && (
                  <button
                    onClick={() => handleRollbackVersion(v.instructions!, v.version)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
                  >
                    এই ভার্সনে রোলব্যাক করুন
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: KNOWLEDGE */}
      {activeTab === 'knowledge' && (
        <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">সংযুক্ত নলেজ বেস ফাইলসমূহ</h3>
            <button
              onClick={() => navigate('/knowledge')}
              className="text-indigo-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              ফাইল আপলোড পেজ <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {knowledgeDocs.map((doc) => (
              <div key={doc.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{doc.fileName}</p>
                  <p className="text-[11px] text-slate-400">{doc.previewExcerpt}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                  Indexed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CALLS */}
      {activeTab === 'calls' && (
        <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">এই এজেন্টের কল হিস্ট্রি ({agentCalls.length})</h3>

          {agentCalls.length === 0 ? (
            <p className="text-slate-500 py-6 text-center">এখনও কোনো কল রেকর্ড পাওয়া যায়নি। টেস্ট কল দিয়ে শুরু করুন।</p>
          ) : (
            <div className="space-y-2">
              {agentCalls.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white font-mono">{c.caller}</p>
                    <p className="text-[11px] text-slate-400">{c.summary}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-emerald-400 font-bold">{c.duration}</span>
                    <p className="text-[10px] text-slate-500">{c.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Agent Health Center Modal */}
      {isHealthModalOpen && (
        <AgentHealthModal
          agent={agent}
          isOpen={isHealthModalOpen}
          onClose={() => setIsHealthModalOpen(false)}
          onNavigate={navigate}
        />
      )}
    </div>
  );
};
