# Vercel & GitHub Deployment Guide

This guide details how to deploy **ABC Car Showroom** to Vercel via GitHub.

---

## 1. Push Code to GitHub

1. Initialize git in your local project root if not already done:
   ```bash
   git init
   git add .
   git commit -m "feat: phase 1 foundation, supabase schema, and vercel functions"
   ```
2. Create a new repository on GitHub (e.g. `abc-car-showroom`).
3. Link and push your commits:
   ```bash
   git remote add origin https://github.com/<your-username>/abc-car-showroom.git
   git branch -M main
   git push -u origin main
   ```

*Note: Ensure `.env` and `.env.local` are not committed (verify they are ignored by `.gitignore`).*

---

## 2. Import into Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** &rarr; **Project**.
3. Select the `abc-car-showroom` repository from GitHub.
4. Framework Preset will auto-detect as **Vite**.
5. Keep Root Directory as `./`.

---

## 3. Configure Environment Variables in Vercel

Under the **Environment Variables** section before deploying, configure both variable groups:

### Group A: Browser-Safe Variables
*Included in the client JavaScript bundle.*

| Variable Name | Environment | Value Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Production, Preview, Dev | Supabase project URL (`https://...supabase.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Production, Preview, Dev | Supabase public anon key |
| `VITE_PUBLIC_SITE_URL` | Production, Preview, Dev | Canonical public URL (e.g., `https://abc-car-showroom.vercel.app`) |
| `VITE_DEMO_MODE` | Production, Preview, Dev | `false` (or `true` for demo staging) |

### Group B: Server-Only Secrets
*Accessed exclusively by Vercel Serverless Functions under `/api/*`.*

| Variable Name | Environment | Value Description |
|---|---|---|
| `SUPABASE_URL` | Production, Preview, Dev | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Dev | Supabase `service_role` secret (bypasses RLS on backend) |
| `BOOTSTRAP_SECRET` | Production, Preview, Dev | Random secure string for super-admin verification |

*Important: Never prepend server secrets with `VITE_`.*

---

## 4. Deploy and Verify

1. Click **Deploy**.
2. Wait for the build and serverless function deployment to finish (~1 minute).
3. Once live, test the serverless health check endpoint directly:
   ```bash
   curl -i https://<your-project>.vercel.app/api/health
   ```
   Expected response:
   ```json
   {
     "ok": true,
     "service": "abc-car-showroom",
     "time": "2026-10-13T08:30:00.000Z",
     "env": {
       "supabaseUrlSet": true,
       "serviceRoleSet": true
     }
   }
   ```
4. Visit `https://<your-project>.vercel.app/status` in your browser. All diagnostic items will display green passes.
