import type { AssessmentStatus } from '../types/AssessmentEntry'

export type StatusCounts = Record<AssessmentStatus, number>

export interface NamedItem {
  id: string
  name: string
}

export interface StatusEntry {
  status: AssessmentStatus
}

export interface SupportRow extends NamedItem {
  needsHelp: number
  partial: number
  mastered: number
  total: number
}

/** Count how many assessment entries fall under each mastery status. */
export function countStatuses(entries: StatusEntry[]): StatusCounts {
  const counts: StatusCounts = { mastered: 0, partial: 0, needs_help: 0 }
  for (const entry of entries) {
    counts[entry.status] += 1
  }
  return counts
}

/** Whole-number percentage of `count` out of `total`; 0 when there is no total. */
export function percentOf(count: number, total: number): number {
  return total ? Math.round((count / total) * 100) : 0
}

/**
 * Rank students or skills by how much support their evidence signals:
 * most needs-help first, then most partial, then name. Items with no
 * assessment evidence are left out, and entries pointing at unknown ids
 * are ignored.
 */
export function rankBySupportNeed<E extends StatusEntry>(
  items: NamedItem[],
  entries: E[],
  getItemId: (entry: E) => string,
  limit = 5,
): SupportRow[] {
  const rows = new Map<string, SupportRow>()

  for (const item of items) {
    rows.set(item.id, { id: item.id, name: item.name, needsHelp: 0, partial: 0, mastered: 0, total: 0 })
  }

  for (const entry of entries) {
    const row = rows.get(getItemId(entry))
    if (!row) continue

    row.total += 1
    if (entry.status === 'needs_help') row.needsHelp += 1
    if (entry.status === 'partial') row.partial += 1
    if (entry.status === 'mastered') row.mastered += 1
  }

  return [...rows.values()]
    .filter((row) => row.total > 0)
    .sort((a, b) => {
      if (b.needsHelp !== a.needsHelp) return b.needsHelp - a.needsHelp
      if (b.partial !== a.partial) return b.partial - a.partial
      return a.name.localeCompare(b.name)
    })
    .slice(0, limit)
}
