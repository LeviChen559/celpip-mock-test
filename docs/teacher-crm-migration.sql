-- Teacher CRM Migration
-- Run this in the Supabase SQL Editor

-- 1. Teacher-student assignments table
create table public.teacher_student_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references public.profiles(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  assigned_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(teacher_id, student_id)
);

alter table public.teacher_student_assignments enable row level security;

-- Admins can do everything
create policy "Admins can manage assignments"
  on public.teacher_student_assignments for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Teachers can read their own assignments
create policy "Teachers can read own assignments"
  on public.teacher_student_assignments for select using (
    teacher_id = auth.uid()
  );

create index idx_assignments_teacher on public.teacher_student_assignments(teacher_id);
create index idx_assignments_student on public.teacher_student_assignments(student_id);
