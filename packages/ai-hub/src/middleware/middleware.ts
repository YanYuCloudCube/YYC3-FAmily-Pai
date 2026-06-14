/**
 * file middleware.ts
 * description 中间件类型定义与链式执行器
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-19
 * updated 2026-05-19
 * status active
 * tags [middleware]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 中间件类型定义与链式执行器
 */

import { AgentExecutionResult, TaskContext } from '../types.js'

export interface MiddlewareContext {
  task: string
  agentId: string
  context?: TaskContext
  metadata: Record<string, unknown>
}

export interface AgentMiddleware {
  name: string
  before?(ctx: MiddlewareContext): Promise<MiddlewareContext>
  after?(ctx: MiddlewareContext, result: AgentExecutionResult): Promise<AgentExecutionResult>
  onError?(ctx: MiddlewareContext, error: Error): Promise<Error>
}

export class MiddlewareChain {
  private middlewares: AgentMiddleware[] = []

  use(middleware: AgentMiddleware): this {
    this.middlewares.push(middleware)
    return this
  }

  remove(name: string): this {
    this.middlewares = this.middlewares.filter(m => m.name !== name)
    return this
  }

  list(): string[] {
    return this.middlewares.map(m => m.name)
  }

  async executeBefore(ctx: MiddlewareContext): Promise<MiddlewareContext> {
    let current = ctx
    for (const mw of this.middlewares) {
      if (mw.before) {
        current = await mw.before(current)
      }
    }
    return current
  }

  async executeAfter(ctx: MiddlewareContext, result: AgentExecutionResult): Promise<AgentExecutionResult> {
    let current = result
    for (const mw of this.middlewares) {
      if (mw.after) {
        current = await mw.after(ctx, current)
      }
    }
    return current
  }

  async executeOnError(ctx: MiddlewareContext, error: Error): Promise<Error> {
    let current = error
    for (const mw of this.middlewares) {
      if (mw.onError) {
        current = await mw.onError(ctx, current)
      }
    }
    return current
  }

  has(name: string): boolean {
    return this.middlewares.some(m => m.name === name)
  }

  clear(): void {
    this.middlewares = []
  }
}

export function createLoggingMiddleware(): AgentMiddleware {
  return {
    name: 'logging',
    async before(ctx) {
      ctx.metadata.startTime = Date.now()
      return ctx
    },
    async after(ctx, result) {
      const duration = Date.now() - (ctx.metadata.startTime as number || 0)
      return { ...result, duration }
    },
  }
}

export function createRetryMiddleware(maxRetries = 3): AgentMiddleware {
  return {
    name: 'retry',
    async onError(ctx, error) {
      const attempts = ((ctx.metadata.retryAttempts as number) || 0) + 1
      ctx.metadata.retryAttempts = attempts
      if (attempts < maxRetries) {
        const wrapped = new Error(`Retry ${attempts}/${maxRetries}: ${error.message}`)
        wrapped.cause = error
        return wrapped
      }
      return error
    },
  }
}

export function createCacheMiddleware(ttl = 60000): AgentMiddleware {
  const cache = new Map<string, { result: AgentExecutionResult; expires: number }>()

  return {
    name: 'cache',
    async before(ctx) {
      const key = `${ctx.agentId}:${ctx.task}`
      const cached = cache.get(key)
      if (cached && Date.now() < cached.expires) {
        ctx.metadata.cachedResult = cached.result
      }
      return ctx
    },
    async after(ctx, result) {
      const key = `${ctx.agentId}:${ctx.task}`
      cache.set(key, { result, expires: Date.now() + ttl })
      return result
    },
  }
}

export function createRateLimitMiddleware(maxRps = 10): AgentMiddleware {
  let timestamps: number[] = []

  return {
    name: 'rate-limit',
    async before(ctx) {
      const now = Date.now()
      timestamps = timestamps.filter(t => now - t < 1000)
      if (timestamps.length >= maxRps) {
        throw new Error(`Rate limit exceeded: ${maxRps} requests per second`)
      }
      timestamps.push(now)
      return ctx
    },
  }
}
