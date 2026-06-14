"use client"

import { motion, type TargetAndTransition } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cardEnterAnimation, hoverLift, tapScale } from "@/lib/animations"
import type { ReactNode } from "react"

interface AnimatedCardProps {
  title?: string
  children: ReactNode
  delay?: number
  className?: string
  enableHover?: boolean
  enableTap?: boolean
}

export function AnimatedCard({
  title,
  children,
  delay = 0,
  className = "",
  enableHover = true,
  enableTap = true,
}: AnimatedCardProps) {
  const initialProps: TargetAndTransition = {
    opacity: 0,
    y: 30,
    scale: 0.95,
  }

  const animateProps: TargetAndTransition = {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
      delay,
    },
  }

  const hoverProps: TargetAndTransition = {
    y: -4,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  }

  const tapProps: TargetAndTransition = {
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  }

  return (
    <motion.div
      initial={initialProps}
      animate={animateProps}
      whileHover={enableHover ? hoverProps : undefined}
      whileTap={enableTap ? tapProps : undefined}
    >
      <Card className={`bg-slate-900/50 border-slate-700/50 backdrop-blur-sm ${className}`}>
        {title && (
          <CardHeader className="border-b border-slate-700/50 pb-3">
            <CardTitle className="text-slate-100 text-base">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className={title ? "p-4" : "p-0"}>{children}</CardContent>
      </Card>
    </motion.div>
  )
}