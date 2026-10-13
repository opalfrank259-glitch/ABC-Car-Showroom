import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Menu, X, Phone, ShieldCheck, Activity, Palette } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext.tsx';
import { LanguageSwitcher } from '../components/LanguageSwitcher.tsx';
import { ConsentBanner } from '../components/ConsentBanner.tsx';
import { FloatingContactButtons } from '../components/FloatingContactButtons.tsx';
import { BusinessHoursStatus } from '../components/ui/BusinessHoursStatus.tsx';
import { DemoWatermark } from '../components/ui/DemoWatermark.tsx';
import { settingsService, analyticsService, type PublicSiteSettings } from '../services/index.ts';
import { getTelUrl } from '../utils/phone.ts';

export const RootLayout: React.FC = () => {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null);

  useEffect(() => {
    const unsub = settingsService.subscribe((s) => setSettings(s));
    return unsub;
  }, []);

  const primaryPhone = settings?.phones.find((p) => p.is_primary) || settings?.phones[0];

  const handleHeaderCallClick = () => {
    analyticsService.logContactEvent({
      channel: 'call',
      source: 'header_call_button',
      vehicleId: null,
    });
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/cars', label: t('nav.cars') },
    { to: '/sold', label: t('nav.sold') },
    { to: '/sell', label: t('nav.sellYourCar') },
    { to: '/finance', label: t('nav.finance') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const devLinks = [
    { to: '/status', label: t('nav.status'), icon: <Activity className="w-3.5 h-3.5 text-[#1F9D55]" /> },
    { to: '/design', label: t('nav.design'), icon: <Palette className="w-3.5 h-3.5 text-[#C8102E]" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#14161C] relative">
      {/* Top Demo Banner */}
      <DemoWatermark />

      {/* Main Header */}
      <header className="bg-[#14161C] text-white border-b border-gray-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between gap-3">
          {/* Logo Slot */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-[#C8102E] flex items-center justify-center font-bold text-white text-base tracking-wider shadow-xs group-hover:bg-[#a60d26] transition-colors">
              {settings?.stock_prefix || 'ABC'}
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight block text-white leading-tight">
                {settings?.showroom_name || t('common.showroomName')}
              </span>
              <span className="text-[11px] text-gray-400 block">
                {settings?.city || t('common.city')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-xs xl:text-sm font-medium">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Header Actions: Business Hours, Call Button, Language Switcher, Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Real-time Business Hours Indicator (only renders if hours are configured) */}
            <div className="hidden sm:block">
              <BusinessHoursStatus schedule={settings?.business_hours || null} />
            </div>

            {/* Call Action Button */}
            {primaryPhone && (
              <a
                href={getTelUrl(primaryPhone.number_e164)}
                onClick={handleHeaderCallClick}
                className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[#C8102E] hover:bg-[#a60d26] text-white text-xs font-semibold tracking-wide transition-colors shadow-2xs"
                title={`${t('common.callUs')}: ${primaryPhone.display}`}
              >
                <Phone className="w-3.5 h-3.5 rtl-flip" />
                <span>{primaryPhone.display}</span>
              </a>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.menu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-800 bg-[#14161C] px-4 py-4 space-y-3">
            {/* Business Hours in Mobile Drawer */}
            <div className="pb-2 border-b border-gray-800">
              <BusinessHoursStatus schedule={settings?.business_hours || null} />
            </div>

            <div className="flex flex-col space-y-1">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center transition-colors ${
                      isActive ? 'bg-white/15 text-white font-semibold' : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-800 flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 px-3 font-semibold">
                Dev &amp; Diagnostics
              </span>
              {devLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] px-3 py-2.5 rounded-lg text-xs text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Mobile Call CTA */}
            {primaryPhone && (
              <div className="pt-2">
                <a
                  href={getTelUrl(primaryPhone.number_e164)}
                  onClick={handleHeaderCallClick}
                  className="w-full min-h-[44px] rounded-lg bg-[#C8102E] text-white flex items-center justify-center gap-2 text-sm font-semibold py-2.5 shadow-sm"
                >
                  <Phone className="w-4 h-4 rtl-flip" />
                  <span>{t('common.callUs')}: {primaryPhone.display}</span>
                </a>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>

      {/* Floating Call & WhatsApp Buttons */}
      <FloatingContactButtons />

      {/* Cookie & Consent Banner */}
      <ConsentBanner />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto pt-8 pb-12 text-sm text-gray-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Showroom Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#C8102E] text-white flex items-center justify-center font-bold text-xs">
                  {settings?.stock_prefix || 'ABC'}
                </div>
                <span className="font-bold text-[#14161C] text-base">
                  {settings?.showroom_name || t('common.showroomName')}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {settings?.city || t('common.city')}
              </p>
              {primaryPhone && (
                <div className="text-xs font-semibold text-[#14161C]">
                  <span>{primaryPhone.label}: </span>
                  <a
                    href={getTelUrl(primaryPhone.number_e164)}
                    className="hover:text-[#C8102E] underline underline-offset-2 transition-colors"
                  >
                    {primaryPhone.display}
                  </a>
                </div>
              )}
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#14161C] mb-3">
                {t('common.quickLinks')}
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/cars" className="hover:text-[#C8102E] transition-colors">{t('nav.cars')}</Link></li>
                <li><Link to="/sold" className="hover:text-[#C8102E] transition-colors">{t('nav.sold')}</Link></li>
                <li><Link to="/sell" className="hover:text-[#C8102E] transition-colors">{t('nav.sellYourCar')}</Link></li>
                <li><Link to="/finance" className="hover:text-[#C8102E] transition-colors">{t('nav.finance')}</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal & Terms */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#14161C] mb-3">
                {t('common.legal')}
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/privacy" className="hover:text-[#C8102E] transition-colors">{t('common.privacyPolicy')}</Link></li>
                <li><Link to="/terms" className="hover:text-[#C8102E] transition-colors">{t('common.termsOfService')}</Link></li>
                <li><Link to="/about" className="hover:text-[#C8102E] transition-colors">{t('nav.about')}</Link></li>
                <li><Link to="/contact" className="hover:text-[#C8102E] transition-colors">{t('nav.contact')}</Link></li>
              </ul>
            </div>

            {/* Column 4: System & Dev Tools */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#14161C] mb-3">
                Development
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/status" className="inline-flex items-center gap-1.5 text-gray-700 hover:text-[#C8102E]">
                    <Activity className="w-3.5 h-3.5 text-[#1F9D55]" />
                    <span>{t('nav.status')}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/design" className="inline-flex items-center gap-1.5 text-gray-700 hover:text-[#C8102E]">
                    <Palette className="w-3.5 h-3.5 text-[#C8102E]" />
                    <span>{t('nav.design')}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1F9D55]" />
              <span>
                &copy; {new Date().getFullYear()} {settings?.showroom_name || t('common.showroomName')}. {t('common.rightsReserved')}
              </span>
            </div>
            <div>
              <span>Phase 2 &bull; Design System &amp; Public Shell</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
