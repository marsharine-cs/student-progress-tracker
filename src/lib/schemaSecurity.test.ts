import { describe, expect, it } from 'vitest'
import schemaSql from '../../supabase/schema.sql?raw'

const schema = schemaSql
  .replace(/\s+/g, ' ')
  .toLowerCase()

describe('database tenant boundaries', () => {
  it('binds assessment students and skills to the same owner', () => {
    expect(schema).toContain(
      'foreign key (student_id, user_id) references public.students (id, user_id) on delete cascade',
    )
    expect(schema).toContain(
      'foreign key (skill_id, user_id) references public.skills (id, user_id) on delete cascade',
    )
  })

  it.each(['students', 'skills', 'assessment_entries'])(
    'enables row level security for %s',
    (table) => {
      expect(schema).toContain(`alter table public.${table} enable row level security`)
    },
  )

  it('requires authenticated users to own inserted assessment rows', () => {
    expect(schema).toContain(
      'create policy "users can insert their own assessment entries" on public.assessment_entries for insert to authenticated with check (user_id = auth.uid())',
    )
  })
})
