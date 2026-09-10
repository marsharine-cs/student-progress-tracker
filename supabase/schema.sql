-- Student Progress Tracker — database schema and Row Level Security policies
--
-- Run this file once in the Supabase SQL Editor of a fresh project
-- (Dashboard → SQL Editor → New query → paste → Run).
--
-- Every table is scoped to the signed-in teacher through the user_id column.
-- RLS policies below guarantee that a user can only read and write their own
-- rows, even though the browser talks to Supabase directly with the public
-- anon key.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  grade_level text,
  notes       text,
  created_at  timestamptz not null default now()
);

create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.assessment_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  student_id  uuid not null references public.students (id) on delete cascade,
  skill_id    uuid not null references public.skills (id) on delete cascade,
  status      text not null check (status in ('mastered', 'partial', 'needs_help')),
  assessed_at timestamptz not null default now()
);

-- Indexes for the joins and orderings the app performs.
create index if not exists students_user_id_idx            on public.students (user_id);
create index if not exists skills_user_id_idx              on public.skills (user_id);
create index if not exists assessment_entries_user_id_idx  on public.assessment_entries (user_id);
create index if not exists assessment_entries_student_idx  on public.assessment_entries (student_id);
create index if not exists assessment_entries_skill_idx    on public.assessment_entries (skill_id);
create index if not exists assessment_entries_assessed_idx on public.assessment_entries (assessed_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.students           enable row level security;
alter table public.skills             enable row level security;
alter table public.assessment_entries enable row level security;

-- students -----------------------------------------------------------------
drop policy if exists "Users can view their own students" on public.students;
create policy "Users can view their own students" on public.students
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users can insert their own students" on public.students;
create policy "Users can insert their own students" on public.students
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Users can update their own students" on public.students;
create policy "Users can update their own students" on public.students
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users can delete their own students" on public.students;
create policy "Users can delete their own students" on public.students
  for delete to authenticated using (user_id = auth.uid());

-- skills -------------------------------------------------------------------
drop policy if exists "Users can view their own skills" on public.skills;
create policy "Users can view their own skills" on public.skills
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users can insert their own skills" on public.skills;
create policy "Users can insert their own skills" on public.skills
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Users can update their own skills" on public.skills;
create policy "Users can update their own skills" on public.skills
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users can delete their own skills" on public.skills;
create policy "Users can delete their own skills" on public.skills
  for delete to authenticated using (user_id = auth.uid());

-- assessment_entries -------------------------------------------------------
drop policy if exists "Users can view their own assessment entries" on public.assessment_entries;
create policy "Users can view their own assessment entries" on public.assessment_entries
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users can insert their own assessment entries" on public.assessment_entries;
create policy "Users can insert their own assessment entries" on public.assessment_entries
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Users can update their own assessment entries" on public.assessment_entries;
create policy "Users can update their own assessment entries" on public.assessment_entries
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users can delete their own assessment entries" on public.assessment_entries;
create policy "Users can delete their own assessment entries" on public.assessment_entries
  for delete to authenticated using (user_id = auth.uid());
