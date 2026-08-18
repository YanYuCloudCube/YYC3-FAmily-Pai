"use client"

/**
 * file enhanced-progress.tsx
 * description 增强版进度条 — 支持状态、尺寸、动画、标签
 * module @yyc3/ui/components/ui
 * author YanYuCloudCube Team <admin@0379.email>
 * version 3.0.0
 * created 2026-06-20
 * status active
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 从 UI-MONO 迁移，提供彩色渐变进度条
 */

import { cn } from "../../lib/utils"
import { getProgressColor } from "../../lib/design-system"

export interface EnhancedProgressProps {
  value: number
  status?:
    | "on-track"
    | "at-risk"
    | "off-track"
    | "excellent"
    | "good"
    | "warning"
    | "critical"
  size?: "sm" | "md" | "lg"
  animated?: boolean
  showLabel?: boolean
  className?: string
}

export function EnhancedProgress({
  value,
  status,
  size = "md",
  animated = false,
  showLabel = false,
  className,
}: EnhancedProgressProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }

  const progressColor = getProgressColor(value, status)

  return (
    <div className={cn("relative", className)}>
      <div className={cn("bg-slate-200 rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full transition-all duration-500 relative overflow-hidden",
            progressColor,
            animated && "animate-pulse",
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
      {showLabel && <div className="text-xs text-slate-600 mt-1 text-center">{value}%</div>}
    </div>
  )
}
