import React from 'react';
import { Inbox } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext.tsx';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  const { t } = useI18n();
  const displayTitle = title || t('common.noItems');

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-gray-300 bg-white ${className}`}
    >
      <div className="text-gray-400 mb-3">
        {icon || <Inbox className="w-10 h-10 mx-auto stroke-1" />}
      </div>
      <h4 className="text-base font-semibold text-[#14161C]">{displayTitle}</h4>
      {description && (
        <p className="mt-1.5 text-xs text-gray-500 max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
