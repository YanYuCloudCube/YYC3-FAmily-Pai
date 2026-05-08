/**
 * file: NeonCard.tsx
 * description: 霓虹发光卡片组件 - 支持赛博朋克和液态玻璃双主题
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-30
 * updated: 2026-03-30
 * status: active
 * tags: [component],[effects],[card],[theme]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 赛博朋克风格霓虹发光卡片，支持滚动入场动画
 *
 * details:
 * - 支持霓虹发光边框效果
 * - 支持赛博朋克和液态玻璃双主题
 * - 使用IntersectionObserver实现性能优化的滚动显示
 * - 支持hover交互效果
 * - 使用React.memo优化性能
 *
 * exports: NeonCard, NeonCardProps, NeonCardThemeMode
 * dependencies: react
 */

import React, { memo, useRef, useEffect, useState, type CSSProperties, type ReactNode } from 'react';

// ==========================================
// 类型定义
// ==========================================

/**
 * 可视主题模式
 */
export type NeonCardThemeMode = 'cyberpunk' | 'liquidGlass';

/**
 * NeonCard 组件属性
 */
export interface NeonCardProps {
  /** 卡片内容 */
  children: ReactNode;
  /** 霓虹发光颜色 */
  color?: string;
  /** 额外的CSS类名 */
  className?: string;
  /** 是否启用hover效果 */
  hoverable?: boolean;
  /** 点击回调 */
  onClick?: () => void;
  /** 禁用滚动显示动画 */
  noReveal?: boolean;
  /** ARIA无障碍标签 */
  ariaLabel?: string;
  /** 主题模式 */
  themeMode?: NeonCardThemeMode;
  /** 内联样式 */
  style?: CSSProperties;
}

// ==========================================
// 颜色映射
// ==========================================

const LIQUID_COLOR_MAP: Record<string, string> = {
  '#00f0ff': '#00ff87',
  '#00d4ff': '#06b6d4',
  '#00ffcc': '#22d3ee',
  '#00ffc8': '#00ffaa',
  '#41ffdd': '#34d399',
  '#008b9d': '#0891b2',
};

// ==========================================
// 组件实现
// ==========================================

/**
 * 赛博朋克风格霓虹发光卡片组件
 *
 * 带有霓虹发光边框和可选滚动显示动画的赛博朋克风格卡片。
 * 使用`IntersectionObserver`实现性能优化的延迟入场，
 * 使用`will-change`提示优化渲染。
 *
 * @param props - 组件属性
 * @returns 霓虹卡片组件
 *
 * @example
 * ```tsx
 * <NeonCard color="#00f0ff" hoverable themeMode="cyberpunk">
 *   <h3>标题</h3>
 *   <p>内容</p>
 * </NeonCard>
 * ```
 */
export const NeonCard = memo(function NeonCard({
  children,
  color = '#00f0ff',
  className = '',
  hoverable = true,
  onClick,
  noReveal = false,
  ariaLabel,
  themeMode = 'cyberpunk',
  style,
}: NeonCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(noReveal);
  const isLiquid = themeMode === 'liquidGlass';

  // 根据主题映射颜色
  const effectiveColor = isLiquid ? LIQUID_COLOR_MAP[color] || color : color;

  // IntersectionObserver for scroll reveal
  useEffect(() => {
    if (noReveal || revealed) return;
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [noReveal, revealed]);

  // 获取主题特定的样式
  const getThemeStyles = (): CSSProperties => {
    const baseStyles: CSSProperties = {
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      willChange: hoverable ? 'transform, box-shadow' : 'auto',
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
    };

    if (isLiquid) {
      return {
        ...baseStyles,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderTop: '1px solid rgba(255,255,255,0.18)',
        borderLeft: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
        borderRadius: '20px',
      };
    }

    return {
      ...baseStyles,
      background: 'rgba(10,10,10,0.75)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderColor: `${effectiveColor}33`,
      border: `1px solid ${effectiveColor}33`,
      boxShadow: `0 0 10px ${effectiveColor}33, inset 0 0 15px ${effectiveColor}0d`,
    };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverable) {
      const target = e.currentTarget;
      if (isLiquid) {
        target.style.background = 'rgba(255,255,255,0.10)';
        target.style.boxShadow =
          '0 16px 40px rgba(0,0,0,0.12), 0 0 30px rgba(0,255,135,0.1), inset 0 1px 0 rgba(255,255,255,0.12)';
      } else {
        target.style.borderColor = `${effectiveColor}80`;
        target.style.boxShadow = `0 0 20px ${effectiveColor}66, 0 0 40px ${effectiveColor}33, inset 0 0 20px ${effectiveColor}1a`;
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverable) {
      const target = e.currentTarget;
      if (isLiquid) {
        target.style.background = 'rgba(255,255,255,0.06)';
        target.style.boxShadow =
          '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)';
      } else {
        target.style.borderColor = `${effectiveColor}33`;
        target.style.boxShadow = `0 0 10px ${effectiveColor}33, inset 0 0 15px ${effectiveColor}0d`;
      }
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      data-neon-card=""
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`
        relative overflow-hidden rounded-2xl p-5
        transition-all duration-400
        ${hoverable ? 'cursor-pointer hover:-translate-y-2 hover:scale-[1.02]' : ''}
        ${className}
      `}
      style={{ ...getThemeStyles(), ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shimmer effect */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full pointer-events-none opacity-0 hover:opacity-100"
        style={{
          background: isLiquid
            ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          animation: 'shimmer-move 3s ease-in-out infinite',
        }}
      />
      {/* Circuit grid overlay — cyberpunk only */}
      {!isLiquid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `linear-gradient(${effectiveColor}0f 1px, transparent 1px), linear-gradient(90deg, ${effectiveColor}0f 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

export default NeonCard;
