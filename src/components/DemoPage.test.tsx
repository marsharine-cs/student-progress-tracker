import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import DemoPage from './DemoPage'

describe('public demo', () => {
  it('shows fictional mastery data without authentication', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: 'Student Progress Tracker' })).toBeInTheDocument()
    expect(screen.getByRole('table')).toHaveTextContent('Alex Morgan')
    expect(screen.getByRole('table')).toHaveTextContent('Not assessed')
  })

  it('records history, updates latest mastery, and resets the sample data', async () => {
    const user = userEvent.setup()
    render(<DemoPage />)
    await user.click(screen.getByRole('button', { name: 'Assessments' }))
    await user.selectOptions(screen.getByLabelText('Mastery status'), 'needs_help')
    await user.click(screen.getByRole('button', { name: 'Record assessment' }))
    expect(screen.getByRole('status')).toHaveTextContent('Dashboard updated')
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Alex Morgan · Fractions · Needs Help')
    await user.click(screen.getByRole('button', { name: 'Dashboard' }))
    const row = screen.getByRole('row', { name: /Alex Morgan/ })
    expect(within(row).getAllByRole('cell')[0]).toHaveTextContent('Needs Help')
    await user.click(screen.getByRole('button', { name: 'Reset demo data' }))
    expect(within(row).getAllByRole('cell')[0]).toHaveTextContent('Mastered')
  })
})
