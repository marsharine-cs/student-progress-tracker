import { describe, expect, it } from 'vitest'
import { buildLatestStatusByPair } from './dashboardGrid'

describe('buildLatestStatusByPair', () => {
  it('returns an empty lookup for no entries', () => {
    expect(buildLatestStatusByPair([])).toEqual({})
  })

  it('keys each entry by student and skill', () => {
    const lookup = buildLatestStatusByPair([
      { student_id: 's1', skill_id: 'k1', status: 'mastered' },
      { student_id: 's1', skill_id: 'k2', status: 'needs_help' },
      { student_id: 's2', skill_id: 'k1', status: 'partial' },
    ])

    expect(lookup).toEqual({
      's1-k1': 'mastered',
      's1-k2': 'needs_help',
      's2-k1': 'partial',
    })
  })

  it('keeps only the first (most recent) entry per pair, given newest-first input', () => {
    const lookup = buildLatestStatusByPair([
      { student_id: 's1', skill_id: 'k1', status: 'mastered' },
      { student_id: 's1', skill_id: 'k1', status: 'needs_help' },
    ])

    expect(lookup).toEqual({ 's1-k1': 'mastered' })
  })
})
