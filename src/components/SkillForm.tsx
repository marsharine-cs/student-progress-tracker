import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Skill } from '../types/Skill'

interface SkillFormProps {
  editingSkill: Skill | null
  onSaved: () => void
  onCancelEdit: () => void
}

export default function SkillForm({ editingSkill, onSaved, onCancelEdit }: SkillFormProps) {
  // The parent remounts this form (via `key`) whenever the editing target
  // changes, so initializing state from props here is safe.
  const [name, setName] = useState(editingSkill?.name ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { error } = editingSkill
      ? await supabase.from('skills').update({ name }).eq('id', editingSkill.id)
      : await supabase.from('skills').insert({ name })

    if (error) {
      setError(error.message)
    } else {
      setName('')
      onSaved()
    }

    setSaving(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 rounded p-4 mb-6 flex flex-col gap-3"
    >
      <input
        type="text"
        placeholder="Skill name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="p-2 rounded bg-slate-700 text-white outline-none"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving...' : editingSkill ? 'Save Changes' : 'Add Skill'}
        </button>
        {editingSkill && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
