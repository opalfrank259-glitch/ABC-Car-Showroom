import type { BusinessHoursSchedule, DaySchedule } from '../services/contracts/settings.ts';

export type BusinessHoursStatusKey = 
  | 'not_configured'
  | 'open'
  | 'closed'
  | 'closed_today'
  | 'break' // e.g. Friday Jumma prayer break
  | 'holiday';

export interface BusinessHoursStatusResult {
  hasHours: boolean;
  isOpen: boolean;
  statusKey: BusinessHoursStatusKey;
  todaySchedule: DaySchedule | null;
  currentTimeKarachi: string; // "HH:MM"
  currentDay: string; // "monday", etc.
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

type DayName = (typeof DAY_NAMES)[number];

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

/**
 * Extracts Karachi local date parts (Asia/Karachi UTC+5)
 */
export function getKarachiDateParts(date: Date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'long',
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, string> = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }

  const year = partMap.year;
  const month = partMap.month;
  const day = partMap.day;
  const hour = parseInt(partMap.hour, 10);
  const minute = parseInt(partMap.minute, 10);
  const weekday = (partMap.weekday || '').toLowerCase() as DayName;
  const isoDate = `${year}-${month}-${day}`;
  const minutesFromMidnight = hour * 60 + minute;
  const timeFormatted = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  return {
    year,
    month,
    day,
    hour,
    minute,
    weekday,
    isoDate,
    minutesFromMidnight,
    timeFormatted,
  };
}

/**
 * Pure function determining current showroom open/closed status in Asia/Karachi.
 * If schedule is null, returns hasHours: false so UI can cleanly suppress rendering.
 */
export function getBusinessHoursStatus(
  schedule: BusinessHoursSchedule | null,
  referenceDate: Date = new Date()
): BusinessHoursStatusResult {
  if (!schedule || !schedule.days) {
    return {
      hasHours: false,
      isOpen: false,
      statusKey: 'not_configured',
      todaySchedule: null,
      currentTimeKarachi: '',
      currentDay: '',
    };
  }

  const { weekday, isoDate, minutesFromMidnight, timeFormatted } = getKarachiDateParts(referenceDate);

  // 1. Holiday Check
  if (schedule.holidays && schedule.holidays.includes(isoDate)) {
    return {
      hasHours: true,
      isOpen: false,
      statusKey: 'holiday',
      todaySchedule: null,
      currentTimeKarachi: timeFormatted,
      currentDay: weekday,
    };
  }

  const PREV_DAYS: Record<DayName, DayName> = {
    sunday: 'saturday',
    monday: 'sunday',
    tuesday: 'monday',
    wednesday: 'tuesday',
    thursday: 'wednesday',
    friday: 'thursday',
    saturday: 'friday',
  };

  const prevDayName = PREV_DAYS[weekday];
  const prevDayConfig = schedule.days[prevDayName];

  // 2. Check if yesterday's overnight shift extends into early morning today
  if (prevDayConfig && prevDayConfig.isOpen) {
    const prevOpenM = parseTimeToMinutes(prevDayConfig.openTime);
    const prevCloseM = parseTimeToMinutes(prevDayConfig.closeTime);
    if (prevCloseM < prevOpenM && minutesFromMidnight < prevCloseM) {
      return {
        hasHours: true,
        isOpen: true,
        statusKey: 'open',
        todaySchedule: prevDayConfig,
        currentTimeKarachi: timeFormatted,
        currentDay: weekday,
        openTime: prevDayConfig.openTime,
        closeTime: prevDayConfig.closeTime,
      };
    }
  }

  const todayConfig = schedule.days[weekday];

  // 3. Day not scheduled or explicitly marked closed
  if (!todayConfig || !todayConfig.isOpen) {
    return {
      hasHours: true,
      isOpen: false,
      statusKey: 'closed_today',
      todaySchedule: todayConfig || null,
      currentTimeKarachi: timeFormatted,
      currentDay: weekday,
    };
  }

  const openMinutes = parseTimeToMinutes(todayConfig.openTime);
  const closeMinutes = parseTimeToMinutes(todayConfig.closeTime);

  // 3. Break Check (e.g. Friday Jumma prayer break 12:30 - 14:30)
  if (todayConfig.breakStart && todayConfig.breakEnd) {
    const breakStartM = parseTimeToMinutes(todayConfig.breakStart);
    const breakEndM = parseTimeToMinutes(todayConfig.breakEnd);

    if (minutesFromMidnight >= breakStartM && minutesFromMidnight < breakEndM) {
      return {
        hasHours: true,
        isOpen: false,
        statusKey: 'break',
        todaySchedule: todayConfig,
        currentTimeKarachi: timeFormatted,
        currentDay: weekday,
        openTime: todayConfig.openTime,
        closeTime: todayConfig.closeTime,
        breakStart: todayConfig.breakStart,
        breakEnd: todayConfig.breakEnd,
      };
    }
  }

  // 4. Overnight Schedule (e.g. 18:00 to 02:00) vs Normal Schedule
  let isOpen = false;
  if (closeMinutes < openMinutes) {
    // Overnight: open if past opening time OR before closing time next morning
    isOpen = minutesFromMidnight >= openMinutes || minutesFromMidnight < closeMinutes;
  } else {
    // Normal same-day schedule
    isOpen = minutesFromMidnight >= openMinutes && minutesFromMidnight < closeMinutes;
  }

  return {
    hasHours: true,
    isOpen,
    statusKey: isOpen ? 'open' : 'closed',
    todaySchedule: todayConfig,
    currentTimeKarachi: timeFormatted,
    currentDay: weekday,
    openTime: todayConfig.openTime,
    closeTime: todayConfig.closeTime,
    breakStart: todayConfig.breakStart,
    breakEnd: todayConfig.breakEnd,
  };
}
