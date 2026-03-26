-- CRM Admin Migration
-- Run this in the Supabase SQL Editor

-- 1. Add role column to profiles
alter table public.profiles add column if not exists role text not null default 'improver' check (role in ('admin', 'teacher', 'user', 'improver', 'intensive', 'guarantee'));

-- 2. Allow admins to read all profiles
create policy "Admins can read all profiles"
  on public.profiles for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'teacher'))
  );

-- 3. Allow admins to update all profiles
create policy "Admins can update all profiles"
  on public.profiles for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'teacher'))
  );

-- 4. Allow admins to read all test records
create policy "Admins can read all test records"
  on public.test_records for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'teacher'))
  );

-- 5. Allow admins to delete any test records
create policy "Admins can delete all test records"
  on public.test_records for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'teacher'))
  );

-- 6. Set yourself as admin (replace YOUR_USER_ID with your actual user ID)
-- update public.profiles set role in ('admin', 'teacher') where email = 'your-email@example.com';
