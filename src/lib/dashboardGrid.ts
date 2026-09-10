import type { AssessmentEntry, AssessmentStatus } from '../types/AssessmentEntry'

type EntryForLookup = Pick<AssessmentEntry, 'student_id' | 'skill_id' | 'status'>

/**
 * Reduces a list of assessment entries (newest first) down to the most
 * recent status per student+skill pair, keyed as `${student_id}-${skill_id}`.
 */
export function buildLatestStatusByPair(
  entries: EntryForLookup[],
): Record<string, AssessmentStatus> {
  const lookup: Record<string, AssessmentStatus> = {}

  for (const entry of entries) {
    const key = `${entry.student_id}-${entry.skill_id}`
    if (!(key in lookup)) {
      lookup[key] = entry.status
    }
  }

  return lookup
}
