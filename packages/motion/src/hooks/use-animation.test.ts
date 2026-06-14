import { describe, expect, it, vi } from 'vitest'
import { useAnimation } from './use-animation'

const mockEngine = {
  animateWithPreset: vi.fn(),
  onScroll: vi.fn(),
  onHover: vi.fn(),
  cleanup: vi.fn(),
}

vi.mock('../waapi/index', () => ({
  getAnimationEngine: () => mockEngine,
}))

describe('useAnimation', () => {
  it('应导出 useAnimation 函数', () => {
    expect(useAnimation).toBeTypeOf('function')
  })

  it('mock engine 应有正确方法', () => {
    const engine = mockEngine
    expect(engine.animateWithPreset).toBeTypeOf('function')
    expect(engine.onScroll).toBeTypeOf('function')
    expect(engine.onHover).toBeTypeOf('function')
    expect(engine.cleanup).toBeTypeOf('function')
  })
})
