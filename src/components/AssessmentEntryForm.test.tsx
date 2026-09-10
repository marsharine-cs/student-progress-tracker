import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AssessmentEntryForm from './AssessmentEntryForm'
import type { Student } from '../types/Student'
import type { Skill } from '../types/Skill'

const { insert } = vi.hoisted(() => ({ insert: vi.fn() }))

vi.mock('../lib/supabaseClient', () => ({
  supabase: { from: () => ({ insert }) },
}))

const students: Student[] = [
  { id: 's1', user_id: 'u1', name: 'Ada', grade_level: null, notes: null, created_at: '2026-01-01' },
]
const skills: Skill[] = [{ id: 'k1', user_id: 'u1', name: 'Fractions', created_at: '2026-01-01' }]

describe('AssessmentEntryForm', () => {
  beforeEach(() => {
    insert.mockReset()
  })

  it('asks for a student and a skill before showing the form', () => {
    render(<AssessmentEntryForm students={[]} skills={skills} onSaved={() => {}} />)
    expect(screen.getByText(/add at least one student and one skill/i)).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('inserts the chosen student, skill, and status, then reports saved', async () => {
    insert.mockResolvedValue({ error: null })
    const onSaved = vi.fn()
    const user = userEvent.setup()

    render(<AssessmentEntryForm students={students} skills={skills} onSaved={onSaved} />)

    const [studentSelect, skillSelect, statusSelect] = screen.getAllByRole('combobox')
    await user.selectOptions(studentSelect, 's1')
    await user.selectOptions(skillSelect, 'k1')
    await user.selectOptions(statusSelect, 'needs_help')
    await user.click(screen.getByRole('button', { name: /record assessment/i }))

    expect(insert).toHaveBeenCalledWith({ student_id: 's1', skill_id: 'k1', status: 'needs_help' })
    expect(onSaved).toHaveBeenCalledTimes(1)
  })

  it('shows the database error and does not report saved', async () => {
    insert.mockResolvedValue({ error: { message: 'row violates policy' } })
    const onSaved = vi.fn()
    const user = userEvent.setup()

    render(<AssessmentEntryForm students={students} skills={skills} onSaved={onSaved} />)

    const [studentSelect, skillSelect] = screen.getAllByRole('combobox')
    await user.selectOptions(studentSelect, 's1')
    await user.selectOptions(skillSelect, 'k1')
    await user.click(screen.getByRole('button', { name: /record assessment/i }))

    expect(await screen.findByText('row violates policy')).toBeInTheDocument()
    expect(onSaved).not.toHaveBeenCalled()
  })
})
