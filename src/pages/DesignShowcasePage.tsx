import React, { useState } from 'react';
import { useI18n } from '../i18n/i18nContext.tsx';
import { Seo } from '../components/Seo.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Badge, type BadgeVariant } from '../components/ui/Badge.tsx';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Textarea } from '../components/ui/Textarea.tsx';
import { Select } from '../components/ui/Select.tsx';
import { Checkbox } from '../components/ui/Checkbox.tsx';
import { FormField } from '../components/ui/FormField.tsx';
import { Modal } from '../components/ui/Modal.tsx';
import { Skeleton } from '../components/ui/Skeleton.tsx';
import { useToast } from '../components/ui/Toast.tsx';
import { LoadingState } from '../components/LoadingState.tsx';
import { ErrorState } from '../components/ErrorState.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { BusinessHoursStatus } from '../components/ui/BusinessHoursStatus.tsx';
import { SAMPLE_DEMO_BUSINESS_HOURS } from '../services/demo/demoSettings.ts';
import { Mail, Phone, Sparkles } from 'lucide-react';

export const DesignShowcasePage: React.FC = () => {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const badgeVariants: BadgeVariant[] = [
    'featured',
    'hotDeal',
    'new',
    'priceDrop',
    'reserved',
    'sold',
    'verified',
  ];

  return (
    <div className="space-y-10 pb-12">
      <Seo title={t('design.title')} description={t('design.subtitle')} noindex={true} />

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
          Dev Utility &bull; noindex
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#14161C] tracking-tight">
          {t('design.title')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {t('design.subtitle')}
        </p>
      </div>

      {/* 1. Buttons */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#14161C] border-b border-gray-200 pb-2">
          {t('design.buttons')}
        </h2>
        <Card>
          <CardBody className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Variants (44px min tap target)</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">{t('design.primaryBtn')}</Button>
                <Button variant="secondary">{t('design.secondaryBtn')}</Button>
                <Button variant="outline">{t('design.outlineBtn')}</Button>
                <Button variant="ghost">{t('design.ghostBtn')}</Button>
                <Button variant="whatsapp" leftIcon={<Phone className="w-4 h-4 rtl-flip" />}>
                  {t('design.whatsappBtn')}
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small (sm)</Button>
                <Button size="md">Medium (md default)</Button>
                <Button size="lg">Large (lg)</Button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">States</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  isLoading={buttonLoading}
                  onClick={() => {
                    setButtonLoading(true);
                    setTimeout(() => setButtonLoading(false), 2000);
                  }}
                >
                  {buttonLoading ? 'Loading...' : 'Click for Loading State'}
                </Button>
                <Button disabled>Disabled Button</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 2. Badges */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#14161C] border-b border-gray-200 pb-2">
          {t('design.badges')}
        </h2>
        <Card>
          <CardBody className="space-y-4">
            <p className="text-xs text-gray-500">
              Defined per PRD 13.3 with consistent palette and prominent SOLD badge:
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {badgeVariants.map((v) => (
                <Badge key={v} variant={v} />
              ))}
            </div>

            <div className="pt-2">
              <span className="text-xs text-gray-400 block mb-2">Small size variant:</span>
              <div className="flex flex-wrap items-center gap-2">
                {badgeVariants.map((v) => (
                  <Badge key={v} variant={v} size="sm" />
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 3. Form Controls */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#14161C] border-b border-gray-200 pb-2">
          {t('design.forms')}
        </h2>
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label={t('design.inputLabel')} hint="Must be at least 3 characters" required>
              <Input placeholder={t('design.inputPlaceholder')} leftIcon={<Mail className="w-4 h-4" />} />
            </FormField>

            <FormField label="Phone Number with Error" error="Please enter a valid Pakistani mobile number" required>
              <Input placeholder="03XX-XXXXXXX" hasError defaultValue="0300" />
            </FormField>

            <FormField label={t('design.selectLabel')}>
              <Select
                placeholder={t('design.selectPlaceholder')}
                options={[
                  { value: 'toyota', label: 'Toyota' },
                  { value: 'honda', label: 'Honda' },
                  { value: 'suzuki', label: 'Suzuki' },
                  { value: 'daihatsu', label: 'Daihatsu' },
                ]}
              />
            </FormField>

            <FormField label="Inquiry Message" hint="Max 500 characters">
              <Textarea placeholder="Tell us what car specifications you are looking for..." />
            </FormField>

            <div className="md:col-span-2 pt-2">
              <Checkbox
                label={t('design.checkboxLabel')}
                description="We only send relevant verified car listings; no spam."
                defaultChecked
              />
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 4. Modals & Notifications */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#14161C] border-b border-gray-200 pb-2">
          {t('design.modals')} &amp; Notifications
        </h2>
        <Card>
          <CardBody className="flex flex-wrap items-center gap-4">
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              {t('design.openModalBtn')}
            </Button>

            <Button
              variant="secondary"
              onClick={() => showToast(t('design.toastSampleMessage'), 'success')}
            >
              {t('design.toastTrigger')} (Success)
            </Button>

            <Button
              variant="ghost"
              onClick={() => showToast('Network sync in progress...', 'info')}
            >
              Toast (Info)
            </Button>
          </CardBody>
        </Card>

        {/* Modal Instance */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={t('design.modalTitle')}
          description={t('design.modalDesc')}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                {t('design.close')}
              </Button>
              <Button size="sm" onClick={() => setModalOpen(false)}>
                {t('design.confirm')}
              </Button>
            </>
          }
        >
          <p className="text-sm text-gray-700 leading-relaxed">
            This modal supports focus trapping, Escape key closing, backdrop click dismissal, and accessible ARIA attributes.
          </p>
        </Modal>
      </section>

      {/* 5. Business Hours Indicator Demo */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#14161C] border-b border-gray-200 pb-2">
          Business Hours Component Demo
        </h2>
        <Card>
          <CardBody className="space-y-3">
            <p className="text-xs text-gray-500">
              Live Asia/Karachi status badge computed from schedules:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <BusinessHoursStatus schedule={SAMPLE_DEMO_BUSINESS_HOURS} />
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 6. Feedback & Skeletons */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#14161C] border-b border-gray-200 pb-2">
          {t('design.feedback')} &amp; Skeletons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardBody>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skeleton Loading</h4>
              <div className="space-y-2">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="rectangular" height={80} />
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Loading Primitive</h4>
              <LoadingState message="Fetching details..." />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Error Primitive</h4>
              <ErrorState message="Could not connect to service." onRetry={() => showToast('Retrying...', 'info')} />
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
};
