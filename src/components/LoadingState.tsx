import React from 'react';
import { Loader2 } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext.tsx';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  className = '',
}) => {
  const { t } = useI18n();
  const displayMessage = message || t('common.loading');

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-8 text-center text-sm text-[#14161C]/70 ${className}`}
    >
      <Loader2 className="w-6 h-6 animate-spin text-[#C8102E] mb-2" />
      <span>{displayMessage}</span>
    </div>
  );
};
