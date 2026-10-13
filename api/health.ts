import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Health check endpoint for ABC Car Showroom
 * 
 * Vercel Serverless Function: GET /api/health
 * 
 * RULES:
 * - Only GET allowed; all other HTTP methods return 405 Method Not Allowed.
 * - Environment variables are reported STRICTLY as boolean presence checks.
 * - Never leak URLs, keys, tokens, or stack traces in responses.
 */

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({
        error: 'Method Not Allowed',
        message: 'Only GET requests are supported on this endpoint.',
      });
    }

    const supabaseUrlSet = Boolean(
      (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
    );
    const serviceRoleSet = Boolean(
      (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
    );

    return res.status(200).json({
      ok: true,
      service: 'abc-car-showroom',
      time: new Date().toISOString(),
      env: {
        supabaseUrlSet,
        serviceRoleSet,
      },
    });
  } catch (_err) {
    return res.status(500).json({
      ok: false,
      error: 'Internal server error',
    });
  }
}
