# Supabase Service Adapters (Dormant until Phase 14)

This directory is reserved for live Supabase PostgreSQL and Storage adapter implementations.

In accordance with the **Frontend-First** architecture mandate:
- All features are currently built and tested using the Demo Data Layer (`src/services/demo/`).
- In **Phase 14: Connect Supabase + GitHub + Vercel**, real Supabase adapter implementations of `SettingsRepository`, `VehicleRepository`, `LeadRepository`, etc., will be added here and activated in `src/services/index.ts`.
- UI components code strictly to the interfaces in `src/services/contracts/`, allowing a seamless swap without modifying UI code.
