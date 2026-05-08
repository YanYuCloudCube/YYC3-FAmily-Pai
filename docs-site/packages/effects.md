---
title: "@yyc3/effects"
description: "YYC³ UI 特效组件库 — 赛博朋克 / 液态玻璃 / 3D / 粒子 / 视差 / 微交互"
---

# @yyc3/effects

赛博朋克 / 液态玻璃 / 3D / 粒子 / 视差 / 微交互 — 38 个特效组件。

## 安装

```bash
pnpm add @yyc3/effects react react-dom
```

3D 特效组件额外需要: `pnpm add motion`

## 组件分类

### 赛博朋克特效 (4)

- **NeonCard** — 霓虹发光卡，支持 `cyberpunk` + `liquidGlass` 双主题
- **GlitchText** — 故障风格文字，随机/hover 触发
- **ParticleCanvas** — Canvas 粒子网络背景，鼠标交互
- **CyberpunkWidget** — 赛博朋克悬浮窗，可拖拽/多标签/最小化

### 3D 特效 (8)

- TiltCard / FlipCard / StackedCards / PerspectiveContainer
- RotatingShowcase / FloatingCard / GlassRefractionCard / BookPage

### 微交互 (9)

- RippleButton / PulseButton / MagneticButton / AnimatedInput
- AnimatedSwitch / LoadingButton / AnimatedCounter / AnimatedCheckbox / LikeButton

### 视差滚动 (11)

- Parallax / ParallaxBackground / SmoothParallax / ParallaxText
- ParallaxImage / ParallaxStack / ParallaxReveal / ScrollProgress
- ScrollTrigger / Parallax3DCard / InfiniteScroll

## 快速开始

```tsx
import { NeonCard, GlitchText, ParticleCanvas } from '@yyc3/effects'

export default function CyberpunkPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      <ParticleCanvas config={{ neonIntensity: 80 }} />
      <NeonCard color="#00f0ff" themeMode="cyberpunk" hoverable>
        <GlitchText color="#00f0ff" intensity={1.2}>赛博朋克</GlitchText>
      </NeonCard>
    </div>
  )
}
```

## 零依赖

除 3D 特效外，所有组件仅依赖 react + react-dom，无第三方运行时依赖。
