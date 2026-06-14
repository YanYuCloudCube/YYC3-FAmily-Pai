import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  AnimatedCheckbox,
  AnimatedCounter,
  AnimatedInput,
  AnimatedSwitch,
  LikeButton,
  LoadingButton,
  MagneticButton,
  PulseButton,
  RippleButton
} from './MicroInteractions'

describe('MicroInteractions', () => {
  describe('RippleButton', () => {
    it('renders children', () => {
      render(<RippleButton>Click Me</RippleButton>)
      expect(screen.getByText('Click Me')).toBeTruthy()
    })

    it('calls onClick', () => {
      let clicked = false
      render(<RippleButton onClick={() => { clicked = true }}>Click</RippleButton>)
      fireEvent.click(screen.getByText('Click'))
      expect(clicked).toBe(true)
    })
  })

  describe('PulseButton', () => {
    it('renders children', () => {
      render(<PulseButton>Pulse</PulseButton>)
      expect(screen.getByText('Pulse')).toBeTruthy()
    })
  })

  describe('MagneticButton', () => {
    it('renders children', () => {
      render(<MagneticButton>Magnet</MagneticButton>)
      expect(screen.getByText('Magnet')).toBeTruthy()
    })
  })

  describe('AnimatedInput', () => {
    it('renders input', () => {
      const { container } = render(<AnimatedInput />)
      expect(container.querySelector('input')).toBeTruthy()
    })

    it('renders with label', () => {
      render(<AnimatedInput label="Email" />)
      expect(screen.getByText('Email')).toBeTruthy()
    })
  })

  describe('AnimatedSwitch', () => {
    it('renders switch', () => {
      const { container } = render(<AnimatedSwitch checked={false} onChange={() => { }} />)
      expect(container.querySelector('input[type="checkbox"]')).toBeTruthy()
    })

    it('toggles on click', () => {
      let checked = false
      render(<AnimatedSwitch checked={checked} onChange={(v) => { checked = v }} />)
      fireEvent.click(screen.getByRole('checkbox'))
      expect(checked).toBe(true)
    })
  })

  describe('LoadingButton', () => {
    it('renders in normal state', () => {
      render(<LoadingButton loading={false}>Submit</LoadingButton>)
      expect(screen.getByText('Submit')).toBeTruthy()
    })

    it('renders loading state', () => {
      render(<LoadingButton loading={true}>Submit</LoadingButton>)
      expect(screen.getByText('加载中...')).toBeTruthy()
    })
  })

  describe('AnimatedCounter', () => {
    it('renders with prefix and suffix', () => {
      render(<AnimatedCounter value={100} prefix="$" suffix="+" />)
      const el = screen.getByText(/\$.*\+/)
      expect(el).toBeTruthy()
    })
  })

  describe('AnimatedCheckbox', () => {
    it('renders checkbox', () => {
      render(<AnimatedCheckbox checked={false} onChange={() => { }} label="Accept" />)
      expect(screen.getByText('Accept')).toBeTruthy()
    })
  })

  describe('LikeButton', () => {
    it('renders button', () => {
      const { container } = render(<LikeButton />)
      expect(container.querySelector('button')).toBeTruthy()
    })
  })
})
