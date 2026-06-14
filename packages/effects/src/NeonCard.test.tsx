import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NeonCard } from './NeonCard'

describe('NeonCard', () => {
  it('renders children content', () => {
    render(<NeonCard>Card Content</NeonCard>)
    expect(screen.getByText('Card Content')).toBeTruthy()
  })

  it('applies custom className', () => {
    const { container } = render(
      <NeonCard className="my-card">Content</NeonCard>
    )
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toContain('my-card')
  })

  it('renders with default theme', () => {
    const { container } = render(<NeonCard>Test</NeonCard>)
    expect(container.firstElementChild).toBeTruthy()
  })

  it('renders with liquidGlass themeMode', () => {
    const { container } = render(
      <NeonCard themeMode="liquidGlass">Glass</NeonCard>
    )
    expect(container.firstElementChild).toBeTruthy()
  })

  it('calls onClick handler', () => {
    let clicked = false
    render(<NeonCard onClick={() => { clicked = true }}>Click</NeonCard>)
    const el = screen.getByText('Click').closest('div')
    el?.click()
    expect(clicked).toBe(true)
  })
})
