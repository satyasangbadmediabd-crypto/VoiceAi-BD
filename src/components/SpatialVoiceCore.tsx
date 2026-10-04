import React from 'react';
import { motion } from 'motion/react';
import { Wifi, Activity } from 'lucide-react';

export type VoiceCoreState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'CONNECTED' | 'ERROR';

interface SpatialVoiceCoreProps {
  state?: VoiceCoreState;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  /** Telephony connection status override, e.g., 'Simulation Mode' or 'Configured' */
  connectionStatus?: string;
  signalStrengthBars?: number;
}

export const SpatialVoiceCore: React.FC<SpatialVoiceCoreProps> = ({
  state = 'IDLE',
  size = 'md',
  showLabel = true,
  className = '',
  interactive = false,
  onClick,
  connectionStatus,
  signalStrengthBars = 4
}) => {
  const sizeMap = {
    sm: { box: 'w-24 h-24', core: 'w-10 h-10', ring1: 80, ring2: 60, text: 'text-[10px]' },
    md: { box: 'w-36 h-36', core: 'w-14 h-14', ring1: 128, ring2: 96, text: 'text-xs' },
    lg: { box: 'w-48 h-48', core: 'w-20 h-20', ring1: 176, ring2: 132, text: 'text-xs' },
    hero: { box: 'w-64 h-64 sm:w-80 sm:h-80', core: 'w-28 h-28 sm:w-32 sm:h-32', ring1: 270, ring2: 200, text: 'text-sm' }
  }[size];

  const stateConfig = {
    IDLE: {
      accent: '#2563eb', // electric blue
      glow: 'rgba(37, 99, 235, 0.16)',
      ringBorder: 'rgba(59, 130, 246, 0.28)',
      waveformColor: '#60a5fa',
      statusText: 'text-blue-400',
      label: 'IDLE',
      sub: 'অপেক্ষমাণ (Ready for Call)',
      activityDb: '-54 dB',
      statusBadge: 'STANDBY'
    },
    LISTENING: {
      accent: '#06b6d4', // cyan
      glow: 'rgba(6, 182, 212, 0.25)',
      ringBorder: 'rgba(34, 211, 238, 0.45)',
      waveformColor: '#22d3ee',
      statusText: 'text-cyan-300',
      label: 'LISTENING',
      sub: 'শুনছে (Audio Ingestion)',
      activityDb: '-18 dB',
      statusBadge: 'INBOUND'
    },
    THINKING: {
      accent: '#7c3aed', // violet
      glow: 'rgba(124, 58, 237, 0.25)',
      ringBorder: 'rgba(167, 139, 250, 0.45)',
      waveformColor: '#c084fc',
      statusText: 'text-violet-300',
      label: 'THINKING',
      sub: 'প্রসেসিং (Reasoning & Retrieval)',
      activityDb: '-24 dB',
      statusBadge: 'REASONING'
    },
    SPEAKING: {
      accent: '#10b981', // emerald
      glow: 'rgba(16, 185, 129, 0.28)',
      ringBorder: 'rgba(52, 211, 153, 0.55)',
      waveformColor: '#34d399',
      statusText: 'text-emerald-300',
      label: 'SPEAKING',
      sub: 'কথা বলছে (Voice Synthesis)',
      activityDb: '-6 dB',
      statusBadge: 'TRANSMITTING'
    },
    CONNECTED: {
      accent: '#3b82f6', // bright blue
      glow: 'rgba(59, 130, 246, 0.22)',
      ringBorder: 'rgba(96, 165, 250, 0.38)',
      waveformColor: '#93c5fd',
      statusText: 'text-blue-300',
      label: 'CONNECTED',
      sub: 'সংযুক্ত (Channel Active)',
      activityDb: '-20 dB',
      statusBadge: 'LINKED'
    },
    ERROR: {
      accent: '#ef4444', // red
      glow: 'rgba(239, 68, 68, 0.30)',
      ringBorder: 'rgba(248, 113, 113, 0.55)',
      waveformColor: '#f87171',
      statusText: 'text-rose-400',
      label: 'INTERRUPTED',
      sub: 'লাইন স্থগিত (Check Settings)',
      activityDb: '-∞ dB',
      statusBadge: 'ALERT'
    }
  }[state];

  const defaultConnection = connectionStatus || (state === 'ERROR' ? 'Line Interrupted' : 'Simulation Mode');

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${interactive ? 'cursor-pointer group' : ''} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={`AI Voice Engine State: ${stateConfig.label}`}
    >
      {/* 3D Perspective Stage */}
      <div
        className={`relative ${sizeMap.box} flex items-center justify-center`}
        style={{ perspective: 1000 }}
      >
        {/* Soft Environmental Lighting (Anti-Slop: restrained, max 0.28 opacity) */}
        <div
          className="absolute inset-0 rounded-full blur-2xl transition-all duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${stateConfig.glow} 0%, transparent 68%)`
          }}
        />

        {/* Outer Telemetry Precision Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-dashed pointer-events-none"
          style={{ borderColor: stateConfig.ringBorder }}
          animate={{
            rotate: 360,
            scale: state === 'LISTENING' ? [1, 1.08, 1] : state === 'CONNECTED' ? [1, 1.03, 1] : 1,
            opacity: state === 'LISTENING' ? [0.45, 0.85, 0.45] : 0.55
          }}
          transition={{
            rotate: { duration: 32, repeat: Infinity, ease: 'linear' },
            scale: { duration: state === 'LISTENING' ? 1.3 : 3, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 1.3, repeat: Infinity, ease: 'easeInOut' }
          }}
        />

        {/* Secondary Inclined Precision Ring */}
        <motion.div
          className="absolute rounded-full border pointer-events-none"
          style={{
            width: sizeMap.ring1,
            height: sizeMap.ring1,
            borderColor: stateConfig.ringBorder,
            borderWidth: '1px',
            transformStyle: 'preserve-3d'
          }}
          animate={{
            rotateZ: -360,
            rotateX: 42
          }}
          transition={{
            rotateZ: { duration: 22, repeat: Infinity, ease: 'linear' }
          }}
        >
          {/* Orbital node on ring */}
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{
              backgroundColor: stateConfig.accent,
              boxShadow: `0 0 6px ${stateConfig.accent}`
            }}
          />
          {state === 'THINKING' && (
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: stateConfig.accent }}
            />
          )}
        </motion.div>

        {/* Inner Counter-Rotating Ring */}
        <motion.div
          className="absolute rounded-full border border-slate-700/50 pointer-events-none"
          style={{
            width: sizeMap.ring2,
            height: sizeMap.ring2,
            transformStyle: 'preserve-3d'
          }}
          animate={{
            rotateZ: 360,
            rotateY: 38
          }}
          transition={{
            rotateZ: { duration: 18, repeat: Infinity, ease: 'linear' }
          }}
        />

        {/* Central Voice Engine Sphere with realistic audio activity & micro waveform */}
        <div
          className={`relative ${sizeMap.core} rounded-full flex flex-col items-center justify-center shadow-xl transition-transform duration-200 border`}
          style={{
            background: `radial-gradient(circle at 35% 28%, #142038 0%, #0b0f16 70%, #05070c 100%)`,
            borderColor: stateConfig.ringBorder,
            boxShadow: `0 0 20px ${stateConfig.glow}, inset 0 0 10px rgba(255,255,255,0.06)`
          }}
        >
          {/* Micro Telemetry HUD in Top of Core (Visible in hero and lg) */}
          {(size === 'hero' || size === 'lg') && (
            <div className="absolute top-2 sm:top-2.5 px-2 flex items-center justify-between w-full text-[9px] font-mono text-slate-400 pointer-events-none opacity-80">
              <span className="text-[8px] tracking-tight">{stateConfig.statusBadge}</span>
              <span className="text-[8px] text-slate-400">{stateConfig.activityDb}</span>
            </div>
          )}

          {/* Responsive Voice Micro-Waveform */}
          <div className="flex items-center justify-center gap-[2.5px] sm:gap-[3px] h-6 sm:h-8 px-2 overflow-hidden">
            {[35, 70, 95, 55, 85, 45, 75].map((h, i) => {
              const isSpeaking = state === 'SPEAKING';
              const isListening = state === 'LISTENING';
              const isThinking = state === 'THINKING';

              const barHeight = isSpeaking
                ? [h * 0.25, h, h * 0.35]
                : isListening
                ? [h * 0.2, h * 0.55, h * 0.2]
                : isThinking
                ? [14, 28, 14]
                : [10, 14, 10];

              const duration = isSpeaking ? 0.35 + (i % 3) * 0.12 : isListening ? 0.65 : 1.5;

              return (
                <motion.span
                  key={i}
                  className="w-[2.5px] sm:w-[3px] rounded-full"
                  style={{
                    backgroundColor: stateConfig.waveformColor,
                    boxShadow: `0 0 3px ${stateConfig.waveformColor}`
                  }}
                  animate={{
                    height: barHeight
                  }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.07
                  }}
                />
              );
            })}
          </div>

          {/* Micro Signal Strength indicator at bottom of core (hero/lg) */}
          {(size === 'hero' || size === 'lg') && (
            <div className="absolute bottom-2 sm:bottom-2.5 flex items-center gap-[2px] pointer-events-none opacity-75">
              {[1, 2, 3, 4].map((bar) => (
                <span
                  key={bar}
                  className="w-[2px] rounded-xs bg-slate-600"
                  style={{
                    height: `${bar * 2.5}px`,
                    backgroundColor: bar <= signalStrengthBars ? stateConfig.accent : '#334155'
                  }}
                />
              ))}
            </div>
          )}

          {/* Precision Crosshair */}
          <div className="absolute inset-1 rounded-full border border-white/5 pointer-events-none" />
        </div>
      </div>

      {/* Structured Technical Status Label & Connection Indicator */}
      {showLabel && (
        <div className="mt-3 flex flex-col items-center text-center space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: stateConfig.accent,
                boxShadow: `0 0 6px ${stateConfig.accent}`
              }}
            />
            <span className={`font-mono font-bold tracking-wider ${sizeMap.text} ${stateConfig.statusText}`}>
              {stateConfig.label}
            </span>
            <span className="text-slate-600">•</span>
            {/* Connection Status Pill */}
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-50 border border-amber-200/90 text-amber-900 font-medium">
              {defaultConnection}
            </span>
          </div>
          <span className="text-[11px] text-slate-600 font-medium">
            {stateConfig.sub}
          </span>
        </div>
      )}
    </div>
  );
};
