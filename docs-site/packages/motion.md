# @yyc3/motion

<p>
  <img src="https://img.shields.io/npm/v/@yyc3/motion" alt="npm" />
  <img src="https://img.shields.io/badge/zero--dep-CSS%20layer-green" alt="zero-dep" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="license" />
</p>

YYC³ 三层渐进式动效引擎 — CSS → WAAPI → Framer Motion，按需升级。

## 三层架构

| 层级 | 技术 | 依赖 | 适用场景 |
|------|------|------|----------|
| **Layer 1: CSS** | Keyframes + CSS Variables | **零依赖** | 基础入场/退场/脉冲 |
| **Layer 2: WAAPI** | Web Animations API | **零依赖** | 物理弹簧/贝塞尔曲线 |
| **Layer 3: Framer** | Framer Motion | `framer-motion` | 手势交互/布局动画/3D |

## 安装

```bash
# 基础安装（CSS + WAAPI，零依赖）
pnpm add @yyc3/motion

# 完整安装（含 Framer Motion 层）
pnpm add @yyc3/motion framer-motion
```

## 子路径导出

```ts
import { fadeIn, slideUp, pulse } from '@yyc3/motion/css'       // Layer 1
import { spring, bounce, morph } from '@yyc3/motion/waapi'      // Layer 2
import { useAnimation, useScrollReveal } from '@yyc3/motion'     // Layer 3（hooks）
import { Spotlight } from '@yyc3/motion/spotlight'               // 增强组件
import { Card3D } from '@yyc3/motion/three'                      // 3D 组件
import { ParticleCanvas } from '@yyc3/motion/particle'           // 粒子系统
```

## 快速示例

### CSS 层 — 零依赖入场动画

```tsx
import { fadeIn } from '@yyc3/motion/css'

function Page() {
  return <div style={fadeIn('up', 300)}>Hello YYC³</div>
}
```

### WAAPI 层 — 物理弹簧

```tsx
import { spring } from '@yyc3/motion/waapi'

const el = useRef<HTMLDivElement>(null)
spring(el.current, { tension: 120, friction: 14 })
```

### Framer 层 — 交互 Hook

```tsx
import { useAnimation } from '@yyc3/motion'

const { animate, controls } = useAnimation({ preset: 'spring' })
```

## 3D 组件

### Spotlight — 鼠标跟随聚光灯

```tsx
import { Spotlight } from '@yyc3/motion/spotlight'

function Hero() {
  return (
    <div className="relative overflow-hidden">
      <Spotlight size={300} />
      <h1>YYC³ AI Family</h1>
    </div>
  )
}
```

### Card3D — 3D 透视卡片

```tsx
import { Card3D } from '@yyc3/motion/three'

function Dashboard() {
  return (
    <Card3D backgroundGradient="from-blue-100 via-purple-50 to-pink-50">
      <h2>数据面板</h2>
    </Card3D>
  )
}
```

### ParticleCanvas — 霓虹粒子网络

```tsx
import { ParticleCanvas } from '@yyc3/motion/particle'

function Background() {
  return (
    <div className="relative h-screen">
      <ParticleCanvas colors={['#00f0ff', '#00ffcc']} neonScale={1.2} />
      <div className="relative z-10">内容</div>
    </div>
  )
}
```

## API 参考

### CSS Presets

| 函数 | 参数 | 说明 |
|------|------|------|
| `fadeIn` | `(direction, duration)` | 淡入（up/down/left/right） |
| `slideUp` | `(distance, duration)` | 上滑入场 |
| `pulse` | `(scale, duration)` | 脉冲缩放 |
| `shake` | `(intensity)` | 抖动反馈 |

### WAAPI Presets

| 函数 | 参数 | 说明 |
|------|------|------|
| `spring` | `(el, options)` | 物理弹簧动画 |
| `bounce` | `(el, height)` | 弹跳效果 |
| `morph` | `(el, keyframes)` | 形态变换 |

### Hooks

| Hook | 说明 |
|------|------|
| `useAnimation` | 统一动画控制 |
| `useScrollReveal` | 滚动揭示触发 |
