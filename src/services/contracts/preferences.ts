/**
 * Preferences Repository Contract
 * Persists user choices such as active language and cookie/tracking consent.
 */

export type SupportedLanguage = 'en' | 'roman-ur' | 'ur' | 'skr';
export type ConsentStatus = 'pending' | 'accepted' | 'declined';

export interface UserPreferences {
  language: SupportedLanguage;
  consent: ConsentStatus;
  consentTimestamp?: string;
}

export interface PreferencesRepository {
  getPreferences(): UserPreferences;
  setLanguage(lang: SupportedLanguage): void;
  setConsent(status: ConsentStatus): void;
  subscribe(listener: (prefs: UserPreferences) => void): () => void;
}
