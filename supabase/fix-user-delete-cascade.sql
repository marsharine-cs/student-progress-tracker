-- Fix: deleting a user under Authentication → Users failed with a
-- foreign key error, because students, skills, and assessment_entries
-- referenced auth.users(id) with the default ON DELETE NO ACTION.
--
-- This changes each user_id foreign key to ON DELETE CASCADE, so deleting
-- a teacher account also removes that teacher's rows. It finds the
-- constraints by column, so it works whatever they were named, and it is
-- safe to run more than once.
--
-- Run in the Supabase SQL Editor. Projects created from schema.sql already
-- have CASCADE and do not need this.

do $$
declare
  fk record;
begin
  for fk in
    select rel.relname as table_name, con.conname as constraint_name
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace n on n.oid = rel.relnamespace
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any (con.conkey)
    where n.nspname = 'public'
      and con.contype = 'f'
      and att.attname = 'user_id'
      and rel.relname in ('students', 'skills', 'assessment_entries')
      and con.confdeltype <> 'c'
  loop
    execute format('alter table public.%I drop constraint %I', fk.table_name, fk.constraint_name);
    execute format(
      'alter table public.%I add constraint %I foreign key (user_id) references auth.users (id) on delete cascade',
      fk.table_name, fk.constraint_name
    );
    raise notice 'Updated %.% to ON DELETE CASCADE', fk.table_name, fk.constraint_name;
  end loop;
end $$;

-- Verify: every user_id row should now read CASCADE.
select rel.relname as table_name,
       att.attname as column_name,
       case con.confdeltype when 'c' then 'CASCADE' else 'NOT CASCADE' end as on_delete
from pg_constraint con
join pg_class rel on rel.oid = con.conrelid
join pg_namespace n on n.oid = rel.relnamespace
join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any (con.conkey)
where n.nspname = 'public'
  and con.contype = 'f'
  and att.attname = 'user_id'
  and rel.relname in ('students', 'skills', 'assessment_entries')
order by rel.relname;
