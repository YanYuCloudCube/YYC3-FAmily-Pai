---
file: MAINTENANCE.md
description: "@yyc3/effects 维护指南"
author: YanYuCloudCube Team <admin@0379.email>
version: 1.0.0
created: 2026-05-08
updated: 2026-05-08
status: active
tags: [maintenance],[guide]
category: package
---

# Maintenance Guide

## 发布流程

```bash
# 1. 清理旧构建
pnpm clean

# 2. 全量验证
pnpm build && pnpm test && pnpm typecheck

# 3. 发布到 npm
pnpm publish --access public
```

## 故障排查

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| DTS 构建失败 | motion/react 类型缺失 | 检查 `src/types/motion-react-stub.d.ts` |
| ESM 导入报错 | 未安装 react peerDep | `pnpm add react react-dom` |
| 3D 组件白屏 | 未安装 motion | `pnpm add motion` |

## 安全更新

- 定期运行 `pnpm audit` 检查依赖漏洞
- motion (framer-motion) 作为可选 peerDependency，不影响零依赖组件
