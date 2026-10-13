import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.ts';
import type { PhoneNumberSetting, SiteSettingsPublic } from '../types/database.ts';

export interface SettingsCheckResult {
  configured: boolean;
  connected: boolean;
  message: string;
  primaryPhone: string | null;
  settings: Record<string, unknown> | null;
  errorDetail?: string;
}

/**
 * Harmless read of public settings table to test Supabase client connectivity
 * and fetch public showroom parameters (such as primary phone number).
 */
export async function checkSupabaseConnection(): Promise<SettingsCheckResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      configured: false,
      connected: false,
      message: 'Supabase is not configured yet (missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY)',
      primaryPhone: null,
      settings: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from('site_settings_public')
      .select('key, value, updated_at');

    if (error) {
      return {
        configured: true,
        connected: false,
        message: `Connected to Supabase endpoint, but table query returned an error: ${error.message}`,
        primaryPhone: null,
        settings: null,
        errorDetail: error.message,
      };
    }

    const settingsMap: Record<string, unknown> = {};
    let primaryPhone: string | null = null;

    if (Array.isArray(data)) {
      for (const row of data as SiteSettingsPublic[]) {
        settingsMap[row.key] = row.value;
        if (row.key === 'phones' && Array.isArray(row.value)) {
          const phones = row.value as PhoneNumberSetting[];
          const primary = phones.find((p) => p.is_primary) || phones[0];
          if (primary) {
            primaryPhone = primary.display || primary.number_e164;
          }
        }
      }
    }

    return {
      configured: true,
      connected: true,
      message: 'Successfully connected to Supabase and verified site_settings_public table read access.',
      primaryPhone,
      settings: settingsMap,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      configured: true,
      connected: false,
      message: `Failed to query Supabase: ${errorMessage}`,
      primaryPhone: null,
      settings: null,
      errorDetail: errorMessage,
    };
  }
}
