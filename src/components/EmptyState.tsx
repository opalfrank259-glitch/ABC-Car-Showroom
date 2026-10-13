import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-gray-300 bg-white ${className}`}
    >
      <div className="text-gray-400 mb-3">
        {icon || <Inbox className="w-8 h-8 mx-auto" />}
      </div>
      <h4 className="text-sm font-semibold text-[#14161C]">{title}</h4>
      {description && (
        <p className="mt-1 text-xs text-gray-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
