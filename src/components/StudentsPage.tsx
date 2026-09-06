import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Student } from '../types/Student'
import StudentForm from './StudentForm'
import StudentList from './StudentList'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setStudents(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleSaved = () => {
    setEditingStudent(null)
    fetchStudents()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Students</h2>
      <StudentForm
        editingStudent={editingStudent}
        onSaved={handleSaved}
        onCancelEdit={() => setEditingStudent(null)}
      />
      {loading && <p className="text-slate-400">Loading students...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && (
        <StudentList
          students={students}
          onEdit={setEditingStudent}
          onDeleted={fetchStudents}
        />
      )}
    </div>
  )
}
