import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OnboardingBanner } from '../components/OnboardingBanner';
import { AgentStatusBadge } from '../components/AgentStatusBadge';
import { AgentHealthModal } from '../components/AgentHealthModal';
import { AgentDeploymentModal } from '../components/AgentDeploymentModal';
import { Agent } from '../types';
import { AnimatedText } from '../components/AnimatedText';
import { Card3D } from '../components/Card3D';
import {
  Bot,
  PhoneCall,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  PhoneForwarded,
  ShieldCheck,
  Eye,
  Shield,
  Zap,
  Activity,
  Search,
  BookOpen,
  Phone,
  Play,
  Flame,
  Radio,
  Database
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, agents, calls, leads, navigate, openCallSimulator, openCheckout, openGlobalSearch } = useApp();
  const [selectedAgentForHealth, setSelectedAgentForHealth] = useState<Agent | null>(null);
  const [deployingAgent, setDeployingAgent] = useState<Agent | null>(null);

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.isActive).length;
  const callsToday = 47;
  const minutesUsed = user?.minutesUsed || 82;
  const minutesLimit = user?.minutesLimit || 100;
  const minutesPct = Math.min(100, Math.round((minutesUsed / minutesLimit) * 100));
  const hotLeads = leads.filter((l) => l.status === 'HOT' || l.status === 'WARM');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Onboarding Checklist Banner */}
      <OnboardingBanner />

      {/* Top Welcome & Platform Status Header (Enterprise Dark Card) */}
      <div className="rounded-2xl p-5 sm:p-6 bg-[#080d1a] border border-cyan-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
              {user?.businessName || 'AI Skill Hub BD'}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>VAPI & WEBRTC ENGINE: ONLINE</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
              <Database className="w-3 h-3 text-cyan-400" />
              <span>SERVER STORAGE SYNCED</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            <AnimatedText text={`স্বাগতম, ${user?.name || 'তানভীর আহমেদ'}`} variant="words" as="span" />
          </h2>
          <AnimatedText
            text="আপনার AI ভয়েস এজেন্ট কনফিগারেশন, ডায়ালগ টেস্টিং এবং কলার লিড ডাটাবেজ এক জায়গা থেকেই পরিচালনা করুন।"
            variant="rise"
            as="p"
            delay={0.15}
            className="text-xs text-slate-400 max-w-xl leading-relaxed"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => navigate('/agent-testing')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Testing Lab</span>
          </button>

          <button
            onClick={() => navigate('/agents/create')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/30 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Agent</span>
          </button>
        </div>
      </div>

      {/* Quick Action Command Toolbar */}
      <div className="p-3 rounded-2xl bg-[#050811]/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] font-bold">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>QUICK WORKSPACE ACTIONS:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/agents/create')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3 h-3 text-blue-400" />
            <span>Create Agent</span>
          </button>
          <button
            onClick={() => navigate('/agent-testing')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Test Lab</span>
          </button>
          <button
            onClick={() => navigate('/knowledge')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-amber-400" />
            <span>Upload Knowledge</span>
          </button>
          <button
            onClick={() => navigate('/phones')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>Connect +880 SIP</span>
          </button>
          <button
            onClick={openGlobalSearch}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/40 text-cyan-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-3 h-3" />
            <span>Ctrl+K</span>
          </button>
        </div>
      </div>

      {/* Metric Strip: 3D Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Calls */}
        <Card3D
          depth={6}
          glowColor="rgba(6, 182, 212, 0.2)"
          onClick={() => navigate('/calls')}
          className="p-4 bg-[#080d1a] border-cyan-900/40 shadow-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono font-semibold uppercase">Calls Today</span>
            <PhoneCall className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">{callsToday}</span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14% vs yesterday
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Average call duration: 2m 14s</p>
        </Card3D>

        {/* Metric 2: Minutes Quota */}
        <Card3D
          depth={6}
          glowColor="rgba(59, 130, 246, 0.2)"
          onClick={() => navigate('/billing')}
          className="p-4 bg-[#080d1a] border-cyan-900/40 shadow-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono font-semibold uppercase">Call Minutes</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">
              {minutesUsed} <span className="text-xs text-slate-400 font-normal">/ {minutesLimit}m</span>
            </span>
            <span className="text-xs font-mono font-bold text-blue-400">{minutesPct}% used</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${minutesPct > 80 ? 'bg-rose-500' : 'bg-blue-500'}`}
              style={{ width: `${minutesPct}%` }}
            />
          </div>
        </Card3D>

        {/* Metric 3: Hot Leads */}
        <Card3D
          depth={6}
          glowColor="rgba(245, 158, 11, 0.25)"
          onClick={() => navigate('/leads')}
          className="p-4 bg-[#080d1a] border-amber-900/50 shadow-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono font-semibold uppercase text-amber-300">Hot / Qualified Leads</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-amber-400">{hotLeads.length}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/60 font-bold">
              CRITICAL
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires follow-up within 24 hours</p>
        </Card3D>

        {/* Metric 4: Agents Fleet */}
        <Card3D
          depth={6}
          glowColor="rgba(16, 185, 129, 0.2)"
          onClick={() => navigate('/agents')}
          className="p-4 bg-[#080d1a] border-cyan-900/40 shadow-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono font-semibold uppercase">Agent Fleet</span>
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">{totalAgents}</span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {activeAgents} Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">All engines healthy & connected</p>
        </Card3D>
      </div>

      {/* Main Enterprise Dashboard Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Enterprise Tables & Call Activity */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Call Activity - Enterprise Compact Table */}
          <div className="rounded-2xl bg-[#080d1a] border border-cyan-900/40 overflow-hidden shadow-xl">
            <div className="px-4 py-3 border-b border-cyan-900/40 flex items-center justify-between bg-[#050811]/60">
              <div className="flex items-center gap-2">
                <PhoneForwarded className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Live Call Activity Stream
                </h3>
              </div>
              <button
                onClick={() => navigate('/calls')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Log</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#050811] border-b border-cyan-900/40 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-2.5 px-4">Caller</th>
                    <th className="py-2.5 px-4">Agent</th>
                    <th className="py-2.5 px-4">Intent</th>
                    <th className="py-2.5 px-4">Duration</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {calls.slice(0, 5).map((call, idx) => (
                    <tr
                      key={`${call.id}-${idx}`}
                      onClick={() => navigate('/calls')}
                      className="hover:bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-200">
                        {call.caller}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300 font-medium">
                        {call.agentName}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-[10px] font-mono text-cyan-300">
                          {call.leadCollected?.intent || call.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-400">
                        {call.duration}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            call.status === 'Qualified Lead' || call.status === 'Interested'
                              ? 'text-emerald-400'
                              : call.status === 'Missed'
                              ? 'text-rose-400'
                              : 'text-slate-400'
                          }`}
                        >
                          ● {call.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-500 text-[11px]">
                        {call.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Agents Fleet Management */}
          <div className="rounded-2xl bg-[#080d1a] border border-cyan-900/40 overflow-hidden shadow-xl">
            <div className="px-4 py-3 border-b border-cyan-900/40 flex items-center justify-between bg-[#050811]/60">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Configured Agent Deployments
                </h3>
              </div>
              <button
                onClick={() => navigate('/agents')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Manage All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {agents.map((ag) => (
                <div
                  key={ag.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-white">{ag.name}</span>
                      <AgentStatusBadge status={ag.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-400">
                      {ag.businessName} • {ag.type} • Voice: {ag.voiceId || 'Default'} • {ag.knowledgeBaseCount} docs
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedAgentForHealth(ag)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Agent Health"
                    >
                      <Activity className="w-3 h-3 text-blue-400" />
                      <span>Health</span>
                    </button>

                    <button
                      onClick={() => setDeployingAgent(ag)}
                      className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-xs font-semibold text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Simulate Deployment"
                    >
                      <Zap className="w-3 h-3 text-blue-400" />
                      <span>Deploy</span>
                    </button>

                    <button
                      onClick={() => navigate(`/agents/${ag.id}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Leads CRM Stream & System Telemetry */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hot Leads Activity Stream */}
          <div className="rounded-2xl bg-[#0b0f16] border border-slate-800 overflow-hidden shadow-xl">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-[#080d1a]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Hot Leads Stream
                </h3>
              </div>
              <button
                onClick={() => navigate('/leads')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
              >
                All Leads
              </button>
            </div>

            <div className="p-3 divide-y divide-slate-800/60">
              {hotLeads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{lead.name}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">{lead.phone}</p>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{lead.interest}</p>
                </div>
              ))}
            </div>
          </div>

          {/* System Health Telemetry Console Card */}
          <div className="p-4 rounded-2xl bg-[#0b0f16] border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase font-mono">Environment Status</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                READY (ONLINE)
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Bangla Dialog Engine</span>
                <span className="text-emerald-400 font-bold">Gemini AI</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">TTS Audio Synthesizer</span>
                <span className="text-emerald-400 font-bold">Operational</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Carrier PSTN Line</span>
                <span className="text-amber-400 font-bold">Simulated</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Webhooks & CRM Dispatch</span>
                <span className="text-emerald-400 font-bold">Synchronized</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (agents[0]) setSelectedAgentForHealth(agents[0]);
              }}
              className="w-full mt-2 py-2 rounded-xl bg-[#080a0f] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-blue-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Launch Full Diagnostic Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Health Modal */}
      {selectedAgentForHealth && (
        <AgentHealthModal
          agent={selectedAgentForHealth}
          isOpen={Boolean(selectedAgentForHealth)}
          onClose={() => setSelectedAgentForHealth(null)}
          onNavigate={navigate}
        />
      )}

      {/* Deployment Pipeline Modal */}
      {deployingAgent && (
        <AgentDeploymentModal
          agent={deployingAgent}
          isOpen={Boolean(deployingAgent)}
          onClose={() => setDeployingAgent(null)}
          onComplete={() => {
            // update agent status if needed
          }}
        />
      )}
    </div>
  );
};
