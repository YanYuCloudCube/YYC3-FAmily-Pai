/**
 * file: ParticleCanvas.tsx
 * description: Canvas粒子背景系统 - 支持独立主题配置的粒子网络动画
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-30
 * updated: 2026-03-30
 * status: active
 * tags: [component],[effects],[canvas],[animation]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: Canvas粒子网络背景组件，支持霓虹连线效果和鼠标交互
 *
 * details:
 * - 基于Canvas的高性能粒子动画系统
 * - 支持粒子间霓虹连线效果
 * - 支持鼠标交互吸引力
 * - 可配置粒子数量、颜色、强度等参数
 * - 支持主题配置独立控制
 *
 * exports: ParticleCanvas, ParticleCanvasProps
 * dependencies: react
 */

import { useEffect, useRef, useCallback, memo, type CSSProperties } from 'react';

// ==========================================
// 类型定义
// ==========================================

/**
 * 单个粒子数据结构
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

/**
 * 粒子画布配置选项
 */
export interface ParticleCanvasConfig {
  /** 是否启用粒子动画 */
  enabled?: boolean;
  /** 霓虹强度 (0-100) */
  neonIntensity?: number;
  /** 粒子颜色数组 */
  colors?: string[];
  /** 连接距离阈值 */
  connectionDistance?: number;
  /** 粒子数量因子（每像素粒子的比例） */
  particleCountFactor?: number;
  /** 最大粒子数 */
  maxParticles?: number;
  /** 最小粒子数 */
  minParticles?: number;
  /** 画布透明度 */
  opacity?: number;
  /** 鼠标交互范围 */
  mouseInteractionRange?: number;
}

/**
 * ParticleCanvas 组件属性
 */
export interface ParticleCanvasProps {
  /** 粒子画布配置 */
  config?: ParticleCanvasConfig;
  /** 额外的CSS类名 */
  className?: string;
  /** 内联样式 */
  style?: CSSProperties;
  /** 是否启用鼠标交互 */
  enableMouseInteraction?: boolean;
  /** 是否自动适应父容器大小 */
  autoResize?: boolean;
}

// ==========================================
// 默认配置
// ==========================================

const DEFAULT_COLORS = [
  '#00f0ff', // primary cyan
  '#00d4ff', // secondary blue-cyan
  '#00ffcc', // accent cyan-green
  '#00ffc8', // success cyan
  '#41ffdd', // highlight cyan
];

const DEFAULT_CONFIG: Required<ParticleCanvasConfig> = {
  enabled: true,
  neonIntensity: 80,
  colors: DEFAULT_COLORS,
  connectionDistance: 120,
  particleCountFactor: 0.000035,
  maxParticles: 60,
  minParticles: 15,
  opacity: 0.6,
  mouseInteractionRange: 150,
};

// ==========================================
// 组件实现
// ==========================================

/**
 * Canvas粒子网络背景组件
 *
 * 使用requestAnimationFrame实现平滑的60fps动画，
 * 支持粒子间霓虹连线效果和鼠标交互吸引力。
 * 通过React.memo优化避免不必要的重新渲染。
 *
 * @param props - 组件属性
 * @returns 粒子画布组件或null（当禁用时）
 *
 * @example
 * ```tsx
 * <ParticleCanvas
 *   config={{
 *     enabled: true,
 *     neonIntensity: 80,
 *     colors: ['#00f0ff', '#00d4ff']
 *   }}
 * />
 * ```
 */
export const ParticleCanvas = memo(function ParticleCanvas({
  config: userConfig,
  className = '',
  style,
  enableMouseInteraction = true,
  autoResize = true,
}: ParticleCanvasProps) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const createParticles = useCallback(
    (width: number, height: number): Particle[] => {
      const area = width * height;
      const count = Math.max(
        config.minParticles,
        Math.min(config.maxParticles, Math.floor(area * config.particleCountFactor))
      );
      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 1 + Math.random() * 2,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        alpha: 0.15 + Math.random() * 0.35,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      }));
    },
    [config]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !config.enabled) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = createParticles(width, height);
    };

    resize();
    if (autoResize) {
      window.addEventListener('resize', resize);
    }

    // Mouse interaction handlers
    let handleMouse: ((e: MouseEvent) => void) | null = null;
    let handleMouseLeave: (() => void) | null = null;

    if (enableMouseInteraction) {
      handleMouse = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };
      handleMouseLeave = () => {
        mouseRef.current = { x: -1000, y: -1000 };
      };
      canvas.addEventListener('mousemove', handleMouse);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    const neonScale = config.neonIntensity / 100;

    // Animation loop
    const animate = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Pulse
        p.pulsePhase += p.pulseSpeed;
        const pulse = 0.6 + 0.4 * Math.sin(p.pulsePhase);

        // Mouse attraction (gentle)
        if (enableMouseInteraction) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < config.mouseInteractionRange && mDist > 1) {
            p.vx += (mdx / mDist) * 0.02;
            p.vy += (mdy / mDist) * 0.02;
          }
        }

        // Velocity dampening
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw node
        const alpha = p.alpha * pulse * neonScale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.15;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.connectionDistance) {
            const lineAlpha =
              (1 - dist / config.connectionDistance) * 0.15 * neonScale;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Mouse connection lines
      if (enableMouseInteraction && mouse.x > 0 && mouse.y > 0) {
        for (const p of particles) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const lineAlpha = (1 - dist / 180) * 0.25 * neonScale;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (autoResize) {
        window.removeEventListener('resize', resize);
      }
      if (handleMouse) {
        canvas.removeEventListener('mousemove', handleMouse);
      }
      if (handleMouseLeave) {
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [
    config,
    createParticles,
    enableMouseInteraction,
    autoResize,
  ]);

  if (!config.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`particle-canvas absolute inset-0 pointer-events-auto z-0 ${className}`}
      style={{ opacity: config.opacity, ...style }}
      aria-hidden="true"
    />
  );
});

export default ParticleCanvas;
