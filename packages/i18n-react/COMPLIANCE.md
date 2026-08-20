---
file: COMPLIANCE.md
description: "@yyc3/i18n-react 闭环达标报告"
author: YanYuCloudCube Team <admin@0379.email>
version: v0.1.0
created: 2026-07-15
updated: 2026-07-15
status: active
tags: [compliance],[audit],[report]
category: package
---

# @yyc3/i18n-react 闭环达标报告

**包名**: @yyc3/i18n-react | **版本**: v0.1.0 | **审计日期**: 2026-07-15 | **结果**: ✅ 全部通过

---

## 达标矩阵

| 维度 | 标准 | 结果 | 证据 |
|------|------|------|------|
| 构建 | tsup ESM + DTS 零错误 | ✅ | `dist/index.js` 1.67 KB + `dist/next.js` 1.09 KB |
| 类型检查 | `tsc --noEmit` strict mode | ✅ | 0 errors |
| Lint | ESLint flat config | ✅ | 0 errors |
| 测试 | Vitest + @testing-library/react | ✅ | 24 passed (3 files) |
| 包体积 | size-limit ≤ 10 kB | ✅ | 782 B brotlied |
| Lockfile | `--frozen-lockfile` | ✅ | CI 验证通过 |

---

## 文档五件套

| 文件 | 状态 |
|------|------|
| README.md | ✅ 完整 API 参考 + 快速开始 + Next.js 集成 |
| CHANGELOG.md | ✅ Keep a Changelog 格式 |
| MAINTENANCE.md | ✅ 发布流程 + 故障排查 |
| LICENSE | ✅ MIT |
| COMPLIANCE.md | ✅ 本文件 |

---

## 配置合规

| 字段 | 标准值 | 实际值 |
|------|--------|--------|
| name | `@yyc3/i18n-react` | ✅ |
| author | `YanYuCloudCube Team <admin@0379.email>` | ✅ |
| license | `MIT` | ✅ |
| type | `module` | ✅ |
| engines.node | `>=18.0.0` | ✅ |
| publishConfig.access | `public` | ✅ |
| repository.directory | `packages/i18n-react` | ✅ |
| sideEffects | `false` | ✅ |

---

## 依赖关系

| 类型 | 包 |
|------|-----|
| peerDependencies | `@yyc3/i18n-core >=2.4.0`, `react >=18`, `react-dom >=18` |
| 外部化 (external) | `react`, `react-dom`, `@yyc3/i18n-core`, `next`, `next/server` |
| 运行时依赖 | 无（零运行时依赖，仅 peer） |

---

## 导出映射

| 子路径 | 入口 | 类型定义 |
|--------|------|---------|
| `.` | `dist/index.js` | `dist/index.d.ts` |
| `./next` | `dist/next.js` | `dist/next.d.ts` |

---

## 结论

**总达标率**: 6/6 维度全部通过，5/5 文档齐全。
