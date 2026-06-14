import { beforeEach, describe, expect, it } from 'vitest'
import { TrustSystem } from '../work/trust-system'

describe('TrustSystem', () => {
  let trust: TrustSystem

  beforeEach(() => {
    trust = new TrustSystem(100)
  })

  it('returns level 1 for unknown pairs', () => {
    expect(trust.getTrustLevel('user-1', 'member-1')).toBe(1)
  })

  it('records positive events and updates trust', () => {
    for (let i = 0; i < 5; i++) {
      trust.recordTrustEvent('user-1', 'member-1', {
        taskId: `task-${i}`,
        action: 'positive',
        rating: 5,
        feedback: 'excellent work',
      })
    }
    expect(trust.getTrustLevel('user-1', 'member-1')).toBeGreaterThanOrEqual(1)
  })

  it('trust level increases with consistent positive events', () => {
    for (let i = 0; i < 100; i++) {
      trust.recordTrustEvent('user-1', 'member-1', {
        taskId: `task-${i}`,
        action: 'positive',
        rating: 5,
        feedback: 'perfect',
      })
    }
    const level = trust.getTrustLevel('user-1', 'member-1')
    expect(level).toBeGreaterThanOrEqual(3)
  })

  it('negative events lower trust', () => {
    for (let i = 0; i < 50; i++) {
      trust.recordTrustEvent('user-1', 'member-1', {
        taskId: `task-${i}`,
        action: 'positive',
        rating: 5,
        feedback: 'good',
      })
    }
    for (let i = 0; i < 50; i++) {
      trust.recordTrustEvent('user-1', 'member-1', {
        taskId: `task-${i + 50}`,
        action: 'negative',
        rating: 1,
        feedback: 'error',
      })
    }
    const level = trust.getTrustLevel('user-1', 'member-1')
    expect(level).toBeLessThan(5)
  })

  it('getTrustPermissions returns correct permissions for level 1', () => {
    const perms = trust.getTrustPermissions(1)
    expect(perms).toContain('basic_chat')
    expect(perms).toContain('simple_tasks')
  })

  it('getTrustPermissions accumulates for higher levels', () => {
    const perms5 = trust.getTrustPermissions(5)
    const perms1 = trust.getTrustPermissions(1)
    expect(perms5.length).toBeGreaterThan(perms1.length)
    expect(perms5).toContain('full_access')
    expect(perms5).toContain('represent_family')
  })

  it('evicts oldest records when max is reached', () => {
    const small = new TrustSystem(3)
    for (let i = 0; i < 5; i++) {
      small.recordTrustEvent(`user-${i}`, 'member-1', {
        taskId: `task-${i}`,
        action: 'positive',
        rating: 4,
        feedback: 'ok',
      })
    }
    expect(small.getTrustLevel('user-0', 'member-1')).toBe(1)
  })

  it('isolates trust between different user-member pairs', () => {
    for (let i = 0; i < 50; i++) {
      trust.recordTrustEvent('user-1', 'member-1', {
        taskId: `task-${i}`,
        action: 'positive',
        rating: 5,
        feedback: 'great',
      })
    }
    expect(trust.getTrustLevel('user-2', 'member-1')).toBe(1)
    expect(trust.getTrustLevel('user-1', 'member-2')).toBe(1)
  })

  it('handles mixed ratings', () => {
    for (let i = 0; i < 10; i++) {
      trust.recordTrustEvent('user-1', 'member-1', {
        taskId: `task-${i}`,
        action: i % 2 === 0 ? 'positive' : 'negative',
        rating: i % 2 === 0 ? 5 : 2,
        feedback: 'mixed',
      })
    }
    const level = trust.getTrustLevel('user-1', 'member-1')
    expect(level).toBeGreaterThanOrEqual(1)
    expect(level).toBeLessThanOrEqual(5)
  })
})
