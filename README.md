# ABC Car Showroom (Sadiqabad, Punjab, Pakistan)

A modern, high-performance web platform for ABC Car Showroom in Sadiqabad, Punjab, Pakistan. Built on a serverless and edge-ready architecture utilizing React, Vite, Tailwind CSS, Supabase (PostgreSQL, Auth, Storage), and Vercel Serverless Functions.

---

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + React Router v7 + Tailwind CSS (v4)
- **Backend / Serverless**: Vercel Functions (TypeScript) under `/api`
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) + Supabase Auth
- **Design Tokens**: Centralized token file with Deep Charcoal (`#14161C`) & Showroom Red (`#C8102E`)
- **Deployment**: GitHub &rarr; Vercel

---

## Folder Map

```text
/
  src/
    app/              # Router configuration and application shell
    components/       # Reusable UI primitives (Loading, Error, Empty, Banner)
    config/           # Environment validation (env.ts) and design tokens (tokens.ts)
    features/         # Modular feature slices (isolated business domains)
      inventory/      # Vehicle browsing & filters (Phase 2)
      vehicle/        # Detailed vehicle view & media gallery (Phase 2)
      compare/        # Vehicle side-by-side comparison (Phase 2)
      admin/          # Backoffice management & RBAC (Phase 3)
      leads/          # Inquiries & WhatsApp outreach (Phase 4)
      finance/        # Financing & loan estimation (Phase 5)
      trade-in/       # Car exchange & appraisal (Phase 6)
      appointments/   # Test drive bookings (Phase 7)
      chatbot/        # Multilingual conversational assistant (Phase 8)
    hooks/            # Custom React hooks (useSupabaseStatus, etc.)
    i18n/             # Localization files (en, roman-ur, ur, skr)
    layouts/          # Layout wrappers (RootLayout with header, footer, demo bar)
    lib/              # Supabase browser client & shared utilities
    pages/            # Top-level route pages (HomePage, StatusPage, NotFoundPage)
    services/         # Client services & API query abstraction
    types/            # TypeScript schema types & database interfaces
    utils/            # Formatting and helper utilities
  api/
    health.ts         # Vercel serverless health check function
    _lib/             # Server-only helpers (supabaseAdmin.ts with service-role key)
    admin/            # Admin serverless endpoints (Phase 3+)
    public/           # Public serverless endpoints (leads/appointments)
    storage/          # Upload signing & asset management
    cron/             # Background scheduled jobs
  public/
    assets/           # Static media assets
    robots.txt        # Search crawler rules
    favicon.svg       # Neutral minimalist SVG favicon
  supabase/
    migrations/       # Versioned SQL migrations (0001_foundation.sql)
    seed/             # Minimal real seed guidelines
  docs/
    setup.md          # Local development and Supabase configuration guide
    deployment.md     # GitHub and Vercel deployment instructions
    security.md       # Security constitution and secrets policy
  .env.example        # Environment variable template (browser vs server-only)
  vercel.json         # Vercel routing and SPA fallback rules
  package.json
  tsconfig.json
  vite.config.ts
```

---

## 13-Phase Project Roadmap (PRD Schedule)

1. **Phase 1: Foundation + Supabase + Vercel** &mdash; *CURRENT (Completed)*: Plumbing, schema, RLS, Vercel routing, environment isolation, diagnostics.
2. **Phase 2: Design system + public shell + i18n**
3. **Phase 3: Admin auth + roles + settings**
4. **Phase 4: Vehicle management (admin)**
5. **Phase 5: Public inventory + vehicle pages**
6. **Phase 6: Leads/forms/CRM**
7. **Phase 7: Dealer tools**
8. **Phase 8: Trust/content/local SEO**
9. **Phase 9: Advanced vehicle experience + languages**
10. **Phase 10: Chatbot/push/PWA**
11. **Phase 11: Analytics/reports/CMS polish**
12. **Phase 12: Security/performance/QA**
13. **Phase 13: Production deployment**

---

## Phase 1 Status

- **Status**: COMPLETE &amp; VERIFIED
- **TypeScript**: Strict compilation without errors (`tsc --noEmit`).
- **Database**: Migration `0001_foundation.sql` ready with `profiles`, `site_settings_public`, `site_settings_private`, `audit_logs`, and Row Level Security enabled.
- **Client Safety**: Complete separation between browser-safe `VITE_` variables and server-only secrets.
- **Diagnostics**: `/status` live route provides comprehensive health inspection.

---

## How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up local environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase project URL and publishable key to `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The site will be running at `http://localhost:3000`.

4. **Verify production build**:
   ```bash
   npm run build
   ```
