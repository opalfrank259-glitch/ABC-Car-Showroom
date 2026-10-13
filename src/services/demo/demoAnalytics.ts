import type {
  AnalyticsRepository,
  ContactChannel,
  ContactEvent,
} from '../contracts/analytics.ts';

const ANALYTICS_STORAGE_KEY = 'abc_demo_analytics_events_v1';

class DemoAnalyticsRepository implements AnalyticsRepository {
  private events: ContactEvent[] = [];

  constructor() {
    this.events = this.loadEvents();
  }

  private loadEvents(): ContactEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  }

  private saveEvents(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        ANALYTICS_STORAGE_KEY,
        JSON.stringify(this.events.slice(-100))
      );
    } catch {
      // ignore
    }
  }

  // TODO(final-phase): replace with server function /api/public/log-event with rate-limiting and RLS audit
  async logContactEvent(params: {
    channel: ContactChannel;
    source: string;
    vehicleId?: string | null;
  }): Promise<void> {
    const event: ContactEvent = {
      channel: params.channel,
      source: params.source,
      vehicleId: params.vehicleId || null,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    this.saveEvents();
  }

  async getRecordedEvents(): Promise<ContactEvent[]> {
    return [...this.events];
  }
}

export const demoAnalyticsRepository = new DemoAnalyticsRepository();
