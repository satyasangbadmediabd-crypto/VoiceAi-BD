import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpatialVoiceCore, VoiceCoreState } from './SpatialVoiceCore';
import { Agent } from '../types';
import { CheckCircle2, AlertCircle, X, ShieldCheck, Cpu, ArrowRight, Code2 } from 'lucide-react';
import { AgentIntegrationModal } from './AgentIntegrationModal';

interface AgentDeploymentModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const AgentDeploymentModal: React.FC<AgentDeploymentModalProps> = ({
  agent,
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [coreState, setCoreState] = useState<VoiceCoreState>('THINKING');
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);

  const steps = [
    { num: 1, label: 'Preparing Agent Runtime', desc: 'Validating system prompt & dialect instructions' },
    { num: 2, label: 'Indexing Knowledge Store', desc: `${agent.knowledgeBaseCount} vector documents retrieved` },
    { num: 3, label: 'Checking Voice Engine', desc: `Synthesizer profile: ${agent.voiceId || 'bn-female-1'}` },
    { num: 4, label: 'Telephony Route Check', desc: 'Demo Mode (Simulated +880 line active)' },
    { num: 5, label: 'Compiling Agent State', desc: 'Finalizing live production deployment' }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setCoreState('THINKING');
      return;
    }

    // Step sequence with fast 220ms - 350ms pacing
    const t1 = setTimeout(() => {
      setCurrentStep(2);
      setCoreState('LISTENING');
    }, 450);

    const t2 = setTimeout(() => {
      setCurrentStep(3);
      setCoreState('THINKING');
    }, 900);

    const t3 = setTimeout(() => {
      setCurrentStep(4);
      setCoreState('CONNECTED');
    }, 1350);

    const t4 = setTimeout(() => {
      setCurrentStep(5);
      setCoreState('SPEAKING');
    }, 1800);

    const t5 = setTimeout(() => {
      setCurrentStep(6);
      setCoreState('CONNECTED');
      if (onComplete) onComplete();
    }, 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0b0f16] border border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Agent Deployment Pipeline
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Voice Core Animation */}
        <div className="py-5 flex flex-col items-center justify-center">
          <SpatialVoiceCore state={coreState} size="md" showLabel={false} />
          <div className="mt-2 text-center">
            <h4 className="text-sm font-bold text-white">{agent.name}</h4>
            <p className="text-xs text-slate-400">{agent.businessName} • {agent.type}</p>
          </div>
        </div>

        {/* Deployment Steps List */}
        <div className="space-y-2 py-2">
          {steps.map((s) => {
            const isDone = currentStep > s.num || currentStep === 6;
            const isCurrent = currentStep === s.num;

            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all duration-200 ${
                  isDone
                    ? 'bg-[#080d16] border-emerald-500/30 text-emerald-300'
                    : isCurrent
                    ? 'bg-blue-950/40 border-blue-500/50 text-white'
                    : 'bg-slate-900/30 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                      isDone
                        ? 'bg-emerald-500 text-black'
                        : isCurrent
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : s.num}
                  </div>
                  <div>
                    <p className="font-semibold leading-tight">{s.label}</p>
                    <p className="text-[10px] text-slate-400">{s.desc}</p>
                  </div>
                </div>

                {isDone ? (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">READY</span>
                ) : isCurrent ? (
                  <span className="text-[10px] font-mono text-blue-400 font-bold animate-pulse">RUNNING...</span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-600">PENDING</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Final Completion State */}
        {currentStep === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1"
          >
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Agent Deployed to Production</span>
            </div>
            <p className="text-[11px] text-slate-300">
              এজেন্ট সক্রিয় হয়েছে এবং ইনকামিং কলের জন্য প্রস্তুত।
            </p>
          </motion.div>
        )}

        {/* Bottom Actions */}
        <div className="mt-5 flex items-center justify-between gap-2">
          {currentStep === 6 ? (
            <button
              onClick={() => setShowIntegrationModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-950"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>কানেক্ট কোড নিন (Embed Code)</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            {currentStep === 6 ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>

      {/* Integration Code Modal */}
      {showIntegrationModal && (
        <AgentIntegrationModal
          agent={agent}
          isOpen={showIntegrationModal}
          onClose={() => setShowIntegrationModal(false)}
        />
      )}
    </div>
  );
};
