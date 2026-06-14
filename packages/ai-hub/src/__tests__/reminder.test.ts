import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createReminder,
  createReminderId,
  createDeadlineReminder,
  createDependencyReminder,
  createBlockingReminder,
  createProgressReminder,
  checkDueReminders,
  markTriggered,
  ReminderEngine,
} from '../router/reminder'

describe('reminder', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-20T12:00:00Z'))
  })

  describe('createReminderId', () => {
    it('generates unique IDs', () => {
      const id1 = createReminderId()
      const id2 = createReminderId()
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^reminder-\d+-\d+$/)
    })
  })

  describe('createReminder', () => {
    it('creates a reminder with all fields', () => {
      const r = createReminder('task-1', 'deadline', 'Test reminder', Date.now())
      expect(r.taskId).toBe('task-1')
      expect(r.type).toBe('deadline')
      expect(r.message).toBe('Test reminder')
      expect(r.triggered).toBe(false)
      expect(r.id).toBeTruthy()
    })
  })

  describe('createDeadlineReminder', () => {
    it('creates reminder 24h before due', () => {
      const dueDate = Date.now() + 48 * 60 * 60 * 1000
      const r = createDeadlineReminder('task-1', dueDate)
      expect(r).not.toBeNull()
      expect(r!.type).toBe('deadline')
      expect(r!.remindAt).toBe(dueDate - 24 * 60 * 60 * 1000)
    })

    it('returns null if lead time has passed', () => {
      const dueDate = Date.now() + 12 * 60 * 60 * 1000
      const r = createDeadlineReminder('task-1', dueDate)
      expect(r).toBeNull()
    })

    it('supports custom lead time', () => {
      const dueDate = Date.now() + 2 * 60 * 60 * 1000
      const r = createDeadlineReminder('task-1', dueDate, 60 * 60 * 1000)
      expect(r).not.toBeNull()
      expect(r!.remindAt).toBe(dueDate - 60 * 60 * 1000)
    })
  })

  describe('createDependencyReminder', () => {
    it('returns null if dep is done', () => {
      const r = createDependencyReminder('task-1', { id: 'dep-1', title: 'Dep', status: 'done' })
      expect(r).toBeNull()
    })

    it('creates reminder if dep is not done', () => {
      const r = createDependencyReminder('task-1', { id: 'dep-1', title: 'Dep', status: 'todo' })
      expect(r).not.toBeNull()
      expect(r!.type).toBe('dependency')
      expect(r!.message).toContain('Dep')
    })
  })

  describe('createBlockingReminder', () => {
    it('creates blocking reminder', () => {
      const r = createBlockingReminder('task-1', { id: 'b-1', title: 'Blocker', status: 'in-progress' })
      expect(r.type).toBe('blocking')
      expect(r.message).toContain('Blocker')
    })
  })

  describe('createProgressReminder', () => {
    it('creates progress reminder', () => {
      const r = createProgressReminder('task-1', 75)
      expect(r.type).toBe('progress')
      expect(r.message).toContain('75%')
    })
  })

  describe('checkDueReminders', () => {
    it('finds due reminders', () => {
      const reminders = [
        createReminder('t1', 'deadline', 'Due', Date.now() - 1000),
        createReminder('t2', 'deadline', 'Future', Date.now() + 60000),
      ]
      const due = checkDueReminders(reminders)
      expect(due.length).toBe(1)
      expect(due[0].taskId).toBe('t1')
    })

    it('excludes triggered reminders', () => {
      const r = createReminder('t1', 'deadline', 'Due', Date.now() - 1000)
      r.triggered = true
      const due = checkDueReminders([r])
      expect(due.length).toBe(0)
    })

    it('returns empty for no reminders', () => {
      expect(checkDueReminders([])).toEqual([])
    })
  })

  describe('markTriggered', () => {
    it('marks specified reminders as triggered', () => {
      const r1 = createReminder('t1', 'deadline', 'A', Date.now())
      const r2 = createReminder('t2', 'deadline', 'B', Date.now())
      const updated = markTriggered([r1, r2], [r1.id])
      expect(updated[0].triggered).toBe(true)
      expect(updated[1].triggered).toBe(false)
    })
  })

  describe('ReminderEngine', () => {
    it('adds and retrieves reminders', () => {
      const engine = new ReminderEngine()
      const r = createReminder('t1', 'deadline', 'Test', Date.now())
      engine.add(r)
      expect(engine.getAll()).toHaveLength(1)
    })

    it('checks due reminders', () => {
      const engine = new ReminderEngine()
      engine.add(createReminder('t1', 'deadline', 'Due', Date.now() - 1000))
      engine.add(createReminder('t2', 'deadline', 'Future', Date.now() + 60000))
      expect(engine.checkDue()).toHaveLength(1)
    })

    it('marks triggered', () => {
      const engine = new ReminderEngine()
      const r = createReminder('t1', 'deadline', 'Test', Date.now())
      engine.add(r)
      engine.markTriggered([r.id])
      expect(engine.checkDue()).toHaveLength(0)
    })

    it('clears all reminders', () => {
      const engine = new ReminderEngine()
      engine.add(createReminder('t1', 'deadline', 'Test', Date.now()))
      engine.clear()
      expect(engine.getAll()).toHaveLength(0)
    })
  })
})
