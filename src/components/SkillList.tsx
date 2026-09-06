import { supabase } from '../lib/supabaseClient'
import type { Skill } from '../types/Skill'

interface SkillListProps {
  skills: Skill[]
  onEdit: (skill: Skill) => void
  onDeleted: () => void
}

export default function SkillList({ skills, onEdit, onDeleted }: SkillListProps) {
  if (skills.length === 0) {
    return <p className="text-slate-400">No skills yet. Add one to get started.</p>
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (!error) {
      onDeleted()
    }
  }

  return (
    <ul className="space-y-2">
      {skills.map((skill) => (
        <li
          key={skill.id}
          className="bg-slate-800 rounded p-4 flex justify-between items-center"
        >
          <p className="text-white font-semibold">{skill.name}</p>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(skill)}
              className="text-slate-300 hover:text-white text-sm px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(skill.id)}
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
