// ─── External Module Type Stubs for @yyc3/effects ───
// These stubs provide minimal type declarations for optional peer dependencies
// used by individual effect components but not required for the core library.

// ─── class-variance-authority ───
declare module 'class-variance-authority' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type VariantProps<T> = any

  export function cva(
    base: string,
    config?: Record<string, unknown>
  ): (props?: Record<string, unknown>) => string
}

// ─── @radix-ui/react-slot ───
declare module '@radix-ui/react-slot' {
  import * as React from 'react'
  export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode
  }
  export const Slot: React.ForwardRefExoticComponent<SlotProps & React.RefAttributes<HTMLElement>>
}

// ─── lucide-react ───
declare module 'lucide-react' {
  import * as React from 'react'
  export const Loader2: React.FC<React.SVGProps<SVGSVGElement>>
  export const Plus: React.FC<React.SVGProps<SVGSVGElement>>
  export const X: React.FC<React.SVGProps<SVGSVGElement>>
  export const Sparkles: React.FC<React.SVGProps<SVGSVGElement>>
  export const Brain: React.FC<React.SVGProps<SVGSVGElement>>
  export const BarChart3: React.FC<React.SVGProps<SVGSVGElement>>
  export const FileText: React.FC<React.SVGProps<SVGSVGElement>>
}

// ─── framer-motion ───
declare module 'framer-motion' {
  import * as React from 'react'
  export interface MotionProps {
    initial?: string | Record<string, unknown>
    animate?: string | Record<string, unknown>
    exit?: string | Record<string, unknown>
    transition?: Record<string, unknown>
    whileHover?: Record<string, unknown>
    whileTap?: Record<string, unknown>
    variants?: Record<string, unknown>
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  export const motion: {
    div: React.ForwardRefExoticComponent<MotionProps & React.RefAttributes<HTMLDivElement>>
    span: React.ForwardRefExoticComponent<MotionProps & React.RefAttributes<HTMLSpanElement>>
    p: React.ForwardRefExoticComponent<MotionProps & React.RefAttributes<HTMLParagraphElement>>
    section: React.ForwardRefExoticComponent<MotionProps & React.RefAttributes<HTMLElement>>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  export function useAnimation(): {
    start: (...args: unknown[]) => Promise<void>
    set: (...args: unknown[]) => void
    stop: () => void
  }
  export type Variants = Record<string, Record<string, unknown>>
  export type TargetAndTransition = Record<string, unknown>
}

// ─── motion (framer-motion v11+ alias) ───
declare module 'motion' {
  export * from 'framer-motion'
}

// ─── three ───
declare module 'three' {
  export class Scene { }
  export class PerspectiveCamera { }
  export class WebGLRenderer { }
  export class BoxGeometry { }
  export class Mesh { }
  export class MeshStandardMaterial { }
  export class DirectionalLight { }
  export class AmbientLight { }
  export class Color {
    constructor(color: string | number)
  }
  export class Vector3 {
    x: number
    y: number
    z: number
  }
  export class Group { }
  export class TextureLoader {
    load(url: string): unknown
  }
  export namespace MathUtils {
    function degToRad(deg: number): number
  }
  export const SRGBColorSpace: string
  export const LinearSRGBColorSpace: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type AnyPrimitive = any
}
declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  export class GLTFLoader {
    load(url: string, onLoad: (gltf: unknown) => void, onProgress?: (e: ProgressEvent) => void, onError?: (e: ErrorEvent) => void): void
  }
}
declare module 'three/examples/jsm/loaders/OBJLoader.js' {
  export class OBJLoader {
    load(url: string, onLoad: (obj: unknown) => void, onProgress?: (e: ProgressEvent) => void, onError?: (e: ErrorEvent) => void): void
  }
}
declare module 'three/examples/jsm/controls/OrbitControls.js' {
  export class OrbitControls {
    constructor(camera: unknown, domElement: HTMLElement)
    enableDamping: boolean
    dampingFactor: number
    update(): void
    dispose(): void
  }
}

// ─── @tsparticles ───
declare module '@tsparticles/react' {
  import type { Engine } from '@tsparticles/engine'
  import type { FC } from 'react'
  const Particles: FC<{ id?: string; className?: string; options?: Record<string, unknown>;[key: string]: unknown }>
  export default Particles
  export function initParticlesEngine(cb: (engine: Engine) => Promise<void>): Promise<void>
}
declare module '@tsparticles/engine' {
  export interface Container { destroy(): void }
  export interface Engine { load(plugin: unknown): Promise<void> }
  export type SingleOrMultiple<T> = T | T[]
}
declare module '@tsparticles/slim' {
  import type { Engine } from '@tsparticles/engine'
  export function loadSlim(engine: Engine): Promise<void>
}

// ─── @splinetool/react-spline ───
declare module '@splinetool/react-spline' {
  import type { FC } from 'react'
  const Spline: FC<{ scene: string; className?: string;[key: string]: unknown }>
  export default Spline
}
