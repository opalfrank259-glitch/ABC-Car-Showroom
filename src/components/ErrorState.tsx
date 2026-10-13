import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext.tsx';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  className = '',
}) => {
  const { t } = useI18n();
  const displayTitle = title || t('common.errorTitle');

  return (
    <div
      role="alert"
      className={`rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-[#14161C]">{displayTitle}</h4>
          <p className="mt-1 text-xs text-[#14161C]/80 break-words">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#14161C] hover:bg-[#14161C]/90 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 rtl-flip" />
              <span>{t('common.retry')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
