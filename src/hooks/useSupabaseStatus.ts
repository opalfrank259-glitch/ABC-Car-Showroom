import { useState, useEffect, useCallback } from 'react';
import { checkSupabaseConnection, SettingsCheckResult } from '../services/settingsService.ts';

export function useSupabaseStatus() {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<SettingsCheckResult | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await checkSupabaseConnection();
      setResult(res);
    } catch (err) {
      setResult({
        configured: false,
        connected: false,
        message: err instanceof Error ? err.message : 'Unknown error during status check',
        primaryPhone: null,
        settings: null,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loading, result, refresh };
}
