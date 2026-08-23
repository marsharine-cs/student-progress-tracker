import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Auth() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Account created! You can now log in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
      }
      // On success, no message needed — App.tsx will detect the session change
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-white text-center">
          {isSignUp ? 'Create Account' : 'Log In'}
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 rounded bg-slate-700 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="p-2 rounded bg-slate-700 text-white outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>

        {message && (
          <p className="text-sm text-center text-red-400">{message}</p>
        )}

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-slate-400 hover:text-white text-center"
        >
          {isSignUp ? 'Already have an account? Log in' : "Need an account? Sign up"}
        </button>
      </form>
    </div>
  )
}

export default Auth