import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UpdatePassword from './UpdatePassword'

const { updateUser } = vi.hoisted(() => ({ updateUser: vi.fn() }))

vi.mock('../lib/supabaseClient', () => ({
  supabase: { auth: { updateUser } },
}))

describe('UpdatePassword', () => {
  beforeEach(() => {
    updateUser.mockReset()
  })

  it('rejects mismatched passwords without calling Supabase', async () => {
    const user = userEvent.setup()
    render(<UpdatePassword onDone={() => {}} />)

    await user.type(screen.getByPlaceholderText('New password'), 'newpass1')
    await user.type(screen.getByPlaceholderText('Confirm new password'), 'newpass2')
    await user.click(screen.getByRole('button', { name: /save password/i }))

    expect(await screen.findByText(/do not match/i)).toBeInTheDocument()
    expect(updateUser).not.toHaveBeenCalled()
  })

  it('saves the new password and reports done', async () => {
    updateUser.mockResolvedValue({ error: null })
    const onDone = vi.fn()
    const user = userEvent.setup()
    render(<UpdatePassword onDone={onDone} />)

    await user.type(screen.getByPlaceholderText('New password'), 'newpass1')
    await user.type(screen.getByPlaceholderText('Confirm new password'), 'newpass1')
    await user.click(screen.getByRole('button', { name: /save password/i }))

    expect(updateUser).toHaveBeenCalledWith({ password: 'newpass1' })
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
