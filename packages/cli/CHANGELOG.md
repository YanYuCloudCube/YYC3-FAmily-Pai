---
file: CHANGELOG.md
description: "@yyc3/cli 版本变更记录"
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-27
updated: 2026-08-19
status: active
tags: [changelog],[versioning]
category: package
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-08-19

### Added

- **主题系统统一**：28 套主题采用三层正交架构（Base Preset Layer × Visual Style Layer × Business Scenario Layer = 770 种组合）
  - Base Preset Layer (7)：nova / vega / maia / lyra / mira / luma / sera
  - Visual Style Layer (11)：yyc3-brand / cyberpunk / futuristic / aurora / liquid-glass / medical / musical / hacker / dark-minimal / professional / yyc3-dark
  - Business Scenario Layer (10)：ai-intelligent / business-management / cli-devops / cyber-futuristic / dashboard-data / education-learning / finance-quantitative / medical-health / minimal-zero / aurora-gradient
- `yyc3 themes` 命令族：
  - `yyc3 themes --list` — 简洁列表（28 主题）
  - `yyc3 themes` — 表格视图（按层分组）
  - `yyc3 themes <name>` — 主题详情
  - `yyc3 themes --layer <layer>` — 按层筛选（preset / visual / scenario）
  - `yyc3 themes --category <cat>` — 按分类筛选（ai / dark / minimal / professional …）
  - `yyc3 themes --dark` / `--light` — 暗色/亮色筛选
  - `yyc3 themes <name> --css` — 生成 CSS 变量（含暗色变体）
  - `yyc3 themes <name> --tailwind` — 生成 Tailwind 配置片段
  - `yyc3 themes <name> --globals` — 生成 globals.css 片段（@layer base）
  - `yyc3 themes --compose <preset>:<visual>:<scenario>` — 三层正交组合查询
  - `yyc3 themes <name> --json` / `--compose ... --json` — JSON 输出
- 主题注册中心模块 `@yyc3/cli/themes/registry`：findTheme / filterThemesByLayer / filterThemesByCategory / composeTheme / validateTheme 等查询工具
- 主题注入器模块 `@yyc3/cli/themes/injector`：CSS 变量 / Tailwind 配置 / globals.css / 运行时切换脚本 / React `useYYC3Theme` Hook 生成器
- 44 个主题系统单元测试（计数/唯一性/层分布/查找/分类/暗亮/组合/注入器/关联样板）
- 业务场景层与 20 套样板项目映射关系
- 主题与依赖包联动配置（deps 字段）

### Changed

- README 新增「主题系统统一」章节，含三层架构说明与 28 主题完整列表
- 版本号 1.1.1 → 1.2.0（minor：新增 themes 命令系统）

### Fixed

- 修复 `injector.ts` 中字符串字面量未终止的语法错误（`--radius` 行）

## [1.1.0] - 2026-05-08

### Added

- MCP Server 集成命令 (`yyc3 mcp init`)
- 11 主题 × 18 场景正交组合
- 3D 组件注册表 (card-3d, spotlight)
- 搜索命令 (`yyc3 search`)
- 文档查看命令 (`yyc3 docs`)

### Changed

- 升级到 Vitest 3.2
- 升级 TypeScript 至 5.8

## [1.0.0] - 2026-04-27

### Added

- CLI 智能编程库初始版本
- `npx create-yyc3-app` 脚手架
- `yyc3 add` 组件添加命令
- `yyc3 init` 项目初始化
- `yyc3 build` 构建命令
- `yyc3 diff` 差异对比
- `yyc3 info` 环境信息
- `yyc3 view` 组件预览
- `yyc3 apply` 应用变更
- `yyc3 migrate` 迁移工具
- 多框架模板支持 (Next.js / Vite / Astro / Laravel)
- MCP Server 内置支持
- shadcn/ui v4.5.0 全量融合

---

[1.2.0]: https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/releases/tag/v1.2.0
[1.1.0]: https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/releases/tag/v1.1.0
[1.0.0]: https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/releases/tag/v1.0.0
