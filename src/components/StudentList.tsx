import { supabase } from '../lib/supabaseClient'
import type { Student } from '../types/Student'

interface StudentListProps {
  students: Student[]
  onEdit: (student: Student) => void
  onDeleted: () => void
}

export default function StudentList({ students, onEdit, onDeleted }: StudentListProps) {
  if (students.length === 0) {
    return <p className="text-slate-400">No students yet. Add one to get started.</p>
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('students').delete().eq('id', id)
    if (!error) {
      onDeleted()
    }
  }

  return (
    <ul className="space-y-2">
      {students.map((student) => (
        <li
          key={student.id}
          className="bg-slate-800 rounded p-4 flex justify-between items-center"
        >
          <div>
            <p className="text-white font-semibold">{student.name}</p>
            {student.grade_level && (
              <p className="text-slate-400 text-sm">{student.grade_level}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(student)}
              className="text-slate-300 hover:text-white text-sm px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(student.id)}
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
