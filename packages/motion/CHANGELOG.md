---
file: CHANGELOG.md
description: "@yyc3/motion 版本变更记录"
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-27
updated: 2026-05-19
status: active
tags: [changelog],[versioning]
category: package
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-27

### Added

- 三层渐进式动效架构: CSS (零依赖) → WAAPI → Framer Motion
- CSS 层: `getFadeInStyle` / `createRipple` / `animateNumber` / `cssKeyframes`
- WAAPI 层: `AnimationEngine` 序列编排 + `PRESETS` 预设 + `easings` 缓动曲线
- Framer Motion 层: `variants` 动画变体 (optional peerDependency)
- React Hooks: `useAnimation` / `useScrollReveal`
- React 组件: `<FadeIn>` / `<LazyWrap>`
- 6 个子路径导出 (`./css` / `./waapi` / `./framer` / `./hooks` / `./components` / `.`)
- 13 个单元测试 (CSS motion + WAAPI engine)
- TypeScript strict mode
- framer-motion / react-dom 为 optional peerDependency

---

[1.0.0]: https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/releases/tag/v1.0.0
