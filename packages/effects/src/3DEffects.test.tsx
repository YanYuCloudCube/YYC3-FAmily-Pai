import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  TiltCard, FlipCard, StackedCards, PerspectiveContainer,
  RotatingShowcase, FloatingCard, GlassRefractionCard, BookPage
} from './3DEffects'

describe('3DEffects', () => {
  describe('TiltCard', () => {
    it('renders children', () => {
      render(<TiltCard>Tilt Content</TiltCard>)
      expect(screen.getByText('Tilt Content')).toBeTruthy()
    })

    it('applies className', () => {
      const { container } = render(<TiltCard className="test-tilt">X</TiltCard>)
      expect(container.querySelector('.test-tilt')).toBeTruthy()
    })
  })

  describe('FlipCard', () => {
    it('renders front content', () => {
      render(<FlipCard front={<div>Front</div>} back={<div>Back</div>} />)
      expect(screen.getByText('Front')).toBeTruthy()
    })

    it('flips on click', () => {
      render(<FlipCard front={<div>Front</div>} back={<div>Back</div>} />)
      fireEvent.click(screen.getByText('Front').closest('div')!)
      expect(screen.getByText('Back')).toBeTruthy()
    })

    it('flips on hover when flipOnHover', () => {
      render(
        <FlipCard flipOnHover front={<div>Front</div>} back={<div>Back</div>} />
      )
      const container = screen.getByText('Front').closest('div')!
      fireEvent.mouseEnter(container)
      expect(screen.getByText('Back')).toBeTruthy()
    })
  })

  describe('StackedCards', () => {
    it('renders all cards', () => {
      render(
        <StackedCards cards={[<div key="a">Card A</div>, <div key="b">Card B</div>]} />
      )
      expect(screen.getByText('Card A')).toBeTruthy()
      expect(screen.getByText('Card B')).toBeTruthy()
    })
  })

  describe('PerspectiveContainer', () => {
    it('renders children with perspective', () => {
      const { container } = render(
        <PerspectiveContainer perspective={800}>Content</PerspectiveContainer>
      )
      expect(container.firstElementChild).toBeTruthy()
      expect(container.firstElementChild?.textContent).toBe('Content')
    })
  })

  describe('FloatingCard', () => {
    it('renders children', () => {
      render(<FloatingCard>Float</FloatingCard>)
      expect(screen.getByText('Float')).toBeTruthy()
    })
  })

  describe('GlassRefractionCard', () => {
    it('renders children', () => {
      render(<GlassRefractionCard>Glass</GlassRefractionCard>)
      expect(screen.getByText('Glass')).toBeTruthy()
    })
  })

  describe('BookPage', () => {
    it('renders first page', () => {
      render(
        <BookPage pages={[<div key="p1">Page 1</div>, <div key="p2">Page 2</div>]} />
      )
      expect(screen.getByText('Page 1')).toBeTruthy()
    })

    it('navigates to next page', () => {
      render(
        <BookPage pages={[<div key="p1">Page 1</div>, <div key="p2">Page 2</div>]} />
      )
      fireEvent.click(screen.getByText('下一页'))
      expect(screen.getByText('Page 2')).toBeTruthy()
    })
  })
})
