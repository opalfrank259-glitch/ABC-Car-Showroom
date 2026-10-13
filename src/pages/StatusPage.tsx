import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Database, 
  Server, 
  Phone, 
  CheckSquare, 
  Terminal,
  Globe,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { env } from '../config/env.ts';
import { useI18n } from '../i18n/i18nContext.tsx';
import { Seo } from '../components/Seo.tsx';
import { Button } from '../components/ui/Button.tsx';
import { BusinessHoursStatus } from '../components/ui/BusinessHoursStatus.tsx';
import { 
  settingsService, 
  preferencesService, 
  ACTIVE_DATA_ADAPTER, 
  type PublicSiteSettings,
  type ConsentStatus 
} from '../services/index.ts';
import { SAMPLE_DEMO_BUSINESS_HOURS } from '../services/demo/demoSettings.ts';

interface ApiHealthResponse {
  ok?: boolean;
  service?: string;
  time?: string;
  env?: {
    supabaseUrlSet: boolean;
    serviceRoleSet: boolean;
  };
  error?: string;
}

interface ApiHealthState {
  loading: boolean;
  checked: boolean;
  ok: boolean;
  data: ApiHealthResponse | null;
  error: string | null;
}

export const StatusPage: React.FC = () => {
  const { t, language, direction } = useI18n();

  const [settings, setSettings] = useState<PublicSiteSettings | null>(null);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [loadingHoursToggle, setLoadingHoursToggle] = useState<boolean>(false);

  const [apiState, setApiState] = useState<ApiHealthState>({
    loading: true,
    checked: false,
    ok: false,
    data: null,
    error: null,
  });

  const checkApiHealth = useCallback(async () => {
    setApiState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const json: ApiHealthResponse = await response.json();
        setApiState({
          loading: false,
          checked: true,
          ok: json.ok === true,
          data: json,
          error: null,
        });
      } else {
        setApiState({
          loading: false,
          checked: true,
          ok: false,
          data: null,
          error: `HTTP ${response.status} ${response.statusText} — Endpoint requires Vercel serverless environment`,
        });
      }
    } catch (_err) {
      setApiState({
        loading: false,
        checked: true,
        ok: false,
        data: null,
        error: 'Fetch failed (Expected in preview: Vercel Functions run after deployment)',
      });
    }
  }, []);

  useEffect(() => {
    const unsubSettings = settingsService.subscribe((s) => setSettings(s));
    const unsubPrefs = preferencesService.subscribe((p) => setConsentStatus(p.consent));
    checkApiHealth();

    return () => {
      unsubSettings();
      unsubPrefs();
    };
  }, [checkApiHealth]);

  const handleToggleSampleHours = async (enable: boolean) => {
    setLoadingHoursToggle(true);
    try {
      if (enable) {
        await settingsService.updatePublicSettings({
          business_hours: SAMPLE_DEMO_BUSINESS_HOURS,
        });
      } else {
        await settingsService.updatePublicSettings({
          business_hours: null,
        });
      }
    } finally {
      setLoadingHoursToggle(false);
    }
  };

  const primaryPhone = settings?.phones.find((p) => p.is_primary) || settings?.phones[0];

  return (
    <div className="space-y-6">
      <Seo title={t('status.title')} description={t('status.subtitle')} noindex={true} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#14161C]">
            {t('status.title')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {t('status.subtitle')}
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          onClick={() => checkApiHealth()}
          isLoading={apiState.loading}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 rtl-flip" />}
        >
          {t('status.runDiagnostics')}
        </Button>
      </div>

      {/* Diagnostics List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs divide-y divide-gray-100">
        {/* Item 1: App Build */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-emerald-100 text-[#1F9D55] mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">{t('status.appBuild')}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{t('status.appBuildDesc')}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#1F9D55] border border-emerald-200 shrink-0">
            {t('status.ok')}
          </span>
        </div>

        {/* Item 2: Active Data Adapter */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-blue-100 text-blue-700 mt-0.5">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">{t('status.dataAdapter')}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{t('status.dataAdapterDesc')}</p>
              <div className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded p-2 text-gray-700 font-mono">
                Active Adapter: <strong className="text-blue-700">{ACTIVE_DATA_ADAPTER}</strong> (in-memory + localStorage repository)
              </div>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0 uppercase">
            {ACTIVE_DATA_ADAPTER}
          </span>
        </div>

        {/* Item 3: Demo Mode Flag */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-amber-100 text-[#E0A800] mt-0.5">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">{t('status.demoMode')}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{t('status.demoModeDesc')}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-[#E0A800] border border-amber-200 shrink-0">
            ACTIVE
          </span>
        </div>

        {/* Item 4: Language & Direction */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-purple-100 text-purple-700 mt-0.5">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">{t('status.i18nState')}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{t('status.i18nStateDesc')}</p>
              <div className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded p-2 text-gray-700">
                <span>Active Language: <strong>{language}</strong> ({t(`common.${language === 'roman-ur' ? 'romanUrdu' : language}`)})</span> &bull; 
                <span className="ms-1.5">Direction: <strong>{direction.toUpperCase()}</strong></span>
              </div>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 shrink-0 uppercase">
            {language} ({direction})
          </span>
        </div>

        {/* Item 5: Consent State */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-emerald-100 text-[#1F9D55] mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">{t('status.consentState')}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{t('status.consentStateDesc')}</p>
              <div className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded p-2 text-gray-700">
                Consent: <strong className="capitalize">{consentStatus}</strong>
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 uppercase ${
            consentStatus === 'accepted'
              ? 'bg-emerald-50 text-[#1F9D55] border border-emerald-200'
              : consentStatus === 'declined'
              ? 'bg-gray-100 text-gray-700 border border-gray-300'
              : 'bg-amber-50 text-[#E0A800] border border-amber-200'
          }`}>
            {consentStatus}
          </span>
        </div>

        {/* Item 6: Business Hours & Dev Toggle */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-blue-100 text-blue-700 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#14161C]">{t('status.businessHours')}</h3>
              <p className="text-xs text-gray-600">{t('status.businessHoursDesc')}</p>

              {/* Dev-Only Sample Hours Controls */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                {settings?.business_hours ? (
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={loadingHoursToggle}
                    onClick={() => handleToggleSampleHours(false)}
                  >
                    {t('status.unloadHoursBtn')}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    isLoading={loadingHoursToggle}
                    onClick={() => handleToggleSampleHours(true)}
                  >
                    {t('status.loadHoursBtn')}
                  </Button>
                )}
                {settings?.business_hours && (
                  <BusinessHoursStatus schedule={settings.business_hours} />
                )}
              </div>

              <div className="text-xs text-gray-500 italic">
                {settings?.business_hours ? t('status.hoursLoadedNotice') : t('status.hoursNullNotice')}
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
            settings?.business_hours 
              ? 'bg-emerald-50 text-[#1F9D55] border border-emerald-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
            {settings?.business_hours ? 'LOADED' : 'NULL (DEFAULT)'}
          </span>
        </div>

        {/* Item 7: Primary Phone from Settings */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-emerald-100 text-[#1F9D55] mt-0.5">
              <Phone className="w-5 h-5 rtl-flip" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">{t('status.phoneSetting')}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{t('status.phoneSettingDesc')}</p>
              <div className="mt-2 text-xs">
                {primaryPhone ? (
                  <span className="font-mono text-sm font-bold text-[#14161C] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
                    {primaryPhone.display} ({primaryPhone.label})
                  </span>
                ) : (
                  <span className="text-gray-500 italic">{t('status.notLoaded')}</span>
                )}
              </div>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#1F9D55] border border-emerald-200 shrink-0">
            {primaryPhone ? 'LOADED' : 'PENDING'}
          </span>
        </div>

        {/* Item 8: Vercel /api/health */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-full ${apiState.ok ? 'bg-emerald-100 text-[#1F9D55]' : 'bg-gray-100 text-gray-500'} mt-0.5`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#14161C]">{t('status.vercelHealth')}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{t('status.vercelHealthNotice')}</p>
              <div className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded p-2 text-gray-600">
                {apiState.loading ? (
                  <span>Evaluating /api/health...</span>
                ) : apiState.ok ? (
                  <span className="text-[#1F9D55] font-semibold">Service live: {apiState.data?.service}</span>
                ) : (
                  <span>Status: {apiState.error}</span>
                )}
              </div>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 shrink-0">
            PHASE 14
          </span>
        </div>
      </div>

      {/* Security Hygiene Notice */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-2">
        <h4 className="text-sm font-semibold text-[#14161C] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#C8102E]" />
          Zero Secrets Policy &bull; Frontend-First Isolation
        </h4>
        <p className="text-xs text-gray-600 leading-relaxed">
          The application operates in full preview mode with the Demo Data Layer. No secrets, private API keys, or database credentials are bound or required in the client bundle.
        </p>
      </div>
    </div>
  );
};
