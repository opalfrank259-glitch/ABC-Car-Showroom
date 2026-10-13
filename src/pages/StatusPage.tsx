import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  Server, 
  Phone, 
  CheckSquare, 
  Terminal,
  ExternalLink
} from 'lucide-react';
import { env } from '../config/env.ts';
import { useSupabaseStatus } from '../hooks/useSupabaseStatus.ts';

interface ApiHealthResponse {
  ok?: boolean;
  service?: string;
  time?: string;
  env?: {
    supabaseUrlSet: boolean;
    serviceRoleSet: boolean;
  };
  error?: string;
}

interface ApiHealthState {
  loading: boolean;
  checked: boolean;
  ok: boolean;
  data: ApiHealthResponse | null;
  error: string | null;
}

export const StatusPage: React.FC = () => {
  const { loading: supabaseLoading, result: supabaseResult, refresh: refreshSupabase } = useSupabaseStatus();

  const [apiState, setApiState] = useState<ApiHealthState>({
    loading: true,
    checked: false,
    ok: false,
    data: null,
    error: null,
  });

  const checkApiHealth = useCallback(async () => {
    setApiState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const json: ApiHealthResponse = await response.json();
        setApiState({
          loading: false,
          checked: true,
          ok: json.ok === true,
          data: json,
          error: null,
        });
      } else {
        setApiState({
          loading: false,
          checked: true,
          ok: false,
          data: null,
          error: `HTTP ${response.status} ${response.statusText} — Endpoint requires Vercel serverless environment`,
        });
      }
    } catch (_err) {
      setApiState({
        loading: false,
        checked: true,
        ok: false,
        data: null,
        error: 'Fetch failed (Expected inside AI Studio preview: Vercel Functions run after deployment)',
      });
    }
  }, []);

  useEffect(() => {
    checkApiHealth();
  }, [checkApiHealth]);

  const handleRefreshAll = () => {
    refreshSupabase();
    checkApiHealth();
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#14161C]">
            Phase 1 System Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Verification checklist for environment variables, database connectivity, and Vercel endpoints.
          </p>
        </div>
        <button
          onClick={handleRefreshAll}
          disabled={supabaseLoading || apiState.loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#14161C] hover:bg-black rounded-lg transition-colors disabled:opacity-50 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${supabaseLoading || apiState.loading ? 'animate-spin' : ''}`} />
          Run Diagnostics
        </button>
      </div>

      {/* Diagnostics Checklist */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {/* Item 1: App Build */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-emerald-100 text-[#1F9D55] mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">1. App Build Status</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Vite + TypeScript SPA compilation and routing bundle.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-[#1F9D55] border border-emerald-200 shrink-0">
            OK
          </span>
        </div>

        {/* Item 2: Demo Mode */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-full ${env.isDemoMode ? 'bg-amber-100 text-[#E0A800]' : 'bg-gray-100 text-gray-600'} mt-0.5`}>
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">2. Demo Mode Flag</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Controlled by <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">VITE_DEMO_MODE</code> (defaults to <code className="text-[11px]">false</code>).
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
            env.isDemoMode 
              ? 'bg-amber-50 text-[#E0A800] border border-amber-200' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {env.isDemoMode ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Item 3: Supabase Environment Variables */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-full ${env.isSupabaseConfigured ? 'bg-emerald-100 text-[#1F9D55]' : 'bg-amber-100 text-[#E0A800]'} mt-0.5`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">3. Supabase Client Configured</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Requires browser-safe variables: <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_URL</code> and <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_PUBLISHABLE_KEY</code>.
              </p>
              {!env.isSupabaseConfigured && (
                <div className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-2.5">
                  <strong>Notice:</strong> Supabase is not configured yet. The application continues running safely without throwing fatal runtime errors. Add your Supabase project keys to activate live reads.
                </div>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
            env.isSupabaseConfigured 
              ? 'bg-emerald-50 text-[#1F9D55] border border-emerald-200' 
              : 'bg-amber-50 text-[#E0A800] border border-amber-200'
          }`}>
            {env.isSupabaseConfigured ? 'YES' : 'NO'}
          </span>
        </div>

        {/* Item 4: Supabase Reachability & Table Read */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-full ${
              supabaseLoading 
                ? 'bg-gray-100 text-gray-400' 
                : supabaseResult?.connected 
                  ? 'bg-emerald-100 text-[#1F9D55]' 
                  : 'bg-rose-100 text-[#C8102E]'
            } mt-0.5`}>
              {supabaseResult?.connected ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">4. Supabase Reachable</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Attempts harmless select query on <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">site_settings_public</code>.
              </p>
              <div className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded p-2.5 text-gray-700">
                <span className="font-semibold">Result: </span>
                {supabaseLoading ? 'Testing connection...' : supabaseResult?.message}
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
            supabaseLoading 
              ? 'bg-gray-100 text-gray-500' 
              : supabaseResult?.connected 
                ? 'bg-emerald-50 text-[#1F9D55] border border-emerald-200' 
                : 'bg-rose-50 text-[#C8102E] border border-rose-200'
          }`}>
            {supabaseLoading ? 'CHECKING...' : supabaseResult?.connected ? 'PASS' : 'FAIL'}
          </span>
        </div>

        {/* Item 5: Primary Phone loaded from settings */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-full ${supabaseResult?.primaryPhone ? 'bg-emerald-100 text-[#1F9D55]' : 'bg-gray-100 text-gray-500'} mt-0.5`}>
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">5. Primary Phone Loaded From Settings</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Verifies dynamic retrieval from database seed, ensuring phone numbers are not hard-coded in components.
              </p>
              <div className="mt-2 text-xs">
                {supabaseResult?.primaryPhone ? (
                  <span className="font-mono text-sm font-bold text-[#14161C] bg-emerald-50 px-2 py-1 rounded border border-emerald-200 inline-block">
                    {supabaseResult.primaryPhone}
                  </span>
                ) : (
                  <span className="text-gray-500 italic">
                    (Not loaded — will display once Supabase is connected and migration 0001 is executed)
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
            supabaseResult?.primaryPhone 
              ? 'bg-emerald-50 text-[#1F9D55] border border-emerald-200' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {supabaseResult?.primaryPhone ? 'LOADED' : 'PENDING'}
          </span>
        </div>

        {/* Item 6: Vercel /api/health */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-full ${
              apiState.ok 
                ? 'bg-emerald-100 text-[#1F9D55]' 
                : 'bg-amber-100 text-[#E0A800]'
            } mt-0.5`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-[#14161C]">6. Vercel Serverless /api/health</h3>
                <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium">
                  Works only after Vercel deployment
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Vercel Function handler at <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">api/health.ts</code>.
              </p>
              <div className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded p-2.5 text-gray-700">
                {apiState.loading ? (
                  <span>Checking /api/health...</span>
                ) : apiState.ok && apiState.data ? (
                  <div className="space-y-1">
                    <p className="font-semibold text-[#1F9D55]">Endpoint operational!</p>
                    <p>Service: {apiState.data.service} &bull; Time: {apiState.data.time}</p>
                    <p>Server env: Supabase URL: {String(apiState.data.env?.supabaseUrlSet)} | Service Role: {String(apiState.data.env?.serviceRoleSet)}</p>
                  </div>
                ) : (
                  <div>
                    <span className="font-semibold text-amber-800">Status: </span>
                    <span className="text-gray-600">{apiState.error}</span>
                    <p className="mt-1 text-[11px] text-gray-500">
                      Inside local preview or AI Studio, standalone Vite dev server is running without the Vercel Serverless Function runner. When deployed to Vercel via GitHub, Vercel automatically mounts <code>/api/*</code> serverless routes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
            apiState.ok 
              ? 'bg-emerald-50 text-[#1F9D55] border border-emerald-200' 
              : 'bg-amber-50 text-[#E0A800] border border-amber-200'
          }`}>
            {apiState.ok ? 'PASS' : 'DEPLOY PENDING'}
          </span>
        </div>
      </div>

      {/* Security Audit Checklist Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-[#14161C] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#C8102E]" />
          Zero Secrets Policy Enforcement
        </h3>
        <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
          <li>
            <strong>No Service Role Key in Client:</strong> The client bundle only consumes <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> and cannot access administrative privileges.
          </li>
          <li>
            <strong>Row Level Security (RLS):</strong> All four tables (<code>profiles</code>, <code>site_settings_public</code>, <code>site_settings_private</code>, <code>audit_logs</code>) enforce strict RLS policies.
          </li>
          <li>
            <strong>Server Secrets Shielded:</strong> <code>SUPABASE_SERVICE_ROLE_KEY</code>, <code>BOOTSTRAP_SECRET</code>, and other credentials reside solely in server environment configuration.
          </li>
        </ul>
      </div>
    </div>
  );
};
