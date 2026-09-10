import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SkillForm from './SkillForm'
import type { Skill } from '../types/Skill'

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

const skill: Skill = { id: 'k1', user_id: 'u1', name: 'Recursion', created_at: '2026-01-01' }

describe('SkillForm', () => {
  beforeEach(() => {
    insert.mockReset()
    update.mockReset()
    eq.mockReset()
  })

  it('inserts a new skill when not editing', async () => {
    insert.mockResolvedValue({ error: null })
    const onSaved = vi.fn()
    const user = userEvent.setup()

    render(<SkillForm editingSkill={null} onSaved={onSaved} onCancelEdit={() => {}} />)

    await user.type(screen.getByPlaceholderText('Skill name'), 'Big-O Notation')
    await user.click(screen.getByRole('button', { name: /add skill/i }))

    expect(insert).toHaveBeenCalledWith({ name: 'Big-O Notation' })
    expect(onSaved).toHaveBeenCalledTimes(1)
  })

  it('pre-fills and updates when editing an existing skill', async () => {
    eq.mockResolvedValue({ error: null })
    const onSaved = vi.fn()
    const user = userEvent.setup()

    render(<SkillForm editingSkill={skill} onSaved={onSaved} onCancelEdit={() => {}} />)

    expect(screen.getByDisplayValue('Recursion')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(update).toHaveBeenCalledWith({ name: 'Recursion' })
    expect(eq).toHaveBeenCalledWith('id', 'k1')
    expect(onSaved).toHaveBeenCalledTimes(1)
  })

  it('shows the database error and does not report saved', async () => {
    insert.mockResolvedValue({ error: { message: 'row violates policy' } })
    const onSaved = vi.fn()
    const user = userEvent.setup()

    render(<SkillForm editingSkill={null} onSaved={onSaved} onCancelEdit={() => {}} />)

    await user.type(screen.getByPlaceholderText('Skill name'), 'Big-O Notation')
    await user.click(screen.getByRole('button', { name: /add skill/i }))

    expect(await screen.findByText('row violates policy')).toBeInTheDocument()
    expect(onSaved).not.toHaveBeenCalled()
  })
})
