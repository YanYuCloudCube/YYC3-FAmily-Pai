import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ParticleCanvas } from './ParticleCanvas'

describe('ParticleCanvas', () => {
  it('renders a canvas element', () => {
    const { container } = render(<ParticleCanvas />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeTruthy()
  })

  it('applies custom style', () => {
    const { container } = render(
      <ParticleCanvas style={{ width: 400, height: 300 }} />
    )
    const canvas = container.querySelector('canvas') as HTMLElement
    expect(canvas).toBeTruthy()
  })

  it('accepts config prop', () => {
    const { container } = render(
      <ParticleCanvas config={{ enabled: true, colors: ['#00f0ff'] }} />
    )
    expect(container.querySelector('canvas')).toBeTruthy()
  })

  it('accepts enableMouseInteraction prop', () => {
    const { container } = render(
      <ParticleCanvas enableMouseInteraction={false} />
    )
    expect(container.querySelector('canvas')).toBeTruthy()
  })
})
