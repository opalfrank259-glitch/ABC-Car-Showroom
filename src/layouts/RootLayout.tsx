import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { DemoBanner } from '../components/DemoBanner.tsx';
import { ShieldCheck, Activity } from 'lucide-react';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#14161C]">
      <DemoBanner />

      {/* Header */}
      <header className="bg-[#14161C] text-white border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#C8102E] flex items-center justify-center font-bold text-white text-sm tracking-wider">
              ABC
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight block">ABC Car Showroom</span>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-xs sm:text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Foundation
            </NavLink>
            <NavLink
              to="/status"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Activity className="w-3.5 h-3.5 text-[#1F9D55]" />
              System Status
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-4 text-xs text-gray-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1F9D55]" />
            <span>Phase 1 Architecture — Foundation &amp; Security Layer</span>
          </div>
          <div>
            <span>Phase 1 &bull; Supabase + Vercel Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
