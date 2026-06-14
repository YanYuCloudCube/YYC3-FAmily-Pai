import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ParticleEmitter } from './ParticleEmitter'

describe('ParticleEmitter', () => {
  it('renders canvas when active', () => {
    const { container } = render(
      <ParticleEmitter
        position={{ x: 100, y: 100 }}
        speed={5}
        color={{ r: 0, g: 255, b: 136 }}
        active={true}
      />
    )
    expect(container.querySelector('canvas')).toBeTruthy()
  })

  it('renders canvas when inactive', () => {
    const { container } = render(
      <ParticleEmitter
        position={{ x: 0, y: 0 }}
        speed={0}
        color={{ r: 0, g: 0, b: 0 }}
        active={false}
      />
    )
    expect(container.querySelector('canvas')).toBeTruthy()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ParticleEmitter
        position={{ x: 50, y: 50 }}
        speed={3}
        color={{ r: 255, g: 0, b: 0 }}
        active={true}
        className="my-emitter"
      />
    )
    const canvas = container.querySelector('canvas')
    expect(canvas?.className).toContain('my-emitter')
  })

  it('applies custom style', () => {
    const { container } = render(
      <ParticleEmitter
        position={{ x: 0, y: 0 }}
        speed={1}
        color={{ r: 0, g: 0, b: 255 }}
        active={true}
        style={{ opacity: 0.5 }}
      />
    )
    const canvas = container.querySelector('canvas') as HTMLElement
    expect(canvas.style.opacity).toBe('0.5')
  })

  it('accepts maxParticles prop', () => {
    const { container } = render(
      <ParticleEmitter
        position={{ x: 200, y: 200 }}
        speed={10}
        color={{ r: 0, g: 240, b: 255 }}
        active={true}
        maxParticles={50}
      />
    )
    expect(container.querySelector('canvas')).toBeTruthy()
  })

  it('accepts particleLife prop', () => {
    const { container } = render(
      <ParticleEmitter
        position={{ x: 300, y: 300 }}
        speed={2}
        color={{ r: 100, g: 200, b: 50 }}
        active={true}
        particleLife={30}
      />
    )
    expect(container.querySelector('canvas')).toBeTruthy()
  })

  it('has aria-hidden for accessibility', () => {
    const { container } = render(
      <ParticleEmitter
        position={{ x: 0, y: 0 }}
        speed={1}
        color={{ r: 0, g: 0, b: 0 }}
        active={true}
      />
    )
    const canvas = container.querySelector('canvas')
    expect(canvas?.getAttribute('aria-hidden')).toBe('true')
  })
})
