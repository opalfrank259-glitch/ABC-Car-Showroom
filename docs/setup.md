# Local Setup & Supabase Configuration Guide

Follow these steps to configure Supabase and run **ABC Car Showroom** locally.

---

## 1. Create a Supabase Project

1. Navigate to [Supabase](https://supabase.com/) and sign in.
2. Click **New Project**.
3. Set your project name (e.g., `abc-car-showroom`).
4. Generate a strong database password and save it securely.
5. Select a region close to your primary audience (e.g. `ap-south-1` Mumbai or `me-central-1` Middle East).
6. Click **Create new project** and wait ~2 minutes for provisioning to complete.

---

## 2. Execute Foundation Migration

1. In your Supabase project dashboard, open the **SQL Editor** from the left-hand navigation.
2. Click **New query**.
3. Copy the full contents of `supabase/migrations/0001_foundation.sql`.
4. Paste into the editor and click **Run** (or press Ctrl+Enter / Cmd+Enter).
5. Verify success:
   - Check **Table Editor** to confirm 4 tables exist:
     - `profiles`
     - `site_settings_public`
     - `site_settings_private`
     - `audit_logs`
   - Check `site_settings_public` to confirm the default showroom seed rows are populated:
     - `phones`: `0327-1126457`
     - `city`: `Sadiqabad, Punjab, Pakistan`
     - `currency`: `PKR`
     - `timezone`: `Asia/Karachi`
     - `showroom_name`: `ABC`
     - `stock_prefix`: `ABC`

---

## 3. Retrieve Supabase API Credentials

1. In your Supabase dashboard, go to **Project Settings** &rarr; **API**.
2. Under **Project URL**, copy the URL (e.g. `https://xyzproject.supabase.co`).
3. Under **Project API keys**:
   - Copy the **anon public** key (this will become `VITE_SUPABASE_PUBLISHABLE_KEY`).
   - Copy the **service_role secret** key (this is `SUPABASE_SERVICE_ROLE_KEY` for serverless functions only).

---

## 4. Configure Local Environment Variables

1. Copy `.env.example` to `.env.local` in the project root:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and fill in the browser-safe parameters:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key
   VITE_PUBLIC_SITE_URL=http://localhost:3000
   VITE_DEMO_MODE=false
   ```

---

## 5. Start the Application

1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the local Vite server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000/status` in your browser.
4. Verify the checklist:
   - **App Build**: OK
   - **Supabase Client Configured**: YES
   - **Supabase Reachable**: PASS
   - **Primary Phone**: Loaded as `0327-1126457`
