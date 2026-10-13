/**
 * ABC Car Showroom - Client Environment Configuration
 * Only browser-safe variables (prefixed with VITE_) are read and validated here.
 *
 * CRITICAL RULE:
 * Never import or reference server secrets (SUPABASE_SERVICE_ROLE_KEY, etc.) here.
 */

export interface ClientEnv {
  supabaseUrl: string;
  supabasePublishableKey: string;
  publicSiteUrl: string;
  isDemoMode: boolean;
  recaptchaSiteKey: string;
  vapidPublicKey: string;
  isSupabaseConfigured: boolean;
}

function parseBoolean(val: unknown, fallback = false): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const normalized = val.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
  }
  return fallback;
}

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();
const publicSiteUrl = (import.meta.env.VITE_PUBLIC_SITE_URL || '').trim();
const isDemoMode = parseBoolean(import.meta.env.VITE_DEMO_MODE, false);
const recaptchaSiteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY || '').trim();
const vapidPublicKey = (import.meta.env.VITE_VAPID_PUBLIC_KEY || '').trim();

// Supabase is considered configured only if both URL and publishable key are present
const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabasePublishableKey && 
  supabaseUrl.startsWith('http')
);

export const env: ClientEnv = {
  supabaseUrl,
  supabasePublishableKey,
  publicSiteUrl,
  isDemoMode,
  recaptchaSiteKey,
  vapidPublicKey,
  isSupabaseConfigured,
};

export default env;
