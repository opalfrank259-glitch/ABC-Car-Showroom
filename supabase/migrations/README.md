# Supabase Database Migrations

This folder maintains sequential, versioned SQL migration scripts for the **ABC Car Showroom** PostgreSQL database hosted on Supabase.

## Migration Naming Convention

All migrations must follow the numeric sequential format:

```text
0001_foundation.sql
0002_vehicles_and_inventory.sql
0003_leads_and_appointments.sql
...
```

- Prefix: 4-digit zero-padded index (`0001_`, `0002_`, etc.).
- Suffix: Lowercase slug describing the schema change.
- Extension: `.sql`.

## Execution Guide

### Option 1: Supabase Dashboard (Recommended for initial setup)
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project.
3. In the left navigation, click on **SQL Editor**.
4. Click **New query**.
5. Paste the contents of `0001_foundation.sql` (and subsequent migrations in order).
6. Click **Run**.
7. Confirm that tables (`profiles`, `site_settings_public`, `site_settings_private`, `audit_logs`) and policies are created under the **Table Editor** view.

### Option 2: Supabase CLI
If using the Supabase CLI locally:
```bash
supabase db push
```

## Migration Rules
1. **Row Level Security (RLS)** must be enabled on every new table created.
2. Tables must never expose sensitive staff or customer records without access policies.
3. Helper functions that inspect roles must declare `security definer` and set `search_path = public`.
4. Foreign keys must use appropriate `on delete` cascading or nullifying strategies.
5. All migrations must be idempotent (`create table if not exists`, `on conflict do nothing`, etc.).
