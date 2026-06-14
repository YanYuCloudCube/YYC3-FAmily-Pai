/**
 * @file safeStorage.ts
 * @description Zustand persist 安全存储层 — QuotaExceeded/损坏检测/内存降级
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-05-21
 * @updated 2026-05-21
 * @status active
 * @tags storage,persist,zustand,fault-tolerance
 */

import type { StateStorage } from 'zustand/middleware'

interface SafeStorageOptions {
  storageKey: string
  fallbackToMemory?: boolean
  onError?: (error: Error, operation: 'getItem' | 'setItem' | 'removeItem') => void
}

const memoryFallback = new Map<string, string>()

export function createSafeStorage(options: SafeStorageOptions): StateStorage {
  const { storageKey, fallbackToMemory = true, onError } = options

  const handleError = (error: unknown, operation: 'getItem' | 'setItem' | 'removeItem') => {
    const err = error instanceof Error ? error : new Error(String(error))
    onError?.(err, operation)

    if (
      err.name === 'QuotaExceededError' ||
      err.message.includes('quota') ||
      err.message.includes('QUOTA')
    ) {
      try {
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith('yyc3-') && key !== storageKey) {
            keysToRemove.push(key)
          }
        }
        for (const key of keysToRemove) {
          localStorage.removeItem(key)
        }
      } catch {
        // unable to cleanup
      }
    }
  }

  return {
    getItem: (name: string): string | null => {
      try {
        const value = localStorage.getItem(name)
        if (value !== null) {
          JSON.parse(value)
        }
        if (value === null && fallbackToMemory) {
          return memoryFallback.get(name) ?? null
        }
        return value
      } catch (error) {
        handleError(error, 'getItem')
        if (error instanceof Error && error.message.includes('JSON')) {
          try {
            localStorage.removeItem(name)
          } catch {
            // unable to remove corrupt data
          }
        }
        if (fallbackToMemory) {
          return memoryFallback.get(name) ?? null
        }
        return null
      }
    },

    setItem: (name: string, value: string): void => {
      try {
        JSON.parse(value)
        localStorage.setItem(name, value)
        if (fallbackToMemory) {
          memoryFallback.set(name, value)
        }
      } catch (error) {
        handleError(error, 'setItem')
        if (fallbackToMemory) {
          memoryFallback.set(name, value)
        }
      }
    },

    removeItem: (name: string): void => {
      try {
        localStorage.removeItem(name)
      } catch (error) {
        handleError(error, 'removeItem')
      }
      memoryFallback.delete(name)
    },
  }
}

export const defaultSafeStorage = createSafeStorage({
  storageKey: 'yyc3-default',
})

export function healthCheckStorage(): { healthy: boolean; errors: string[] } {
  const errors: string[] = []
  const testKey = '__yyc3_storage_health_check__'

  try {
    localStorage.setItem(testKey, 'ok')
    const read = localStorage.getItem(testKey)
    localStorage.removeItem(testKey)
    if (read !== 'ok') {
      errors.push('Storage read/write mismatch')
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    errors.push(err.message)
  }

  return { healthy: errors.length === 0, errors }
}
