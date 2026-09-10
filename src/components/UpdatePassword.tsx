import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface UpdatePasswordProps {
  onDone: () => void
}

/**
 * Shown after the user arrives from a password-recovery email. Supabase has
 * already signed them in with a temporary session; this screen lets them
 * pick a new password before continuing into the app.
 */
function UpdatePassword({ onDone }: UpdatePasswordProps) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)

    if (error) {
      setError(error.message)
    } else {
      onDone()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-white text-center">Choose a New Password</h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="p-2 rounded bg-slate-700 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={6}
          className="p-2 rounded bg-slate-700 text-white outline-none"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Password'}
        </button>

        {error && <p className="text-sm text-center text-red-400">{error}</p>}
      </form>
    </div>
  )
}

export default UpdatePassword
