# CityMood database boundary

This directory is reserved for the Supabase/PostgreSQL schema, migrations, RLS
policies, and controlled bootstrap data described in docs/BACKEND_PLAN.md.

Planned directories:

- schema/: typed schema definitions.
- migrations/: reviewed, versioned migrations.
- seeds/: development/staging data only.

No migration has been created yet. Before adding one, approve:

1. Supabase development, staging, and production project separation.
2. Supabase CLI and SQL migration workflow.
3. RLS policies and backup/restore policy.
4. Production data-retention requirements.

Fictional stories from lib/content/seed.ts must never be used as production
editorial data.
