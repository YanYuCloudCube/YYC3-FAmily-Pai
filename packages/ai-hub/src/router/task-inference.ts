/**
 * file task-inference.ts
 * description 任务推理引擎 — 从对话/代码/描述中智能提取任务
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-20
 * updated 2026-05-20
 * status active
 * tags [inference],[task],[nlp]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

export type TaskType = 'feature' | 'bug' | 'refactor' | 'test' | 'documentation' | 'other'
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'

export interface InferredTask {
  title: string
  description: string
  priority: TaskPriority
  type: TaskType
}

export interface TaskInferenceResult {
  task: InferredTask
  confidence: number
  reasoning: string
  context: string
}

const KEYWORD_PATTERNS: { pattern: RegExp; type: TaskType; priority: TaskPriority }[] = [
  { pattern: /TODO:?\s*(.+)/gi, type: 'feature', priority: 'medium' },
  { pattern: /FIXME:?\s*(.+)/gi, type: 'bug', priority: 'high' },
  { pattern: /BUG:?\s*(.+)/gi, type: 'bug', priority: 'high' },
  { pattern: /HACK:?\s*(.+)/gi, type: 'refactor', priority: 'medium' },
  { pattern: /OPTIMIZE:?\s*(.+)/gi, type: 'refactor', priority: 'low' },
  { pattern: /NOTE:?\s*(.+)/gi, type: 'documentation', priority: 'low' },
  { pattern: /需要实现(.+)/g, type: 'feature', priority: 'medium' },
  { pattern: /修复(.+)问题/g, type: 'bug', priority: 'high' },
  { pattern: /重构(.+)/g, type: 'refactor', priority: 'medium' },
  { pattern: /添加(.+)功能/g, type: 'feature', priority: 'medium' },
  { pattern: /完善(.+)/g, type: 'feature', priority: 'low' },
  { pattern: /优化(.+)/g, type: 'refactor', priority: 'low' },
  { pattern: /测试(.+)/g, type: 'test', priority: 'medium' },
  { pattern: /编写(.+)文档/g, type: 'documentation', priority: 'low' },
]

export function inferTasksFromText(text: string): TaskInferenceResult[] {
  const results: TaskInferenceResult[] = []
  const seen = new Set<string>()

  for (const { pattern, type, priority } of KEYWORD_PATTERNS) {
    pattern.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = pattern.exec(text)) !== null) {
      const title = match[1]?.trim()
      if (!title || title.length < 3 || seen.has(title.toLowerCase())) continue
      seen.add(title.toLowerCase())

      results.push({
        task: {
          title,
          description: `Auto-extracted: "${match[0].trim()}"`,
          priority,
          type,
        },
        confidence: 0.7,
        reasoning: `Keyword pattern: ${pattern.source}`,
        context: text.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50),
      })
    }
  }

  return results
}

export function inferTasksFromCode(code: string, language: string): TaskInferenceResult[] {
  return inferTasksFromText(code).map((inf) => ({
    ...inf,
    task: {
      ...inf.task,
      description: `From ${language} code comment: ${inf.task.description}`,
    },
    confidence: 0.85,
  }))
}

export function inferTasksFromConversation(
  messages: Array<{ role: string; content: string }>
): TaskInferenceResult[] {
  const fullText = messages.map((m) => m.content).join('\n\n')
  return inferTasksFromText(fullText).map((inf) => ({
    ...inf,
    task: {
      ...inf.task,
      description: `From AI conversation: ${inf.task.description}`,
    },
  }))
}

export function inferTasksFromDescription(description: string): TaskInferenceResult[] {
  const lines = description
    .split(/[\n;；。]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 3)

  if (lines.length <= 1) {
    return [{
      task: {
        title: description.slice(0, 80),
        description,
        priority: 'medium',
        type: 'feature',
      },
      confidence: 0.75,
      reasoning: 'User direct description',
      context: description,
    }]
  }

  return lines.map((line, i) => ({
    task: {
      title: line.slice(0, 80),
      description: line,
      priority: 'medium' as TaskPriority,
      type: 'feature' as TaskType,
    },
    confidence: 0.65,
    reasoning: `User description item ${i + 1}`,
    context: line,
  }))
}

export function inferTaskDependencies(
  tasks: Array<{ id: string; title: string; description?: string }>
): Map<string, string[]> {
  const deps = new Map<string, string[]>()

  for (let i = 0; i < tasks.length; i++) {
    const taskDeps: string[] = []
    const titleLower = (tasks[i].title + ' ' + (tasks[i].description || '')).toLowerCase()

    for (let j = 0; j < tasks.length; j++) {
      if (i === j) continue
      const otherWords = tasks[j].title.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
      const matchCount = otherWords.filter((w) => titleLower.includes(w)).length
      if (matchCount >= 2) {
        taskDeps.push(tasks[j].id)
      }
    }

    if (taskDeps.length > 0) deps.set(tasks[i].id, taskDeps)
  }

  return deps
}
