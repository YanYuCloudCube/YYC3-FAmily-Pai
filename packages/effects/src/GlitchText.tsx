/**
 * file: GlitchText.tsx
 * description: 赛博朋克风格文字故障效果组件
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-30
 * updated: 2026-03-30
 * status: active
 * tags: [component],[effects],[animation],[text]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 带有赛博朋克风格故障效果的文字组件
 *
 * details:
 * - 支持随机触发和hover加强效果
 * - 可配置故障强度和触发间隔
 * - 支持多种HTML标签
 * - 尊重prefers-reduced-motion设置
 *
 * exports: GlitchText, GlitchTextProps
 * dependencies: react
 */

import { useState, useEffect, useRef, useCallback, memo, type CSSProperties } from 'react';

// ==========================================
// 类型定义
// ==========================================

/**
 * GlitchText 组件属性
 */
export interface GlitchTextProps {
  /** 要显示的文字内容 */
  children: string;
  /** 主要霓虹颜色 */
  color?: string;
  /** 额外的CSS类名 */
  className?: string;
  /** 内联样式覆盖 */
  style?: CSSProperties;
  /** 是否显示为行内元素 */
  inline?: boolean;
  /** 随机故障间隔范围 [最小毫秒, 最大毫秒]，设为null禁用定时触发 */
  interval?: [number, number] | null;
  /** 故障强度乘数 (0-2, 默认1) */
  intensity?: number;
  /** 使用的HTML标签 */
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p';
  /** 是否启用故障效果 */
  enabled?: boolean;
}

// ==========================================
// 组件实现
// ==========================================

/**
 * 赛博朋克风格文字故障效果组件
 *
 * 文字组件带有动画故障失真效果，
 * 强度可控制，效果尊重`prefers-reduced-motion`设置。
 *
 * @param props - 组件属性
 * @returns 故障文字组件
 *
 * @example
 * ```tsx
 * <GlitchText color="#00f0ff" intensity={1.2}>
 *   赛博朋克
 * </GlitchText>
 * ```
 */
export const GlitchText = memo(function GlitchText({
  children,
  color = '#00f0ff',
  className = '',
  style,
  inline = true,
  interval = [3000, 8000],
  intensity = 1,
  as: Tag = 'span',
  enabled = true,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 检查是否支持动画
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const shouldAnimate = enabled && !prefersReducedMotion;

  // Random periodic glitch trigger
  useEffect(() => {
    if (!shouldAnimate || !interval) return;

    const scheduleGlitch = () => {
      const [min, max] = interval;
      const delay = min + Math.random() * (max - min);
      timerRef.current = setTimeout(() => {
        setIsGlitching(true);
        // Glitch lasts 150-400ms
        setTimeout(() => {
          setIsGlitching(false);
          scheduleGlitch();
        }, 150 + Math.random() * 250);
      }, delay);
    };

    scheduleGlitch();
    return () => clearTimeout(timerRef.current);
  }, [shouldAnimate, interval]);

  const handleMouseEnter = useCallback(() => {
    if (shouldAnimate) setIsHovering(true);
  }, [shouldAnimate]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const active = shouldAnimate && (isGlitching || isHovering);
  const hoverActive = shouldAnimate && isHovering;
  const px = Math.round(3 * intensity);

  return (
    <Tag
      className={`${inline ? 'inline-block' : 'block'} relative ${className}`}
      style={{
        ...style,
        color,
        willChange: active ? 'transform, clip-path' : 'auto',
        animation: active
          ? `glitch-skew ${hoverActive ? '0.3s' : '0.5s'} ease-in-out`
          : undefined,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={children}
    >
      {/* Main text */}
      <span
        className="relative z-10"
        style={{
          animation: active
            ? `glitch-color-shift ${hoverActive ? '0.15s' : '0.3s'} ease-in-out`
            : undefined,
        }}
      >
        {children}
      </span>

      {/* Cyan offset layer */}
      {active && (
        <span
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            color: '#00d4ff',
            opacity: 0.7 * intensity,
            animation: hoverActive
              ? 'glitch-text-hover 0.4s steps(2, start) infinite'
              : 'glitch-text-1 0.4s steps(2, start)',
            textShadow: `${px}px 0 #00d4ff`,
          }}
          aria-hidden="true"
        >
          {children}
        </span>
      )}

      {/* Magenta offset layer */}
      {active && (
        <span
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            color: '#00d4ff',
            opacity: 0.5 * intensity,
            animation: hoverActive
              ? 'glitch-text-hover 0.35s steps(2, start) 0.05s infinite'
              : 'glitch-text-2 0.35s steps(2, start)',
            textShadow: `${-px}px 0 #00d4ff`,
          }}
          aria-hidden="true"
        >
          {children}
        </span>
      )}
    </Tag>
  );
});

export default GlitchText;
