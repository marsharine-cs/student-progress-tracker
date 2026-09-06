import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Student } from '../types/Student'
import type { Skill } from '../types/Skill'
import type { AssessmentStatus } from '../types/AssessmentEntry'

interface AssessmentEntryFormProps {
  students: Student[]
  skills: Skill[]
  onSaved: () => void
}

const STATUS_OPTIONS: { value: AssessmentStatus; label: string }[] = [
  { value: 'mastered', label: 'Mastered' },
  { value: 'partial', label: 'Partial' },
  { value: 'needs_help', label: 'Needs Help' },
]

export default function AssessmentEntryForm({ students, skills, onSaved }: AssessmentEntryFormProps) {
  const [studentId, setStudentId] = useState('')
  const [skillId, setSkillId] = useState('')
  const [status, setStatus] = useState<AssessmentStatus>('mastered')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { error } = await supabase.from('assessment_entries').insert({
      student_id: studentId,
      skill_id: skillId,
      status,
    })

    if (error) {
      setError(error.message)
    } else {
      setStudentId('')
      setSkillId('')
      setStatus('mastered')
      onSaved()
    }

    setSaving(false)
  }

  if (students.length === 0 || skills.length === 0) {
    return (
      <p className="text-slate-400 mb-6">
        Add at least one student and one skill before recording an assessment.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 rounded p-4 mb-6 flex flex-col gap-3"
    >
      <select
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        required
        className="p-2 rounded bg-slate-700 text-white outline-none"
      >
        <option value="" disabled>
          Select student
        </option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </select>

      <select
        value={skillId}
        onChange={(e) => setSkillId(e.target.value)}
        required
        className="p-2 rounded bg-slate-700 text-white outline-none"
      >
        <option value="" disabled>
          Select skill
        </option>
        {skills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as AssessmentStatus)}
        className="p-2 rounded bg-slate-700 text-white outline-none"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Record Assessment'}
      </button>
    </form>
  )
}
