# @yyc3/cli

<p>
  <img src="https://img.shields.io/npm/v/@yyc3/cli" alt="npm" />
  <img src="https://img.shields.io/badge/based%20on-shadcn%20v4.5.0-blue" alt="shadcn" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license" />
</p>

YYC³ UI 智能编程库 CLI — 言启象限 · 语枢未来。基于 shadcn/ui v4.5.0 全量融合，保留上游全部能力 + YYC³ 品牌注入 + 增强组件 Registry。

## 安装

```bash
npx @yyc3/cli --help
```

## 命令总览

```
Usage: yyc3 [options] [command]

YYC³ UI 智能编程库 — 言启象限 | 语枢未来

Commands:
  init|create    初始化项目并安装依赖
  apply          应用预设到现有项目
  add            添加组件到项目
  diff           对比组件差异
  docs           查看文档和 API 参考
  view           查看 Registry 中的组件
  search|list    搜索 Registry 中的组件
  migrate        运行迁移
  info           获取项目信息
  build          构建 Registry 组件
  mcp            MCP Server 和配置命令
  registry       管理 Registry
```

## 快速开始

### 创建项目

```bash
npx create-yyc3-app my-project -t dashboard --preset yyc3-dark
cd my-project
pnpm install
pnpm dev
```

### 初始化现有项目

```bash
npx @yyc3/cli init -p yyc3-dark
```

### 添加标准组件

```bash
npx @yyc3/cli add button
npx @yyc3/cli add card dialog sheet
```

### 添加 YYC³ 增强组件

```bash
npx @yyc3/cli add @yyc3/spotlight
npx @yyc3/cli add @yyc3/card-3d
npx @yyc3/cli add @yyc3/particle-canvas
npx @yyc3/cli add @yyc3/spline-scene
```

## 主题预设

| 预设 | 风格 | 字体 | 色系 |
|------|------|------|------|
| `yyc3-dark` | Cyberpunk 霓虹 | Geist | Zinc Dark |
| `yyc3-light` | 明亮商务 | Inter | Neutral |
| `yyc3-brand` | 品牌标准 | Geist | Neutral |
| `nova` | shadcn 默认 | Geist | Neutral |
| `vega` | Inter 风格 | Inter | Neutral |

## MCP 集成

AI 编辑器（Trae / Cursor / Claude Code / VS Code）可通过 MCP 直接搜索和添加组件：

```bash
npx @yyc3/cli mcp init --client cursor
```

支持的客户端：`claude` / `cursor` / `vscode` / `codex` / `opencode`

## 品牌标识

所有通过 `yyc3 add` 写入的 `.tsx/.ts` 文件自动注入品牌标识头：

```ts
// ⟨YYC³⟩ — YYC³ UI 智能编程库 | 言启象限 · 语枢未来
import * as React from "react"
```

## 情感启动画面

当直接运行 `yyc3`（无子命令）时，CLI 会展示 AI Family 情感欢迎画面：

```text
🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹
  ██╗   ██╗██╗   ██╗ ██████╗██████╗
  ╚██╗ ██╔╝╚██╗ ██╔╝██╔════╝╚════██╗
   ╚████╔╝  ╚████╔╝ ██║      █████╔╝
    ╚██╔╝    ╚██╔╝  ██║      ╚═══██╗
     ██║      ██║   ╚██████╗██████╔╝
     ╚═╝      ╚═╝    ╚═════╝╚═════╝
🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹

   AI Family · 人从众曌众从人
   亦师亦友亦伯乐，一言一语一协同
   拟人为本 · AI为核 · 纯粹为心
```

> 此启动画面源自 AI Family 情感文化总铭第九节，自动显示系统用户名和家族陪伴天数。

## YYC³ Registry 组件

| 组件 | 类型 | 依赖 | 说明 |
|------|------|------|------|
| `@yyc3/spotlight` | 交互 | framer-motion | 鼠标跟随聚光灯 |
| `@yyc3/card-3d` | 3D | framer-motion | 透视旋转卡片 |
| `@yyc3/spline-scene` | 3D | @splinetool/react-spline | Spline 懒加载场景 |
| `@yyc3/particle-canvas` | 背景 | **零依赖** | 霓虹粒子网络 |

## 脚手架模板

```bash
npx create-yyc3-app <name> -t <template>
```

| 模板 | 说明 | 端口 |
|------|------|------|
| `dashboard` | 侧边栏 + 内容区 + 数据表格 | 3201 |
| `ai-platform` | 对话界面 + 模型管理 + 工具调用 | 3300 |
| `landing` | 品牌展示 + Spline 3D + 动效 | 3200 |
| `api` | RESTful API + 认证 + 中间件 | 3400 |

## 完整业务样板（T01-T20）

v1.3.0 起，20 套完整 Next.js 业务样板（源自 UI-MONO blueprints）作为**实体蓝图**随 `@yyc3/cli` 分发，离线可用。生成时自动完成：复制蓝图 → `package.json` 定制（项目名/端口/`@yyc3/ui ^3.0.0`）→ `components.json`（shadcn 协议）→ 主题注入（可选）→ 依赖安装。

```bash
# 推荐：create-yyc3-app
npx create-yyc3-app my-admin --blueprint admin-dashboard
npx create-yyc3-app my-ai --blueprint T01 --theme cyberpunk

# 或：yyc3 init（-t 命中样板编号/语义名/目录名均可）
yyc3 init -t admin-dashboard -n my-admin

# 查看 / 校验
yyc3 list --blueprints          # 20 套样板清单（含端口与实体状态）
yyc3 samples admin-dashboard    # 单套详情（组件/主题/生成命令）
```

| 编号 | 样板 | 场景 | 端口 |
|------|------|------|------|
| T01 | `ai-intelligent-center` | AI 智能中心 | 3300 |
| T02 | `admin-dashboard` | 管理后台 | 3201 |
| T03 | `landing-page` | 企业官网 | 3200 |
| T04 | `ai-medical` | AI 医疗 | 3205 |
| T05 | `learning-platform` | 学习平台 | 3203 |
| T06 | `smart-city` | 智慧城市 | 3206 |
| T07 | `3d-portal` | 3D 门户 | 3207 |
| T08 | `crm-system` | CRM 系统 | 3208 |
| T09 | `data-dashboard` | 数据大屏 | 3202 |
| T10 | `ai-code-ide` | AI 编程 IDE | 3209 |
| T11 | `financial-quant` | 金融量化 | 3210 |
| T12 | `music-player` | 音乐播放器 | 3213 |
| T13 | `devops-monitor` | DevOps 监控 | 3211 |
| T14 | `saas-platform` | SaaS 平台 | 3212 |
| T15 | `ai-call-center` | AI 呼叫中心 | 3214 |
| T16 | `knowledge-wiki` | 知识 Wiki | 3204 |
| T17 | `ecommerce-shop` | 电商商店 | 3215 |
| T18 | `portfolio` | 个人作品集 | 3216 |
| T19 | `table-converter` | 表格转换器 | 3217 |
| T20 | `forum-community` | 论坛社区 | 3218 |

> 端到端验证：`node scripts/verify-blueprints.mjs --deep`（20 套冒烟 + P0 五套 `next build`）

## 技术架构

- **基于**: shadcn/ui v4.5.0（MIT）全量源码融合
- **构建**: tsup ESM，398KB，tree-shaken
- **Registry**: `@shadcn` + `@yyc3` 双 Registry 内置
- **MCP**: 5 工具（搜索/查看/列出/示例/Registry）
- **品牌**: 自动标识头注入 + CLI 名称/描述/Server name 全面 YYC³ 化
