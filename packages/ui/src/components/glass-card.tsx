/**
 * file glass-card.tsx
 * description GlassCard · 液态玻璃质感容器组件
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [component],[primitive],[layout],card
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized/primitives/layout；
 *        BaseComponentProps 原依赖不存在的 @yyc3/types，改为内联定义
 */

import React, { forwardRef } from 'react';

/** 组件基础属性（内联自原 @yyc3/types） */
interface BaseComponentProps {
  'data-testid'?: string;
}

export interface GlassCardProps extends BaseComponentProps {
  children: React.ReactNode;
  className?: string;
  /** 发光颜色（可选） */
  glowColor?: string;
  /** 是否可点击 */
  clickable?: boolean;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 点击事件 */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className = '',
      glowColor,
      clickable = false,
      onClick,
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`relative rounded-xl border border-gray-200/50 bg-white/70 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-gray-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/70 dark:hover:border-gray-600 ${clickable ? 'cursor-pointer active:scale-[0.99]' : ''} ${className} `}
        style={
          glowColor ? { boxShadow: `0 0 30px ${glowColor}`, ...style } : style
        }
        {...rest}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
