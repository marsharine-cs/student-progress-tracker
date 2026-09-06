import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Student } from '../types/Student'

interface StudentFormProps {
  editingStudent: Student | null
  onSaved: () => void
  onCancelEdit: () => void
}

export default function StudentForm({ editingStudent, onSaved, onCancelEdit }: StudentFormProps) {
  const [name, setName] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setName(editingStudent?.name ?? '')
    setGradeLevel(editingStudent?.grade_level ?? '')
    setNotes(editingStudent?.notes ?? '')
    setError(null)
  }, [editingStudent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const values = {
      name,
      grade_level: gradeLevel || null,
      notes: notes || null,
    }

    const { error } = editingStudent
      ? await supabase.from('students').update(values).eq('id', editingStudent.id)
      : await supabase.from('students').insert(values)

    if (error) {
      setError(error.message)
    } else {
      setName('')
      setGradeLevel('')
      setNotes('')
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
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="p-2 rounded bg-slate-700 text-white outline-none"
      />
      <input
        type="text"
        placeholder="Grade level (optional)"
        value={gradeLevel}
        onChange={(e) => setGradeLevel(e.target.value)}
        className="p-2 rounded bg-slate-700 text-white outline-none"
      />
      <input
        type="text"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="p-2 rounded bg-slate-700 text-white outline-none"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving...' : editingStudent ? 'Save Changes' : 'Add Student'}
        </button>
        {editingStudent && (
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
