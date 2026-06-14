/**
 * file task-formatter.ts
 * description 任务格式化工具 — 将任务对象格式化为文本/Markdown/代码注释/JSON
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-20
 * updated 2026-05-20
 * status active
 * tags [task],[formatter],[markdown],[export]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked'
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'

export interface FormatTask {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  type?: string
  dueDate?: number
  estimatedHours?: number
  tags?: string[]
  subtasks?: Array<{ title: string; isCompleted: boolean }>
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  critical: 'P0',
  high: 'P1',
  medium: 'P2',
  low: 'P3',
}

const STATUS_LABELS: Record<string, string> = {
  todo: '待办',
  'in-progress': '进行中',
  review: '审核中',
  done: '已完成',
  blocked: '阻塞',
}

export function formatTaskAsText(task: FormatTask): string {
  let text = `# ${task.title}\n\n`
  if (task.description) text += `## 描述\n${task.description}\n\n`
  text += `## 状态\n${task.status}\n\n`
  text += `## 优先级\n${task.priority}\n\n`
  if (task.type) text += `## 类型\n${task.type}\n\n`
  if (task.dueDate) text += `## 截止日期\n${new Date(task.dueDate).toLocaleString('zh-CN')}\n\n`
  if (task.estimatedHours) text += `## 预估时间\n${task.estimatedHours} 小时\n\n`
  if (task.tags && task.tags.length > 0) text += `## 标签\n${task.tags.join(', ')}\n\n`
  if (task.subtasks && task.subtasks.length > 0) {
    text += `## 子任务\n`
    task.subtasks.forEach((st, i) => {
      text += `${i + 1}. ${st.isCompleted ? '✓' : '○'} ${st.title}\n`
    })
    text += '\n'
  }
  return text
}

export function formatTaskAsMarkdown(task: FormatTask): string {
  let md = `- [${task.status === 'done' ? 'x' : ' '}] ${task.title}\n`
  if (task.description) md += `  - ${task.description}\n`
  if (task.dueDate) md += `  - ${new Date(task.dueDate).toLocaleDateString('zh-CN')}\n`
  md += `  - ${PRIORITY_LABELS[task.priority]} ${task.priority}\n`
  return md
}

export function formatTaskAsCodeComment(task: FormatTask, lang = 'typescript'): string {
  const styles: Record<string, [string, string]> = {
    javascript: ['// TODO: ', ''],
    typescript: ['// TODO: ', ''],
    python: ['# TODO: ', ''],
    html: ['<!-- TODO: ', ' -->'],
    css: ['/* TODO: ', ' */'],
  }
  const [start, end] = styles[lang] || styles.typescript
  let comment = `${start}${task.title}`
  if (task.description) comment += ` - ${task.description}`
  comment += ` [${task.priority}]${end}`
  return comment
}

export function getHighestPriority(priorities: TaskPriority[]): TaskPriority {
  const order: TaskPriority[] = ['critical', 'high', 'medium', 'low']
  for (const p of order) {
    if (priorities.includes(p)) return p
  }
  return 'medium'
}

export function exportTasksAsJSON(tasks: FormatTask[]): string {
  return JSON.stringify(tasks, null, 2)
}

export function exportTasksAsMarkdown(tasks: FormatTask[], now = new Date()): string {
  let md = `# 任务列表\n\n> 导出时间: ${now.toLocaleString('zh-CN')}\n\n`

  const grouped = new Map<string, FormatTask[]>()
  for (const t of tasks) {
    const key = t.status
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(t)
  }

  for (const [status, list] of grouped) {
    md += `## ${STATUS_LABELS[status] || status} (${list.length})\n\n`
    for (const t of list) md += formatTaskAsMarkdown(t) + '\n'
    md += '\n'
  }

  return md
}
