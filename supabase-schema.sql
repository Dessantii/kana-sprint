create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null unique,
  xp integer not null default 0,
  weekly_xp integer not null default 0,
  level integer not null default 1,
  rank_title text not null default 'Novato',
  mastered_count integer not null default 0,
  current_streak integer not null default 0,
  best_daily_streak integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
  add column if not exists weekly_xp integer not null default 0,
  add column if not exists current_streak integer not null default 0,
  add column if not exists best_daily_streak integer not null default 0;

create table if not exists public.player_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.player_progress enable row level security;

drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "progress_select_own" on public.player_progress;
create policy "progress_select_own"
on public.player_progress
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.player_progress;
create policy "progress_insert_own"
on public.player_progress
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.player_progress;
create policy "progress_update_own"
on public.player_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
