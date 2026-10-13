import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext.tsx';
import { Seo } from '../components/Seo.tsx';
import { settingsService, analyticsService, type PublicSiteSettings } from '../services/index.ts';
import { getTelUrl, getWhatsAppUrl, GENERAL_WHATSAPP_MESSAGE } from '../utils/phone.ts';

export interface ComingSoonPageProps {
  pageTitleKey?: string;
  defaultTitle?: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  pageTitleKey,
  defaultTitle = 'Coming Soon',
}) => {
  const { t } = useI18n();
  const [settings, setSettings] = React.useState<PublicSiteSettings | null>(null);

  React.useEffect(() => {
    const unsub = settingsService.subscribe((s) => setSettings(s));
    return unsub;
  }, []);

  const title = pageTitleKey ? t(pageTitleKey) : defaultTitle;
  const primaryPhone = settings?.phones.find((p) => p.is_primary) || settings?.phones[0];

  const handleCall = () => {
    analyticsService.logContactEvent({ channel: 'call', source: 'coming_soon_page', vehicleId: null });
  };

  const handleWhatsApp = () => {
    analyticsService.logContactEvent({ channel: 'whatsapp', source: 'coming_soon_page', vehicleId: null });
  };

  return (
    <div className="py-12 px-4 max-w-2xl mx-auto text-center">
      <Seo title={title} description={t('common.comingSoonDesc')} />

      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#E0A800] border border-amber-200 flex items-center justify-center mx-auto mb-5 shadow-xs">
        <Sparkles className="w-8 h-8" />
      </div>

      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 mb-3">
        {t('common.comingSoon')}
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#14161C] tracking-tight">
        {title}
      </h1>

      <p className="mt-3 text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
        {t('common.comingSoonDesc')}
      </p>

      {/* Showroom Contact CTA */}
      {primaryPhone && (
        <div className="mt-8 p-5 bg-white rounded-xl border border-gray-200 shadow-2xs max-w-md mx-auto">
          <p className="text-xs text-gray-500 mb-3">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <a
              href={getTelUrl(primaryPhone.number_e164)}
              onClick={handleCall}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#14161C] text-white text-xs font-medium hover:bg-black transition-colors"
            >
              <Phone className="w-3.5 h-3.5 rtl-flip" />
              <span>{t('common.callUs')}: {primaryPhone.display}</span>
            </a>
            {primaryPhone.whatsapp && (
              <a
                href={getWhatsAppUrl(primaryPhone.number_e164, settings?.whatsapp_message_general || GENERAL_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white text-xs font-medium hover:bg-[#20ba59] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>{t('common.whatsappUs')}</span>
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#14161C] hover:text-[#C8102E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl-flip" />
          <span>{t('common.backHome')}</span>
        </Link>
      </div>
    </div>
  );
};
