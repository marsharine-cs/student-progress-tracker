import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Skill } from '../types/Skill'
import SkillForm from './SkillForm'
import SkillList from './SkillList'

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((key) => key + 1)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false })

      if (!active) return

      if (error) {
        setError(error.message)
      } else {
        setError(null)
        setSkills(data)
      }
      setLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [refreshKey])

  const handleSaved = () => {
    setEditingSkill(null)
    refresh()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Skills</h2>
      <SkillForm
        key={editingSkill?.id ?? 'new'}
        editingSkill={editingSkill}
        onSaved={handleSaved}
        onCancelEdit={() => setEditingSkill(null)}
      />
      {loading && <p className="text-slate-400">Loading skills...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && (
        <SkillList skills={skills} onEdit={setEditingSkill} onDeleted={refresh} />
      )}
    </div>
  )
}
