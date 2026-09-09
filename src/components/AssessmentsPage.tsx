import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Student } from '../types/Student'
import type { Skill } from '../types/Skill'
import type { AssessmentEntry } from '../types/AssessmentEntry'
import AssessmentEntryForm from './AssessmentEntryForm'
import AssessmentEntryList from './AssessmentEntryList'

export default function AssessmentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [entries, setEntries] = useState<AssessmentEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((key) => key + 1)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)

      const [studentsRes, skillsRes, entriesRes] = await Promise.all([
        supabase.from('students').select('*').order('name'),
        supabase.from('skills').select('*').order('name'),
        supabase
          .from('assessment_entries')
          .select('*, students(name), skills(name)')
          .order('assessed_at', { ascending: false }),
      ])

      if (!active) return

      const firstError = studentsRes.error ?? skillsRes.error ?? entriesRes.error
      if (firstError) {
        setError(firstError.message)
      } else {
        setError(null)
        setStudents(studentsRes.data ?? [])
        setSkills(skillsRes.data ?? [])
        setEntries((entriesRes.data as AssessmentEntry[]) ?? [])
      }

      setLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [refreshKey])

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Assessments</h2>
      <AssessmentEntryForm students={students} skills={skills} onSaved={refresh} />
      {loading && <p className="text-slate-400">Loading assessments...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && <AssessmentEntryList entries={entries} onDeleted={refresh} />}
    </div>
  )
}
