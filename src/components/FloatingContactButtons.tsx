import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { settingsService, analyticsService, type PublicSiteSettings } from '../services/index.ts';
import { getTelUrl, getWhatsAppUrl, GENERAL_WHATSAPP_MESSAGE } from '../utils/phone.ts';
import { useI18n } from '../i18n/i18nContext.tsx';

export const FloatingContactButtons: React.FC = () => {
  const { t } = useI18n();
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null);

  useEffect(() => {
    const unsub = settingsService.subscribe((s) => setSettings(s));
    return unsub;
  }, []);

  const primaryPhone = settings?.phones.find((p) => p.is_primary) || settings?.phones[0];
  if (!primaryPhone) {
    return null;
  }

  const handleCallClick = () => {
    analyticsService.logContactEvent({
      channel: 'call',
      source: 'floating_button',
      vehicleId: null,
    });
  };

  const handleWhatsAppClick = () => {
    analyticsService.logContactEvent({
      channel: 'whatsapp',
      source: 'floating_button',
      vehicleId: null,
    });
  };

  const telUrl = getTelUrl(primaryPhone.number_e164);
  const waUrl = getWhatsAppUrl(
    primaryPhone.number_e164,
    settings?.whatsapp_message_general || GENERAL_WHATSAPP_MESSAGE
  );

  return (
    <div
      role="complementary"
      aria-label="Direct contact options"
      className="fixed bottom-6 end-6 z-30 flex flex-col items-end gap-3 select-none pb-safe"
    >
      {/* Phone Call Button */}
      <a
        href={telUrl}
        onClick={handleCallClick}
        aria-label={`${t('common.callUs')}: ${primaryPhone.display}`}
        className="w-12 h-12 rounded-full bg-[#14161C] text-white flex items-center justify-center shadow-lg hover:bg-black active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#14161C] group"
      >
        <Phone className="w-5 h-5 rtl-flip" />
        <span className="sr-only">{t('common.callUs')}</span>
      </a>

      {/* WhatsApp Button */}
      {primaryPhone.whatsapp && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          aria-label={`${t('common.whatsappUs')}: ${primaryPhone.display}`}
          className="w-13 h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:bg-[#20ba59] active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] group"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="sr-only">{t('common.whatsappUs')}</span>
        </a>
      )}
    </div>
  );
};
