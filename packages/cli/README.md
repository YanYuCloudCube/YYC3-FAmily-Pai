---
file: README.md
description: "@yyc3/cli — YYC³ UI 智能编程库 CLI"
author: YanYuCloudCube Team <admin@0379.email>
version: v1.2.0
created: 2026-04-27
updated: 2026-06-20
status: active
tags: [cli, scaffold, components, shadcn, radix, tailwind, registry, samples]
category: package
---

# 🛠️ @yyc3/cli

<p align="center">
  <strong>YYC³ UI 智能编程库 CLI</strong><br/>
  <em>言启象限 | 语枢未来 — 组件脚手架 · 注册表管理 · 主题×场景正交组合</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@yyc3/cli"><img src="https://img.shields.io/npm/v/@yyc3/cli.svg?style=flat-square" alt="npm version"/></a>
  <a href="https://www.npmjs.com/package/@yyc3/cli"><img src="https://img.shields.io/npm/dt/@yyc3/cli.svg?style=flat-square" alt="npm downloads"/></a>
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
- [🚀 快速开始](#-快速开始)
- [📖 命令详解](#-命令详解)
- [🎨 主题系统](#-主题系统)
- [🎬 场景系统](#-场景系统)
- [🧪 样板项目](#-样板项目)
- [🎨 主题系统统一](#-主题系统统一)
- [📋 注册表](#-注册表)
- [🔌 MCP 集成](#-mcp-集成)
- [🧪 测试](#-测试)
- [📄 维护指南](#-维护指南)
- [📜 License](#-license)

---

## ✨ 核心特性

### 🏗️ 项目脚手架

- **11 主题 × 18 场景** — 正交组合，一键创建 Next.js 项目
- **`npx create-yyc3-app`** — 零配置启动，交互式主题/场景选择
- **多框架支持** — Next.js / Vite / Astro / Laravel 模板

### 📦 组件管理

- **`yyc3 add`** — 从注册表添加 UI 组件
- **`yyc3 init`** — 初始化项目配置
- **`yyc3 build`** — 构建组件注册表
- **`yyc3 diff`** — 组件差异对比

### 🔍 搜索与浏览

- **`yyc3 search`** — 模糊搜索组件
- **`yyc3 view`** — 预览组件效果
- **`yyc3 docs`** — 查看组件文档
- **`yyc3 info`** — 环境信息诊断

### 🔄 迁移工具

- **`yyc3 migrate`** — 自动迁移（Radix / Icons / RTL）
- **`yyc3 apply`** — 应用变更到项目

### 🔌 MCP Server

- **`yyc3 mcp init`** — 初始化 MCP Server
- **`yyc3 registry`** — 注册表管理命令

---

## 📦 安装

```bash
# 全局安装
pnpm add -g @yyc3/cli

# 或使用 npx (无需安装)
npx @yyc3/cli --help

# 项目脚手架
npx create-yyc3-app my-app
```

### 系统要求

| 要求 | 版本 |
| ------ | ------ |
| Node.js | >= 18.0.0 |
| pnpm | >= 8.0.0 |
| React | ^18.0.0 \|\| ^19.0.0 (可选) |

---

## 🚀 快速开始

### 创建新项目

```bash
npx create-yyc3-app my-app

# 从 20 套完整业务样板生成（推荐，开箱即用的完整应用）
npx create-yyc3-app my-app --blueprint admin-dashboard

# 指定主题
npx create-yyc3-app my-app --theme cyberpunk

# 指定场景（轻量脚手架模式）
npx create-yyc3-app my-app --scenes ai-chat,admin-dashboard

# 指定端口
npx create-yyc3-app my-app --port 3300
```

### 管理组件

```bash
# 初始化项目
yyc3 init

# 添加组件
yyc3 add button
yyc3 add card dialog

# 搜索组件
yyc3 search input

# 查看差异
yyc3 diff button
```

---

## 📖 命令详解

| 命令 | 说明 | 示例 |
| ------ | ------ | ------ |
| `yyc3 init` | 初始化项目配置（`-t` 可命中 T01-T20 样板） | `yyc3 init -t admin-dashboard -n my-app` |
| `yyc3 add <component>` | 添加组件到项目 | `yyc3 add button card` |
| `yyc3 build` | 构建注册表 | `yyc3 build` |
| `yyc3 diff <component>` | 对比组件变更 | `yyc3 diff button` |
| `yyc3 docs <component>` | 查看组件文档 | `yyc3 docs dialog` |
| `yyc3 info` | 环境信息 | `yyc3 info` |
| `yyc3 view <component>` | 预览组件 | `yyc3 view card` |
| `yyc3 search <query>` | 搜索组件 | `yyc3 search table` |
| `yyc3 list` | 列出模板/样板/主题 | `yyc3 list --blueprints` |
| `yyc3 migrate` | 迁移工具 | `yyc3 migrate --radix` |
| `yyc3 apply` | 应用变更 | `yyc3 apply` |
| `yyc3 mcp` | MCP Server 管理 | `yyc3 mcp init` |
| `yyc3 registry` | 注册表管理 | `yyc3 registry add` |
| `yyc3 samples` | 查看 20 套样板 | `yyc3 samples --list` |
| `yyc3 themes` | 查看 28 套主题 | `yyc3 themes --list` |

---

## 🎨 主题系统

内置 11 种精心设计的视觉主题：

| 主题 | 值 | 描述 |
| ------ | ------ | ------ |
| YYC³ Brand | `yyc3-brand` | 默认品牌标准色 / Geist / Lucide |
| 赛博朋克 | `cyberpunk` | 霓虹发光 / 暗色 / 故障效果 |
| 未来科技 | `futuristic` | 玻璃拟态 / 粒子背景 / 渐变光晕 |
| 极光星空 | `aurora` | 极光渐变 / 深空背景 / 微光闪烁 |
| 液态玻璃 | `liquid-glass` | 透明毛玻璃 / 折射 / 浮动卡片 |
| 医疗洁净 | `medical` | 柔和蓝绿 / 干净圆角 / 安全感 |
| 音乐律动 | `musical` | 紫蓝渐变 / 频谱动画 |
| 黑客极客 | `hacker` | 绿色终端 / 等宽字体 / 矩阵风格 |
| 暗黑极简 | `dark-minimal` | 极致暗色 / 锌色调 |
| 商务专业 | `professional` | 蓝色标准 / 白色背景 / 企业级 |
| YYC³ Dark | `yyc3-dark` | YYC³ 暗色主题 / Zinc 基底 |

---

## 🎬 场景系统

内置 18 种业务场景模板：

| 场景 | 值 | 依赖包 |
| ------ | ------ | ------ |
| AI 对话 | `ai-chat` | @yyc3/ai-hub |
| 管理后台 | `admin-dashboard` | recharts |
| 数据仪表盘 | `data-dashboard` | recharts |
| 企业官网 | `landing` | @yyc3/motion |
| 医疗健康 | `medical` | — |
| 学习教育 | `education` | — |
| CRM 客户 | `crm` | — |
| AI 全栈平台 | `ai-platform` | @yyc3/ai-hub |
| 音乐播放器 | `music-player` | — |
| DevOps | `devops` | — |
| SaaS 平台 | `saas` | — |
| 电商商城 | `ecommerce` | — |
| 知识库 Wiki | `knowledge-wiki` | — |
| 金融量化 | `financial` | recharts |
| AI 编程 IDE | `ai-code-ide` | — |
| AI 呼叫中心 | `ai-call-center` | — |
| 作品集 | `portfolio` | @yyc3/motion |
| 智慧城市 | `smart-city` | — |

---

## 🧪 样板项目

CLI 内置 **20 套业务样板项目**，覆盖 AI 智能、数据仪表盘、企业 SaaS、门户展示、行业应用五大类。

### 样板列表

| 名称 | 标签 | 分类 |
| ------ | ------ | ------ |
| `ai-intelligent-center` | AI 智能中心 | ai, dashboard |
| `admin-dashboard` | 管理仪表盘 | admin, dashboard, enterprise |
| `landing-page` | 落地页 | landing, 3d |
| `ai-medical` | AI 医疗 | ai, medical |
| `learning-platform` | 学习平台 | education |
| `smart-city` | 智慧城市 | dashboard, government |
| `3d-portal` | 3D 门户 | 3d, landing |
| `crm-system` | CRM 系统 | enterprise, admin |
| `data-dashboard` | 数据仪表盘 | dashboard |
| `ai-code-ide` | AI 代码 IDE | ai, devops |
| `financial-quant` | 金融量化 | finance, dashboard |
| `music-player` | 音乐播放器 | music |
| `devops-monitor` | DevOps 监控 | devops, dashboard |
| `saas-platform` | SaaS 平台 | saas, enterprise |
| `ai-call-center` | AI 呼叫中心 | ai, enterprise |
| `knowledge-wiki` | 知识 Wiki | knowledge, enterprise |
| `ecommerce-shop` | 电商商店 | ecommerce, enterprise |
| `portfolio` | 个人作品集 | portfolio, 3d |
| `table-converter` | 表格转换器 | tool |
| `forum-community` | 论坛社区 | forum |

### 使用方式

```bash
# 列出所有样板
yyc3 samples --list

# 查看样板详情
yyc3 samples admin-dashboard

# 按分类筛选
yyc3 samples --category ai

# JSON 输出（便于脚本消费）
yyc3 samples ai-intelligent-center --json
```

### 从样板生成项目（v1.3.0+）

20 套样板均为**完整 Next.js 应用实体**（随 `@yyc3/cli` 包分发，离线可用）。生成时会自动完成：复制蓝图 → 改写 `package.json`（项目名/端口/`@yyc3/ui ^3.0.0`）→ 写入 `components.json`（shadcn 协议）→ 主题注入（可选）→ 依赖安装。

```bash
# 方式一：create-yyc3-app（推荐）
npx create-yyc3-app my-admin --blueprint admin-dashboard
npx create-yyc3-app my-ai --blueprint T01 --theme cyberpunk   # 编号 + 主题注入
npx create-yyc3-app my-crm --blueprint crm-system --no-install # 跳过安装

# 方式二：yyc3 init
yyc3 init -t admin-dashboard -n my-admin          # -t 命中样板即走实体管线
yyc3 init admin-dashboard my-admin                # 空目录下的位置参数形式

# 方式三：全交互（不带任何参数，首问选择「完整业务样板」）
npx create-yyc3-app my-app

# 查看全部可用样板 / 模板 / 主题
yyc3 list
yyc3 list --blueprints --json
```

生成完成后即可开发：

```bash
cd my-admin
pnpm dev          # 端口与样板一致（如 admin-dashboard → 3201）
yyc3 add button   # components.json 已就位，组件添加开箱可用
```

### 验证脚本

仓库根目录提供端到端验证（CI 可复用）：

```bash
pnpm --filter @yyc3/cli build
node scripts/verify-blueprints.mjs          # 20 套全量冒烟
node scripts/verify-blueprints.mjs --deep   # + P0 五套 (T02/T03/T08/T09/T14) 安装并 next build
```

---

## 🎨 主题系统统一

CLI 内置 **28 套统一主题**，采用**三层正交架构**：7 × 11 × 10 = 770 种正交组合。

### 三层架构

| 层 | 数量 | 职责 | 示例 |
| ---- | ------ | ------ | ------ |
| **Base Preset Layer** | 7 | shadcn 风格预设（字体/图标库/基础色） | nova, vega, maia, lyra, mira, luma, sera |
| **Visual Style Layer** | 11 | 视觉调性（CSS变量/特效/整体观感） | yyc3-brand, cyberpunk, futuristic, aurora, liquid-glass, medical, musical, hacker, dark-minimal, professional, yyc3-dark |
| **Business Scenario Layer** | 10 | 业务场景（组件组合/布局/页面结构） | ai-intelligent, business-management, cli-devops, cyber-futuristic, dashboard-data, education-learning, finance-quantitative, medical-health, minimal-zero, aurora-gradient |

### 主题列表

#### Base Preset Layer (7)

| 名称 | 标签 | 描述 |
| ------ | ------ | ------ |
| `nova` | Nova | Lucide / Geist |
| `vega` | Vega | Lucide / Inter |
| `maia` | Maia | Hugeicons / Figtree |
| `lyra` | Lyra | Phosphor / JetBrains Mono |
| `mira` | Mira | Hugeicons / Inter |
| `luma` | Luma | Lucide / Inter |
| `sera` | Sera | Lucide / Noto Sans + Playfair Display |

#### Visual Style Layer (11)

| 名称 | 标签 | 描述 | 暗色 |
| ------ | ------ | ------ | ------ |
| `yyc3-brand` | YYC³ Brand | YYC³ 品牌标准色 | No |
| `cyberpunk` | 赛博朋克 | 霓虹发光 / 故障效果 | Yes |
| `futuristic` | 未来科技 | 玻璃拟态 / 粒子背景 | Yes |
| `aurora` | 极光星空 | 极光渐变 / 深空背景 | Yes |
| `liquid-glass` | 液态玻璃 | 透明毛玻璃 / 折射 | No |
| `medical` | 医疗洁净 | 柔和蓝绿 / 干净圆角 | No |
| `musical` | 音乐律动 | 紫蓝渐变 / 频谱动画 | Yes |
| `hacker` | 黑客极客 | 绿色终端 / 矩阵风格 | Yes |
| `dark-minimal` | 暗黑极简 | 极致暗色 / 锌色调 | Yes |
| `professional` | 商务专业 | 蓝色标准 / 企业级 | No |
| `yyc3-dark` | YYC³ Dark | YYC³ 暗色 / Zinc 基底 | Yes |

#### Business Scenario Layer (10)

| 名称 | 标签 | 描述 | 关联样板 |
| ------ | ------ | ------ | ---------- |
| `ai-intelligent` | AI 智能 | AI 智能场景 | ai-intelligent-center, ai-medical, ai-code-ide, ai-call-center |
| `business-management` | 企业管理 | 企业级管理 | admin-dashboard, crm-system, saas-platform |
| `cli-devops` | CLI DevOps | DevOps / CI/CD | ai-code-ide, devops-monitor |
| `cyber-futuristic` | 赛博未来 | 赛博+未来融合 | landing-page, 3d-portal, portfolio, smart-city |
| `dashboard-data` | 数据仪表盘 | 数据可视化 | admin-dashboard, data-dashboard, financial-quant, devops-monitor |
| `education-learning` | 教育学习 | 在线教育 | learning-platform, knowledge-wiki, forum-community |
| `finance-quantitative` | 金融量化 | K线 / 量化策略 | financial-quant |
| `medical-health` | 医疗健康 | 医疗卫生 | ai-medical |
| `minimal-zero` | 极简零干扰 | 极简主义 | portfolio, table-converter |
| `aurora-gradient` | 极光渐变 | 梦幻色彩 | music-player, ecommerce-shop, forum-community |

### 使用方式

```bash
# 列出所有 28 主题
yyc3 themes --list

# 查看主题详情
yyc3 themes cyberpunk

# 按层筛选
yyc3 themes --layer visual
yyc3 themes --layer scenario

# 按分类筛选
yyc3 themes --category dark
yyc3 themes --category ai

# 仅暗色/亮色
yyc3 themes --dark
yyc3 themes --light

# 生成 CSS 变量
yyc3 themes cyberpunk --css

# 生成 Tailwind 配置
yyc3 themes cyberpunk --tailwind

# 生成 globals.css 片段
yyc3 themes cyberpunk --globals

# 三层正交组合查询
yyc3 themes --compose nova:cyberpunk:ai-intelligent

# JSON 输出
yyc3 themes cyberpunk --json
yyc3 themes --compose nova:cyberpunk:ai-intelligent --json
```

---

## 📋 注册表

内置 3D/高级组件注册表：

| 组件 | 文件 | 说明 |
| ------ | ------ | ------ |
| Card3D | `card-3d.json` | 3D 卡片翻转效果 |
| ParticleCanvas | `particle-canvas.json` | 粒子画布背景 |
| Spotlight | `spotlight.json` | 聚光灯效果 |
| SplineScene | `spline-scene.json` | Spline 3D 场景嵌入 |

---

## 🔌 MCP 集成

```bash
# 初始化 MCP Server
yyc3 mcp init

# MCP 配置文件自动生成
# 支持 Stdio / HTTP 传输协议
```

---

## 🧪 测试

```bash
# 运行测试
pnpm test

# 覆盖率
pnpm test:coverage

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```

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
