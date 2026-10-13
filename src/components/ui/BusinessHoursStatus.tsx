import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import type { BusinessHoursSchedule } from '../../services/contracts/settings.ts';
import { getBusinessHoursStatus } from '../../utils/businessHours.ts';
import { useI18n } from '../../i18n/i18nContext.tsx';

export interface BusinessHoursStatusProps {
  schedule: BusinessHoursSchedule | null;
  className?: string;
}

export const BusinessHoursStatus: React.FC<BusinessHoursStatusProps> = ({
  schedule,
  className = '',
}) => {
  const { t } = useI18n();
  const [, setTick] = useState<number>(0);

  // Periodically refresh status every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // PRD RULE: If hours are null -> component renders nothing
  if (!schedule) {
    return null;
  }

  const status = getBusinessHoursStatus(schedule);
  if (!status.hasHours) {
    return null;
  }

  const { isOpen, statusKey, todaySchedule, breakEnd } = status;

  let badgeColor = 'bg-emerald-50 text-[#1F9D55] border-emerald-200';
  let dotColor = 'bg-[#1F9D55]';
  let labelText = t('hours.openNow');
  let detailText = todaySchedule ? `${todaySchedule.openTime} – ${todaySchedule.closeTime}` : '';

  if (statusKey === 'break') {
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-[#E0A800]';
    labelText = t('hours.jummaBreak');
    detailText = breakEnd ? t('hours.reopensAt', { time: breakEnd }) : '';
  } else if (statusKey === 'holiday') {
    badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
    dotColor = 'bg-[#C8102E]';
    labelText = t('hours.holiday');
    detailText = '';
  } else if (!isOpen) {
    badgeColor = 'bg-gray-100 text-gray-700 border-gray-200';
    dotColor = 'bg-gray-400';
    labelText = t('hours.closedNow');
    detailText = todaySchedule?.openTime ? t('hours.opensAt', { time: todaySchedule.openTime }) : '';
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border font-medium select-none ${badgeColor} ${className}`}
      title={`${labelText} ${detailText ? `(${detailText})` : ''}`}
    >
      <span className="relative flex h-2 w-2">
        {isOpen && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      <span className="font-semibold">{labelText}</span>
      {detailText && (
        <span className="opacity-80 border-s border-current ps-1.5 ms-0.5 text-[11px] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {detailText}
        </span>
      )}
    </div>
  );
};
