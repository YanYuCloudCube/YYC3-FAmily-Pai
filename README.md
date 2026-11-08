---
file: README.md
title: YYC3-FAmily-Pai — AI Family 正仓主线（org）
description: FAmily-Pai 正仓 README：14 包 monorepo 与 system-control 拆分后架构
author: YYC³ Team <admin@0379.email>
version: v1.1.0
created: 2026-11-09
updated: 2026-11-09
status: stable
tags: [readme, architecture, monorepo]
category: technical
language: zh-CN
audience: developers,managers
complexity: intermediate
---

# YYC3-FAmily-Pai — AI Family 正仓主线（org）

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

## 🧭 定位

正仓层·AI Family 主线：唯一发版线（OIDC Trusted Publishing），开发区 family-pai 副本的母本。

## 🌳 文件树架构

```text
├── .changeset/  (4)
│   ├── brown-moons-return.md
│   ├── config.json
│   ├── lucky-pans-smile.md
│   └── quiet-donuts-juggle.md
├── .github/  (2)
│   ├── workflows/  (5)
│   └── renovate.json5
├── .husky/  (3)
│   ├── commit-msg
│   ├── pre-commit
│   └── pre-push
├── .trae/  (2)
│   ├── project_rules.md
│   └── ultimate-audit-report-2026-04-24.md
├── assets/  (1)
│   └── logo.png
├── docs/  (15)
│   ├── YYC3-FAmily-Pai-glm53-20261008/  (3)
│   ├── YYC3-pi3-audit-20260519/  (4)
│   ├── 01-AI-HUB-AUDIT.md
│   ├── 02-CORE-AUDIT.md
│   ├── CICD-升级存档文档.md
│   ├── CICD-团队存档文档.md
│   ├── CICD-存档优化建议.md
│   ├── mcp-tools.md
│   ├── PIPELINE.md
│   ├── YYC3-AI-Family-五维五高五标五化.md
│   ├── YYC3-AI-Family-协同公约规范手册.md
│   ├── YYC3-AI-FAmily-情感文化总铭.md
│   ├── YYC3-UI-MONO-一体化入库规划方案.md
│   ├── YYC3-ui3-cli1.3-发布就绪清单.md
│   └── 统一npm包设计方案.md
├── docs-site/  (16)
│   ├── .vitepress/  (1)
│   ├── ar/  (1)
│   ├── architecture/  (3)
│   ├── de/  (1)
│   ├── en/  (1)
│   ├── es/  (1)
│   ├── fr/  (1)
│   ├── ja/  (1)
│   ├── ko/  (1)
│   ├── packages/  (12)
│   ├── pt/  (1)
│   ├── public/  (1)
│   ├── quality/  (3)
│   ├── zh-TW/  (1)
│   ├── index.md
│   └── package.json
├── examples/  (1)
│   └── basic-usage.ts
├── packages/  (14)
│   ├── ai-hooks/  (8)
│   ├── ai-hub/  (17)
│   ├── cli/  (16)
│   ├── core/  (13)
│   ├── effects/  (13)
│   ├── emotion/  (11)
│   ├── i18n-core/  (20)
│   ├── i18n-react/  (12)
│   ├── ide/  (27)
│   ├── mcp-servers/  (11)
│   ├── motion/  (11)
│   ├── plugins/  (11)
│   ├── theme/  (8)
│   └── ui/  (14)
├── public/  (18)
│   ├── cloud-icons/  (6)
│   ├── yyc3/  (5)
│   ├── yyc3-app-icons/  (6)
│   ├── yyc3-blue/  (5)
│   ├── yyc3-dist/  (9)
│   ├── yyc3-yy/  (5)
│   ├── Family-π³.png
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   ├── placeholder.svg
│   ├── YYC3.png
│   ├── 沫言-AI-Family.md
│   ├── 沫言-AI-Family.mp3
│   ├── 沫言-Family-AI-智慧工坊.md
│   ├── 沫言-Family-AI-智慧工坊.mp3
│   └── 沫言-Family-AI.mp3
├── scripts/  (7)
│   ├── adapt-component.mjs
│   ├── audit-publish.mjs
│   ├── ultimate-test.mts
│   ├── unify-headers.mjs
│   ├── verify-blueprints.mjs
│   ├── verify-optimization.sh
│   └── verify-pull.mjs
├── server/  (27)
│   ├── eslint-rules/  (1)
│   ├── gates/  (7)
│   ├── graphs/  (24)
│   ├── logs/  (0)
│   ├── methodologies/  (4)
│   ├── plans/  (1)
│   ├── prompts/  (9)
│   ├── runtime-state/  (2)
│   ├── scripts/  (4)
│   ├── src/  (24)
│   ├── styles/  (4)
│   ├── tests/  (4)
│   ├── tooling/  (1)
│   ├── .dependency-cruiser.cjs
│   ├── .lintstagedrc.json
│   ├── .prettierignore
│   ├── .prettierrc.json
│   ├── config.json
│   ├── eslint.config.js
│   ├── jest.config.cjs
│   ├── LICENSE
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.json
│   └── tsconfig.test.json
├── tests/  (1)
│   └── src/  (1)
├── .actrc
├── .editorconfig
├── .env.example
├── .gitattributes
├── .gitignore
├── .gitleaks.toml
├── .prettierrc
├── CONTRIBUTING.md
├── eslint.config.mjs
├── FULLCHAIN.md
├── LICENSE
├── package.json
└── pnpm-lock.yaml
└── …（另有 7 项）
```

## 🧱 技术栈

pnpm monorepo：14 包（ui@3.0.0-alpha.4 · core@1.4.0 · mcp-servers@3.0.0 · cli/ide/theme/ai-hooks…）+ server（claude-prompts@1.1.0，605 单测）+ docs-site

## ✂️ 拆分与复用衔接建议

1. **已完成**：system-control 3569→目录模块（registry+handlers×8 全 ≤434）；ModelSettings 2758→215 容器+9 子模块；监听边界收敛 127.0.0.1（权限裁决）；605 单测全绿
2. **拆分衔接**：一切 PAI 线单码以本仓 server/ + packages/ide 为母本；四区副本已退役/对齐
3. **复用**：消费 `npm:@yyc3/mcp-servers`（server 工具集）· `@yyc3/ui`（base-ui 线）· `@yyc3/core`；发版仅限本仓
4. **watch**：YYC3_MCP_HOST 可覆盖监听边界；私有部署需自行加鉴权层

## 🔗 衔接文档

- PR #1（拆分）· merge 1f391ef/46c3a1a · Mimosa deep 封印 `baaf3dc9` · [四区替换指引](../../../Volumes/Development/YYC3-团队通用-标规文档/YYC3-正仓对接-四区副本替换指引-system-control与ModelSettings.md)*（开发层路径）

---

**维护**: YYC³ Team · 架构治理会话生成（2026-11-09），结构变更时同步更新。

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>
