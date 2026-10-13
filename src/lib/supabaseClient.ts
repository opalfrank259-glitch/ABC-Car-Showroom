import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.ts';
import type { Database } from '../types/database.ts';

/**
 * Browser-Safe Supabase Client
 * 
 * Initialized exclusively with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.
 * Never uses or accepts service-role keys.
 * 
 * If environment variables are missing, supabase exports `null` gracefully
 * rather than throwing a runtime fatal error.
 */

export const isSupabaseConfigured: boolean = env.isSupabaseConfigured;

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
