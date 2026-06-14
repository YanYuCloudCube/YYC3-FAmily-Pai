import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GlitchText } from './GlitchText'

describe('GlitchText', () => {
  it('renders children text', () => {
    render(<GlitchText>YYC³</GlitchText>)
    expect(screen.getByText('YYC³')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <GlitchText className="custom-class">Test</GlitchText>
    )
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toContain('custom-class')
  })

  it('renders with inline style', () => {
    const { container } = render(
      <GlitchText style={{ fontSize: '20px' }}>Styled</GlitchText>
    )
    const el = container.firstElementChild as HTMLElement
    expect(el.style.fontSize).toBe('20px')
  })

  it('renders as span by default', () => {
    const { container } = render(<GlitchText>Span</GlitchText>)
    expect(container.firstElementChild?.tagName).toBe('SPAN')
  })

  it('renders as h1 when specified', () => {
    const { container } = render(<GlitchText as="h1">Heading</GlitchText>)
    expect(container.firstElementChild?.tagName).toBe('H1')
  })
})
