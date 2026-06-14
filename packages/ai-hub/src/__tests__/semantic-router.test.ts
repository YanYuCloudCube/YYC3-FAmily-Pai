import { describe, it, expect, beforeEach } from 'vitest'
import { SemanticRouter } from '../router/semantic-router'

describe('SemanticRouter', () => {
  let router: SemanticRouter

  beforeEach(() => {
    router = new SemanticRouter()
    router.clearSemanticRoutes()
    SemanticRouter.clearCustomRules()
  })

  it('routes based on semantic similarity', async () => {
    router.addSemanticRoute({
      agent: 'security-expert',
      examples: [
        'scan for vulnerabilities and security issues',
        'audit code for potential exploits',
        'check for SQL injection attacks',
      ],
      threshold: 0.3,
    })
    const result = await router.route('find security vulnerabilities in my code')
    expect(result).toContain('security-expert')
  })

  it('does not route below threshold', async () => {
    router.addSemanticRoute({
      agent: 'unrelated-agent',
      examples: ['bake a chocolate cake recipe'],
      threshold: 0.9,
    })
    const result = await router.route('deploy kubernetes cluster')
    expect(result).not.toContain('unrelated-agent')
  })

  it('combines semantic and keyword routing', async () => {
    router.addSemanticRoute({
      agent: 'ai-expert',
      examples: ['build machine learning models', 'train neural networks'],
      threshold: 0.3,
    })
    const result = await router.route('train ML model with security scanning')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns up to 3 agents', async () => {
    router.addSemanticRoute({
      agent: 'agent-a',
      examples: ['write code in typescript'],
      threshold: 0.2,
    })
    router.addSemanticRoute({
      agent: 'agent-b',
      examples: ['develop react application'],
      threshold: 0.2,
    })
    const result = await router.route('typescript react code')
    expect(result.length).toBeLessThanOrEqual(3)
  })

  it('getSemanticRoutes returns all routes', () => {
    router.addSemanticRoute({ agent: 'a', examples: ['x'], threshold: 0.5 })
    router.addSemanticRoute({ agent: 'b', examples: ['y'], threshold: 0.5 })
    expect(router.getSemanticRoutes()).toHaveLength(2)
  })

  it('clearSemanticRoutes removes all routes', () => {
    router.addSemanticRoute({ agent: 'a', examples: ['x'], threshold: 0.5 })
    router.clearSemanticRoutes()
    expect(router.getSemanticRoutes()).toHaveLength(0)
  })

  it('handles empty task', async () => {
    router.addSemanticRoute({
      agent: 'test',
      examples: ['something'],
      threshold: 0.3,
    })
    const result = await router.route('')
    expect(Array.isArray(result)).toBe(true)
  })

  it('deduplicates agents', async () => {
    router.addSemanticRoute({
      agent: 'security-scanning',
      examples: ['check for security issues'],
      threshold: 0.3,
    })
    const result = await router.route('security scan vulnerabilities')
    const unique = new Set(result)
    expect(unique.size).toBe(result.length)
  })
})
