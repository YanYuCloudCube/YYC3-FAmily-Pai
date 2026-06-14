import { describe, expect, it } from 'vitest'
import {
  inferTaskDependencies,
  inferTasksFromCode,
  inferTasksFromConversation,
  inferTasksFromDescription,
  inferTasksFromText,
} from '../router/task-inference'

describe('task-inference', () => {
  describe('inferTasksFromText', () => {
    it('extracts TODO items', () => {
      const results = inferTasksFromText('TODO: implement user auth\nTODO: add tests')
      expect(results.length).toBeGreaterThanOrEqual(2)
      expect(results[0].task.title).toContain('implement user auth')
      expect(results[0].task.type).toBe('feature')
    })

    it('extracts FIXME items as bugs', () => {
      const results = inferTasksFromText('FIXME: null pointer in parser')
      expect(results.length).toBe(1)
      expect(results[0].task.type).toBe('bug')
      expect(results[0].task.priority).toBe('high')
    })

    it('extracts Chinese patterns', () => {
      const results = inferTasksFromText('需要实现用户登录功能')
      expect(results.length).toBeGreaterThanOrEqual(1)
      expect(results.some(r => r.task.type === 'feature')).toBe(true)
    })

    it('deduplicates identical tasks', () => {
      const results = inferTasksFromText('TODO: fix bug\nTODO: fix bug')
      const titles = results.map(r => r.task.title.toLowerCase())
      const uniqueTitles = new Set(titles)
      expect(uniqueTitles.size).toBe(results.length)
    })

    it('returns empty for no matches', () => {
      const results = inferTasksFromText('This is just a normal sentence.')
      expect(results.length).toBe(0)
    })

    it('includes context around match', () => {
      const results = inferTasksFromText('some prefix text TODO: fix this issue some suffix')
      expect(results.length).toBe(1)
      expect(results[0].context).toContain('TODO')
    })

    it('sets confidence to 0.7 for keyword matches', () => {
      const results = inferTasksFromText('BUG: crash on startup')
      expect(results[0].confidence).toBe(0.7)
    })
  })

  describe('inferTasksFromCode', () => {
    it('extracts tasks from code with higher confidence', () => {
      const results = inferTasksFromCode('// TODO: refactor this function\nconst x = 1', 'typescript')
      expect(results.length).toBeGreaterThanOrEqual(1)
      expect(results[0].confidence).toBe(0.85)
      expect(results[0].task.description).toContain('typescript')
    })

    it('extracts HACK comments', () => {
      const results = inferTasksFromCode('// HACK: workaround for bug', 'javascript')
      expect(results.length).toBe(1)
      expect(results[0].task.type).toBe('refactor')
    })
  })

  describe('inferTasksFromConversation', () => {
    it('extracts from multiple messages', () => {
      const messages = [
        { role: 'user', content: 'I need to add a login page' },
        { role: 'assistant', content: 'TODO: implement OAuth2 flow' },
      ]
      const results = inferTasksFromConversation(messages)
      expect(results.length).toBeGreaterThanOrEqual(1)
      expect(results[0].task.description).toContain('AI conversation')
    })
  })

  describe('inferTasksFromDescription', () => {
    it('returns single task for short description', () => {
      const results = inferTasksFromDescription('Add dark mode toggle')
      expect(results.length).toBe(1)
      expect(results[0].task.title).toBe('Add dark mode toggle')
      expect(results[0].confidence).toBe(0.75)
    })

    it('splits multi-line description into tasks', () => {
      const results = inferTasksFromDescription('Add login page\nAdd registration page\nAdd password reset')
      expect(results.length).toBe(3)
    })

    it('filters out short lines', () => {
      const results = inferTasksFromDescription('ok\nAdd user management feature')
      expect(results.every(r => r.task.title.length >= 3)).toBe(true)
    })
  })

  describe('inferTaskDependencies', () => {
    it('detects dependencies based on title overlap', () => {
      const tasks = [
        { id: '1', title: 'Setup database schema models' },
        { id: '2', title: 'Create database migration scripts' },
        { id: '3', title: 'Implement user authentication system' },
      ]
      const deps = inferTaskDependencies(tasks)
      expect(deps).toBeDefined()
      expect(deps instanceof Map).toBe(true)
    })

    it('returns empty map for unrelated tasks', () => {
      const tasks = [
        { id: '1', title: 'Design logo' },
        { id: '2', title: 'Write documentation' },
        { id: '3', title: 'Deploy server' },
      ]
      const deps = inferTaskDependencies(tasks)
      expect(deps.size).toBe(0)
    })

    it('handles empty task list', () => {
      const deps = inferTaskDependencies([])
      expect(deps.size).toBe(0)
    })
  })
})
