import { describe, it, expect } from 'vitest';
import { getBusinessHoursStatus } from './businessHours.ts';
import type { BusinessHoursSchedule } from '../services/contracts/settings.ts';

const testSchedule: BusinessHoursSchedule = {
  days: {
    monday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
    friday: {
      isOpen: true,
      openTime: '10:00',
      closeTime: '20:00',
      breakStart: '12:30',
      breakEnd: '14:30',
    },
    saturday: { isOpen: true, openTime: '20:00', closeTime: '03:00' }, // Overnight schedule
    sunday: { isOpen: false, openTime: '00:00', closeTime: '00:00' }, // Closed day
  },
  holidays: ['2026-03-23', '2026-08-14'],
};

describe('businessHours status calculator', () => {
  it('returns hasHours: false when schedule is null', () => {
    const result = getBusinessHoursStatus(null);
    expect(result.hasHours).toBe(false);
    expect(result.isOpen).toBe(false);
    expect(result.statusKey).toBe('not_configured');
  });

  it('correctly detects open status during regular weekday hours', () => {
    // Monday at 12:00 PM Karachi (07:00 UTC)
    // 2026-10-12 is a Monday
    const mondayNoon = new Date('2026-10-12T07:00:00Z');
    const result = getBusinessHoursStatus(testSchedule, mondayNoon);
    expect(result.hasHours).toBe(true);
    expect(result.isOpen).toBe(true);
    expect(result.statusKey).toBe('open');
  });

  it('correctly detects closed status before opening time on a weekday', () => {
    // Monday at 08:30 AM Karachi (03:30 UTC)
    const mondayEarly = new Date('2026-10-12T03:30:00Z');
    const result = getBusinessHoursStatus(testSchedule, mondayEarly);
    expect(result.hasHours).toBe(true);
    expect(result.isOpen).toBe(false);
    expect(result.statusKey).toBe('closed');
  });

  it('correctly detects Jumma prayer break on Friday', () => {
    // Friday at 13:00 (1:00 PM) Karachi (08:00 UTC)
    // 2026-10-16 is a Friday
    const fridayJumma = new Date('2026-10-16T08:00:00Z');
    const result = getBusinessHoursStatus(testSchedule, fridayJumma);
    expect(result.hasHours).toBe(true);
    expect(result.isOpen).toBe(false);
    expect(result.statusKey).toBe('break');
    expect(result.breakStart).toBe('12:30');
    expect(result.breakEnd).toBe('14:30');
  });

  it('correctly detects open status after Friday Jumma break concludes', () => {
    // Friday at 15:00 (3:00 PM) Karachi (10:00 UTC)
    const fridayAfternoon = new Date('2026-10-16T10:00:00Z');
    const result = getBusinessHoursStatus(testSchedule, fridayAfternoon);
    expect(result.hasHours).toBe(true);
    expect(result.isOpen).toBe(true);
    expect(result.statusKey).toBe('open');
  });

  it('correctly handles overnight operating hours past midnight', () => {
    // Saturday night 23:00 Karachi (18:00 UTC) -> should be open
    // 2026-10-17 is Saturday
    const satLate = new Date('2026-10-17T18:00:00Z');
    const result1 = getBusinessHoursStatus(testSchedule, satLate);
    expect(result1.isOpen).toBe(true);
    expect(result1.statusKey).toBe('open');

    // Saturday overnight 01:30 AM Karachi (which is 20:30 UTC on Saturday) -> should be open
    const satOvernight = new Date('2026-10-17T20:30:00Z');
    const result2 = getBusinessHoursStatus(testSchedule, satOvernight);
    expect(result2.isOpen).toBe(true);
    expect(result2.statusKey).toBe('open');
  });

  it('correctly reports closed status on unscheduled or closed days', () => {
    // Sunday (2026-10-18)
    const sunday = new Date('2026-10-18T07:00:00Z');
    const result = getBusinessHoursStatus(testSchedule, sunday);
    expect(result.hasHours).toBe(true);
    expect(result.isOpen).toBe(false);
    expect(result.statusKey).toBe('closed_today');
  });

  it('correctly identifies scheduled holidays', () => {
    // Pakistan Day: 2026-03-23 at 11:00 Karachi (06:00 UTC)
    const holidayDate = new Date('2026-03-23T06:00:00Z');
    const result = getBusinessHoursStatus(testSchedule, holidayDate);
    expect(result.hasHours).toBe(true);
    expect(result.isOpen).toBe(false);
    expect(result.statusKey).toBe('holiday');
  });
});
