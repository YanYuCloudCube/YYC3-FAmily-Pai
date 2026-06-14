import { describe, it, expect } from 'vitest'
import {
  buildPrompt,
  executeLocalAction,
  getAvailableActions,
  escapeHTML,
  formatCodeLocal,
  wrapAsMarkdown,
  wrapAsHTML,
} from '../router/quick-actions'

describe('quick-actions', () => {
  const codeCtx = { text: 'const x = 1;', language: 'typescript', filePath: 'test.ts' }

  describe('escapeHTML', () => {
    it('escapes HTML entities', () => {
      expect(escapeHTML('<div class="test">&</div>')).toBe(
        '&lt;div class=&quot;test&quot;&gt;&amp;&lt;/div&gt;'
      )
    })
    it('handles empty string', () => {
      expect(escapeHTML('')).toBe('')
    })
    it('leaves plain text unchanged', () => {
      expect(escapeHTML('hello world')).toBe('hello world')
    })
  })

  describe('formatCodeLocal', () => {
    it('trims trailing whitespace', () => {
      expect(formatCodeLocal('line1   \nline2  ')).toBe('line1\nline2')
    })
    it('handles single line', () => {
      expect(formatCodeLocal('hello   ')).toBe('hello')
    })
  })

  describe('wrapAsMarkdown', () => {
    it('wraps code in markdown block', () => {
      expect(wrapAsMarkdown('const x = 1', 'ts')).toBe('```ts\nconst x = 1\n```')
    })
    it('defaults to text language', () => {
      expect(wrapAsMarkdown('hello')).toBe('```text\nhello\n```')
    })
  })

  describe('wrapAsHTML', () => {
    it('wraps code in pre/code block', () => {
      expect(wrapAsHTML('<b>bold</b>', 'html')).toBe(
        '<pre><code class="language-html">&lt;b&gt;bold&lt;/b&gt;</code></pre>'
      )
    })
  })

  describe('executeLocalAction', () => {
    it('copy returns original text', () => {
      expect(executeLocalAction('copy', codeCtx)).toBe('const x = 1;')
    })
    it('copy-markdown wraps in markdown', () => {
      expect(executeLocalAction('copy-markdown', codeCtx)).toBe('```typescript\nconst x = 1;\n```')
    })
    it('copy-html wraps in html', () => {
      const result = executeLocalAction('copy-html', codeCtx)
      expect(result).toContain('<pre><code')
      expect(result).toContain('language-typescript')
    })
    it('format trims trailing spaces', () => {
      expect(executeLocalAction('format', { text: 'a   \nb  ' })).toBe('a\nb')
    })
  })

  describe('buildPrompt', () => {
    it('builds refactor prompt', () => {
      const result = buildPrompt('refactor', codeCtx)
      expect(result.systemPrompt).toContain('refactoring')
      expect(result.userPrompt).toContain('typescript')
      expect(result.actionType).toBe('refactor')
    })

    it('builds optimize prompt', () => {
      const result = buildPrompt('optimize', codeCtx)
      expect(result.systemPrompt).toContain('optimizer')
      expect(result.userPrompt).toContain('performance')
    })

    it('builds explain prompt', () => {
      const result = buildPrompt('explain', codeCtx)
      expect(result.systemPrompt).toContain('educator')
      expect(result.userPrompt).toContain('explain')
    })

    it('builds translate prompt with targetLang param', () => {
      const result = buildPrompt('translate', codeCtx, { targetLang: 'ja' })
      expect(result.userPrompt).toContain('ja')
      expect(result.actionType).toBe('translate')
    })

    it('builds summarize prompt', () => {
      const result = buildPrompt('summarize', { text: 'Long text here' })
      expect(result.systemPrompt).toContain('summarizer')
    })

    it('throws for unknown action type', () => {
      expect(() => buildPrompt('unknown' as any, codeCtx)).toThrow('Unknown action type')
    })
  })

  describe('getAvailableActions', () => {
    it('returns all action types', () => {
      const actions = getAvailableActions()
      expect(actions.length).toBeGreaterThanOrEqual(10)
      expect(actions).toContain('refactor')
      expect(actions).toContain('explain')
      expect(actions).toContain('translate')
      expect(actions).toContain('summarize')
    })
  })
})
