import { describe, it, expect } from 'vitest'
import { PRESETS } from './presets'

describe('PRESETS', () => {
  it('contains expected preset names', () => {
    expect(Object.keys(PRESETS)).toContain('fadeIn')
    expect(Object.keys(PRESETS)).toContain('scaleIn')
    expect(Object.keys(PRESETS)).toContain('slideInLeft')
  })

  it('each preset has keyframes and options', () => {
    for (const [name, preset] of Object.entries(PRESETS)) {
      expect(Array.isArray(preset.keyframes)).toBe(true)
      expect(preset.keyframes.length).toBeGreaterThanOrEqual(2)
      expect(preset).toHaveProperty('options')
    }
  })

  it('fadeIn preset has opacity keyframes', () => {
    expect(PRESETS.fadeIn.keyframes[0]).toHaveProperty('opacity')
  })

  it('scaleIn preset has transform keyframes', () => {
    expect(PRESETS.scaleIn.keyframes[0]).toHaveProperty('transform')
  })

  it('presets have valid durations', () => {
    for (const preset of Object.values(PRESETS)) {
      expect(preset.options.duration).toBeGreaterThan(0)
    }
  })
})
