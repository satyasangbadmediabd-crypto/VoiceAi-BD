import React from 'react';
import { useApp } from '../context/AppContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showTagline = false }) => {
  let siteName = 'vapi';
  try {
    const { websiteSettings } = useApp();
    if (websiteSettings?.siteName) siteName = websiteSettings.siteName;
  } catch {}

  const iconSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }[size];

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Vapi-style Geometric Wave Logo Icon */}
      <div className={`relative flex items-center justify-center ${iconSize} shrink-0`}>
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          {/* Stylized Vapi Wave Motif in Clean White & Orange Glow */}
          <path
            d="M6 14L20 30L34 14"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white group-hover:text-orange-400 transition-colors"
          />
          <path
            d="M13 14L20 22L27 14"
            stroke="#f97316"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-500"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight text-white lowercase transition-colors group-hover:text-orange-400 font-sans ${
              size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
            }`}
          >
            {siteName.toLowerCase().includes('vapi') ? 'vapi' : siteName}
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-950/90 text-orange-300 border border-orange-500/40">
            Telephony BD
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5">
            Smart Cloud Telephony & Customer Reception
          </span>
        )}
      </div>
    </div>
  );
};
