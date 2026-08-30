import type { Student } from '../types/Student'

interface StudentListProps {
  students: Student[]
}

export default function StudentList({ students }: StudentListProps) {
  if (students.length === 0) {
    return <p className="text-slate-400">No students yet. Add one to get started.</p>
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
        </li>
      ))}
    </ul>
  )
}
