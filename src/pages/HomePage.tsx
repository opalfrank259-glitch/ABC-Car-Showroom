import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Layers, Database, ShieldAlert, Cpu } from 'lucide-react';
import { env } from '../config/env.ts';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#1F9D55] border border-emerald-200 mb-4">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Phase 1: Foundation Ready
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14161C]">
          ABC Car Showroom
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Full-Stack Foundation &amp; Architecture Scaffold
        </p>
        <p className="mt-4 text-sm sm:text-base text-gray-700 max-w-2xl leading-relaxed">
          The core plumbing, database schemas, Row Level Security (RLS) policies, environment configuration, 
          and Vercel serverless integration have been initialized according to the PRD specification.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/status"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#14161C] hover:bg-black rounded-lg transition-colors shadow-sm"
          >
            Open System Diagnostics (/status)
            <ArrowRight className="w-4 h-4 text-[#C8102E]" />
          </Link>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="w-9 h-9 rounded-md bg-red-50 text-[#C8102E] flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[#14161C]">Modular Scaffold</h3>
          <p className="mt-1 text-xs text-gray-600 leading-relaxed">
            Standardized folder architecture across 9 future feature slices: inventory, vehicle, leads, finance, trade-in, appointments, chatbot, compare, and admin.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="w-9 h-9 rounded-md bg-emerald-50 text-[#1F9D55] flex items-center justify-center mb-3">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[#14161C]">Supabase PostgreSQL</h3>
          <p className="mt-1 text-xs text-gray-600 leading-relaxed">
            Migration <code>0001_foundation.sql</code> ready for execution with <code>profiles</code>, <code>site_settings_public</code>, <code>site_settings_private</code>, <code>audit_logs</code>, and strict RLS.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="w-9 h-9 rounded-md bg-amber-50 text-[#E0A800] flex items-center justify-center mb-3">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[#14161C]">Zero Secrets in Client</h3>
          <p className="mt-1 text-xs text-gray-600 leading-relaxed">
            Strict separation between browser-safe <code>VITE_</code> parameters and server-only service-role keys. App never crashes if credentials are unset.
          </p>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Runtime Config:</span>
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800">
            {env.isSupabaseConfigured ? 'Supabase Configured' : 'Supabase Not Configured'}
          </span>
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800">
            Demo Mode: {env.isDemoMode ? 'ON' : 'OFF'}
          </span>
        </div>
        <Link to="/status" className="text-[#C8102E] font-medium hover:underline inline-flex items-center gap-1">
          View full diagnostics checklist &rarr;
        </Link>
      </div>
    </div>
  );
};
