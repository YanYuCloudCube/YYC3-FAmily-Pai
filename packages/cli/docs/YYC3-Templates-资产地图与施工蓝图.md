---
file: YYC3-Templates-资产地图与施工蓝图.md
description: 20套样板项目 — 完整资产来源清单 + 统一工作目录 + 施工路线图
author: YYC³ 总控工程师导师 <Trae-IDE>
version: v2.0.0
created: 2026-05-08
updated: 2026-05-08
status: completed
tags: [templates],[asset-map],[architecture],[blueprint]
category: plan
context:
  prev: null
  next: YYC3-Templates-完整使用指南.md
  related:
    - retrieval-training-data.json
    - ../verify-all.sh
    - ../../YYC3-CLI/packages/yyc3-cli/bin/yyc3-cli.js
    - ../../../YYC3-硬件设备-算力中心/docs/YYC3-总控工程师-trae-ide-20260508/00-YYC3全链路分化推进方案.md
  milestone: YYC3-Templates v2.0 全链路闭环 → 线B样板产品线

> 📎 **文档导航** — [蓝图(本文)](./YYC3-Templates-资产地图与施工蓝图.md) → [完整使用指南](./YYC3-Templates-完整使用指南.md) → [检索训练数据](./retrieval-training-data.json) → [验证脚本](../verify-all.sh)
> 🔗 **跨域衔接** — [全链路分化推进方案](../../../YYC3-硬件设备-算力中心/docs/YYC3-总控工程师-trae-ide-20260508/00-YYC3全链路分化推进方案.md) (线B: 样板→RAG→文档→生态)

# YYC³ 20套样板 — 资产地图与施工蓝图

## 一、资产来源清单（每一件东西从哪来）

### 1.1 组件层 — UI组件从哪来

| 资产 | 来源路径 | 用途 | 归属 |
|------|---------|------|------|
| **@yyc3/ui** (56+组件) | `YYC3-π³/packages/ui/` | 样板项目的UI组件库 | ✅ 你的npm包 |
| **Call-UI** (48组件) | `YYC3-设计工具-组件插件/Call-UI/ui/` | shadcn/ui标准组件副本 | ✅ 你的副本 |
| **shadcn-ui源码** | `YYC3-设计工具-组件插件/shadcn-ui.tnasdownload/` | 参考+学习，不直接用 | 📖 参考用 |
| **Raptor-UI** (217组件) | `YYC3-设计工具-组件插件/Raptor-UI-prompt-hub/` | AI提示词生成器 | ✅ 你的工具 |

**结论：样板统一使用 `@yyc3/ui`，不再引入其他UI库。**

### 1.2 工具层 — CLI从哪来

| 资产 | 来源路径 | 用途 | 归属 |
|------|---------|------|------|
| **YYC3-CLI** | `YYC3-设计工具-组件插件/YYC3-CLI/` | 项目脚手架+运维工具箱 | ✅ 你的 |
| **@yyc3/cli** | `YYC3-π³/packages/cli/` | 组件管理工具(add/init/build) | ✅ 你的npm包 |
| **create-app.ts** | `YYC3-π³/packages/cli/src/create-app.ts` | 创建项目入口(4模板) | ✅ 你的 |

**结论：样板模板扩展在 `YYC3-CLI` 中进行。**

### 1.3 知识层 — 参考项目从哪来

| 资产 | 来源路径 | 项目数 | 用途 |
|------|---------|--------|------|
| **KB分析报告1** | `YYC3-构建智能-复用架构/YYC3-KB-分类分析报告/analysis_2026-05-08T08-43-23.md` | 77个项目 | YYC-DCU知识库 |
| **KB分析报告2** | `...analysis_2026-05-08T08-43-36.md` | 162个项目 | YYC3-DC知识库 |
| **KB分析报告3** | `...analysis_2026-05-08T08-43-44.md` | 118个项目 | YYC3-UI知识库 |
| **复用框架规划** | `YYC3-构建智能-复用架构/YYC3-KB-复用框架规划.md` | — | 架构设计参考 |
| **Next+React项目** | `YYC3-构建智能-复用架构/YYC3-Next+React-项目.md` | — | 技术栈规范 |
| **GitHub仓库** | `github.com/YYC-Cube` | 25+ | 已发布项目 |

**结论：357个项目是参考来源，样板从这些项目中提炼最佳组合。**

### 1.4 设计层 — 图标/品牌从哪来

| 资产 | 来源路径 | 用途 |
|------|---------|------|
| **YYC³图标全平台** | `YYC3-CLI/Public/cloud-icons/` | favicon/App Icon/各平台 |
| **YYC³品牌图标** | `YYC3-设计工具-组件插件/Public/yyc3/` | yyc3标准版 |
| **YYC³蓝色版** | `...Public/yyc3-blue/` | 蓝色主题版 |
| **YYC³语枢版** | `...Public/yyc3-yy/` | 语枢品牌版 |
| **占位图** | `...Public/placeholder*` | 开发用占位图 |
| **GitHub社交图** | `...Public/github/` | GitHub展示图 |

---

## 二、统一工作目录

**所有20套样板的建设工作在一个目录进行：**

```
/Volumes/Max/YanYuCloudCube/YanYuCloud/YYC3-设计工具-组件插件/YYC3-Templates/
```

### 2.1 目录结构

```
YYC3-Templates/                          ← 统一工作目录（新建）
├── README.md                             ← 总索引（20套一览表）
├── _blueprint/                           ← 施工蓝图（本文件）
│   └── YYC3-Templates-资产地图与施工蓝图.md
│
├── T01-ai-intelligent-center/            ← 样板1: AI智能中心
│   ├── package.json
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
│
├── T02-admin-dashboard/                  ← 样板2: 管理后台
├── T03-landing-page/                     ← 样板3: 企业官网/Landing
├── T04-ai-medical/                       ← 样板4: AI医疗系统
├── T05-learning-platform/                ← 样板5: 学习教育平台
├── T06-smart-city/                       ← 样板6: 智慧城市平台
├── T07-3d-portal/                        ← 样板7: 3D交互门户
├── T08-crm-system/                       ← 样板8: CRM客户管理
├── T09-data-dashboard/                   ← 样板9: 数据看盘大屏
├── T10-ai-code-ide/                      ← 样板10: AI编程IDE
├── T11-financial-quant/                  ← 样板11: 金融量化平台
├── T12-music-player/                     ← 样板12: 音乐播放器
├── T13-devops-monitor/                   ← 样板13: DevOps监控
├── T14-saas-platform/                    ← 样板14: SaaS多租户
├── T15-ai-call-center/                   ← 样板15: AI呼叫中心
├── T16-knowledge-wiki/                   ← 样板16: 知识库Wiki
├── T17-ecommerce-shop/                   ← 样板17: 电商商城
├── T18-portfolio/                        ← 样板18: 作品集Portfolio
├── T19-table-converter/                  ← 样板19: 表格转换工具
└── T20-forum-community/                  ← 样板20: 论坛社区
```

### 2.2 每套样板内部结构（统一标准）

```
T{NN}-{name}/
├── package.json              ← 依赖：@yyc3/ui + next + react + tailwind
├── next.config.ts            ← Next.js配置
├── tailwind.config.ts        ← Tailwind + YYC³主题
├── tsconfig.json             ← TypeScript配置
├── components.json           ← shadcn/ui配置（指向@yyc3/ui）
├── pnpm-workspace.yaml       ← pnpm配置
├── .env.example              ← 环境变量模板
│
├── app/
│   ├── layout.tsx            ← 全局布局（导航+侧栏+主题）
│   ├── page.tsx              ← 首页
│   ├── loading.tsx           ← 加载态
│   ├── error.tsx             ← 错误边界
│   ├── not-found.tsx         ← 404
│   ├── globals.css           ← 主题CSS变量
│   └── (routes)/             ← 业务路由
│       ├── dashboard/        ← 具体页面（按样板类型不同）
│       ├── settings/
│       └── ...
│
├── components/
│   ├── layout/               ← 布局组件（header/sidebar/footer）
│   ├── business/             ← 业务组件（按样板类型不同）
│   └── ui/                   ← 不复制，通过@yyc3/ui引用
│
├── lib/
│   ├── utils.ts              ← cn() + 工具函数
│   ├── config.ts             ← 配置管理
│   └── mock/                 ← Mock数据（TODO标记接口位置）
│
├── public/
│   ├── favicon.ico           ← 从Public/cloud-icons/复制
│   └── images/               ← 占位图
│
└── README.md                 ← 该样板说明+截图
```

### 2.3 依赖关系图

```
每套样板的外部依赖（统一）：

  @yyc3/ui (56+组件)     ← 你的npm包，不重复造轮子
  next (App Router)      ← 框架
  react 19               ← UI库
  tailwindcss 4          ← 样式
  @radix-ui/*            ← 无障碍（@yyc3/ui已包含）
  lucide-react           ← 图标（@yyc3/ui已包含）
  recharts               ← 图表（@yyc3/ui已包含）

每套样板的独有差异：
  T01: 无额外依赖
  T07: @splinetool/react-spline (3D)
  T09: 无额外依赖（recharts已在@yyc3/ui）
  T10: @monaco-editor/react (代码编辑)
  T11: lightweight-charts (K线图)
  T12: howler.js (音频)
  ...
```

---

## 三、施工路线图

### Phase 1: 基础设施（先搭一次）

| 步骤 | 内容 | 产出 |
|------|------|------|
| 1.1 | 创建统一工作目录 | `YYC3-Templates/` |
| 1.2 | 创建共享基础模板 | base package.json / layout / config |
| 1.3 | 提取@yyc3/ui使用规范 | 组件引用方式文档 |

### Phase 2: 核心样板（先做6套最高频）

| 优先级 | 样板 | KB参考项目 | 核心页面 |
|--------|------|-----------|---------|
| P0 | T01 AI智能中心 | YYC³ AI Intelligent Center, Nexus AI | Chat+侧栏+历史+设置 |
| P0 | T02 管理后台 | admin-dashboard, yyc3_AI_Management | 侧栏+卡片+表格+图表 |
| P0 | T03 企业官网 | yyc3-AI-Landing-Page, CN-Portfolio | Hero+特性+定价+CTA |
| P0 | T09 数据看盘 | YYC-Data-Dashboard-Design, futuristic-Dashboard | 全屏图表+实时数据 |
| P0 | T05 学习平台 | yyc3-learning-platform, AI学习中心 | 课程+视频+进度+考试 |
| P0 | T16 知识库Wiki | Knowledge-Base-UI-Design | 文档树+搜索+编辑 |

### Phase 3: 扩展样板（再做8套）

| T04 AI医疗 | T06 智慧城市 | T07 3D门户 | T08 CRM |
| T10 AI编程IDE | T11 金融量化 | T13 DevOps | T14 SaaS |

### Phase 4: 补全样板（最后6套）

| T12 音乐 | T15 AI呼叫 | T17 电商 | T18 Portfolio |
| T19 表格工具 | T20 论坛 |

### Phase 5: 集成到CLI

| 步骤 | 内容 |
|------|------|
| 5.1 | 将20套样板注册到YYC3-CLI的TEMPLATES数组 |
| 5.2 | 测试 `yyc3-cli create my-project --template ai-center` |
| 5.3 | 更新YYC3-CLI文档 |

---

## 四、资产使用追踪

| 资产 | 被哪些样板使用 | 使用方式 |
|------|--------------|---------|
| @yyc3/ui | 全部20套 | npm依赖 |
| @yyc3/core | T01/T04/T10/T13/T15 | AI能力核心 |
| @yyc3/ai-hub | T01/T04/T06/T10 | AI家人调度 |
| @yyc3/i18n-core | T03/T05/T06/T17 | 多语言 |
| @yyc3/motion | T03/T07/T12/T18 | 动效 |
| @yyc3/emotion | T12 | 音乐情感 |
| YYC³图标 | 全部20套 | 从Public/cloud-icons/复制 |
| 占位图 | 全部20套 | 从Public/placeholder*复制 |
| shadcn-ui源码 | 仅参考 | 不直接复制 |

---

*文档结束 — YYC³ 20套样板资产地图 v1.0.0 — 2026-05-08*
