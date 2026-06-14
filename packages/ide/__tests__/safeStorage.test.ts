import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSafeStorage, healthCheckStorage } from '../stores/safeStorage'

describe('safeStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('createSafeStorage', () => {
    it('reads and writes normally', () => {
      const storage = createSafeStorage({ storageKey: 'test' })
      storage.setItem('test-key', JSON.stringify({ foo: 'bar' }))
      const result = storage.getItem('test-key')
      expect(result).toBe(JSON.stringify({ foo: 'bar' }))
    })

    it('returns null for missing keys', () => {
      const storage = createSafeStorage({ storageKey: 'test' })
      expect(storage.getItem('missing')).toBeNull()
    })

    it('removes items', () => {
      const storage = createSafeStorage({ storageKey: 'test' })
      storage.setItem('test-key', 'value')
      storage.removeItem('test-key')
      expect(storage.getItem('test-key')).toBeNull()
    })

    it('falls back to memory on setItem error', () => {
      const onError = vi.fn()
      const storage = createSafeStorage({
        storageKey: 'test',
        fallbackToMemory: true,
        onError,
      })

      const spy = vi.spyOn(localStorage, 'setItem')
      spy.mockImplementationOnce(() => {
        const err = new Error('QuotaExceededError')
        err.name = 'QuotaExceededError'
        throw err
      })

      storage.setItem('test-key', JSON.stringify({ data: 'fallback' }))

      expect(onError).toHaveBeenCalled()
      spy.mockRestore()

      const result = storage.getItem('test-key')
      expect(result).toBe(JSON.stringify({ data: 'fallback' }))
    })

    it('clears corrupt data on JSON parse error', () => {
      const storage = createSafeStorage({ storageKey: 'test' })
      localStorage.setItem('corrupt-key', '{invalid json')

      const result = storage.getItem('corrupt-key')
      expect(result).toBeNull()
    })

    it('calls onError callback', () => {
      const onError = vi.fn()
      const storage = createSafeStorage({ storageKey: 'test', onError })

      const spy = vi.spyOn(localStorage, 'getItem')
      spy.mockImplementationOnce(() => {
        throw new Error('storage error')
      })

      storage.getItem('test-key')
      expect(onError).toHaveBeenCalledWith(expect.any(Error), 'getItem')
      spy.mockRestore()
    })
  })

  describe('healthCheckStorage', () => {
    it('returns healthy when storage works', () => {
      const result = healthCheckStorage()
      expect(result.healthy).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('detects unhealthy storage', () => {
      const spy = vi.spyOn(localStorage, 'setItem')
      spy.mockImplementationOnce(() => {
        throw new Error('Storage disabled')
      })

      const result = healthCheckStorage()
      expect(result.healthy).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      spy.mockRestore()
    })
  })
})
