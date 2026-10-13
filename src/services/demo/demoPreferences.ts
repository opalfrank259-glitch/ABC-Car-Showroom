import type {
  ConsentStatus,
  PreferencesRepository,
  SupportedLanguage,
  UserPreferences,
} from '../contracts/preferences.ts';

const PREFERENCES_STORAGE_KEY = 'abc_showroom_user_preferences_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  consent: 'pending',
};

class DemoPreferencesRepository implements PreferencesRepository {
  private prefs: UserPreferences;
  private listeners: Set<(prefs: UserPreferences) => void> = new Set();

  constructor() {
    this.prefs = this.loadFromStorage();
  }

  private loadFromStorage(): UserPreferences {
    if (typeof window === 'undefined') return { ...DEFAULT_PREFERENCES };
    try {
      const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch {
      // ignore
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private saveToStorage(prefs: UserPreferences): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.prefs);
    }
  }

  getPreferences(): UserPreferences {
    return { ...this.prefs };
  }

  setLanguage(lang: SupportedLanguage): void {
    this.prefs = { ...this.prefs, language: lang };
    this.saveToStorage(this.prefs);
    this.notify();
  }

  setConsent(status: ConsentStatus): void {
    this.prefs = {
      ...this.prefs,
      consent: status,
      consentTimestamp: new Date().toISOString(),
    };
    this.saveToStorage(this.prefs);
    this.notify();
  }

  subscribe(listener: (prefs: UserPreferences) => void): () => void {
    this.listeners.add(listener);
    listener(this.prefs);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const demoPreferencesRepository = new DemoPreferencesRepository();
