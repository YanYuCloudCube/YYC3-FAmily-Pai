/**
 * @file RetryCircuitBreaker.ts
 * @description LLM 请求重试与熔断器 — 指数退避重试 + 熔断保护 + Provider 降级
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-05-21
 * @updated 2026-05-21
 * @status active
 * @tags retry,circuit-breaker,resilience,llm
 */

export interface RetryConfig {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
  retryableStatuses: number[]
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 16000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
}

export type CircuitState = 'closed' | 'open' | 'half-open'

export interface CircuitBreakerConfig {
  failureThreshold: number
  resetTimeoutMs: number
  halfOpenMaxAttempts: number
}

export const DEFAULT_CIRCUIT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeoutMs: 30000,
  halfOpenMaxAttempts: 1,
}

interface CircuitStateRecord {
  state: CircuitState
  failureCount: number
  lastFailureTime: number
  halfOpenAttempts: number
}

export class CircuitBreaker {
  private circuits = new Map<string, CircuitStateRecord>()
  private config: CircuitBreakerConfig

  constructor(config: CircuitBreakerConfig = DEFAULT_CIRCUIT_CONFIG) {
    this.config = config
  }

  private getRecord(key: string): CircuitStateRecord {
    if (!this.circuits.has(key)) {
      this.circuits.set(key, {
        state: 'closed',
        failureCount: 0,
        lastFailureTime: 0,
        halfOpenAttempts: 0,
      })
    }
    return this.circuits.get(key)!
  }

  getState(key: string): CircuitState {
    const record = this.getRecord(key)
    if (record.state === 'open') {
      const elapsed = Date.now() - record.lastFailureTime
      if (elapsed >= this.config.resetTimeoutMs) {
        record.state = 'half-open'
        record.halfOpenAttempts = 0
      }
    }
    return record.state
  }

  canExecute(key: string): boolean {
    const state = this.getState(key)
    if (state === 'closed') return true
    if (state === 'half-open') {
      const record = this.getRecord(key)
      return record.halfOpenAttempts < this.config.halfOpenMaxAttempts
    }
    return false
  }

  recordSuccess(key: string): void {
    const record = this.getRecord(key)
    record.failureCount = 0
    record.state = 'closed'
    record.halfOpenAttempts = 0
  }

  recordFailure(key: string): void {
    const record = this.getRecord(key)
    record.failureCount++
    record.lastFailureTime = Date.now()

    if (record.state === 'half-open') {
      record.state = 'open'
      return
    }

    if (record.failureCount >= this.config.failureThreshold) {
      record.state = 'open'
    }
  }

  reset(key: string): void {
    this.circuits.delete(key)
  }

  resetAll(): void {
    this.circuits.clear()
  }
}

export function calculateBackoff(attempt: number, config: RetryConfig): number {
  const delay = config.baseDelayMs * Math.pow(2, attempt)
  const jitter = Math.random() * config.baseDelayMs * 0.5
  return Math.min(delay + jitter, config.maxDelayMs)
}

export function isRetryableError(error: unknown, status?: number, config: RetryConfig = DEFAULT_RETRY_CONFIG): boolean {
  if (status !== undefined) {
    if (status === 401 || status === 403) return false
    return config.retryableStatuses.includes(status)
  }
  if (error instanceof Error) {
    if (error.name === 'AbortError') return false
    if (error.message.includes('CORS')) return false
    return true
  }
  return false
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
