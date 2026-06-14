import { beforeEach, describe, expect, it, vi } from 'vitest'
import { animateNumber } from './animate-number'

describe('animateNumber', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('应立即开始更新文本内容', () => {
    const el = document.createElement('span')
    const cancel = animateNumber(el, 0, 100, 1000)
    vi.advanceTimersByTime(16)
    expect(el.textContent).not.toBe('0')
    cancel()
  })

  it('应在 duration 结束后达到目标值', () => {
    const el = document.createElement('span')
    const cancel = animateNumber(el, 0, 100, 1000)
    vi.advanceTimersByTime(1100)
    expect(el.textContent).toBe('100')
    cancel()
  })

  it('应支持自定义小数位数', () => {
    const el = document.createElement('span')
    const cancel = animateNumber(el, 0, 3.14159, 500, 4)
    vi.advanceTimersByTime(600)
    expect(el.textContent).toContain('.')
    cancel()
  })

  it('取消后应停止更新', () => {
    const el = document.createElement('span')
    const cancel = animateNumber(el, 0, 1000, 5000)
    vi.advanceTimersByTime(100)
    cancel()
    const textAfterCancel = el.textContent
    vi.advanceTimersByTime(5000)
    expect(el.textContent).toBe(textAfterCancel)
  })

  it('应使用默认 duration=1000 和 decimals=0', () => {
    const el = document.createElement('span')
    const cancel = animateNumber(el, 0, 50)
    vi.advanceTimersByTime(1100)
    expect(el.textContent).toBe('50')
    cancel()
  })

  it('应处理负数范围', () => {
    const el = document.createElement('span')
    const cancel = animateNumber(el, -10, 10, 500)
    vi.advanceTimersByTime(600)
    expect(parseFloat(el.textContent!)).toBeCloseTo(10, 0)
    cancel()
  })
})
