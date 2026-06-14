"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

// 简化版无限滚动组件，移除对 framer-motion 和 react-use-measure 的依赖
type InfiniteSliderProps = {
  children: React.ReactNode
  gap?: number
  duration?: number
  direction?: "horizontal" | "vertical"
  className?: string
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  direction = "horizontal",
  className = "",
}: InfiniteSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const slider = sliderRef.current
    
    if (!container || !slider) return

    // 计算移动距离
    const getScrollAmount = () => {
      if (direction === 'horizontal') {
        return slider.offsetWidth / 2
      } else {
        return slider.offsetHeight / 2
      }
    }

    // 动画函数
    const animate = () => {
      const amount = getScrollAmount()
      let startTime: number | null = null
      
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = (elapsed % duration) / duration
        const currentScroll = progress * amount
        
        setScrollDistance(currentScroll)
        requestAnimationFrame(step)
      }
      
      return requestAnimationFrame(step)
    }

    const animationId = animate()
    
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [duration, direction])

  // 计算样式
  const sliderStyle: React.CSSProperties = {
    [direction === 'horizontal' ? 'transform' : 'transform']: `translate${direction === 'horizontal' ? 'X' : 'Y'}(-${scrollDistance}px)`,
    gap: `${gap}px`,
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
  }

  return (
    <div className={`overflow-hidden ${className}`} ref={containerRef}>
      <div className="flex flex-nowrap" style={sliderStyle} ref={sliderRef}>
        {children}
        {children} {/* 复制一份子元素实现循环效果 */}
      </div>
    </div>
  )
}