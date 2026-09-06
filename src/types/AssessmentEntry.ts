export type AssessmentStatus = 'mastered' | 'partial' | 'needs_help'

export interface AssessmentEntry {
  id: string
  user_id: string
  student_id: string
  skill_id: string
  status: AssessmentStatus
  assessed_at: string
  students: { name: string } | null
  skills: { name: string } | null
}
