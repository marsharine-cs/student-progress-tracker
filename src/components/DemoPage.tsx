import { useState } from 'react'
import { buildLatestStatusByPair } from '../lib/dashboardGrid'
import type { AssessmentStatus } from '../types/AssessmentEntry'

const students = ['Alex Morgan', 'Jordan Lee', 'Sam Rivera', 'Taylor Brooks']
const skills = ['Fractions', 'Linear equations', 'Reading graphs']
const labels: Record<AssessmentStatus, string> = { mastered: 'Mastered', partial: 'Partial', needs_help: 'Needs Help' }
const colors: Record<AssessmentStatus, string> = { mastered: 'bg-green-700', partial: 'bg-amber-700', needs_help: 'bg-red-700' }
const seed = [
  { student_id: '0', skill_id: '0', status: 'mastered' as AssessmentStatus, assessed_at: '2026-09-28' },
  { student_id: '0', skill_id: '1', status: 'partial' as AssessmentStatus, assessed_at: '2026-09-28' },
  { student_id: '1', skill_id: '0', status: 'needs_help' as AssessmentStatus, assessed_at: '2026-09-28' },
  { student_id: '1', skill_id: '2', status: 'mastered' as AssessmentStatus, assessed_at: '2026-09-28' },
  { student_id: '2', skill_id: '1', status: 'mastered' as AssessmentStatus, assessed_at: '2026-09-28' },
  { student_id: '3', skill_id: '2', status: 'partial' as AssessmentStatus, assessed_at: '2026-09-28' },
]
const control = 'rounded bg-slate-700 p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'

export default function DemoPage() {
  const [entries, setEntries] = useState(seed)
  const [tab, setTab] = useState('Dashboard')
  const [student, setStudent] = useState('0')
  const [skill, setSkill] = useState('0')
  const [status, setStatus] = useState<AssessmentStatus>('mastered')
  const [message, setMessage] = useState('')
  const latest = buildLatestStatusByPair(entries)

  return <main className="min-h-screen bg-slate-900 px-4 py-8 text-slate-100">
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-sm font-semibold text-blue-300">INTERACTIVE PORTFOLIO DEMO</p><h1 className="text-3xl font-bold">Student Progress Tracker</h1></div>
        <a href={window.location.pathname} className={control}>Log in / Create account</a>
      </header>
      <p className="rounded border border-blue-700 bg-slate-800 p-4">Explore fictional classroom data. Record an assessment to update mastery and history. Changes stay in this browser session and reset on refresh; no account is required.</p>
      <nav aria-label="Demo sections" className="flex flex-wrap gap-2">{['Dashboard', 'Students', 'Skills', 'Assessments'].map(name => <button key={name} aria-current={tab === name ? 'page' : undefined} onClick={() => setTab(name)} className={`${control} ${tab === name ? 'bg-blue-600' : ''}`}>{name}</button>)}</nav>
      <section>
        <h2 className="mb-4 text-2xl font-bold">{tab}</h2>
        {tab === 'Dashboard' && <div className="overflow-x-auto"><table className="w-full border-collapse text-left"><caption className="mb-3 text-left text-slate-300">Latest mastery by student and skill</caption><thead><tr><th scope="col" className="p-3">Student</th>{skills.map(name => <th scope="col" className="p-3" key={name}>{name}</th>)}</tr></thead><tbody>{students.map((name, i) => <tr key={name}><th scope="row" className="p-3">{name}</th>{skills.map((s, j) => { const value = latest[`${i}-${j}`]; return <td key={s} className="p-3"><span className={`inline-block rounded p-2 ${value ? colors[value] : 'bg-slate-700'}`}>{value ? labels[value] : 'Not assessed'}</span></td> })}</tr>)}</tbody></table></div>}
        {tab === 'Students' && <ul className="space-y-2">{students.map(name => <li className="rounded bg-slate-800 p-4" key={name}>{name}</li>)}</ul>}
        {tab === 'Skills' && <ul className="space-y-2">{skills.map(name => <li className="rounded bg-slate-800 p-4" key={name}>{name}</li>)}</ul>}
        {tab === 'Assessments' && <>
          <form className="grid gap-4 rounded bg-slate-800 p-4 sm:grid-cols-3" onSubmit={event => { event.preventDefault(); setEntries(previous => [{ student_id: student, skill_id: skill, status, assessed_at: new Date().toISOString().slice(0, 10) }, ...previous]); setMessage(`Assessment recorded for ${students[Number(student)]}. Dashboard updated.`) }}>
            <label className="flex flex-col gap-2">Student<select className={control} value={student} onChange={event => setStudent(event.target.value)}>{students.map((name, i) => <option key={name} value={i}>{name}</option>)}</select></label>
            <label className="flex flex-col gap-2">Skill<select className={control} value={skill} onChange={event => setSkill(event.target.value)}>{skills.map((name, i) => <option key={name} value={i}>{name}</option>)}</select></label>
            <label className="flex flex-col gap-2">Mastery status<select className={control} value={status} onChange={event => setStatus(event.target.value as AssessmentStatus)}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <button className={`${control} bg-blue-600`} type="submit">Record assessment</button>
          </form>
          <p role="status" className="my-4 text-emerald-300">{message}</p>
          <h3 className="mb-3 text-xl font-semibold">Assessment history — newest first</h3>
          <ul className="space-y-2">{entries.map((entry, i) => <li key={i} className="rounded bg-slate-800 p-3">{entry.assessed_at} · {students[Number(entry.student_id)]} · {skills[Number(entry.skill_id)]} · {labels[entry.status]}</li>)}</ul>
        </>}
      </section>
      <button className={control} onClick={() => { setEntries(seed); setMessage('Demo reset to the original sample data.') }}>Reset demo data</button>
    </div>
  </main>
}
