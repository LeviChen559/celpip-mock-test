-- CELPIP Mock Test — Supabase Schema
-- Run this in the Supabase SQL Editor

-- 1. Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  role text not null default 'improver' check (role in ('admin', 'teacher', 'user', 'improver', 'intensive', 'guarantee')),
  target_date text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Test records table
create table public.test_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  timestamp bigint not null,
  type text not null check (type in ('full', 'section', 'quiz')),
  section text check (section in ('listening', 'reading', 'writing', 'speaking')),
  quiz_section text,
  quiz_part text,
  scores jsonb not null default '{}',
  details jsonb not null default '{}',
  overall_score integer not null,
  created_at timestamptz not null default now()
);

alter table public.test_records enable row level security;
create policy "Users can read own records"
  on public.test_records for select using (auth.uid() = user_id);
create policy "Users can insert own records"
  on public.test_records for insert with check (auth.uid() = user_id);
create policy "Users can delete own records"
  on public.test_records for delete using (auth.uid() = user_id);

create index idx_test_records_user on public.test_records(user_id);
create index idx_test_records_timestamp on public.test_records(user_id, timestamp desc);

-- 3. Schedule items table
create table public.schedule_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  date text not null,
  section text not null,
  label text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.schedule_items enable row level security;
create policy "Users can read own schedule"
  on public.schedule_items for select using (auth.uid() = user_id);
create policy "Users can insert own schedule"
  on public.schedule_items for insert with check (auth.uid() = user_id);
create policy "Users can update own schedule"
  on public.schedule_items for update using (auth.uid() = user_id);
create policy "Users can delete own schedule"
  on public.schedule_items for delete using (auth.uid() = user_id);

create index idx_schedule_items_user on public.schedule_items(user_id);
