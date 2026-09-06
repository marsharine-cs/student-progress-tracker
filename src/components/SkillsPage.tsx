import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Skill } from '../types/Skill'
import SkillForm from './SkillForm'
import SkillList from './SkillList'

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  const fetchSkills = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setSkills(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  const handleSaved = () => {
    setEditingSkill(null)
    fetchSkills()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Skills</h2>
      <SkillForm
        editingSkill={editingSkill}
        onSaved={handleSaved}
        onCancelEdit={() => setEditingSkill(null)}
      />
      {loading && <p className="text-slate-400">Loading skills...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && (
        <SkillList skills={skills} onEdit={setEditingSkill} onDeleted={fetchSkills} />
      )}
    </div>
  )
}
