import { describe, expect, it } from 'vitest'
import { FadeIn } from './fade-in'
import { LazyWrap } from './lazy-wrap'

describe('FadeIn', () => {
  it('应导出 FadeIn 函数组件', () => {
    expect(FadeIn).toBeTypeOf('function')
    expect(FadeIn.name).toBe('FadeIn')
  })

  it('FadeIn 应有正确的参数签名 (通过 TypeScript 编译验证)', () => {
    expect(FadeIn.length).toBe(1)
  })
})

describe('LazyWrap', () => {
  it('应导出 LazyWrap 函数组件', () => {
    expect(LazyWrap).toBeTypeOf('function')
    expect(LazyWrap.name).toBe('LazyWrap')
  })

  it('LazyWrap 应有正确的参数签名', () => {
    expect(LazyWrap.length).toBe(1)
  })
})
