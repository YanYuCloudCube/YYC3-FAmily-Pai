import React from 'react'

function createMotionValue(initial = 0) {
  let _v = initial
  return {
    get: () => _v,
    set: (v: number) => { _v = v },
  }
}

const motion = new Proxy({}, {
  get: (_target, prop: string) => {
    if (typeof prop === 'string') {
      return React.forwardRef((props: Record<string, unknown>, ref) => {
        const { style, initial, animate, exit, whileHover, whileTap, transition, ...rest } = props
        return React.createElement(prop, { ...rest, ref })
      })
    }
    return () => null
  },
})

export function useMotionValue(initial: number) {
  return createMotionValue(initial)
}

export function useSpring(value: unknown) {
  return createMotionValue(0)
}

export function useTransform(_value: unknown, _input: unknown, _output: unknown) {
  return createMotionValue(0)
}

export function useScroll() {
  return {
    scrollX: createMotionValue(0),
    scrollY: createMotionValue(0),
    scrollXProgress: createMotionValue(0),
    scrollYProgress: createMotionValue(0),
  }
}

export function useInView() {
  return true
}

export function useAnimation() {
  return {
    start: async () => { },
    set: () => { },
    stop: () => { },
  }
}

export function AnimatePresence({ children }: { children?: React.ReactNode }) {
  return children ?? null
}

export { motion }
