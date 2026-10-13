import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext.tsx';
import { ACTIVE_DATA_ADAPTER } from '../../services/index.ts';

export interface DemoWatermarkProps {
  className?: string;
}

export const DemoWatermark: React.FC<DemoWatermarkProps> = ({ className = '' }) => {
  const { t } = useI18n();

  if (ACTIVE_DATA_ADAPTER !== 'demo') {
    return null;
  }

  return (
    <div
      role="note"
      className={`bg-amber-500/10 border-y border-amber-500/25 text-amber-900 px-3 py-1.5 text-center text-xs font-semibold flex items-center justify-center gap-2 select-none ${className}`}
    >
      <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
      <span>{t('common.demoMode')} &bull; {t('common.demoWatermark')}</span>
    </div>
  );
};
