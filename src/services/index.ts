/**
 * Services Entrypoint & Dependency Injection
 * 
 * FRONTEND-FIRST ARCHITECTURE:
 * UI components must import repositories ONLY from this file or contracts.
 * Direct imports of demo adapters or localStorage in components are strictly prohibited.
 */

import type { SettingsRepository } from './contracts/settings.ts';
import type { AnalyticsRepository } from './contracts/analytics.ts';
import type { PreferencesRepository } from './contracts/preferences.ts';

import { demoSettingsRepository } from './demo/demoSettings.ts';
import { demoAnalyticsRepository } from './demo/demoAnalytics.ts';
import { demoPreferencesRepository } from './demo/demoPreferences.ts';

// Current active adapter mode: 'demo' (will support 'supabase' in Phase 14)
export const ACTIVE_DATA_ADAPTER: 'demo' | 'supabase' = 'demo';

export const settingsService: SettingsRepository = demoSettingsRepository;
export const analyticsService: AnalyticsRepository = demoAnalyticsRepository;
export const preferencesService: PreferencesRepository = demoPreferencesRepository;

export * from './contracts/settings.ts';
export * from './contracts/analytics.ts';
export * from './contracts/preferences.ts';
