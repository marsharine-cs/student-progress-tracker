import { supabase } from '../lib/supabaseClient'
import type { AssessmentEntry, AssessmentStatus } from '../types/AssessmentEntry'

interface AssessmentEntryListProps {
  entries: AssessmentEntry[]
  onDeleted: () => void
}

const STATUS_STYLES: Record<AssessmentStatus, string> = {
  mastered: 'bg-green-600 text-white',
  partial: 'bg-amber-500 text-slate-900',
  needs_help: 'bg-red-600 text-white',
}

const STATUS_LABELS: Record<AssessmentStatus, string> = {
  mastered: 'Mastered',
  partial: 'Partial',
  needs_help: 'Needs Help',
}

export default function AssessmentEntryList({ entries, onDeleted }: AssessmentEntryListProps) {
  if (entries.length === 0) {
    return <p className="text-slate-400">No assessments recorded yet.</p>
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('assessment_entries').delete().eq('id', id)
    if (!error) {
      onDeleted()
    }
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="bg-slate-800 rounded p-4 flex justify-between items-center"
        >
          <div>
            <p className="text-white font-semibold">
              {entry.students?.name ?? 'Unknown student'} — {entry.skills?.name ?? 'Unknown skill'}
            </p>
            <p className="text-slate-400 text-sm">
              {new Date(entry.assessed_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${STATUS_STYLES[entry.status]}`}>
              {STATUS_LABELS[entry.status]}
            </span>
            <button
              onClick={() => handleDelete(entry.id)}
              className="text-red-300 hover:text-white text-sm px-3 py-1 rounded bg-slate-700 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
