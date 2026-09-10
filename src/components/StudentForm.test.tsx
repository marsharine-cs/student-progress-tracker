import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import StudentForm from './StudentForm'
import type { Student } from '../types/Student'

const { insert, update, eq } = vi.hoisted(() => ({
  insert: vi.fn(),
  update: vi.fn(),
  eq: vi.fn(),
}))

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: () => ({
      insert,
      update: (values: unknown) => {
        update(values)
        return { eq }
      },
    }),
  },
}))

const student: Student = {
  id: 's1',
  user_id: 'u1',
  name: 'Ada Lovelace',
  grade_level: '10th',
  notes: 'Enjoys algorithms',
  created_at: '2026-01-01',
}

describe('StudentForm', () => {
  beforeEach(() => {
    insert.mockReset()
    update.mockReset()
    eq.mockReset()
  })

  it('inserts a new student when not editing', async () => {
    insert.mockResolvedValue({ error: null })
    const onSaved = vi.fn()
    const user = userEvent.setup()

    render(<StudentForm editingStudent={null} onSaved={onSaved} onCancelEdit={() => {}} />)

    await user.type(screen.getByPlaceholderText('Name'), 'Grace Hopper')
    await user.click(screen.getByRole('button', { name: /add student/i }))

    expect(insert).toHaveBeenCalledWith({ name: 'Grace Hopper', grade_level: null, notes: null })
    expect(onSaved).toHaveBeenCalledTimes(1)
  })

  it('pre-fills and updates when editing an existing student', async () => {
    eq.mockResolvedValue({ error: null })
    const onSaved = vi.fn()
    const user = userEvent.setup()

    render(<StudentForm editingStudent={student} onSaved={onSaved} onCancelEdit={() => {}} />)

    expect(screen.getByDisplayValue('Ada Lovelace')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(update).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      grade_level: '10th',
      notes: 'Enjoys algorithms',
    })
    expect(eq).toHaveBeenCalledWith('id', 's1')
    expect(onSaved).toHaveBeenCalledTimes(1)
  })

  it('shows the database error and does not report saved', async () => {
    insert.mockResolvedValue({ error: { message: 'row violates policy' } })
    const onSaved = vi.fn()
    const user = userEvent.setup()

    render(<StudentForm editingStudent={null} onSaved={onSaved} onCancelEdit={() => {}} />)

    await user.type(screen.getByPlaceholderText('Name'), 'Grace Hopper')
    await user.click(screen.getByRole('button', { name: /add student/i }))

    expect(await screen.findByText('row violates policy')).toBeInTheDocument()
    expect(onSaved).not.toHaveBeenCalled()
  })
})
