import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { env } from '../config/env.ts';

export const DemoBanner: React.FC = () => {
  if (!env.isDemoMode) {
    return null;
  }

  return (
    <div
      role="banner"
      className="bg-[#E0A800] text-[#14161C] px-4 py-2 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2 border-b border-yellow-600/20"
    >
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>DEMO MODE — not real data</span>
    </div>
  );
};
