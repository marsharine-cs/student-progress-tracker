import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Student } from '../types/Student'
import StudentList from './StudentList'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
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
    }

    fetchStudents()
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Students</h2>
      {loading && <p className="text-slate-400">Loading students...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && <StudentList students={students} />}
    </div>
  )
}
