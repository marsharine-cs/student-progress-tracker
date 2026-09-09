import { describe, expect, it } from 'vitest'
import { countStatuses, percentOf, rankBySupportNeed } from './dashboardStats'

type Entry = { student_id: string; status: 'mastered' | 'partial' | 'needs_help' }

const students = [
  { id: 'ada', name: 'Ada' },
  { id: 'grace', name: 'Grace' },
  { id: 'linus', name: 'Linus' },
  { id: 'noor', name: 'Noor' },
]

const entries: Entry[] = [
  { student_id: 'ada', status: 'mastered' },
  { student_id: 'ada', status: 'mastered' },
  { student_id: 'grace', status: 'needs_help' },
  { student_id: 'grace', status: 'partial' },
  { student_id: 'linus', status: 'needs_help' },
  { student_id: 'linus', status: 'needs_help' },
  { student_id: 'ghost', status: 'needs_help' }, // no matching student
]

describe('countStatuses', () => {
  it('returns zeros for no entries', () => {
    expect(countStatuses([])).toEqual({ mastered: 0, partial: 0, needs_help: 0 })
  })

  it('tallies each status', () => {
    expect(countStatuses(entries)).toEqual({ mastered: 2, partial: 1, needs_help: 4 })
  })
})

describe('percentOf', () => {
  it('rounds to a whole number', () => {
    expect(percentOf(1, 3)).toBe(33)
    expect(percentOf(2, 3)).toBe(67)
  })

  it('is 0 when the total is 0', () => {
    expect(percentOf(0, 0)).toBe(0)
  })
})

describe('rankBySupportNeed', () => {
  const rank = (limit?: number) =>
    rankBySupportNeed(students, entries, (entry) => entry.student_id, limit)

  it('orders by needs-help, then partial, then name', () => {
    expect(rank().map((row) => row.name)).toEqual(['Linus', 'Grace', 'Ada'])
  })

  it('carries per-status counts and totals', () => {
    expect(rank()[1]).toEqual({
      id: 'grace',
      name: 'Grace',
      needsHelp: 1,
      partial: 1,
      mastered: 0,
      total: 2,
    })
  })

  it('leaves out items with no evidence', () => {
    expect(rank().some((row) => row.id === 'noor')).toBe(false)
  })

  it('ignores entries for unknown ids', () => {
    expect(rank().some((row) => row.id === 'ghost')).toBe(false)
  })

  it('respects the limit', () => {
    expect(rank(2)).toHaveLength(2)
  })

  it('breaks ties alphabetically', () => {
    const tied: Entry[] = [
      { student_id: 'noor', status: 'partial' },
      { student_id: 'ada', status: 'partial' },
    ]
    const rows = rankBySupportNeed(students, tied, (entry) => entry.student_id)
    expect(rows.map((row) => row.name)).toEqual(['Ada', 'Noor'])
  })
})
