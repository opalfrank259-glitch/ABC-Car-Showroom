import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext.tsx';
import { preferencesService } from '../services/index.ts';
import type { ConsentStatus } from '../services/contracts/preferences.ts';
import { Button } from './ui/Button.tsx';

export const ConsentBanner: React.FC = () => {
  const { t } = useI18n();
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(() => {
    return preferencesService.getPreferences().consent;
  });

  useEffect(() => {
    const unsub = preferencesService.subscribe((prefs) => {
      setConsentStatus(prefs.consent);
    });
    return unsub;
  }, []);

  if (consentStatus !== 'pending') {
    return null;
  }

  const handleAccept = () => {
    preferencesService.setConsent('accepted');
  };

  const handleDecline = () => {
    preferencesService.setConsent('declined');
  };

  return (
    <aside
      role="region"
      aria-label={t('consent.title')}
      className="fixed bottom-0 inset-x-0 z-40 p-4 sm:p-5 bg-white/95 backdrop-blur-xs border-t border-gray-200 shadow-2xl transition-all"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1F9D55] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#14161C]">{t('consent.title')}</h4>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              {t('consent.description')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDecline}
            className="flex-1 sm:flex-initial"
          >
            {t('consent.decline')}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleAccept}
            className="flex-1 sm:flex-initial"
          >
            {t('consent.accept')}
          </Button>
        </div>
      </div>
    </aside>
  );
};
