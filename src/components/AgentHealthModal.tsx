import React, { useState } from 'react';
import { Agent, AgentHealthSummary } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Activity,
  PhoneCall,
  Brain,
  FileText,
  CreditCard,
  CheckCircle2,
  Database,
  Webhook,
  Mic,
  Cpu,
  ArrowRight,
  X
} from 'lucide-react';

interface AgentHealthModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

export const evaluateAgentHealth = (agent: Agent): AgentHealthSummary => {
  const hasInstructions = Boolean(agent.instructions && agent.instructions.length > 50);
  const hasKnowledge = agent.knowledgeBaseCount > 0;
  const hasVoice = Boolean(agent.voiceId);
  const hasPhone = Boolean(agent.phoneNumber && agent.phoneNumber !== 'Unassigned');

  const checks = [
    {
      key: 'instructions',
      name: 'Agent System Instructions',
      category: 'core' as const,
      status: hasInstructions ? ('healthy' as const) : ('warning' as const),
      description: hasInstructions
        ? 'সিস্টেম প্রম্পট ও ক্যারেক্টার ইনস্ট্রাকশন ভ্যালিডেশন সফল।'
        : 'ইনস্ট্রাকশন অত্যন্ত সংক্ষিপ্ত, পূর্ণাঙ্গ নিয়মাবলী যোগ করুন।',
      actionLabel: 'Edit Instructions'
    },
    {
      key: 'knowledge',
      name: 'Knowledge Base Documents',
      category: 'core' as const,
      status: hasKnowledge ? ('healthy' as const) : ('warning' as const),
      description: hasKnowledge
        ? `${agent.knowledgeBaseCount}টি নলেজ ডকুমেন্ট কানেক্টেড আছে।`
        : 'কোনো নলেজ ডকুমেন্ট নেই; ব্যবসা সম্পর্কিত তথ্য আপলোড করুন।',
      actionLabel: 'Upload Knowledge',
      actionRoute: '/knowledge'
    },
    {
      key: 'voice',
      name: 'AI Voice Configuration',
      category: 'ai' as const,
      status: hasVoice ? ('healthy' as const) : ('error' as const),
      description: `ভয়েস মডেল সিলেক্টেড: ${agent.voiceId || 'None'}।`,
      actionLabel: 'Voice Catalog',
      actionRoute: '/voices'
    },
    {
      key: 'phone',
      name: 'BD Telephony / SIP Connection',
      category: 'telephony' as const,
      status: hasPhone ? ('healthy' as const) : ('not_connected' as const),
      description: hasPhone
        ? `কানেক্টেড নম্বর: ${agent.phoneNumber} (+880 SIP/Telco Provider)`
        : 'কোনো ফোন নম্বর অ্যাসাইন করা হয়নি। টেস্ট ল্যাব মোড চালু আছে।',
      actionLabel: 'Assign BD Number',
      actionRoute: '/phones'
    },
    {
      key: 'gemini',
      name: 'Gemini 3.8 Flash AI Gateway',
      category: 'ai' as const,
      status: 'healthy' as const,
      description: 'সার্ভার-সাইড জেমিনি ডায়ালগ ইঞ্জিন কানেক্টেড ও রেসপন্সিভ।'
    },
    {
      key: 'billing',
      name: 'Account Call Minutes Quota',
      category: 'account' as const,
      status: 'healthy' as const,
      description: 'পর্যাপ্ত মিনিট ব্যালেন্স সক্রিয় আছে।'
    }
  ];

  let score = 98;
  if (!hasInstructions) score -= 15;
  if (!hasKnowledge) score -= 15;
  if (!hasPhone) score -= 15;
  if (!hasVoice) score -= 10;

  let overallStatus: AgentHealthSummary['overallStatus'] = 'Healthy';
  if (score < 60) overallStatus = 'Action Required';
  else if (score < 80) overallStatus = 'Warning';

  return {
    agentId: agent.id,
    overallScore: Math.max(30, score),
    overallStatus,
    lastChecked: 'Just now',
    checks
  };
};

export const AgentHealthModal: React.FC<AgentHealthModalProps> = ({
  agent,
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  const health = evaluateAgentHealth(agent);
  const [selectedNode, setSelectedNode] = useState<string>('Knowledge');

  // Radial nodes around center
  const radialNodes = [
    { id: 'Knowledge', label: 'Knowledge', icon: FileText, status: agent.knowledgeBaseCount > 0 ? 'READY' : 'WARN', score: agent.knowledgeBaseCount > 0 ? '100%' : '50%', angle: 0, detail: `${agent.knowledgeBaseCount} vector documents indexed & searchable` },
    { id: 'Voice', label: 'Voice', icon: Mic, status: agent.voiceId ? 'READY' : 'WARN', score: '98%', angle: 60, detail: `Synthesizer profile: ${agent.voiceId || 'bn-female-1'}` },
    { id: 'AI', label: 'AI Engine', icon: Cpu, status: 'READY', score: '99%', angle: 120, detail: 'Gemini 3.8 Flash low-latency inference endpoint' },
    { id: 'Phone', label: 'Phone', icon: PhoneCall, status: agent.phoneNumber && agent.phoneNumber !== 'Unassigned' ? 'READY' : 'DEMO', score: agent.phoneNumber && agent.phoneNumber !== 'Unassigned' ? '100%' : 'SIMULATED', angle: 180, detail: agent.phoneNumber && agent.phoneNumber !== 'Unassigned' ? agent.phoneNumber : '+880 Virtual SIP Route (Demo)' },
    { id: 'Webhook', label: 'Webhook', icon: Webhook, status: 'READY', score: '100%', angle: 240, detail: 'Event delivery pipeline for CRM & lead sync' },
    { id: 'Database', label: 'Database', icon: Database, status: 'READY', score: '99%', angle: 300, detail: 'Customer dialog store & call transcript logging' }
  ];

  const activeNodeInfo = radialNodes.find((n) => n.id === selectedNode) || radialNodes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#080a0f] border border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header with technical label */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-600/40 flex items-center justify-center text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Agent Health Center</h3>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400">
                  DEMO HEALTH CHECK
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {agent.name} • Telemetry Diagnostic Console
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Radial Visualization Console */}
        <div className="py-4">
          <div className="relative w-full max-w-sm h-64 mx-auto flex items-center justify-center">
            {/* Ambient Radial Background Grid Lines */}
            <div className="absolute inset-0 rounded-full border border-slate-800/80 pointer-events-none" />
            <div className="absolute inset-6 rounded-full border border-dashed border-blue-500/20 pointer-events-none" />
            <div className="absolute inset-16 rounded-full border border-slate-800/60 pointer-events-none" />

            {/* Central Radial Score Hub */}
            <div className="relative z-10 w-28 h-28 rounded-full bg-[#0b0f16] border-2 border-blue-500/60 flex flex-col items-center justify-center text-center shadow-lg shadow-blue-950/50">
              <span className="text-2xl font-black font-mono text-white tracking-tight">
                {health.overallScore}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Agent Health
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-semibold mt-0.5">
                {health.overallStatus}
              </span>
            </div>

            {/* Orbiting Radial Nodes */}
            {radialNodes.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              const radius = 105; // radius in px
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              const isSelected = selectedNode === node.id;
              const NodeIcon = node.icon;

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  style={{
                    transform: `translate(${x}px, ${y}px)`
                  }}
                  className={`absolute w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-150 cursor-pointer shadow-md ${
                    isSelected
                      ? 'bg-blue-600 border-2 border-blue-400 text-white scale-110 z-20 shadow-blue-900/60'
                      : 'bg-[#0d111a] border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white z-10'
                  }`}
                  title={node.label}
                >
                  <NodeIcon className="w-4 h-4" />
                  <span className="text-[8px] font-mono font-bold leading-none mt-0.5">{node.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Selected Node Inspector Panel */}
          <div className="mt-3 p-3.5 rounded-xl bg-[#0b0f16] border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase text-[11px] font-mono">
                  Subsystem: {activeNodeInfo.label}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    activeNodeInfo.status === 'READY'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {activeNodeInfo.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                {activeNodeInfo.detail}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-mono block">Readiness</span>
              <span className="text-sm font-mono font-bold text-blue-400">{activeNodeInfo.score}</span>
            </div>
          </div>
        </div>

        {/* Detailed Checks Accordion/List */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {health.checks.map((check) => (
            <div
              key={check.key}
              className="p-2.5 rounded-lg bg-[#0b0f16] border border-slate-800/60 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                {check.status === 'healthy' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ) : check.status === 'warning' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                )}

                <div>
                  <span className="font-semibold text-white text-[11px]">{check.name}</span>
                  <p className="text-slate-400 text-[10px] leading-tight">{check.description}</p>
                </div>
              </div>

              {check.actionLabel && onNavigate && (
                <button
                  onClick={() => {
                    onClose();
                    if (check.actionRoute) onNavigate(check.actionRoute);
                  }}
                  className="shrink-0 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-medium transition-colors flex items-center gap-1"
                >
                  <span>{check.actionLabel}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 flex items-center justify-between border-t border-slate-800/80 text-xs">
          <span className="text-slate-500 text-[10px] font-mono">
            *DEMO HEALTH CHECK: Simulated telemetry for local diagnostic evaluation
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
