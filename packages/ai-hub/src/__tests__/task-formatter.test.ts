import { describe, it, expect } from 'vitest'
import {
  formatTaskAsText,
  formatTaskAsMarkdown,
  formatTaskAsCodeComment,
  getHighestPriority,
  exportTasksAsJSON,
  exportTasksAsMarkdown,
} from '../router/task-formatter'
import type { FormatTask } from '../router/task-formatter'

const sampleTask: FormatTask = {
  title: 'Implement auth',
  description: 'Add OAuth2 login',
  status: 'todo',
  priority: 'high',
  type: 'feature',
  dueDate: 1735689600000,
  estimatedHours: 8,
  tags: ['auth', 'security'],
  subtasks: [
    { title: 'Setup provider', isCompleted: false },
    { title: 'Add callback', isCompleted: true },
  ],
}

describe('task-formatter', () => {
  describe('formatTaskAsText', () => {
    it('formats task with all fields', () => {
      const text = formatTaskAsText(sampleTask)
      expect(text).toContain('# Implement auth')
      expect(text).toContain('Add OAuth2 login')
      expect(text).toContain('todo')
      expect(text).toContain('high')
      expect(text).toContain('feature')
      expect(text).toContain('auth, security')
      expect(text).toContain('✓ Add callback')
      expect(text).toContain('○ Setup provider')
    })

    it('formats minimal task', () => {
      const text = formatTaskAsText({ title: 'Simple', status: 'todo', priority: 'medium' })
      expect(text).toContain('# Simple')
      expect(text).not.toContain('## 描述')
    })
  })

  describe('formatTaskAsMarkdown', () => {
    it('formats as markdown checkbox', () => {
      const md = formatTaskAsMarkdown(sampleTask)
      expect(md).toContain('- [ ] Implement auth')
      expect(md).toContain('Add OAuth2 login')
      expect(md).toContain('P1 high')
    })

    it('checks done status', () => {
      const md = formatTaskAsMarkdown({ title: 'Done task', status: 'done', priority: 'low' })
      expect(md).toContain('- [x]')
    })
  })

  describe('formatTaskAsCodeComment', () => {
    it('formats as TypeScript comment', () => {
      const comment = formatTaskAsCodeComment(sampleTask, 'typescript')
      expect(comment).toBe('// TODO: Implement auth - Add OAuth2 login [high]')
    })

    it('formats as Python comment', () => {
      const comment = formatTaskAsCodeComment(sampleTask, 'python')
      expect(comment).toMatch(/^# TODO:/)
    })

    it('formats as HTML comment', () => {
      const comment = formatTaskAsCodeComment(sampleTask, 'html')
      expect(comment).toMatch(/<!-- TODO:.*-->/)
    })

    it('formats as CSS comment', () => {
      const comment = formatTaskAsCodeComment(sampleTask, 'css')
      expect(comment).toMatch(/\/\* TODO:.*\*\//)
    })

    it('defaults to typescript style', () => {
      const comment = formatTaskAsCodeComment({ title: 'Test', status: 'todo', priority: 'medium' })
      expect(comment).toMatch(/^\/\/ TODO:/)
    })
  })

  describe('getHighestPriority', () => {
    it('returns critical when present', () => {
      expect(getHighestPriority(['medium', 'critical', 'low'])).toBe('critical')
    })
    it('returns high when no critical', () => {
      expect(getHighestPriority(['medium', 'high', 'low'])).toBe('high')
    })
    it('defaults to medium for empty array', () => {
      expect(getHighestPriority([])).toBe('medium')
    })
  })

  describe('exportTasksAsJSON', () => {
    it('exports as valid JSON', () => {
      const json = exportTasksAsJSON([sampleTask])
      const parsed = JSON.parse(json)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].title).toBe('Implement auth')
    })
  })

  describe('exportTasksAsMarkdown', () => {
    it('exports grouped by status', () => {
      const tasks: FormatTask[] = [
        { title: 'Task A', status: 'todo', priority: 'high' },
        { title: 'Task B', status: 'done', priority: 'low' },
      ]
      const md = exportTasksAsMarkdown(tasks)
      expect(md).toContain('# 任务列表')
      expect(md).toContain('待办')
      expect(md).toContain('已完成')
      expect(md).toContain('Task A')
      expect(md).toContain('Task B')
    })
  })
})
