import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type MasteryStatus = 'mastered' | 'partial' | 'needs_help'

type Student = {
  id: string
  name: string
}

type Skill = {
  id: string
  name: string
}

type AssessmentEntry = {
  id: string
  student_id: string
  skill_id: string
  status: MasteryStatus
  assessed_at: string
}

type StudentSupportRow = {
  id: string
  name: string
  needsHelp: number
  partial: number
  mastered: number
  total: number
}

type SkillDifficultyRow = {
  id: string
  name: string
  needsHelp: number
  partial: number
  mastered: number
  total: number
}

const STATUS_LABELS: Record<MasteryStatus, string> = {
  mastered: 'Mastered',
  partial: 'Partial',
  needs_help: 'Needs Help',
}

const STATUS_BADGES: Record<MasteryStatus, string> = {
  mastered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  partial: 'bg-amber-100 text-amber-800 border-amber-200',
  needs_help: 'bg-rose-100 text-rose-800 border-rose-200',
}

function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [assessments, setAssessments] = useState<AssessmentEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setLoading(true)
      setError(null)

      const [studentsResult, skillsResult, assessmentsResult] = await Promise.all([
        supabase.from('students').select('id, name').order('name'),
        supabase.from('skills').select('id, name').order('name'),
        supabase
          .from('assessment_entries')
          .select('id, student_id, skill_id, status, assessed_at')
          .order('assessed_at', { ascending: false }),
      ])

      if (!isMounted) {
        return
      }

      const firstError = studentsResult.error ?? skillsResult.error ?? assessmentsResult.error

      if (firstError) {
        setError(firstError.message)
        setLoading(false)
        return
      }

      setStudents((studentsResult.data ?? []) as Student[])
      setSkills((skillsResult.data ?? []) as Skill[])
      setAssessments((assessmentsResult.data ?? []) as AssessmentEntry[])
      setLoading(false)
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  const studentById = useMemo(
    () => new Map(students.map((student) => [student.id, student])),
    [students],
  )

  const skillById = useMemo(
    () => new Map(skills.map((skill) => [skill.id, skill])),
    [skills],
  )

  const statusCounts = useMemo(() => {
    return assessments.reduce(
      (counts, entry) => {
        counts[entry.status] += 1
        return counts
      },
      { mastered: 0, partial: 0, needs_help: 0 } as Record<MasteryStatus, number>,
    )
  }, [assessments])

  const studentSupport = useMemo<StudentSupportRow[]>(() => {
    const rows = new Map<string, StudentSupportRow>()

    students.forEach((student) => {
      rows.set(student.id, {
        id: student.id,
        name: student.name,
        needsHelp: 0,
        partial: 0,
        mastered: 0,
        total: 0,
      })
    })

    assessments.forEach((entry) => {
      const row = rows.get(entry.student_id)
      if (!row) return

      row.total += 1
      if (entry.status === 'needs_help') row.needsHelp += 1
      if (entry.status === 'partial') row.partial += 1
      if (entry.status === 'mastered') row.mastered += 1
    })

    return [...rows.values()]
      .filter((row) => row.total > 0)
      .sort((a, b) => {
        if (b.needsHelp !== a.needsHelp) return b.needsHelp - a.needsHelp
        if (b.partial !== a.partial) return b.partial - a.partial
        return a.name.localeCompare(b.name)
      })
      .slice(0, 5)
  }, [assessments, students])

  const skillDifficulty = useMemo<SkillDifficultyRow[]>(() => {
    const rows = new Map<string, SkillDifficultyRow>()

    skills.forEach((skill) => {
      rows.set(skill.id, {
        id: skill.id,
        name: skill.name,
        needsHelp: 0,
        partial: 0,
        mastered: 0,
        total: 0,
      })
    })

    assessments.forEach((entry) => {
      const row = rows.get(entry.skill_id)
      if (!row) return

      row.total += 1
      if (entry.status === 'needs_help') row.needsHelp += 1
      if (entry.status === 'partial') row.partial += 1
      if (entry.status === 'mastered') row.mastered += 1
    })

    return [...rows.values()]
      .filter((row) => row.total > 0)
      .sort((a, b) => {
        if (b.needsHelp !== a.needsHelp) return b.needsHelp - a.needsHelp
        if (b.partial !== a.partial) return b.partial - a.partial
        return a.name.localeCompare(b.name)
      })
      .slice(0, 5)
  }, [assessments, skills])

  const recentAssessments = assessments.slice(0, 6)

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto" aria-live="polite">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-slate-300">
          Loading dashboard…
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-5xl mx-auto" role="alert">
        <div className="bg-rose-950/60 border border-rose-800 rounded-xl p-6 text-rose-100">
          <h2 className="text-lg font-bold">Dashboard could not load</h2>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
          Teacher Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Class progress at a glance</h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          Use current assessment evidence to spot student support needs, skill-level trends, and recent activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Students" value={students.length} />
        <SummaryCard label="Skills" value={skills.length} />
        <SummaryCard label="Assessments" value={assessments.length} />
        <SummaryCard
          label="Need Help"
          value={statusCounts.needs_help}
          note={assessments.length ? `${Math.round((statusCounts.needs_help / assessments.length) * 100)}% of entries` : 'No entries yet'}
        />
      </div>

      {assessments.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-white">No assessment data yet</h2>
          <p className="mt-2 text-slate-400">
            Add students and skills, then record assessment evidence to populate dashboard insights.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm font-semibold text-blue-400">Mastery distribution</p>
                  <h2 className="mt-1 text-xl font-bold text-white">Assessment status</h2>
                </div>
                <p className="text-sm text-slate-400">{assessments.length} total</p>
              </div>

              <div className="space-y-4">
                <DistributionRow label="Mastered" count={statusCounts.mastered} total={assessments.length} barClass="bg-emerald-500" />
                <DistributionRow label="Partial" count={statusCounts.partial} total={assessments.length} barClass="bg-amber-500" />
                <DistributionRow label="Needs Help" count={statusCounts.needs_help} total={assessments.length} barClass="bg-rose-500" />
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-sm font-semibold text-blue-400">Quick signal</p>
              <h2 className="mt-1 text-xl font-bold text-white">Support priority</h2>
              <div className="mt-5">
                {studentSupport[0] ? (
                  <>
                    <p className="text-2xl font-bold text-white">{studentSupport[0].name}</p>
                    <p className="mt-2 text-slate-400">
                      {studentSupport[0].needsHelp} needs-help and {studentSupport[0].partial} partial assessment signals across {studentSupport[0].total} recorded entries.
                    </p>
                  </>
                ) : (
                  <p className="text-slate-400">No student-level priorities yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RankedPanel
              title="Students needing support"
              subtitle="Ranked by needs-help, then partial evidence"
              rows={studentSupport.map((row) => ({
                id: row.id,
                name: row.name,
                primary: `${row.needsHelp} needs help`,
                secondary: `${row.partial} partial · ${row.mastered} mastered`,
              }))}
              emptyText="No student assessment evidence yet."
            />

            <RankedPanel
              title="Skills needing attention"
              subtitle="Skills with the most support signals"
              rows={skillDifficulty.map((row) => ({
                id: row.id,
                name: row.name,
                primary: `${row.needsHelp} needs help`,
                secondary: `${row.partial} partial · ${row.mastered} mastered`,
              }))}
              emptyText="No skill assessment evidence yet."
            />
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <p className="text-sm font-semibold text-blue-400">Recent activity</p>
              <h2 className="mt-1 text-xl font-bold text-white">Latest assessment evidence</h2>
            </div>

            <div className="divide-y divide-slate-700">
              {recentAssessments.map((entry) => {
                const student = studentById.get(entry.student_id)
                const skill = skillById.get(entry.skill_id)

                return (
                  <div key={entry.id} className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{student?.name ?? 'Unknown student'}</p>
                      <p className="text-sm text-slate-400">{skill?.name ?? 'Unknown skill'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${STATUS_BADGES[entry.status]}`}>
                        {STATUS_LABELS[entry.status]}
                      </span>
                      <time className="text-xs text-slate-500" dateTime={entry.assessed_at}>
                        {new Date(entry.assessed_at).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

type SummaryCardProps = {
  label: string
  value: number
  note?: string
}

function SummaryCard({ label, value, note }: SummaryCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <p className="text-sm font-semibold text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      {note ? <p className="mt-1 text-xs text-slate-500">{note}</p> : null}
    </div>
  )
}

type DistributionRowProps = {
  label: string
  count: number
  total: number
  barClass: string
}

function DistributionRow({ label, count, total, barClass }: DistributionRowProps) {
  const percentage = total ? Math.round((count / total) * 100) : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-200">{label}</span>
        <span className="text-slate-400">{count} · {percentage}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-700" aria-label={`${label}: ${percentage}%`}>
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

type RankedPanelRow = {
  id: string
  name: string
  primary: string
  secondary: string
}

type RankedPanelProps = {
  title: string
  subtitle: string
  rows: RankedPanelRow[]
  emptyText: string
}

function RankedPanel({ title, subtitle, rows, emptyText }: RankedPanelProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>

      {rows.length ? (
        <ol className="divide-y divide-slate-700">
          {rows.map((row, index) => (
            <li key={row.id} className="p-5 flex items-center gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-slate-200">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{row.name}</p>
                <p className="mt-1 text-sm text-slate-400">{row.secondary}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-rose-300">{row.primary}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="p-6 text-slate-400">{emptyText}</p>
      )}
    </div>
  )
}

export default DashboardPage
