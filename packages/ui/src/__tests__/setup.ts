/**
 * file setup.ts
 * description @yyc3/ui setup.ts 单元测试
 * module @yyc3/ui
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.1.1
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [test],[setup],[unit]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief @yyc3/ui setup.ts 单元测试
 */
/// <reference types="vitest" />
import '@testing-library/jest-dom'

// Mock window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock scrollIntoView for jsdom
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn()
}

// Mock ResizeObserver for jsdom (required by Radix UI)
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() { }
    unobserve() { }
    disconnect() { }
  } as unknown as typeof ResizeObserver
}

// Mock navigator.serviceWorker for PWA components
if (!('serviceWorker' in navigator)) {
  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      register: vi.fn().mockResolvedValue({
        scope: '/',
        update: vi.fn(),
        unregister: vi.fn().mockResolvedValue(true),
      }),
      getRegistration: vi.fn().mockResolvedValue(null),
      getRegistrations: vi.fn().mockResolvedValue([]),
      ready: Promise.resolve({
        scope: '/',
        update: vi.fn(),
        unregister: vi.fn().mockResolvedValue(true),
      }),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
    configurable: true,
  })
}

// Mock navigator.onLine
if (!('onLine' in navigator)) {
  Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
}

// Mock caches API for PWA components
if (!('caches' in window)) {
  Object.defineProperty(window, 'caches', {
    value: {
      open: vi.fn().mockResolvedValue({
        match: vi.fn().mockResolvedValue(null),
        add: vi.fn(),
        addAll: vi.fn(),
        put: vi.fn(),
        delete: vi.fn().mockResolvedValue(true),
        keys: vi.fn().mockResolvedValue([]),
      }),
      keys: vi.fn().mockResolvedValue([]),
      delete: vi.fn().mockResolvedValue(true),
    },
    configurable: true,
  })
}

// Mock window.confirm
if (!window.confirm) {
  window.confirm = vi.fn().mockReturnValue(true)
}

// Mock Notification API for PWA components
if (typeof globalThis.Notification === 'undefined') {
  class MockNotification {
    static permission = 'default'
    static requestPermission = vi.fn().mockResolvedValue('granted')
    constructor() { }
    close() { }
  }
  globalThis.Notification = MockNotification as unknown as typeof Notification
}
