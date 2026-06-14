import { describe, it, expect } from 'vitest'
import {
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInFromLeft,
  slideInFromRight,
  staggerItem,
  rotate3DIn,
  staggerContainer,
  springTransition,
  smoothTransition,
  fastTransition,
  hoverScale,
  hoverLift,
  tapScale,
  pulseAnimation,
  spinAnimation,
  pageEnterSequence,
  cardEnterAnimation,
  modalAnimation,
  backgroundAnimation,
  listItemAnimation,
} from './variants'

describe('framer/variants — 基础变体', () => {
  it('fadeInUp 应包含 opacity 和 y', () => {
    expect(fadeInUp).toHaveProperty('opacity', 0)
    expect(fadeInUp).toHaveProperty('y', 20)
  })

  it('fadeIn 应包含 opacity', () => {
    expect(fadeIn).toHaveProperty('opacity', 0)
  })

  it('scaleIn 应包含 opacity 和 scale', () => {
    expect(scaleIn).toHaveProperty('opacity', 0)
    expect(scaleIn).toHaveProperty('scale', 0.9)
  })

  it('slideInFromLeft 应包含 x=-50', () => {
    expect(slideInFromLeft).toHaveProperty('x', -50)
  })

  it('slideInFromRight 应包含 x=50', () => {
    expect(slideInFromRight).toHaveProperty('x', 50)
  })

  it('staggerItem 应包含 opacity 和 y', () => {
    expect(staggerItem).toHaveProperty('opacity', 0)
    expect(staggerItem).toHaveProperty('y', 20)
  })

  it('rotate3DIn 应包含 rotateX', () => {
    expect(rotate3DIn).toHaveProperty('rotateX', 90)
  })
})

describe('framer/variants — Transitions', () => {
  it('springTransition 应为 spring 类型', () => {
    expect(springTransition).toHaveProperty('type', 'spring')
  })

  it('smoothTransition 应有 duration', () => {
    expect(smoothTransition).toHaveProperty('duration', 0.3)
  })

  it('fastTransition 应有短 duration', () => {
    expect(fastTransition).toHaveProperty('duration', 0.15)
  })
})

describe('framer/variants — 交互变体', () => {
  it('hoverScale 应 scale 1.05', () => {
    expect(hoverScale).toHaveProperty('scale', 1.05)
  })

  it('hoverLift 应 y=-4', () => {
    expect(hoverLift).toHaveProperty('y', -4)
  })

  it('tapScale 应 scale 0.95', () => {
    expect(tapScale).toHaveProperty('scale', 0.95)
  })
})

describe('framer/variants — 循环动画', () => {
  it('pulseAnimation 应有 scale 和 opacity 数组', () => {
    expect(pulseAnimation.scale).toBeInstanceOf(Array)
    expect(pulseAnimation.opacity).toBeInstanceOf(Array)
    expect(pulseAnimation.transition).toHaveProperty('repeat', Infinity)
  })

  it('spinAnimation 应有 rotate 360', () => {
    expect(spinAnimation).toHaveProperty('rotate', 360)
    expect(spinAnimation.transition).toHaveProperty('repeat', Infinity)
  })
})

describe('framer/variants — 复合序列', () => {
  it('pageEnterSequence 应有 initial/animate/exit', () => {
    expect(pageEnterSequence).toHaveProperty('initial', 'initial')
    expect(pageEnterSequence).toHaveProperty('animate', 'animate')
    expect(pageEnterSequence).toHaveProperty('exit', 'exit')
    expect(pageEnterSequence.variants).toHaveProperty('initial')
    expect(pageEnterSequence.variants).toHaveProperty('animate')
  })

  it('cardEnterAnimation 应有 initial/animate', () => {
    expect(cardEnterAnimation).toHaveProperty('initial')
    expect(cardEnterAnimation).toHaveProperty('animate')
    expect(cardEnterAnimation.initial).toHaveProperty('opacity', 0)
    expect(cardEnterAnimation.animate).toHaveProperty('opacity', 1)
  })

  it('modalAnimation 应有 initial/animate/exit', () => {
    expect(modalAnimation).toHaveProperty('initial')
    expect(modalAnimation).toHaveProperty('animate')
    expect(modalAnimation).toHaveProperty('exit')
  })

  it('backgroundAnimation 应有 animate', () => {
    expect(backgroundAnimation).toHaveProperty('animate')
  })
})

describe('framer/variants — listItemAnimation', () => {
  it('应返回带 delay 的动画', () => {
    const anim = listItemAnimation(3)
    expect(anim).toHaveProperty('initial')
    expect(anim).toHaveProperty('animate')
    expect(anim.animate).toHaveProperty('transition')
  })

  it('不同 index 应有不同 delay', () => {
    const a = listItemAnimation(0)
    const b = listItemAnimation(5)
    const delayA = (a.animate as any).transition.delay
    const delayB = (b.animate as any).transition.delay
    expect(delayB).toBeGreaterThan(delayA)
  })
})

describe('framer/variants — staggerContainer', () => {
  it('应有 transition.staggerChildren', () => {
    expect(staggerContainer.transition).toHaveProperty('staggerChildren', 0.1)
  })
})
