/**
 * SERVER-ONLY SUPABASE ADMIN CLIENT
 * 
 * CRITICAL SECURITY INSTRUCTION:
 * - This file runs strictly inside Vercel Serverless Functions (/api/*).
 * - NEVER import this file or any file in api/_lib from src/ or client code.
 * - Uses SUPABASE_SERVICE_ROLE_KEY to bypass Row Level Security when executing
 *   authorized administrative operations (such as inserting audit logs).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isServerAdminConfigured = Boolean(
  supabaseUrl && 
  serviceRoleKey && 
  supabaseUrl.startsWith('http')
);

export function getSupabaseAdmin(): SupabaseClient {
  if (!isServerAdminConfigured) {
    throw new Error(
      'Supabase server admin credentials missing: please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server environment.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
