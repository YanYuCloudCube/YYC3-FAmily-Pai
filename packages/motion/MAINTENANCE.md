---
file: MAINTENANCE.md
description: "@yyc3/motion 维护指南 — 发布流程/故障排查/三层架构维护"
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-05-19
updated: 2026-05-19
status: active
tags: [maintenance],[release],[troubleshooting]
category: package
---

# @yyc3/motion 维护指南

## 发布流程

### 前置检查

```bash
cd packages/motion

pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

### 发布步骤

1. 更新 `package.json` 中的 `version`
2. 更新 `CHANGELOG.md` 添加新版本记录
3. 运行完整检查: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
4. 发布: `pnpm publish --access public`
5. 验证: `npm view @yyc3/motion@<version>`

### 回滚

```bash
npm unpublish @yyc3/motion@<version> --force
```

> 注意: npm 仅允许发布后 72 小时内回滚

---

## 三层架构维护要点

### Layer 1: CSS (零依赖)

- 纯 CSS-in-JS 工具函数，无 React 依赖
- 适用于 SSR / 静态页面 / 最低兼容场景
- 修改时确保输出为标准 CSS 属性

### Layer 2: WAAPI (Web Animations API)

- 依赖浏览器原生 Web Animations API
- `AnimationEngine` 提供序列编排能力
- 修改时注意 Node.js 环境兼容性 (测试中需 mock)

### Layer 3: Framer Motion (optional)

- framer-motion 为 optional peerDependency
- 仅在用户安装 framer-motion 时启用
- 新增 framer 层功能时需确保 graceful fallback

---

## 故障排查

### 构建失败

| 症状 | 原因 | 解决方案 |
|------|------|----------|
| tsup 入口找不到 | 子路径 export 配置错误 | 检查 tsup.config.ts 的 entry |
| React 类型错误 | peerDependencies 类型缺失 | 确认 @types/react 已安装 |

### 运行时问题

| 症状 | 原因 | 解决方案 |
|------|------|----------|
| WAAPI 动画不生效 | 浏览器不支持 Web Animations API | 降级到 CSS 层 |
| Framer Motion 组件报错 | 未安装 framer-motion | 安装或使用 CSS/WAAPI 层替代 |
| SSR 环境报错 | 使用了浏览器 API | 确保组件有 typeof window 判断 |

---

## 新增动效流程

1. 确定动效应归属哪一层 (CSS → WAAPI → Framer)
2. 在对应层目录中实现功能
3. 在层的 `index.ts` 中导出
4. 在主 `index.ts` 中重新导出
5. 编写单元测试
6. 更新 `CHANGELOG.md`

---

## 安全更新

- 定期运行 `pnpm audit` 检查依赖漏洞
- 本包无运行时 dependencies，仅 peerDependencies
- framer-motion / react / react-dom 均为外部依赖，安全性由上游保障

---

## 联系方式

- **邮箱**: admin@0379.email
- **GitHub Issues**: https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/issues
