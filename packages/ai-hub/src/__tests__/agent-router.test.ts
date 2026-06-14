import { describe, it, expect, beforeEach } from 'vitest'
import { AgentRouter } from '../agent-router'

describe('AgentRouter', () => {
  beforeEach(() => {
    AgentRouter.clearCustomRules()
  })

  it('routes security-related tasks', () => {
    const result = AgentRouter.route('scan for security vulnerabilities')
    expect(result).toContain('security-scanning')
  })

  it('routes kubernetes tasks', () => {
    const result = AgentRouter.route('deploy to k8s cluster')
    expect(result).toContain('kubernetes-operations')
  })

  it('routes LLM/AI tasks', () => {
    const result = AgentRouter.route('build a RAG pipeline with embeddings')
    expect(result).toContain('llm-application-dev')
  })

  it('routes TypeScript tasks', () => {
    const result = AgentRouter.route('create a react component in typescript')
    expect(result).toContain('javascript-typescript')
  })

  it('routes Python tasks', () => {
    const result = AgentRouter.route('train a ML model with pytorch')
    expect(result).toContain('python-development')
  })

  it('routes testing tasks', () => {
    const result = AgentRouter.route('write unit tests with vitest')
    expect(result).toContain('testing')
  })

  it('routes documentation tasks', () => {
    const result = AgentRouter.route('generate API documentation')
    expect(result).toContain('documentation')
  })

  it('returns general for unknown tasks', () => {
    const result = AgentRouter.route('hello world')
    expect(result).toContain('general')
  })

  it('returns up to 3 agents', () => {
    const result = AgentRouter.route('deploy secure k8s container with CI pipeline')
    expect(result.length).toBeLessThanOrEqual(3)
  })

  it('supports custom rules', () => {
    AgentRouter.addRule({
      agent: 'custom-agent',
      keywords: ['custom', 'special'],
      priority: 100,
    })
    const result = AgentRouter.route('custom special task')
    expect(result[0]).toBe('custom-agent')
  })

  it('clearCustomRules removes custom rules', () => {
    AgentRouter.addRule({
      agent: 'temp-agent',
      keywords: ['temporary'],
      priority: 100,
    })
    AgentRouter.clearCustomRules()
    const result = AgentRouter.route('temporary task')
    expect(result).not.toContain('temp-agent')
  })

  it('prioritizes by keyword match length', () => {
    const result = AgentRouter.route('security vulnerability audit scan')
    expect(result[0]).toBe('security-scanning')
  })

  it('supports regex patterns in rules', () => {
    AgentRouter.addRule({
      agent: 'regex-agent',
      keywords: [],
      patterns: [/deploy-\d+/],
      priority: 80,
    })
    const result = AgentRouter.route('deploy-123 to production')
    expect(result).toContain('regex-agent')
  })
})
