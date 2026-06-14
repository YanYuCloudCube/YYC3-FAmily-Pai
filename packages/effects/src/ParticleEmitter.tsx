/**
 * file ParticleEmitter.tsx
 * description 交互式粒子喷射器 — 基于位置/速度的点击/拖拽粒子效果
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-20
 * updated 2026-05-20
 * status active
 * tags [component],[effects],[canvas],[particle],[interaction]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

import { useRef, useEffect, memo, type CSSProperties } from 'react';

export interface ParticleEmitterProps {
  position: { x: number; y: number }
  speed: number
  color: { r: number; g: number; b: number }
  active: boolean
  maxParticles?: number
  particleLife?: number
  className?: string
  style?: CSSProperties
}

interface EmitterParticle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  life: number
}

export const ParticleEmitter = memo(function ParticleEmitter({
  position,
  speed,
  color,
  active,
  maxParticles = 100,
  particleLife = 20,
  className = '',
  style,
}: ParticleEmitterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let particles: EmitterParticle[] = []
    let animationFrame: number

    const initParticles = () => {
      particles = []
      const count = Math.min(maxParticles, Math.max(10, Math.floor(speed * 10)))

      for (let i = 0; i < count; i++) {
        particles.push({
          x: position.x,
          y: position.y,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * speed * 2,
          speedY: (Math.random() - 0.5) * speed,
          color: `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.random() * 0.5 + 0.3})`,
          life: Math.random() * particleLife + 10,
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY
        p.life--

        if (p.life <= 0) {
          particles.splice(i, 1)
          i--
        }
      }

      if (particles.length > 0) {
        animationFrame = requestAnimationFrame(drawParticles)
      }
    }

    initParticles()
    drawParticles()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [active, position, speed, color, maxParticles, particleLife])

  return (
    <canvas
      ref={canvasRef}
      className={`particle-emitter ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 100,
        width: '100%',
        height: '100%',
        ...style,
      }}
      aria-hidden="true"
    />
  )
})

export default ParticleEmitter
