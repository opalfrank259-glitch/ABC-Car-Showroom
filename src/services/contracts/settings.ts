/**
 * Settings Repository Contract
 * Defines domain types and access methods for showroom settings.
 */

export interface PhoneNumberSetting {
  label: string;
  number_e164: string;
  display: string;
  is_primary: boolean;
  whatsapp: boolean;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime: string;   // "09:00" (24h format)
  closeTime: string;  // "20:00"
  breakStart?: string; // e.g. "13:00"
  breakEnd?: string;   // e.g. "14:00"
}

export interface BusinessHoursSchedule {
  days: {
    monday?: DaySchedule;
    tuesday?: DaySchedule;
    wednesday?: DaySchedule;
    thursday?: DaySchedule;
    friday?: DaySchedule; // Often has Jumma break (e.g. 12:30 - 14:30)
    saturday?: DaySchedule;
    sunday?: DaySchedule;
  };
  holidays?: string[]; // ISO YYYY-MM-DD
}

export interface PublicSiteSettings {
  isDemo: boolean;
  showroom_name: string;
  stock_prefix: string;
  city: string;
  currency: string;
  timezone: string;
  phones: PhoneNumberSetting[];
  address: string | null;
  maps_url: string | null;
  business_hours: BusinessHoursSchedule | null;
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  } | null;
  logo_url: string | null;
  email: string | null;
  domain: string | null;
  whatsapp_message_general?: string;
}

export interface SettingsRepository {
  getPublicSettings(): Promise<PublicSiteSettings>;
  subscribe(listener: (settings: PublicSiteSettings) => void): () => void;
  // Dev / Admin helper to mutate demo settings (e.g. toggle sample business hours)
  updatePublicSettings(partial: Partial<PublicSiteSettings>): Promise<PublicSiteSettings>;
  resetToDefault(): Promise<PublicSiteSettings>;
}
