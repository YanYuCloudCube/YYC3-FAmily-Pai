/**
 * file reminder.ts
 * description 提醒调度引擎 — 截止/依赖/阻塞/进度提醒的创建与巡检
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-20
 * updated 2026-05-20
 * status active
 * tags [reminder],[scheduler],[timer]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

export type ReminderType = 'deadline' | 'dependency' | 'blocking' | 'progress'

export interface Reminder {
  id: string
  taskId: string
  type: ReminderType
  message: string
  remindAt: number
  triggered: boolean
}

export interface ReminderTask {
  id: string
  title: string
  status: string
  dueDate?: number
}

let idCounter = 0

export function createReminderId(): string {
  return `reminder-${Date.now()}-${++idCounter}`
}

export function createReminder(
  taskId: string,
  type: ReminderType,
  message: string,
  remindAt: number
): Reminder {
  return { id: createReminderId(), taskId, type, message, remindAt, triggered: false }
}

export function createDeadlineReminder(
  taskId: string,
  dueDate: number,
  leadMs = 24 * 60 * 60 * 1000
): Reminder | null {
  const remindAt = dueDate - leadMs
  if (remindAt <= Date.now()) return null
  return createReminder(taskId, 'deadline', 'Task due within 24 hours', remindAt)
}

export function createDependencyReminder(
  taskId: string,
  depTask: ReminderTask
): Reminder | null {
  if (depTask.status === 'done') return null
  return createReminder(
    taskId,
    'dependency',
    `Dependency "${depTask.title}" completed, ready to start`,
    Date.now()
  )
}

export function createBlockingReminder(
  taskId: string,
  blockingTask: ReminderTask
): Reminder {
  return createReminder(
    taskId,
    'blocking',
    `Blocked by "${blockingTask.title}"`,
    Date.now()
  )
}

export function createProgressReminder(
  taskId: string,
  progress: number
): Reminder {
  return createReminder(
    taskId,
    'progress',
    `Task progress reached ${progress}%`,
    Date.now()
  )
}

export function checkDueReminders(
  reminders: Reminder[],
  now = Date.now()
): Reminder[] {
  return reminders.filter((r) => !r.triggered && r.remindAt <= now)
}

export function markTriggered(reminders: Reminder[], ids: string[]): Reminder[] {
  const idSet = new Set(ids)
  return reminders.map((r) => (idSet.has(r.id) ? { ...r, triggered: true } : r))
}

export class ReminderEngine {
  private reminders: Reminder[] = []

  add(reminder: Reminder): void {
    this.reminders.push(reminder)
  }

  checkDue(now = Date.now()): Reminder[] {
    return checkDueReminders(this.reminders, now)
  }

  markTriggered(ids: string[]): void {
    this.reminders = markTriggered(this.reminders, ids)
  }

  getAll(): Reminder[] {
    return [...this.reminders]
  }

  clear(): void {
    this.reminders = []
  }
}
