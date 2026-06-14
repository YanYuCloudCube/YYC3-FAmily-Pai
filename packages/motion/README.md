---
file: README.md
description: "@yyc3/motion — YYC³ AI Family 统一动效系统"
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-27
updated: 2026-05-22
status: active
tags: [motion, animation, css, waapi, framer-motion, react, hooks]
category: package
---

# 🎬 @yyc3/motion

<p align="center">
  <strong>YYC³ AI Family 统一动效系统</strong><br/>
  <em>CSS (零依赖) → WAAPI → Framer Motion 三层渐进式架构</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@yyc3/motion"><img src="https://img.shields.io/npm/v/@yyc3/motion.svg?style=flat-square" alt="npm version"/></a>
  <a href="https://www.npmjs.com/package/@yyc3/motion"><img src="https://img.shields.io/npm/dt/@yyc3/motion.svg?style=flat-square" alt="npm downloads"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"/></a>
  <a href="https://github.com/YanYuCloudCube/YYC3-FAmily-Pai"><img src="https://img.shields.io/badge/GitHub-YYC3--FAmily--Pai-black?style=flat-square&logo=github" alt="GitHub"/></a>
</p>

---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***

---

## 目录

- [✨ 核心特性](#-核心特性)
- [📦 安装](#-安装)
- [🏗️ 三层架构](#-三层架构)
- [📖 子路径导入](#-子路径导入treeshaking优化)
- [🧩 API 参考](#-api-参考)
- [🧪 测试](#-测试)
- [📄 维护指南](#-维护指南)
- [📜 License](#-license)

---

## ✨ 核心特性

### 🎨 Layer 1 — CSS (零依赖)
- **`getFadeInStyle`** — 渐入动画样式生成
- **`createRipple`** — Material Design 涟漪效果
- **`animateNumber`** — 数字递增动画
- **`cssKeyframes`** — CSS 关键帧注入
- **`prefersReducedMotion`** — 无障碍动画偏好检测

### ⚡ Layer 2 — WAAPI (Web Animations API)
- **`AnimationEngine`** — 动画引擎，序列编排
- **`PRESETS`** — 20+ 内置动画预设
- **`easings`** — 8 组精选缓动曲线
- **`SequenceStep`** — 复杂动画序列定义

### 🚀 Layer 3 — Framer Motion (可选)
- **`variants`** — 声明式动画变体系统
- framer-motion 为 optional peerDependency
- 按需加载，不影响零依赖层使用

### 🪝 React Hooks
- **`useAnimation`** — 声明式动画控制 Hook
- **`useScrollReveal`** — 滚动揭示动画 Hook

### 🧩 React 组件
- **`<FadeIn>`** — 渐入动画组件
- **`<LazyWrap>`** — 懒加载包装组件

---

## 📦 安装

```bash
# 基础安装 (CSS + WAAPI + Hooks + Components)
pnpm add @yyc3/motion

# 如需 Framer Motion 层 (可选)
pnpm add framer-motion
```

### 系统要求

| 要求 | 版本 |
|------|------|
| Node.js | >= 18.0.0 |
| pnpm | >= 8.0.0 |
| React | >= 18.0.0 (可选) |
| framer-motion | >= 11.0.0 (可选) |

---

## 🏗️ 三层架构

```
@yyc3/motion
│
├── Layer 1: CSS (零依赖)
│   ├── fade-in.ts        # 渐入样式
│   ├── ripple.ts         # 涟漪效果
│   ├── animate-number.ts # 数字动画
│   └── keyframes.ts      # 关键帧
│
├── Layer 2: WAAPI
│   ├── engine.ts         # 动画引擎
│   ├── presets.ts        # 动画预设
│   └── index.ts          # 缓动曲线
│
├── Layer 3: Framer Motion (可选)
│   └── variants.ts       # 动画变体
│
├── Hooks
│   ├── use-animation.ts      # 动画控制
│   └── use-scroll-reveal.ts  # 滚动揭示
│
└── Components
    ├── fade-in.tsx    # 渐入组件
    └── lazy-wrap.tsx  # 懒加载包装
```

### 渐进增强策略

```
CSS (基础) → WAAPI (增强) → Framer Motion (高级)
  │              │                  │
  │ 零依赖       │ 浏览器原生        │ React 声明式
  │ 轻量         │ 序列编排          │ 变体系统
  │ SSR 友好     │ GPU 加速         │ 手势支持
```

---

## 📖 子路径导入 (TreeShaking 优化)

```typescript
// 全量导入
import { getFadeInStyle, AnimationEngine } from '@yyc3/motion';

// 按层导入 (推荐)
import { getFadeInStyle } from '@yyc3/motion/css';
import { AnimationEngine, PRESETS } from '@yyc3/motion/waapi';
import { variants } from '@yyc3/motion/framer';
import { useAnimation } from '@yyc3/motion/hooks';
import { FadeIn, LazyWrap } from '@yyc3/motion/components';
```

### 可用子路径

| 子路径 | 内容 | 依赖 |
|--------|------|------|
| `@yyc3/motion` | 全量导出 | — |
| `@yyc3/motion/css` | CSS 层 | 零依赖 |
| `@yyc3/motion/waapi` | WAAPI 层 | 零依赖 |
| `@yyc3/motion/framer` | Framer Motion 层 | framer-motion |
| `@yyc3/motion/hooks` | React Hooks | react |
| `@yyc3/motion/components` | React 组件 | react |

---

## 🧩 API 参考

### CSS 层

```typescript
import { getFadeInStyle, prefersReducedMotion } from '@yyc3/motion/css';

// 渐入动画
const style = getFadeInStyle({ direction: 'up', duration: 600, delay: 200 });

// 无障碍检测
if (prefersReducedMotion()) {
  // 禁用或简化动画
}
```

```typescript
import { createRipple } from '@yyc3/motion/css';

// 涟漪效果
const ripple = createRipple(event, { color: 'rgba(255,255,255,0.3)', duration: 400 });
```

```typescript
import { animateNumber } from '@yyc3/motion/css';

// 数字递增动画
animateNumber(element, { from: 0, to: 100, duration: 1000 });
```

### WAAPI 层

```typescript
import { AnimationEngine, PRESETS } from '@yyc3/motion/waapi';

// 使用动画引擎
const engine = getAnimationEngine();
engine.animate(element, PRESETS.fadeIn);

// 序列编排
engine.sequence([
  { target: el1, ...PRESETS.fadeIn },
  { target: el2, ...PRESETS.slideUp, delay: 200 },
]);
```

### Framer Motion 层

```typescript
import { variants } from '@yyc3/motion/framer';

// 在 Framer Motion 中使用
<motion.div variants={variants.fadeIn} initial="hidden" animate="visible" />;
```

### Hooks

```typescript
import { useAnimation } from '@yyc3/motion/hooks';

function Component() {
  const { animate, isAnimating } = useAnimation({ preset: 'fadeIn' });
  return <button onClick={() => animate(ref)}>Animate</button>;
}
```

```typescript
import { useScrollReveal } from '@yyc3/motion/hooks';

function Component() {
  const ref = useScrollReveal({ threshold: 0.1 });
  return <div ref={ref}>Scroll to reveal</div>;
}
```

### 组件

```tsx
import { FadeIn, LazyWrap } from '@yyc3/motion/components';

// 渐入动画
<FadeIn direction="up" duration={600}>
  <p>Animated content</p>
</FadeIn>

// 懒加载包装
<LazyWrap fallback={<Skeleton />} height={300}>
  <HeavyComponent />
</LazyWrap>
```

---

## 🧪 测试

```bash
# 运行测试
pnpm test

# 监听模式
pnpm test:watch

# 覆盖率
pnpm test:coverage

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```

### 测试覆盖

| 模块 | 测试文件 | 用例数 |
|------|----------|--------|
| CSS | `motion.test.ts` / `keyframes.test.ts` / `animate-number.test.ts` | — |
| WAAPI | `engine.test.ts` / `engine-extended.test.ts` / `presets.test.ts` | — |
| Framer | `variants.test.ts` | — |
| Hooks | `use-animation.test.ts` / `use-scroll-reveal.test.ts` | — |
| Components | `components.test.ts` | — |
| **总计** | **13 个测试文件** | — |

---

## 📄 维护指南

详见 [MAINTENANCE.md](./MAINTENANCE.md)

---

## 📜 License

[MIT](./LICENSE) © 2024-2026 YYC³ AI Team

---

<div align="center">

**© 2024-2026 YanYuCloudCube Team. All Rights Reserved.**

*五维驱动 · 五高五标五化*

</div>
