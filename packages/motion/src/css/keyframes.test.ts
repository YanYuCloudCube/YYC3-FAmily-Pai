import { beforeEach, describe, expect, it } from 'vitest'
import { cssKeyframes, injectKeyframes } from './keyframes'

describe('cssKeyframes', () => {
  it('contains all expected keyframe names', () => {
    expect(Object.keys(cssKeyframes)).toContain('ripple')
    expect(Object.keys(cssKeyframes)).toContain('pulseGlow')
    expect(Object.keys(cssKeyframes)).toContain('slideInBottom')
    expect(Object.keys(cssKeyframes)).toContain('fadeInScale')
    expect(Object.keys(cssKeyframes)).toContain('shimmer')
    expect(Object.keys(cssKeyframes)).toContain('float')
    expect(Object.keys(cssKeyframes)).toContain('rotateSlow')
    expect(Object.keys(cssKeyframes)).toContain('gradientShift')
  })

  it('each keyframe is a valid CSS @keyframes string', () => {
    for (const [name, value] of Object.entries(cssKeyframes)) {
      expect(value).toContain('@keyframes')
      const hasFromTo = value.includes('from') || value.includes('0%')
      expect(hasFromTo).toBe(true)
    }
  })

  it('all keyframes have yyc3- prefix', () => {
    for (const value of Object.values(cssKeyframes)) {
      expect(value).toContain('yyc3-')
    }
  })
})

describe('injectKeyframes', () => {
  beforeEach(() => {
    const existing = document.getElementById('yyc3-motion-keyframes')
    if (existing) existing.remove()
  })

  it('injects style element into document head', () => {
    injectKeyframes()
    const style = document.getElementById('yyc3-motion-keyframes')
    expect(style).toBeTruthy()
    expect(style?.tagName).toBe('STYLE')
  })

  it('does not duplicate style element', () => {
    injectKeyframes()
    injectKeyframes()
    const styles = document.querySelectorAll('#yyc3-motion-keyframes')
    expect(styles.length).toBe(1)
  })

  it('style contains all keyframes', () => {
    injectKeyframes()
    const style = document.getElementById('yyc3-motion-keyframes')
    expect(style?.textContent).toContain('yyc3-ripple')
    expect(style?.textContent).toContain('yyc3-pulse-glow')
  })
})
