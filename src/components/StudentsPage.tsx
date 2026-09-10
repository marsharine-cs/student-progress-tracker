import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Student } from '../types/Student'
import StudentForm from './StudentForm'
import StudentList from './StudentList'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((key) => key + 1)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })

      if (!active) return

      if (error) {
        setError(error.message)
      } else {
        setError(null)
        setStudents(data)
      }
      setLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [refreshKey])

  const handleSaved = () => {
    setEditingStudent(null)
    refresh()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Students</h2>
      <StudentForm
        key={editingStudent?.id ?? 'new'}
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
          onDeleted={refresh}
        />
      )}
    </div>
  )
}
