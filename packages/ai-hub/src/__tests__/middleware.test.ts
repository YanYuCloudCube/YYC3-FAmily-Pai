import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  MiddlewareChain,
  createLoggingMiddleware,
  createRetryMiddleware,
  createCacheMiddleware,
  createRateLimitMiddleware,
} from '../middleware/index'
import type { MiddlewareContext, AgentMiddleware } from '../middleware/index'
import type { AgentExecutionResult } from '../types'

function createCtx(overrides?: Partial<MiddlewareContext>): MiddlewareContext {
  return {
    task: 'test task',
    agentId: 'agent-1',
    metadata: {},
    ...overrides,
  }
}

function createResult(overrides?: Partial<AgentExecutionResult>): AgentExecutionResult {
  return {
    success: true,
    output: 'test output',
    ...overrides,
  }
}

describe('MiddlewareChain', () => {
  let chain: MiddlewareChain

  beforeEach(() => {
    chain = new MiddlewareChain()
  })

  it('registers middleware with use()', () => {
    chain.use({ name: 'test' })
    expect(chain.list()).toContain('test')
  })

  it('supports chaining use()', () => {
    chain.use({ name: 'a' }).use({ name: 'b' })
    expect(chain.list()).toEqual(['a', 'b'])
  })

  it('removes middleware by name', () => {
    chain.use({ name: 'a' }).use({ name: 'b' }).remove('a')
    expect(chain.list()).toEqual(['b'])
  })

  it('has() checks existence', () => {
    chain.use({ name: 'exists' })
    expect(chain.has('exists')).toBe(true)
    expect(chain.has('missing')).toBe(false)
  })

  it('clear() removes all middleware', () => {
    chain.use({ name: 'a' }).use({ name: 'b' })
    chain.clear()
    expect(chain.list()).toEqual([])
  })

  it('executes before hooks in order', async () => {
    const order: string[] = []
    chain.use({
      name: 'first',
      async before(ctx) { order.push('first'); return ctx },
    }).use({
      name: 'second',
      async before(ctx) { order.push('second'); return ctx },
    })
    await chain.executeBefore(createCtx())
    expect(order).toEqual(['first', 'second'])
  })

  it('executes after hooks in order', async () => {
    const order: string[] = []
    chain.use({
      name: 'first',
      async after(_ctx, result) { order.push('first'); return result },
    }).use({
      name: 'second',
      async after(_ctx, result) { order.push('second'); return result },
    })
    await chain.executeAfter(createCtx(), createResult())
    expect(order).toEqual(['first', 'second'])
  })

  it('before hooks can modify context', async () => {
    chain.use({
      name: 'enrich',
      async before(ctx) { ctx.metadata.enriched = true; return ctx },
    })
    const ctx = await chain.executeBefore(createCtx())
    expect(ctx.metadata.enriched).toBe(true)
  })

  it('after hooks can modify result', async () => {
    chain.use({
      name: 'transform',
      async after(_ctx, result) { return { ...result, output: result.output.toUpperCase() } },
    })
    const result = await chain.executeAfter(createCtx(), createResult({ output: 'hello' }))
    expect(result.output).toBe('HELLO')
  })

  it('executes onError hooks', async () => {
    const spy = vi.fn()
    chain.use({
      name: 'error-handler',
      async onError(_ctx, error) { spy(error.message); return error },
    })
    await chain.executeOnError(createCtx(), new Error('test error'))
    expect(spy).toHaveBeenCalledWith('test error')
  })

  it('skips before hook if not defined', async () => {
    chain.use({ name: 'no-before' })
    const ctx = await chain.executeBefore(createCtx())
    expect(ctx.task).toBe('test task')
  })

  it('skips after hook if not defined', async () => {
    chain.use({ name: 'no-after' })
    const result = await chain.executeAfter(createCtx(), createResult())
    expect(result.output).toBe('test output')
  })
})

describe('createLoggingMiddleware', () => {
  it('sets startTime in before', async () => {
    const mw = createLoggingMiddleware()
    const ctx = createCtx()
    const result = await mw.before!(ctx)
    expect(result.metadata.startTime).toBeDefined()
  })

  it('adds duration in after', async () => {
    const mw = createLoggingMiddleware()
    const ctx = createCtx()
    ctx.metadata.startTime = Date.now() - 100
    const result = await mw.after!(ctx, createResult())
    expect(result.duration).toBeGreaterThanOrEqual(100)
  })
})

describe('createRetryMiddleware', () => {
  it('increments retry attempts on error', async () => {
    const mw = createRetryMiddleware(3)
    const ctx = createCtx()
    const error = await mw.onError!(ctx, new Error('fail'))
    expect(ctx.metadata.retryAttempts).toBe(1)
    expect(error.message).toContain('Retry 1/3')
  })

  it('returns original error after max retries', async () => {
    const mw = createRetryMiddleware(2)
    const ctx = createCtx()
    ctx.metadata.retryAttempts = 1
    const error = await mw.onError!(ctx, new Error('final fail'))
    expect(error.message).toBe('final fail')
  })
})

describe('createCacheMiddleware', () => {
  it('caches results after after hook', async () => {
    const mw = createCacheMiddleware(60000)
    const ctx = createCtx()
    const result = createResult({ output: 'cached' })
    await mw.after!(ctx, result)
    const ctx2 = createCtx()
    await mw.before!(ctx2)
    expect(ctx2.metadata.cachedResult).toBeDefined()
    expect((ctx2.metadata.cachedResult as AgentExecutionResult).output).toBe('cached')
  })

  it('does not cache if before has no match', async () => {
    const mw = createCacheMiddleware(60000)
    const ctx = createCtx({ task: 'different task', agentId: 'agent-x' })
    await mw.before!(ctx)
    expect(ctx.metadata.cachedResult).toBeUndefined()
  })
})

describe('createRateLimitMiddleware', () => {
  it('allows requests under limit', async () => {
    const mw = createRateLimitMiddleware(5)
    const ctx = createCtx()
    const result = await mw.before!(ctx)
    expect(result.metadata).toBeDefined()
  })

  it('throws when rate limit exceeded', async () => {
    const mw = createRateLimitMiddleware(2)
    await mw.before!(createCtx())
    await mw.before!(createCtx())
    await expect(mw.before!(createCtx())).rejects.toThrow('Rate limit exceeded')
  })
})
