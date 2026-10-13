import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useI18n, SUPPORTED_LANGUAGES } from '../i18n/i18nContext.tsx';
import type { SupportedLanguage } from '../services/contracts/preferences.ts';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className="min-h-[40px] px-2.5 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Switch language"
      >
        <Globe className="w-3.5 h-3.5 text-gray-300" />
        <span className="font-semibold">{currentLang.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-gray-300" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute end-0 mt-1.5 w-40 rounded-xl border border-gray-200 bg-white shadow-xl py-1.5 z-50 text-xs text-[#14161C] focus:outline-none"
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                role="menuitem"
                onClick={() => handleSelect(lang.code)}
                type="button"
                className={`w-full text-start px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected ? 'bg-gray-100 font-bold text-[#C8102E]' : 'hover:bg-gray-50'
                }`}
              >
                <span>{lang.nativeName}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{lang.code}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
