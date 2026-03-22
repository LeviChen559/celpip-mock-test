-- API Usage Tracking — Monthly call counter per user
-- Run this in the Supabase SQL Editor

create table public.api_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  month text not null,  -- format: 'YYYY-MM'
  call_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_api_usage_user_month unique (user_id, month)
);

alter table public.api_usage enable row level security;

create policy "Users can read own usage"
  on public.api_usage for select using (auth.uid() = user_id);
create policy "Users can insert own usage"
  on public.api_usage for insert with check (auth.uid() = user_id);
create policy "Users can update own usage"
  on public.api_usage for update using (auth.uid() = user_id);

-- Staff can read all usage
create policy "Staff can read all usage"
  on public.api_usage for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'teacher')
    )
  );

create index idx_api_usage_user on public.api_usage(user_id);
create index idx_api_usage_month on public.api_usage(user_id, month);
