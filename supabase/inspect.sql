-- Read-only inspection query. Paste into the Supabase SQL Editor and Run,
-- then copy the two result grids back. Used to compare a live project
-- against schema.sql. Changes nothing.

-- 1. Columns on the three app tables
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('students', 'skills', 'assessment_entries')
order by table_name, ordinal_position;

-- 2. RLS status and policies
select c.relname as table_name, c.relrowsecurity as rls_enabled,
       p.policyname, p.cmd, p.roles, p.qual, p.with_check
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policies p on p.tablename = c.relname and p.schemaname = n.nspname
where n.nspname = 'public'
  and c.relname in ('students', 'skills', 'assessment_entries')
order by c.relname, p.policyname;
