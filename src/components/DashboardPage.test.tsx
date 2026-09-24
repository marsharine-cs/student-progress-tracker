import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DashboardPage from './DashboardPage'

const responses = {
  students: {
    data: [{ id: 'student-1', user_id: 'user-1', name: 'Ada', grade_level: null, notes: null, created_at: '2026-01-01' }],
    error: null,
  },
  skills: {
    data: [{ id: 'skill-1', user_id: 'user-1', name: 'Algorithms', created_at: '2026-01-01' }],
    error: null,
  },
  assessment_entries: {
    data: [{ student_id: 'student-1', skill_id: 'skill-1', status: 'mastered', assessed_at: '2026-01-02' }],
    error: null,
  },
}

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: (table: keyof typeof responses) => ({
      select: () => ({
        order: () => Promise.resolve(responses[table]),
      }),
    }),
  },
}))

describe('DashboardPage', () => {
  it('communicates status with text as well as color', async () => {
    render(<DashboardPage />)

    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/mastery status legend/i)).toHaveTextContent('Mastered')
    expect(screen.getByRole('img', { name: 'Ada, Algorithms: Mastered' })).toBeInTheDocument()
    expect(screen.getByText('Current mastery status by student and skill')).toBeInTheDocument()
  })
})
