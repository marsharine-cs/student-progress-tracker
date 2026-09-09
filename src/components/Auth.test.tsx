import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Auth from './Auth'

const { signUp, signInWithPassword, resetPasswordForEmail } = vi.hoisted(() => ({
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  resetPasswordForEmail: vi.fn(),
}))

vi.mock('../lib/supabaseClient', () => ({
  supabase: { auth: { signUp, signInWithPassword, resetPasswordForEmail } },
}))

describe('Auth', () => {
  beforeEach(() => {
    signUp.mockReset()
    signInWithPassword.mockReset()
    resetPasswordForEmail.mockReset()
  })

  it('starts in sign-up mode and can switch to log in', async () => {
    const user = userEvent.setup()
    render(<Auth />)

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /already have an account/i }))
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
  })

  it('signs up with the entered credentials and confirms', async () => {
    signUp.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    render(<Auth />)

    await user.type(screen.getByPlaceholderText('Email'), 'teacher@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'hunter22')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(signUp).toHaveBeenCalledWith({ email: 'teacher@example.com', password: 'hunter22' })
    expect(await screen.findByText(/account created/i)).toBeInTheDocument()
  })

  it('shows the error when login fails', async () => {
    signInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } })
    const user = userEvent.setup()
    render(<Auth />)

    await user.click(screen.getByRole('button', { name: /already have an account/i }))
    await user.type(screen.getByPlaceholderText('Email'), 'teacher@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /^log in$/i }))

    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'teacher@example.com', password: 'wrongpass' })
    expect(await screen.findByText('Invalid login credentials')).toBeInTheDocument()
  })

  it('sends a reset link back to this site and confirms', async () => {
    resetPasswordForEmail.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    render(<Auth />)

    await user.click(screen.getByRole('button', { name: /already have an account/i }))
    await user.click(screen.getByRole('button', { name: /forgot your password/i }))

    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Password')).not.toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Email'), 'teacher@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(resetPasswordForEmail).toHaveBeenCalledWith('teacher@example.com', {
      redirectTo: window.location.origin,
    })
    expect(await screen.findByText(/check your email/i)).toBeInTheDocument()
  })
})
