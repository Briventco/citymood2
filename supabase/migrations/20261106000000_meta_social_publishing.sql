-- Meta social publishing foundation.
-- Access tokens are encrypted application data and must never be exposed to the browser.

create table public.social_connections (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('meta_facebook', 'meta_instagram')),
  account_id text not null,
  account_name text not null,
  scopes text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'reauthorization_required', 'revoked', 'disabled')),
  connected_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, account_id)
);

create table public.social_connection_secrets (
  connection_id uuid primary key references public.social_connections (id) on delete cascade,
  token_ciphertext text not null,
  token_nonce text not null,
  token_expires_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.social_publications (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  connection_id uuid not null references public.social_connections (id) on delete cascade,
  platform text not null check (platform in ('meta_facebook', 'meta_instagram')),
  caption text not null check (char_length(caption) between 1 and 5000),
  media_id uuid references public.article_media (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'publishing', 'published', 'failed', 'cancelled')),
  external_post_id text,
  error_code text,
  error_message text,
  scheduled_for timestamptz,
  published_at timestamptz,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.social_publication_attempts (
  id bigint generated always as identity primary key,
  publication_id uuid not null references public.social_publications (id) on delete cascade,
  status text not null check (status in ('started', 'succeeded', 'failed')),
  error_code text,
  error_message text,
  created_at timestamptz not null default now()
);

create index social_publications_article_idx on public.social_publications (article_id, created_at desc);
create index social_publications_status_idx on public.social_publications (status, scheduled_for);
create index social_attempts_publication_idx on public.social_publication_attempts (publication_id, created_at desc);

create trigger social_connections_set_updated_at
before update on public.social_connections
for each row execute function public.set_updated_at();

create trigger social_publications_set_updated_at
before update on public.social_publications
for each row execute function public.set_updated_at();

create trigger social_connection_secrets_set_updated_at
before update on public.social_connection_secrets
for each row execute function public.set_updated_at();

insert into public.permissions (name, description)
values ('social:publish', 'Connect Meta accounts and publish approved articles to social media')
on conflict (name) do nothing;

insert into public.role_permissions (role_name, permission_name)
values ('administrator', 'social:publish')
on conflict do nothing;

alter table public.social_connections enable row level security;
alter table public.social_connection_secrets enable row level security;
alter table public.social_publications enable row level security;
alter table public.social_publication_attempts enable row level security;

create policy social_connections_manage_admin
on public.social_connections for all to authenticated
using (public.has_permission('social:publish'))
with check (public.has_permission('social:publish'));

-- Deliberately no client policies exist for social_connection_secrets.
-- The server-side service-role client is the only application path allowed to read or write tokens.

create policy social_publications_manage_publisher
on public.social_publications for all to authenticated
using (public.has_permission('social:publish'))
with check (public.has_permission('social:publish'));

create policy social_attempts_read_publisher
on public.social_publication_attempts for select to authenticated
using (public.has_permission('social:publish'));

create policy social_attempts_insert_publisher
on public.social_publication_attempts for insert to authenticated
with check (public.has_permission('social:publish'));
