"use client"

// 简化版渐进式模糊组件，移除对 @/lib/utils 和 motion/react 的依赖
export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
}

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES
  blurLayers?: number
  className?: string
  blurIntensity?: number
  [key: string]: any
}

export function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 8,
  className = "",
  blurIntensity = 0.25,
  ...props
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2)
  const segmentSize = 1 / (blurLayers + 1)

  // 合并类名
  const mergedClassName = `relative ${className}`

  return (
    <div className={mergedClassName}>
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction]
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map((pos, posIndex) => `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`)

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(", ")})`

        // 移除 motion 相关属性
        const filteredProps = { ...props }
        delete filteredProps.initial
        delete filteredProps.animate
        delete filteredProps.transition
        delete filteredProps.onHoverStart
        delete filteredProps.onHoverEnd

        return (
          <div
            key={index}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
            }}
            {...filteredProps}
          />
        )
      })}
    </div>
  )
}