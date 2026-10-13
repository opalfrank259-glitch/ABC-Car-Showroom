# Supabase Seed Data Guidelines

This directory houses database seeds and bootstrap reference data for **ABC Car Showroom**.

## Strict Rules for Seed Data (PRD Section 33 & 38)

1. **Minimal & Real Data Only**:
   - Seed data must only include verified constants (e.g. verified phone numbers, currency, showroom city, stock prefix).
   - Never invent mock/fake vehicles, fake customer testimonials, fictitious reviews, fake addresses, placeholder email domains, or made-up bank accounts.
2. **Missing Business Attributes**:
   - Fields whose real showroom values are not yet provided (such as exact street address, Google Maps embed URL, operating hours, social handles, or final logo) must remain explicit `null` values in the database.
   - They will be populated through the Super Admin panel in subsequent phases once physical showroom assets are finalized.
3. **Idempotency**:
   - Always write seed queries using `insert ... on conflict do nothing` or upsert patterns to avoid duplicating or corrupting production data during re-runs.
