/**
 * Phone Number & WhatsApp Helpers (PRD 5.2, 5.3)
 * Standardizes E.164, local Pakistani display format (03XX-XXXXXXX),
 * tel: links, and prefilled wa.me links.
 */

export const GENERAL_WHATSAPP_MESSAGE = 'Hi, I would like to know about your cars.';

/**
 * Converts E.164 Pakistan mobile number (+923271126457) to standard local display format (0327-1126457).
 */
export function formatPhoneDisplay(numberE164: string): string {
  if (!numberE164) return '';
  const clean = numberE164.replace(/[^\d+]/g, '');

  // +923271126457 -> 0327-1126457
  if (clean.startsWith('+92') && clean.length === 13) {
    const local = '0' + clean.slice(3);
    return `${local.slice(0, 4)}-${local.slice(4)}`;
  }

  // 923271126457 -> 0327-1126457
  if (clean.startsWith('92') && clean.length === 12) {
    const local = '0' + clean.slice(2);
    return `${local.slice(0, 4)}-${local.slice(4)}`;
  }

  // 03271126457 -> 0327-1126457
  if (clean.startsWith('03') && clean.length === 11) {
    return `${clean.slice(0, 4)}-${clean.slice(4)}`;
  }

  return numberE164;
}

/**
 * Returns canonical tel: link for click-to-call.
 */
export function getTelUrl(numberE164: string): string {
  if (!numberE164) return '#';
  const clean = numberE164.replace(/[^\d+]/g, '');
  return `tel:${clean}`;
}

/**
 * Returns WhatsApp click-to-chat URL with prefilled text (PRD 5.2).
 * e.g. https://wa.me/923271126457?text=Hi%2C%20I%20would%20like...
 */
export function getWhatsAppUrl(numberE164: string, messageText: string = GENERAL_WHATSAPP_MESSAGE): string {
  if (!numberE164) return '#';
  // Strip + and non-digits for wa.me URL format
  let digits = numberE164.replace(/[^\d]/g, '');
  if (digits.startsWith('03')) {
    digits = '92' + digits.slice(1);
  }
  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${digits}?text=${encodedText}`;
}
