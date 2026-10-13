import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout.tsx';
import { HomePage } from '../pages/HomePage.tsx';
import { StatusPage } from '../pages/StatusPage.tsx';
import { DesignShowcasePage } from '../pages/DesignShowcasePage.tsx';
import { ComingSoonPage } from '../pages/ComingSoonPage.tsx';
import { NotFoundPage } from '../pages/NotFoundPage.tsx';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="status" element={<StatusPage />} />
          <Route path="design" element={<DesignShowcasePage />} />

          {/* Placeholder routes pointing to ComingSoonPage per PRD Phase 2 */}
          <Route path="cars" element={<ComingSoonPage pageTitleKey="nav.cars" />} />
          <Route path="sold" element={<ComingSoonPage pageTitleKey="nav.sold" />} />
          <Route path="sell" element={<ComingSoonPage pageTitleKey="nav.sellYourCar" />} />
          <Route path="finance" element={<ComingSoonPage pageTitleKey="nav.finance" />} />
          <Route path="about" element={<ComingSoonPage pageTitleKey="nav.about" />} />
          <Route path="contact" element={<ComingSoonPage pageTitleKey="nav.contact" />} />
          <Route path="privacy" element={<ComingSoonPage pageTitleKey="common.privacyPolicy" />} />
          <Route path="terms" element={<ComingSoonPage pageTitleKey="common.termsOfService" />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
