declare module "motion/react" {
  import { type ReactNode } from "react"

  type MotionValue<T = number> = {
    get(): T
    set(v: T): void
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface MotionProps extends Record<string, any> {
    children?: ReactNode
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const motion: Record<string, any>

  export function useMotionValue(initial: number): MotionValue
  export function useSpring(value: MotionValue | number, config?: Record<string, unknown>): MotionValue
  export function useTransform(value: MotionValue, inputRange: number[], outputRange: number[]): MotionValue
  export function useTransform(value: MotionValue, mapper: (latest: number) => number): MotionValue
  export function useScroll(options?: Record<string, unknown>): { scrollX: MotionValue; scrollY: MotionValue; scrollXProgress: MotionValue; scrollYProgress: MotionValue }
  export function useInView(ref: unknown, options?: Record<string, unknown>): boolean
  export function useAnimation(): { start: (...args: unknown[]) => Promise<void>; set: (...args: unknown[]) => void; stop: () => void }
  export function AnimatePresence(props: Record<string, unknown>): ReactNode

  export type { MotionValue }
}
