import type {
  BusinessHoursSchedule,
  PublicSiteSettings,
  SettingsRepository,
} from '../contracts/settings.ts';

const STORAGE_KEY = 'abc_showroom_demo_settings_v1';

export const DEFAULT_DEMO_SETTINGS: PublicSiteSettings = {
  isDemo: true,
  showroom_name: 'ABC',
  stock_prefix: 'ABC',
  city: 'Sadiqabad, Punjab, Pakistan',
  currency: 'PKR',
  timezone: 'Asia/Karachi',
  phones: [
    {
      label: 'Sales',
      number_e164: '+923271126457',
      display: '0327-1126457',
      is_primary: true,
      whatsapp: true,
    },
  ],
  address: null,
  maps_url: null,
  business_hours: null, // Default is null per PRD
  social_links: null,
  logo_url: null,
  email: null,
  domain: null,
  whatsapp_message_general: 'Hi, I would like to know about your cars.',
};

/**
 * Realistic sample hours schedule for dev testing of open/closed status.
 * Pakistan standard timings: 10:00 - 20:00 with Friday Jumma prayer break 12:30 - 14:30.
 */
export const SAMPLE_DEMO_BUSINESS_HOURS: BusinessHoursSchedule = {
  days: {
    monday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
    tuesday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
    wednesday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
    thursday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
    friday: {
      isOpen: true,
      openTime: '10:00',
      closeTime: '20:00',
      breakStart: '12:30',
      breakEnd: '14:30',
    },
    saturday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
    sunday: { isOpen: true, openTime: '11:00', closeTime: '18:00' },
  },
  holidays: [
    '2026-03-23', // Pakistan Day
    '2026-08-14', // Independence Day
    '2026-12-25', // Quaid-e-Azam Day
  ],
};

class DemoSettingsRepository implements SettingsRepository {
  private settings: PublicSiteSettings;
  private listeners: Set<(settings: PublicSiteSettings) => void> = new Set();

  constructor() {
    this.settings = this.loadFromStorage();
  }

  private loadFromStorage(): PublicSiteSettings {
    if (typeof window === 'undefined') return { ...DEFAULT_DEMO_SETTINGS };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_DEMO_SETTINGS, ...parsed, isDemo: true };
      }
    } catch {
      // Fallback on parse failure
    }
    return { ...DEFAULT_DEMO_SETTINGS };
  }

  private saveToStorage(settings: PublicSiteSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore quota errors in restricted contexts
    }
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.settings);
    }
  }

  async getPublicSettings(): Promise<PublicSiteSettings> {
    return { ...this.settings };
  }

  subscribe(listener: (settings: PublicSiteSettings) => void): () => void {
    this.listeners.add(listener);
    listener(this.settings);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async updatePublicSettings(partial: Partial<PublicSiteSettings>): Promise<PublicSiteSettings> {
    this.settings = { ...this.settings, ...partial, isDemo: true };
    this.saveToStorage(this.settings);
    this.notify();
    return { ...this.settings };
  }

  async resetToDefault(): Promise<PublicSiteSettings> {
    this.settings = { ...DEFAULT_DEMO_SETTINGS };
    this.saveToStorage(this.settings);
    this.notify();
    return { ...this.settings };
  }
}

export const demoSettingsRepository = new DemoSettingsRepository();
