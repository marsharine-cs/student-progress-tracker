import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Student } from '../types/Student'
import type { Skill } from '../types/Skill'
import type { AssessmentEntry, AssessmentStatus } from '../types/AssessmentEntry'

const STATUS_STYLES: Record<AssessmentStatus, string> = {
  mastered: 'bg-green-600',
  partial: 'bg-amber-500',
  needs_help: 'bg-red-600',
}

const STATUS_LABELS: Record<AssessmentStatus, string> = {
  mastered: 'Mastered',
  partial: 'Partial',
  needs_help: 'Needs Help',
}

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [latestByPair, setLatestByPair] = useState<Record<string, AssessmentStatus>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)

      const [studentsRes, skillsRes, entriesRes] = await Promise.all([
        supabase.from('students').select('*').order('name'),
        supabase.from('skills').select('*').order('name'),
        supabase
          .from('assessment_entries')
          .select('student_id, skill_id, status, assessed_at')
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

        const lookup: Record<string, AssessmentStatus> = {}
        const entries = (entriesRes.data as Pick<AssessmentEntry, 'student_id' | 'skill_id' | 'status'>[]) ?? []
        for (const entry of entries) {
          const key = `${entry.student_id}-${entry.skill_id}`
          if (!(key in lookup)) {
            lookup[key] = entry.status
          }
        }
        setLatestByPair(lookup)
      }

      setLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <p className="text-slate-400">Loading dashboard...</p>
  }

  if (error) {
    return <p className="text-red-400">{error}</p>
  }

  if (students.length === 0 || skills.length === 0) {
    return (
      <p className="text-slate-400">
        Add at least one student and one skill to see the dashboard.
      </p>
    )
  }

  return (
    <div className="max-w-full overflow-x-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="text-left text-slate-400 font-normal p-2">Student</th>
            {skills.map((skill) => (
              <th
                key={skill.id}
                className="text-slate-400 font-normal p-2 whitespace-nowrap"
              >
                {skill.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="text-white font-semibold p-2 whitespace-nowrap">
                {student.name}
              </td>
              {skills.map((skill) => {
                const status = latestByPair[`${student.id}-${skill.id}`]
                return (
                  <td key={skill.id} className="p-2 text-center">
                    <span
                      title={status ? STATUS_LABELS[status] : 'Not assessed'}
                      className={`inline-block w-8 h-8 rounded border border-slate-600 ${
                        status ? STATUS_STYLES[status] : 'bg-slate-800'
                      }`}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
