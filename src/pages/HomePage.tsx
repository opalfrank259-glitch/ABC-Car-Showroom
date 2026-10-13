import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Car, Shield, BadgeCheck, MapPin } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext.tsx';
import { Seo } from '../components/Seo.tsx';
import { BusinessHoursStatus } from '../components/ui/BusinessHoursStatus.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { Card, CardBody } from '../components/ui/Card.tsx';
import { settingsService, analyticsService, type PublicSiteSettings } from '../services/index.ts';
import { getTelUrl, getWhatsAppUrl, GENERAL_WHATSAPP_MESSAGE } from '../utils/phone.ts';

export const HomePage: React.FC = () => {
  const { t } = useI18n();
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null);

  useEffect(() => {
    const unsub = settingsService.subscribe((s) => setSettings(s));
    return unsub;
  }, []);

  const primaryPhone = settings?.phones.find((p) => p.is_primary) || settings?.phones[0];

  const handleCall = () => {
    analyticsService.logContactEvent({ channel: 'call', source: 'home_hero_cta', vehicleId: null });
  };

  const handleWhatsApp = () => {
    analyticsService.logContactEvent({ channel: 'whatsapp', source: 'home_hero_cta', vehicleId: null });
  };

  return (
    <div className="space-y-8">
      <Seo
        title={settings?.showroom_name || t('common.showroomName')}
        description={t('home.subtitle')}
      />

      {/* Hero Welcome Banner */}
      <section className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-10 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#C8102E] border border-red-200">
                <BadgeCheck className="w-3.5 h-3.5" />
                {t('home.badge')}
              </span>
              {/* Live Hours Badge (renders if hours are loaded) */}
              <BusinessHoursStatus schedule={settings?.business_hours || null} />
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#14161C] leading-tight">
              {settings?.showroom_name || t('common.showroomName')}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('home.subtitle')}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
              <span>{settings?.city || t('common.city')}</span>
            </div>
          </div>

          {/* Quick Contact CTAs in Hero */}
          {primaryPhone && (
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
              <a
                href={getTelUrl(primaryPhone.number_e164)}
                onClick={handleCall}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#14161C] hover:bg-black text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Phone className="w-4 h-4 rtl-flip" />
                <span>{t('home.callAction')}</span>
              </a>

              {primaryPhone.whatsapp && (
                <a
                  href={getWhatsAppUrl(
                    primaryPhone.number_e164,
                    settings?.whatsapp_message_general || GENERAL_WHATSAPP_MESSAGE
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsApp}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{t('home.whatsappAction')}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Honest Empty Inventory State (PRD: No Fake Cars) */}
      <section aria-labelledby="inventory-status-heading">
        <h2 id="inventory-status-heading" className="sr-only">
          {t('home.emptyCarsTitle')}
        </h2>
        <EmptyState
          icon={<Car className="w-12 h-12 mx-auto stroke-1 text-gray-400" />}
          title={t('home.emptyCarsTitle')}
          description={t('home.emptyCarsDesc')}
          className="py-12"
          action={
            primaryPhone ? (
              <a
                href={getTelUrl(primaryPhone.number_e164)}
                onClick={handleCall}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14161C] text-white text-xs font-medium hover:bg-black transition-colors"
              >
                <Phone className="w-3.5 h-3.5 rtl-flip" />
                <span>{primaryPhone.display}</span>
              </a>
            ) : undefined
          }
        />
      </section>

      {/* Showroom Values Section */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-[#14161C]">
          {t('home.featuresTitle')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardBody className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-[#C8102E] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#14161C]">
                {t('home.featureInspection')}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t('home.featureInspectionDesc')}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#1F9D55] flex items-center justify-center">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#14161C]">
                {t('home.featurePricing')}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t('home.featurePricingDesc')}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#E0A800] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#14161C]">
                {t('home.featureLocal')}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t('home.featureLocalDesc')}
              </p>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
};
