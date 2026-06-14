import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CircuitBreaker,
  DEFAULT_CIRCUIT_CONFIG,
  DEFAULT_RETRY_CONFIG,
  calculateBackoff,
  isRetryableError,
  sleep,
} from '../services/RetryCircuitBreaker'

describe('RetryCircuitBreaker', () => {
  describe('CircuitBreaker', () => {
    let breaker: CircuitBreaker

    beforeEach(() => {
      breaker = new CircuitBreaker(DEFAULT_CIRCUIT_CONFIG)
    })

    it('starts in closed state', () => {
      expect(breaker.getState('test')).toBe('closed')
    })

    it('allows execution in closed state', () => {
      expect(breaker.canExecute('test')).toBe(true)
    })

    it('transitions to open after threshold failures', () => {
      for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
        breaker.recordFailure('test')
      }
      expect(breaker.getState('test')).toBe('open')
      expect(breaker.canExecute('test')).toBe(false)
    })

    it('resets to closed on success', () => {
      for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
        breaker.recordFailure('test')
      }
      expect(breaker.getState('test')).toBe('open')

      breaker.recordSuccess('test')
      expect(breaker.getState('test')).toBe('closed')
      expect(breaker.canExecute('test')).toBe(true)
    })

    it('transitions to half-open after reset timeout', () => {
      for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
        breaker.recordFailure('test')
      }
      expect(breaker.getState('test')).toBe('open')

      const openBreaker = new CircuitBreaker({
        ...DEFAULT_CIRCUIT_CONFIG,
        resetTimeoutMs: 0,
      })
      for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
        openBreaker.recordFailure('test')
      }
      expect(openBreaker.getState('test')).toBe('half-open')
      expect(openBreaker.canExecute('test')).toBe(true)
    })

    it('returns to open on failure in half-open', () => {
      const openBreaker = new CircuitBreaker({
        failureThreshold: 2,
        resetTimeoutMs: 100,
        halfOpenMaxAttempts: 1,
      })
      openBreaker.recordFailure('test')
      openBreaker.recordFailure('test')
      expect(openBreaker.canExecute('test')).toBe(false)

      vi.useFakeTimers()
      vi.advanceTimersByTime(150)
      expect(openBreaker.canExecute('test')).toBe(true)

      openBreaker.recordFailure('test')
      expect(openBreaker.canExecute('test')).toBe(false)
      vi.useRealTimers()
    })

    it('resets single key', () => {
      breaker.recordFailure('a')
      breaker.recordFailure('b')
      breaker.reset('a')
      expect(breaker.getState('a')).toBe('closed')
      expect(breaker.getState('b')).toBe('closed')
    })

    it('resets all keys', () => {
      breaker.recordFailure('a')
      breaker.recordFailure('b')
      breaker.resetAll()
      expect(breaker.getState('a')).toBe('closed')
      expect(breaker.getState('b')).toBe('closed')
    })
  })

  describe('calculateBackoff', () => {
    it('calculates exponential backoff', () => {
      const config = DEFAULT_RETRY_CONFIG
      const d0 = calculateBackoff(0, config)
      const d1 = calculateBackoff(1, config)
      const d2 = calculateBackoff(2, config)
      expect(d0).toBeLessThan(config.baseDelayMs * 2)
      expect(d1).toBeGreaterThan(config.baseDelayMs)
      expect(d2).toBeGreaterThan(config.baseDelayMs * 2)
    })

    it('respects max delay', () => {
      const config = { ...DEFAULT_RETRY_CONFIG, maxDelayMs: 2000 }
      const d = calculateBackoff(10, config)
      expect(d).toBeLessThanOrEqual(config.maxDelayMs)
    })
  })

  describe('isRetryableError', () => {
    it('retries on retryable HTTP status', () => {
      expect(isRetryableError(null, 429)).toBe(true)
      expect(isRetryableError(null, 500)).toBe(true)
      expect(isRetryableError(null, 502)).toBe(true)
      expect(isRetryableError(null, 503)).toBe(true)
    })

    it('does not retry on auth errors', () => {
      expect(isRetryableError(null, 401)).toBe(false)
      expect(isRetryableError(null, 403)).toBe(false)
    })

    it('does not retry on AbortError', () => {
      const err = new Error('aborted')
      err.name = 'AbortError'
      expect(isRetryableError(err)).toBe(false)
    })

    it('does not retry on CORS error', () => {
      const err = new Error('CORS policy blocked')
      expect(isRetryableError(err)).toBe(false)
    })

    it('retries on network errors', () => {
      expect(isRetryableError(new Error('network timeout'))).toBe(true)
      expect(isRetryableError(new Error('connection refused'))).toBe(true)
    })
  })

  describe('sleep', () => {
    it('resolves after delay', async () => {
      vi.useFakeTimers()
      const p = sleep(100)
      vi.advanceTimersByTime(100)
      await p
      expect(true).toBe(true)
      vi.useRealTimers()
    })
  })
})
