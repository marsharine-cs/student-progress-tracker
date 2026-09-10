import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Mode = 'signup' | 'login' | 'forgot'

const TITLES: Record<Mode, string> = {
  signup: 'Create Account',
  login: 'Log In',
  forgot: 'Reset Password',
}

const SUBMIT_LABELS: Record<Mode, string> = {
  signup: 'Sign Up',
  login: 'Log In',
  forgot: 'Send Reset Link',
}

function Auth() {
  const [mode, setMode] = useState<Mode>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const switchMode = (next: Mode) => {
    setMode(next)
    setMessage('')
    setIsError(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setIsError(false)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setIsError(true)
        setMessage(error.message)
      } else {
        setMessage('Account created! You can now log in.')
      }
    } else if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setIsError(true)
        setMessage(error.message)
      }
      // On success, no message needed — App.tsx will detect the session change
    } else {
      // The recovery link returns the user to this app, where App.tsx
      // catches the PASSWORD_RECOVERY event and shows the new-password screen.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
      if (error) {
        setIsError(true)
        setMessage(error.message)
      } else {
        setMessage('Check your email for a password reset link.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-white text-center">{TITLES[mode]}</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 rounded bg-slate-700 text-white outline-none"
        />

        {mode !== 'forgot' && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="p-2 rounded bg-slate-700 text-white outline-none"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? 'Please wait...' : SUBMIT_LABELS[mode]}
        </button>

        {message && (
          <p className={`text-sm text-center ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
            {message}
          </p>
        )}

        <div className="flex flex-col gap-2">
          {mode === 'signup' && (
            <button type="button" onClick={() => switchMode('login')} className="text-sm text-slate-400 hover:text-white text-center">
              Already have an account? Log in
            </button>
          )}
          {mode === 'login' && (
            <>
              <button type="button" onClick={() => switchMode('signup')} className="text-sm text-slate-400 hover:text-white text-center">
                Need an account? Sign up
              </button>
              <button type="button" onClick={() => switchMode('forgot')} className="text-sm text-slate-400 hover:text-white text-center">
                Forgot your password?
              </button>
            </>
          )}
          {mode === 'forgot' && (
            <button type="button" onClick={() => switchMode('login')} className="text-sm text-slate-400 hover:text-white text-center">
              Back to log in
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default Auth
