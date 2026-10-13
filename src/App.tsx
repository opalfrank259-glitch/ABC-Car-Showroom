/**
 * ABC Car Showroom - Phase 2 Public Shell & Design System
 */

import { I18nProvider } from './i18n/i18nContext.tsx';
import { ToastProvider } from './components/ui/Toast.tsx';
import { AppRouter } from './app/AppRouter.tsx';

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </I18nProvider>
  );
}
