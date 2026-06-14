import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useScrollReveal } from './use-scroll-reveal'

class MockIntersectionObserver {
  private callback: IntersectionObserverCallback
  constructor(cb: IntersectionObserverCallback) {
    this.callback = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('useScrollReveal', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  it('exports a function', () => {
    expect(typeof useScrollReveal).toBe('function')
  })
})
