---
file: README.md
description: YYC³ FAmily π³ AI Family 智能中枢 — 八位拟人化AI家人的统一工作区
author: YanYuCloudCube Team <admin@0379.email>
version: v1.5.0
created: 2026-03-21
updated: 2026-04-29
status: published
tags: [monorepo],[ai-family],[npm],[typescript]
category: project
language: zh-CN
---

# 🏠 YYC³ FAmily π³ — AI Family 智能中枢

<p align="center">
  <strong>八位拟人化 AI 家人的统一工作区</strong><br>
  <em>Monorepo · 8 Packages · 全栈 AI 智能体生态</em>
</p>

<p align="center">
  <a href="https://github.com/YanYuCloudCube/Family-PAI"><img src="https://img.shields.io/badge/GitHub-Family--PAI-181717?style=flat-square&logo=github" alt="GitHub" /></a>
  <a href="https://www.npmjs.com/org/yyc3"><img src="https://img.shields.io/npm/v/@yyc3/core.svg?style=flat-square&color=blue" alt="@yyc3 scope" /></a>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT" />
  <br/>
  <img src="https://img.shields.io/badge/TypeScript-5.3+-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/packages-9-blue?style=flat-square" alt="9 Packages" />
  <img src="https://img.shields.io/badge/tests-1036%20passed-brightgreen?style=flat-square" alt="Tests" />
</p>

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*

---

## 📦 NPM 包总览

### 核心发布包

| #   | 包名                  | 版本     | 描述                                                    | npm                                                    |
| --- | --------------------- | -------- | ------------------------------------------------------- | ------------------------------------------------------ |
| 1   | **@yyc3/core**        | `v1.4.0` | AI Family 核心引擎 — 认证/MCP/技能/智能体/多模态        | [npm](https://www.npmjs.com/package/@yyc3/core)        |
| 2   | **@yyc3/ai-hub**      | `v1.4.0` | AI 集成中心 — 八位家人/Family Compass/错误码体系/工作流 | [npm](https://www.npmjs.com/package/@yyc3/ai-hub)      |
| 3   | **@yyc3/ui**          | `v2.0.0` | React UI 组件库 — 60+组件/shadcn/ui/Family组件/主题     | [npm](https://www.npmjs.com/package/@yyc3/ui)          |
| 4   | **@yyc3/plugins**     | `v1.4.0` | 插件集合 — LSP语言服务器(4) + 内容处理(4)               | [npm](https://www.npmjs.com/package/@yyc3/plugins)     |
| 5   | **@yyc3/i18n-core**   | `v1.4.0` | 国际化框架 — ICU/AI翻译/MCP/10语言/零依赖               | [npm](https://www.npmjs.com/package/@yyc3/i18n-core)   |
| 6   | **@yyc3/emotion**     | `v1.0.0` | 情感引擎 — 多模态融合/音乐桥接/事件总线                 | [npm](https://www.npmjs.com/package/@yyc3/emotion)     |
| 7   | **@yyc3/mcp-servers** | `v1.0.0` | MCP 服务器 — 注册表/服务端/协议实现                     | [npm](https://www.npmjs.com/package/@yyc3/mcp-servers) |
| 8   | **@yyc3/motion**      | `v1.0.0` | 统一动效系统 — CSS/WAAPI/Framer Motion 三层渐进         | [npm](https://www.npmjs.com/package/@yyc3/motion)      |

### 内部开发包

| #   | 包名          | 版本     | 描述                                                 |
| --- | ------------- | -------- | ---------------------------------------------------- |
| 8   | **@yyc3/ide** | `v1.0.0` | IDE 智能开发环境 — AI管道/协作面板/60+组件 (private) |

---

## 🏗️ 工作区结构

```
FAmily-π³/
├── packages/                        ← 9 个子包
│   ├── core/            → @yyc3/core          核心引擎
│   ├── ai-hub/          → @yyc3/ai-hub        AI 集成中心
│   ├── emotion/         → @yyc3/emotion       情感引擎
│   ├── i18n-core/       → @yyc3/i18n-core     国际化框架
│   ├── ui/              → @yyc3/ui            UI 组件库
│   ├── plugins/         → @yyc3/plugins       插件集合
│   ├── mcp-servers/     → @yyc3/mcp-servers   MCP 服务器
│   ├── motion/          → @yyc3/motion        统一动效系统
│   └── ide/             → @yyc3/ide           IDE 环境 (private)
│
├── .github/workflows/               ← CI/CD 自动化
│   ├── ci.yml                       质量门控 (push/PR)
│   ├── packages-ci.yml              包构建 + 覆盖率
│   ├── release.yml                  NPM 发布 + GHCR
│   └── pr-validation.yml            PR 质量门控
│
├── .husky/                          ← Git Hooks
├── docs/                            ← 项目文档
├── YYC3-FAmily-九层五维-核心设计/     ← 架构设计文档
│   └── YYC3-审核分析报告/            ← 审核报告
├── pnpm-workspace.yaml              ← Monorepo 配置
└── package.json                     ← 根配置
```

---

## 🔗 包依赖关系

```
                         ┌──────────────┐
                         │  @yyc3/core  │  ← 核心引擎
                         └──┬─────┬────┘
                            │     │
             ┌──────────────┘     └──────────────┐
             ▼                                    ▼
     ┌──────────────┐                      ┌──────────────┐
     │ @yyc3/ai-hub │                      │ @yyc3/ui     │
     └──────┬───────┘                      └──────┬───────┘
            │                                      │
            ▼                                      ▼
     ┌──────────────┐  ┌──────────────┐   ┌──────────────┐
     │@yyc3/emotion │  │@yyc3/mcp-    │   │@yyc3/plugins │
     └──────────────┘  │  servers     │   └──────────────┘
                       └──────────────┘
     ┌──────────────┐  ┌──────────────┐
     │@yyc3/i18n-   │  │  @yyc3/ide   │
     │  core        │  │  (private)   │
     └──────────────┘  └──────────────┘
```

---

## 🚀 快速开始

### 安装

```bash
git clone https://github.com/YanYuCloudCube/Family-PAI.git
cd Family-PAI
pnpm install
```

### 使用单个包

```bash
pnpm add @yyc3/core                          # 核心引擎
pnpm add @yyc3/ai-hub                        # AI 集成中心
pnpm add @yyc3/emotion                       # 情感引擎
pnpm add @yyc3/motion                        # 统一动效系统
pnpm add @yyc3/i18n-core                     # 国际化
pnpm add @yyc3/ui react react-dom            # UI 组件
```

### 核心引擎示例

```typescript
import { UnifiedAuthManager, AIFamilyManager } from '@yyc3/core';

const auth = new UnifiedAuthManager({ autoDetect: true });
const providers = await auth.autoDetect();

const family = new AIFamilyManager({ authManager: auth });
const result = await family.executeTask({
  role: 'meta-oracle',
  task: { description: '分析项目架构', priority: 'high' },
});
```

### AI Hub 示例

```typescript
import { YYC3AIHub, FamilyCompass, getPersonaByHour } from '@yyc3/ai-hub';

const hub = new YYC3AIHub({ apiKey: process.env.OPENAI_API_KEY });
await hub.initialize();

const result = await hub.execute('帮我审查这段代码的安全性');

const compass = createFamilyCompass();
const onDuty = getPersonaByHour(new Date().getHours());
console.log(`当前值班: ${onDuty.name} (${onDuty.alias})`);
```

---

## 🧪 开发命令

| 命令                        | 说明                   |
| --------------------------- | ---------------------- |
| `pnpm install`              | 安装所有包依赖         |
| `pnpm -r build`             | 构建所有包             |
| `pnpm -r test`              | 测试所有包             |
| `pnpm -r typecheck`         | 类型检查所有包         |
| `pnpm -r lint`              | Lint 检查所有包        |
| `pnpm -r test:coverage`     | 覆盖率报告             |
| `pnpm -C packages/core dev` | 开发单个包（监听模式） |

---

## 👨‍👩‍👧‍👦 AI Family 八位家人

| 角色            | 代号 | 职责领域               | 值班时段    |
| --------------- | ---- | ---------------------- | ----------- |
| 🎯 **Master**    | 千行 | 总指挥 / 战略决策      | 全天候      |
| 🧭 **Navigator** | 引路 | 导航 / 路径规划        | 08:00-14:00 |
| 💡 **Thinker**   | 万物 | 分析 / 推理 / 深度思考 | 10:00-16:00 |
| ⚡ **Bolero**    | 伯乐 | 推荐 / 匹配 / 资源发现 | 09:00-15:00 |
| 🔬 **Prophet**   | 先知 | 预测 / 趋势分析        | 14:00-20:00 |
| 🛡️ **Sentinel**  | 守护 | 安全审计 / 风险防控    | 16:00-22:00 |
| 🎨 **Creative**  | 灵韵 | 创新 / 设计 / 创意     | 18:00-00:00 |
| 📚 **TianShu**   | 天枢 | 知识管理 / 质量优化    | 00:00-06:00 |

---

## 🏛️ 五维五高架构

| 维度     | 设计                                       |
| -------- | ------------------------------------------ |
| **五维** | 时间维 · 空间维 · 属性维 · 事件维 · 关联维 |
| **五高** | 高可用 · 高性能 · 高安全 · 高扩展 · 高智能 |
| **五标** | 标准化 · 规范化 · 自动化 · 可视化 · 智能化 |
| **五化** | 流程化 · 数字化 · 生态化 · 工具化 · 服务化 |

---

## 🔧 技术栈

| 类别       | 技术                            |
| ---------- | ------------------------------- |
| **语言**   | TypeScript 5.3+ (ESM)           |
| **构建**   | tsup (esbuild)                  |
| **测试**   | Vitest + @vitest/coverage-v8    |
| **Lint**   | ESLint 10.x + typescript-eslint |
| **格式化** | Prettier                        |
| **包管理** | pnpm workspace (monorepo)       |
| **Git**    | Husky + Conventional Commits    |
| **CI/CD**  | GitHub Actions                  |
| **安全**   | Gitleaks + npm audit            |
| **文档**   | TypeDoc + JSDoc                 |

---

## 🏷️ 统一元数据

| 字段           | 值                                                                        |
| -------------- | ------------------------------------------------------------------------- |
| **Scope**      | `@yyc3`                                                                   |
| **Author**     | YanYuCloudCube Team \<admin@0379.email\>                                  |
| **License**    | MIT                                                                       |
| **Registry**   | https://registry.npmjs.org/                                               |
| **Repository** | [YanYuCloudCube/Family-PAI](https://github.com/YanYuCloudCube/Family-PAI) |
| **Node.js**    | >= 18.0.0                                                                 |
| **pnpm**       | >= 8.0.0                                                                  |

---

## 🤝 贡献指南

请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解贡献流程、代码规范和提交要求。

## 🔒 安全政策

如发现安全漏洞，请参阅 [SECURITY.md](./SECURITY.md) 进行负责任披露。

## 📊 质量状态

| 指标        | 状态                          |
| ----------- | ----------------------------- |
| CI 质量门控 | ✅ push/PR 自动触发            |
| TypeCheck   | ✅ core/ai-hub/emotion 通过    |
| 安全审计    | ✅ Gitleaks + npm audit        |
| 日志系统    | ✅ 统一 Logger（生产级别静默） |
| 错误体系    | ✅ YYC3Error 中英双语错误码    |

---

<div align="center">

*YYC³ AI Family — 八位拟人化AI家人的智能中枢*

**五高 · 五标 · 五化 · 五维**

**© 2025-2026 YanYuCloudCube Team. All Rights Reserved.**

</div>
