import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Parallax, ParallaxBackground, SmoothParallax, ParallaxText,
  ParallaxImage, ParallaxStack, ParallaxReveal, ScrollProgress,
  ScrollTrigger, Parallax3DCard, InfiniteScroll
} from './ParallaxScroll'

describe('ParallaxScroll', () => {
  describe('Parallax', () => {
    it('renders children', () => {
      render(<Parallax>Parallax Content</Parallax>)
      expect(screen.getByText('Parallax Content')).toBeTruthy()
    })
  })

  describe('ParallaxBackground', () => {
    it('renders layers', () => {
      render(
        <ParallaxBackground
          layers={[
            { content: <div>Layer 1</div>, speed: 0.2 },
            { content: <div>Layer 2</div>, speed: 0.5 },
          ]}
        />
      )
      expect(screen.getByText('Layer 1')).toBeTruthy()
      expect(screen.getByText('Layer 2')).toBeTruthy()
    })
  })

  describe('SmoothParallax', () => {
    it('renders children', () => {
      render(<SmoothParallax>Smooth</SmoothParallax>)
      expect(screen.getByText('Smooth')).toBeTruthy()
    })
  })

  describe('ParallaxText', () => {
    it('renders text', () => {
      render(<ParallaxText text="Hello World" />)
      expect(screen.getByText('Hello World')).toBeTruthy()
    })
  })

  describe('ParallaxReveal', () => {
    it('renders children with up direction', () => {
      render(<ParallaxReveal direction="up">Reveal Up</ParallaxReveal>)
      expect(screen.getByText('Reveal Up')).toBeTruthy()
    })

    it('renders children with left direction', () => {
      render(<ParallaxReveal direction="left">Reveal Left</ParallaxReveal>)
      expect(screen.getByText('Reveal Left')).toBeTruthy()
    })
  })

  describe('ScrollProgress', () => {
    it('renders progress bar', () => {
      const { container } = render(<ScrollProgress />)
      expect(container.firstElementChild).toBeTruthy()
    })
  })

  describe('ScrollTrigger', () => {
    it('renders with fade animation', () => {
      render(<ScrollTrigger animation="fade">Trigger</ScrollTrigger>)
      expect(screen.getByText('Trigger')).toBeTruthy()
    })

    it('renders with scale animation', () => {
      render(<ScrollTrigger animation="scale">Scale</ScrollTrigger>)
      expect(screen.getByText('Scale')).toBeTruthy()
    })
  })

  describe('Parallax3DCard', () => {
    it('renders children', () => {
      render(<Parallax3DCard>3D Card</Parallax3DCard>)
      expect(screen.getByText('3D Card')).toBeTruthy()
    })
  })

  describe('InfiniteScroll', () => {
    it('renders children', () => {
      render(<InfiniteScroll><div>Scroll Item</div></InfiniteScroll>)
      expect(screen.getAllByText('Scroll Item').length).toBeGreaterThanOrEqual(2)
    })
  })
})
