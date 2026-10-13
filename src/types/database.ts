/**
 * Supabase Database Types - Phase 1 Foundation
 */

export type UserRole = 'super_admin' | 'staff';

export interface Profile {
  id: string;
  display_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PhoneNumberSetting {
  label: string;
  number_e164: string;
  display: string;
  is_primary: boolean;
  whatsapp: boolean;
}

export interface SiteSettingsPublic<T = unknown> {
  key: string;
  value: T;
  updated_at: string;
}

export interface SiteSettingsPrivate<T = unknown> {
  key: string;
  value: T;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      site_settings_public: {
        Row: SiteSettingsPublic;
        Insert: SiteSettingsPublic;
        Update: Partial<SiteSettingsPublic>;
      };
      site_settings_private: {
        Row: SiteSettingsPrivate;
        Insert: SiteSettingsPrivate;
        Update: Partial<SiteSettingsPrivate>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<AuditLog>;
      };
    };
  };
}
