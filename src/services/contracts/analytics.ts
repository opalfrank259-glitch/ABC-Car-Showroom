/**
 * Analytics Repository Contract
 * Defines client-side event logging for conversions and interactions.
 */

export type ContactChannel = 'whatsapp' | 'call';

export interface ContactEvent {
  channel: ContactChannel;
  source: string; // e.g. 'floating_button', 'header_call', 'hero_cta'
  vehicleId?: string | null;
  timestamp: string; // ISO UTC
}

export interface AnalyticsRepository {
  logContactEvent(params: {
    channel: ContactChannel;
    source: string;
    vehicleId?: string | null;
  }): Promise<void>;
  getRecordedEvents(): Promise<ContactEvent[]>;
}
