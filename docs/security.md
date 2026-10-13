# Security Constitution & Secrets Policy

This document codifies the mandatory security standards governing the **ABC Car Showroom** codebase, in compliance with PRD Section 33 & 38.

---

## 1. Zero Secrets in Client Code

1. **The `VITE_` Prefix Boundary**:
   - Any environment variable starting with `VITE_` is statically embedded into client JavaScript bundles during build time and is fully visible to anyone inspecting browser network traffic or source maps.
   - **Never prefix any secret with `VITE_`**.
2. **Serverless Functions Only**:
   - `SUPABASE_SERVICE_ROLE_KEY`, `BOOTSTRAP_SECRET`, `RECAPTCHA_SECRET_KEY`, and `VAPID_PRIVATE_KEY` must **never** be imported, passed to, or exposed in any file inside `src/`.
   - These variables may only be referenced in server-side files within `api/` via `process.env`.
3. **No Direct Admin Imports**:
   - Files under `api/_lib/` (such as `supabaseAdmin.ts`) must never be imported into client components or hooks.

---

## 2. Row Level Security (RLS) Mandate

1. **RLS Enabled by Default**:
   - Every table created in Supabase PostgreSQL must have Row Level Security enabled:
     ```sql
     alter table <table_name> enable row level security;
     ```
2. **Deny-by-Default Posture**:
   - In Supabase, enabling RLS without explicit policies blocks all access to `anon` and `authenticated` roles.
   - Policies must explicitly state the minimum necessary permissions.
3. **Foundation Policy Rules**:
   - `site_settings_public`: Public read access (`anon`, `authenticated`), super-admin write only.
   - `site_settings_private`: Super-admin read and write only. Zero anonymous visibility.
   - `profiles`: Authenticated users can read their own record (`id = auth.uid()`). Super-admin can inspect and manage all profiles.
   - `audit_logs`: Super-admin read only. Direct client inserts, updates, and deletes are disabled; audit writes occur exclusively through serverless functions using the service-role client.

---

## 3. GitHub & Repository Hygiene

1. **Git Exclusion**:
   - `.gitignore` strictly ignores `.env`, `.env.*` (with explicit exception for `.env.example`), `.vercel`, and build artifacts.
2. **Sanitized Error Reporting**:
   - Serverless endpoints and client UI must never leak database connection strings, stack traces, private API tokens, or server filesystem paths in API responses or user-facing error dialogs.
3. **Verification Before Commits**:
   - Always run search audits for sensitive string patterns prior to pushing code to public or private repositories.
