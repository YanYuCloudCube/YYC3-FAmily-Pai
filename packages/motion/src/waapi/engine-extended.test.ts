import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AnimationEngine, getAnimationEngine } from './engine'

function mockElement(): HTMLElement {
  const el = document.createElement('div')
  el.animate = vi.fn(() => ({
    addEventListener: vi.fn((_: string, cb: () => void) => cb()),
    cancel: vi.fn(),
    finished: Promise.resolve(),
  })) as unknown as typeof el.animate
  return el
}

describe('AnimationEngine — extended', () => {
  let engine: AnimationEngine

  beforeEach(() => {
    engine = new AnimationEngine()
  })

  it('animate 应调用 element.animate 并传默认参数', () => {
    const el = mockElement()
    const keyframes = [{ opacity: 0 }, { opacity: 1 }]
    engine.animate(el, keyframes)
    expect(el.animate).toHaveBeenCalledWith(
      keyframes,
      expect.objectContaining({ duration: 300, easing: 'ease-out', fill: 'forwards' }),
    )
  })

  it('animate 应合并自定义 options', () => {
    const el = mockElement()
    engine.animate(el, [{ opacity: 0 }], { duration: 500, easing: 'ease-in' })
    expect(el.animate).toHaveBeenCalledWith(
      [{ opacity: 0 }],
      expect.objectContaining({ duration: 500, easing: 'ease-in' }),
    )
  })

  it('sequence 支持 delay', async () => {
    const el = mockElement()
    const start = Date.now()
    await engine.sequence([
      { element: el, preset: 'fadeIn', delay: 50 },
    ])
    const elapsed = Date.now() - start
    expect(el.animate).toHaveBeenCalled()
    expect(elapsed).toBeGreaterThanOrEqual(40)
  })

  it('sequence 支持自定义 keyframes', async () => {
    const el = mockElement()
    const kf = [{ transform: 'scale(0)' }, { transform: 'scale(1)' }]
    await engine.sequence([{ element: el, keyframes: kf }])
    expect(el.animate).toHaveBeenCalledWith(kf, expect.anything())
  })

  it('sequence 跳过无 preset/keyframes 的 step', async () => {
    const el = mockElement()
    await engine.sequence([{ element: el }])
    expect(el.animate).not.toHaveBeenCalled()
  })

  it('parallel 支持自定义 keyframes', async () => {
    const el = mockElement()
    const kf = [{ opacity: 0 }, { opacity: 1 }]
    await engine.parallel([{ element: el, keyframes: kf }])
    expect(el.animate).toHaveBeenCalledWith(kf, expect.anything())
  })

  it('parallel 跳过无 preset/keyframes', async () => {
    const el = mockElement()
    await engine.parallel([{ element: el }])
    expect(el.animate).not.toHaveBeenCalled()
  })

  it('stopAll 应取消所有动画', () => {
    const el = mockElement()
    const mockAnim = { cancel: vi.fn(), addEventListener: vi.fn() }
    el.animate = vi.fn(() => mockAnim) as unknown as typeof el.animate
    engine.animate(el, [{ opacity: 0 }])
    engine.stopAll()
    expect(mockAnim.cancel).toHaveBeenCalled()
  })

  it('onHover 应添加 mouseenter/mouseleave 监听', () => {
    const el = mockElement()
    const addSpy = vi.spyOn(el, 'addEventListener')
    const cleanup = engine.onHover(el, 'fadeIn', 'fadeOut')
    expect(addSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function))
    expect(addSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function))
    cleanup()
  })

  it('onHover cleanup 应移除监听', () => {
    const el = mockElement()
    const removeSpy = vi.spyOn(el, 'removeEventListener')
    const cleanup = engine.onHover(el, 'fadeIn', 'fadeOut')
    cleanup()
    expect(removeSpy).toHaveBeenCalledTimes(2)
  })

  it('onHover 不传 leavePreset 时不执行离开动画', () => {
    const el = mockElement()
    engine.onHover(el, 'fadeIn')
    const leaveEvent = new Event('mouseleave')
    el.dispatchEvent(leaveEvent)
  })

  it('onClick 应添加 click 监听并返回清理函数', () => {
    const el = mockElement()
    const addSpy = vi.spyOn(el, 'addEventListener')
    const removeSpy = vi.spyOn(el, 'removeEventListener')
    const cleanup = engine.onClick(el, 'bounce')
    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function))
    cleanup()
    expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function))
  })

  it('onScroll 应创建 IntersectionObserver', () => {
    const el = mockElement()
    const observeSpy = vi.fn()
    vi.stubGlobal('IntersectionObserver', vi.fn(() => ({ observe: observeSpy, unobserve: vi.fn(), disconnect: vi.fn() })))
    engine.onScroll(el, 'fadeIn')
    expect(observeSpy).toHaveBeenCalledWith(el)
    vi.unstubAllGlobals()
  })

  it('getAnimationEngine 应返回单例', () => {
    const a = getAnimationEngine()
    const b = getAnimationEngine()
    expect(a).toBe(b)
  })
})
