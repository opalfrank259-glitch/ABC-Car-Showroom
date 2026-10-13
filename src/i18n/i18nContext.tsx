import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { SupportedLanguage } from '../services/contracts/preferences.ts';
import { preferencesService } from '../services/index.ts';

import en from './en.json';
import romanUr from './roman-ur.json';
import ur from './ur.json';
import skr from './skr.json';

type Dictionary = Record<string, any>;

const DICTIONARIES: Record<SupportedLanguage, Dictionary> = {
  en,
  'roman-ur': romanUr,
  ur,
  skr,
};

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'roman-ur', name: 'Roman Urdu', nativeName: 'Roman Urdu', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
  { code: 'skr', name: 'Saraiki', nativeName: 'سرائیکی', dir: 'rtl' },
];

export interface I18nContextValue {
  language: SupportedLanguage;
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: SupportedLanguage) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  languages: LanguageInfo[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getNestedValue(obj: Dictionary, path: string): string | undefined {
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current === undefined || current === null || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return preferencesService.getPreferences().language || 'en';
  });

  const direction: 'ltr' | 'rtl' = (language === 'ur' || language === 'skr') ? 'rtl' : 'ltr';

  useEffect(() => {
    // Synchronize HTML attributes for accessibility and layout direction
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = language === 'roman-ur' ? 'ur-Latn' : language;
    }
  }, [language, direction]);

  useEffect(() => {
    const unsubscribe = preferencesService.subscribe((prefs) => {
      setLanguageState(prefs.language);
    });
    return unsubscribe;
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    preferencesService.setLanguage(lang);
    setLanguageState(lang);
  };

  const t = useMemo(() => {
    return (path: string, params?: Record<string, string | number>): string => {
      let val: string | undefined = undefined;

      // 1. Try active language
      val = getNestedValue(DICTIONARIES[language], path);

      // 2. Saraiki fallback chain: skr -> ur -> en
      if (!val && language === 'skr') {
        val = getNestedValue(DICTIONARIES['ur'], path);
      }

      // 3. Fallback to English
      if (!val && language !== 'en') {
        val = getNestedValue(DICTIONARIES['en'], path);
      }

      // 4. Return path if totally missing
      if (!val) {
        val = path;
      }

      // Handle variable interpolation e.g. {{time}}, {{hours}}
      if (params && typeof val === 'string') {
        return Object.entries(params).reduce((acc, [key, replacement]) => {
          return acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(replacement));
        }, val);
      }

      return val;
    };
  }, [language]);

  const value: I18nContextValue = {
    language,
    direction,
    setLanguage,
    t,
    languages: SUPPORTED_LANGUAGES,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
