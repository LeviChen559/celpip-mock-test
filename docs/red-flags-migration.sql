-- Red Flags Migration
-- Run this in the Supabase SQL Editor

-- Table for user-reported question issues
create table public.red_flags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_id text not null,           -- e.g. "L1Q1", "Reading-Part1-01-Q2", "writing-task-1"
  section text not null,               -- "listening", "reading", "writing", "speaking"
  comment text not null default '',
  solved boolean not null default false,
  solved_by uuid references public.profiles(id) on delete set null,
  solved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.red_flags enable row level security;

-- Any authenticated user can insert their own flags
create policy "Users can insert own flags"
  on public.red_flags for insert
  with check (auth.uid() = user_id);

-- Users can read their own flags
create policy "Users can read own flags"
  on public.red_flags for select
  using (auth.uid() = user_id);

-- Admins and teachers can read all flags
create policy "Staff can read all flags"
  on public.red_flags for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'teacher')
    )
  );

-- Only admins can update (mark solved)
create policy "Admins can update flags"
  on public.red_flags for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Indexes for common queries
create index idx_red_flags_question on public.red_flags(question_id);
create index idx_red_flags_user on public.red_flags(user_id);
create index idx_red_flags_solved on public.red_flags(solved);
create index idx_red_flags_created on public.red_flags(created_at desc);
