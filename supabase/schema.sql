-- Early Access lead capture.
-- Run in Supabase SQL editor (or `supabase db push`).
--
-- Zero-key model: the browser never touches this table. It POSTs to the
-- early-access-lead Edge Function, which writes with the service_role key
-- (bypasses RLS). RLS stays ENABLED with NO policies, so every other path
-- (anon / authenticated via PostgREST) is denied — defense in depth.

create table if not exists public.early_access_leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text not null unique,          -- dup submit => 409, handled in the function
  phone      text not null,
  intents    text[] not null default '{}'   -- selected intent keys: team | solo
);

-- RLS on, no policies => only service_role (the Edge Function) can read/write.
alter table public.early_access_leads enable row level security;

-- (Intentionally NO anon/authenticated policy. Do not add one — the function
--  is the only writer.)
