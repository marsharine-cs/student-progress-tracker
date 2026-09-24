-- Harden tenant boundaries for an existing Student Progress Tracker database.
-- Run once in the Supabase SQL Editor after reviewing a backup.

alter table public.students
  add constraint students_id_user_id_key unique (id, user_id);

alter table public.skills
  add constraint skills_id_user_id_key unique (id, user_id);

alter table public.assessment_entries
  drop constraint if exists assessment_entries_student_id_fkey,
  drop constraint if exists assessment_entries_skill_id_fkey;

alter table public.assessment_entries
  add constraint assessment_entries_student_tenant_fkey
    foreign key (student_id, user_id)
    references public.students (id, user_id)
    on delete cascade,
  add constraint assessment_entries_skill_tenant_fkey
    foreign key (skill_id, user_id)
    references public.skills (id, user_id)
    on delete cascade;
