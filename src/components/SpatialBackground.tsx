import React from 'react';

interface SpatialBackgroundProps {
  children?: React.ReactNode;
  showMesh?: boolean;
}

export const SpatialBackground: React.FC<SpatialBackgroundProps> = ({
  children,
  showMesh = true
}) => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#180903] via-[#240e04] to-[#120501] text-slate-100 overflow-x-hidden selection:bg-orange-500/40 selection:text-white">
      {/* 1. Deep Energetic Space Atmosphere: Warm Orange Cosmic Glows & Soundwaves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Soft Concentric Acoustic Rings (Warm Orange & Amber) */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full border border-orange-500/20 opacity-35 animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full border border-dashed border-amber-500/25 opacity-40 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute top-[16%] left-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full border border-orange-400/25 opacity-35 animate-[spin_25s_linear_infinite]" />

        {/* Ambient Chromatic Core Flares (Warm Radiant Orange) */}
        <div
          className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1300px] h-[580px] blur-[130px] rounded-full opacity-60 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.40) 0%, rgba(234, 88, 12, 0.28) 40%, rgba(194, 65, 12, 0.15) 65%, transparent 85%)'
          }}
        />

        {/* Side Aurora Lights (Amber & Warm Copper) */}
        <div
          className="absolute top-[30%] -left-[150px] w-[550px] h-[650px] blur-[140px] rounded-full opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.28) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 80%)'
          }}
        />
        <div
          className="absolute top-[40%] -right-[150px] w-[600px] h-[700px] blur-[150px] rounded-full opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.28) 0%, rgba(234, 88, 12, 0.15) 50%, transparent 80%)'
          }}
        />

        {/* Bottom Ambient Glow */}
        <div
          className="absolute -bottom-[120px] left-1/2 -translate-x-1/2 w-[1100px] h-[480px] blur-[140px] rounded-full opacity-50 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(234, 88, 12, 0.35) 0%, rgba(124, 45, 18, 0.20) 60%, transparent 85%)'
          }}
        />

        {/* Perspective Digital Floor Grid (Warm Orange Mesh) */}
        {showMesh && (
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(249, 115, 22, 0.95) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(249, 115, 22, 0.95) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)'
            }}
          />
        )}

        {/* Soft Background Horizontal Oscilloscope Lines */}
        <div className="absolute top-[28%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/25 to-transparent pointer-events-none" />
        <div className="absolute top-[65%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent pointer-events-none" />
      </div>

      {/* Foreground Workspace Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
