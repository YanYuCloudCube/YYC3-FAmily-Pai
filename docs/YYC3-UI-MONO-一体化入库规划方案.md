# YYC3-UI-MONO × π³ 一体化组件库入库与样板项目规划方案

> **版本**: v1.0.0 | **日期**: 2026-06-20 | **状态**: 规划中
>
> ***YanYuCloudCube*** — 言启象限 | 语枢未来 | 万象归元于云枢

---

## 📋 目录

- [一、项目现状深度分析](#一项目现状深度分析)
- [二、核心差异与互补性分析](#二核心差异与互补性分析)
- [三、一体化架构设计](#三一体化架构设计)
- [四、组件库入库方案](#四组件库入库方案)
- [五、样板项目体系方案](#五样板项目体系方案)
- [六、CLI工具链衔接方案](#六cli工具链衔接方案)
- [七、阶段节点规划](#七阶段节点规划)
- [八、执行清单](#八执行清单)

---

## 一、项目现状深度分析

### 1.1 YYC3-UI-MONO 项目全景

```
YYC3-UI-MONO/                    4.0G | 198,542 文件
├── apps/                 1.6G | 251 应用（Next.js 159 + React 75 + 其他 9）
├── packages/              70M |   7 共享包
│   ├── base/                   ← 唯一 Next.js 底座（40+ 页面路由）
│   ├── ui/                     ← 统一组件库（62 基础UI + 69 业务组件）
│   ├── theme/                  ← 主题系统（7 预设方案）
│   ├── yyc3-cube/              ← 云枢核心
│   ├── yyc3-industry-platform/ ← 行业平台（76 行业包）
│   ├── yyc3-learning/          ← 学习平台
│   └── yyc3-npm-arch/          ← npm 包架构
├── templates/            2.3G |   3 模板集
│   ├── themes/          706M |  21 套主题模板（U01-U20）
│   ├── blueprints/      1.1M |  20 套项目样板（T01-T20）
│   └── code/            2.7G |   3 大类源码
├── tools/                54M |  14 工具（cli/mcp/skills/claw/scripts）
└── docs/                 36M |  统一文档区
```

#### 1.1.1 组件库资产清单（packages/ui）

| 分类 | 数量 | 代表组件 |
|------|------|----------|
| **基础UI（shadcn/ui）** | 62 | accordion, alert, avatar, badge, button, card, carousel, chart, checkbox, command, dialog, drawer, dropdown-menu, form, hover-card, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toggle, tooltip 等 |
| **增强UI** | 8 | enhanced-button, enhanced-card, enhanced-progress, animated-logo, floating-nav-buttons, interactive-progress, item, kbd |
| **业务-企业管理** | 18 | customer-management, okr-management, task-management, finance-module, oa-approval, permission-management, store-management, tenant-management, team-collaboration 等 |
| **业务-AI智能** | 5 | ai-assistant, ai-customer-data, ai-smart-forms, ai-models, ai-service |
| **业务-数据可视化** | 6 | advanced-bi-dashboard, advanced-bi-reports, data-analytics, data-integration, dashboard-realtime-data, kpi-tracking |
| **业务-系统监控** | 7 | system-management-overview, system-performance-metrics, system-status-monitor, performance-monitoring-dashboard, security-center, real-time-threat-detection, system-testing |
| **业务-平台能力** | 9 | pwa-manager, pwa-install-prompt, offline-indicator, enhanced-mobile-experience, mobile-native-app, touch-gestures, global-search, quick-actions, notification-center |
| **业务-通信集成** | 4 | communication, wechat-api, wechat-menu-sync, advanced-wechat-integration |
| **工具/Hook** | 6 | use-mobile, use-toast, design-system, design-system-locked, utils, ProtectedRoute |
| **图表组件** | 4 | finance-chart, okr-analytics-charts, performance-chart, sales-chart |
| **布局组件** | 3 | header, sidebar, page-container |
| **对话框组件** | 2 | profile-dialog, settings-dialog |
| **合计** | **134** | |

#### 1.1.2 样板项目清单（templates/blueprints）

| 编号 | 名称 | 场景 | 框架 |
|------|------|------|------|
| T01 | ai-intelligent-center | AI 智能中心 | Next.js |
| T02 | admin-dashboard | 管理仪表盘 | Next.js |
| T03 | landing-page | 落地页 | Next.js |
| T04 | ai-medical | AI 医疗 | Next.js |
| T05 | learning-platform | 学习平台 | Next.js |
| T06 | smart-city | 智慧城市 | Next.js |
| T07 | 3d-portal | 3D 门户 | Next.js |
| T08 | crm-system | CRM 系统 | Next.js |
| T09 | data-dashboard | 数据仪表盘 | Next.js |
| T10 | ai-code-ide | AI 代码 IDE | Next.js |
| T11 | financial-quant | 金融量化 | Next.js |
| T12 | music-player | 音乐播放器 | Next.js |
| T13 | devops-monitor | DevOps 监控 | Next.js |
| T14 | saas-platform | SaaS 平台 | Next.js |
| T15 | ai-call-center | AI 呼叫中心 | Next.js |
| T16 | knowledge-wiki | 知识 Wiki | Next.js |
| T17 | ecommerce-shop | 电商商店 | Next.js |
| T18 | portfolio | 个人作品集 | Next.js |
| T19 | table-converter | 表格转换器 | Next.js |
| T20 | forum-community | 论坛社区 | Next.js |

#### 1.1.3 主题模板清单（templates/themes）

| 编号 | 主题 | 风格定位 |
|------|------|----------|
| U01 | cyberpunk-neon | 赛博朋克·霓虹 |
| U02 | professional-dark | 专业暗色 |
| U03 | aurora-gradient | 极光渐变 |
| U04 | clinical-clean | 临床清洁 |
| U05 | warm-academic | 温暖学术 |
| U06 | futuristic-grid | 未来网格 |
| U07 | liquid-glass | 液态玻璃 |
| U08 | corporate-slate | 企业岩板 |
| U09 | dark-analytics | 暗色分析 |
| U10-U20 | 11 套 | 教育、医疗、金融、社交等 |

### 1.2 π³ Monorepo 现状

```
YYC3-π³/                         npm 发布 Monorepo（11 包）
├── packages/
│   ├── core/            v1.4.0  核心工具库
│   ├── ai-hub/          v1.4.2  AI 集成中心
│   ├── ui/              v2.0.2  ← 目标升级包（56 shadcn/ui + 32 业务组件）
│   ├── effects/         v1.0.0  动效库
│   ├── plugins/         v1.4.2  插件系统
│   ├── i18n-core/       v2.4.0  国际化核心（621 测试）
│   ├── emotion/         v1.0.0  情感引擎
│   ├── mcp-servers/     v3.0.0  MCP 服务器
│   ├── motion/          v1.0.0  动画系统
│   ├── cli/             v1.1.1  CLI 工具
│   └── ide/             private IDE 包
```

#### 1.2.1 π³ packages/ui 现状

| 分类 | 数量 | 说明 |
|------|------|------|
| shadcn/ui 基础组件 | 56 | 完整 shadcn/ui 标准（accordion → tooltip） |
| 业务组件 | 32 | AdvancedSearch, BentoGrid, BrandBadge, DataTable, DatePicker, MonacoEditor, VirtualList 等 |
| 主题系统 | 21 | ai-intelligent, aurora-gradient, cyber-futuristic, medical-health 等 |
| 构建方式 | tsup ESM+DTS | 已发布 npm，支持 tree-shaking |

---

## 二、核心差异与互补性分析

### 2.1 架构差异

| 维度 | UI-MONO | π³ | 互补关系 |
|------|---------|-----|----------|
| **定位** | 应用层 Monorepo（含 251 应用） | npm 发布层 Monorepo（11 包） | UI-MONO 消费 π³ 的 npm 包 |
| **组件库构建** | 源码直接引用（`./index.ts`） | tsup 构建 + npm 发布 | π³ 是发布源，UI-MONO 是消费端 |
| **TypeScript** | 非严格模式 | 严格模式 | π³ 质量标准更高 |
| **样式方案** | Tailwind 3 + 固定 design-system | Tailwind 4 + oklch + CVA variants | π³ 更现代化 |
| **React 版本** | React 18 | React 18/19 兼容 | π³ 前向兼容 |
| **Next.js** | 14.1.4 固定 | 不绑定（纯组件库） | π³ 框架无关 |
| **测试** | 无测试 | Vitest 全覆盖 | π³ 有质量保证 |
| **ESLint** | 各包独立 | Flat Config 统一 | π³ 更规范 |

### 2.2 组件覆盖差异

#### UI-MONO 独有（π³ 缺失）的高价值业务组件

| 组件 | 分类 | 入库优先级 | 说明 |
|------|------|-----------|------|
| `AIAssistant` | AI 智能助手 | P0 | 完整的 AI 对话面板，多模型切换 |
| `CustomerManagement` | 企业管理 | P1 | 客户全生命周期管理 |
| `OKRManagement` | 企业管理 | P1 | OKR 目标管理 |
| `TaskManagement` | 企业管理 | P1 | 任务看板管理 |
| `FinanceModule` | 企业管理 | P1 | 财务模块 |
| `OAApproval` | 企业管理 | P2 | OA 审批流 |
| `PermissionManagement` | 系统管理 | P1 | 权限管理 |
| `TenantManagement` | 系统管理 | P2 | 多租户管理 |
| `AdvancedBIDashboard` | 数据可视化 | P0 | BI 数据仪表盘 |
| `AdvancedBIReports` | 数据可视化 | P1 | BI 报表 |
| `DashboardRealtimeData` | 数据可视化 | P1 | 实时数据面板 |
| `KPITracking` | 数据可视化 | P1 | KPI 追踪 |
| `SystemStatusMonitor` | 系统监控 | P1 | 系统状态监控 |
| `PerformanceMonitoringDashboard` | 系统监控 | P1 | 性能监控 |
| `SecurityCenter` | 安全 | P2 | 安全中心 |
| `RealTimeThreatDetection` | 安全 | P2 | 威胁检测 |
| `NotificationCenter` | 平台能力 | P0 | 通知中心 |
| `GlobalSearch` | 平台能力 | P1 | 全局搜索 |
| `PWAManager` | 平台能力 | P2 | PWA 管理 |
| `OfflineIndicator` | 平台能力 | P2 | 离线指示器 |
| `EnhancedMobileExperience` | 移动端 | P2 | 增强移动体验 |
| `Communication` | 通信 | P2 | 消息通信 |
| `WechatMenuSync` | 通信 | P3 | 微信菜单同步 |
| `FinanceChart` | 图表 | P1 | 财务图表 |
| `OkrAnalyticsCharts` | 图表 | P1 | OKR 分析图表 |
| `PerformanceChart` | 图表 | P1 | 性能图表 |
| `SalesChart` | 图表 | P1 | 销售图表 |
| `ProfileDialog` | 对话框 | P2 | 资料对话框 |
| `SettingsDialog` | 对话框 | P2 | 设置对话框 |
| `AnimatedLogo` | 增强 UI | P2 | 动画 Logo |
| `EnhancedButton` | 增强 UI | P2 | 增强按钮 |
| `EnhancedCard` | 增强 UI | P2 | 增强卡片 |
| `FloatingNavButtons` | 增强 UI | P2 | 浮动导航按钮 |
| `TouchGestures` | 移动端 | P3 | 触摸手势 |
| `UserTraining` | 平台能力 | P3 | 用户培训 |
| `TeamCollaboration` | 企业管理 | P2 | 团队协作 |
| `InternationalizationManager` | 平台能力 | P2 | 国际化管理 |
| `ParameterSettings` | 系统管理 | P3 | 参数设置 |
| `SystemTesting` | 系统管理 | P3 | 系统测试 |
| `CustomerLifecycle` | 企业管理 | P2 | 客户生命周期 |
| `CustomerSatisfaction` | 企业管理 | P3 | 客户满意度 |

### 2.3 质量差距与适配需求

| 问题 | 影响 | 解决方案 |
|------|------|----------|
| `@/` 路径别名依赖 | 组件无法独立使用 | 改为相对路径或通过 tsup alias 处理 |
| `"use client"` 指令 | 纯组件库不需要 | 保留（兼容 Next.js App Router） |
| `next-themes` 硬依赖 | 非 Next.js 项目无法使用 | 改为 peerDependency + 可选注入 |
| 固定 design-system 色值 | 主题不灵活 | 改为 CSS variables + Tailwind tokens |
| 无 TypeScript 严格检查 | 类型不完整 | 补充类型声明，启用 strict |
| 无单元测试 | 质量无保证 | 每个入库组件补充 Vitest 测试 |
| React 18 固定 | 不兼容 React 19 | 改为 `>=18.0.0 || >=19.0.0` |

---

## 三、一体化架构设计

### 3.1 目标架构

```
YYC3-π³ (npm 发布源)                    YYC3-UI-MONO (应用消费端)
┌──────────────────────────┐           ┌──────────────────────────┐
│ packages/ui/              │           │ apps/*                    │
│ ├── src/                  │  npm publish  │   └── import @yyc3/ui  │
│ │   ├── components/ui/    │ ────────→ │ packages/ui/              │
│ │   │   (56 shadcn base)  │           │   └── import @yyc3/ui    │
│ │   ├── components/business/│          │ templates/blueprints/     │
│ │   │   (40+ 入库新组件)   │           │   └── import @yyc3/ui    │
│ │   ├── themes/           │           │                            │
│ │   │   (21+7 主题)        │           │                            │
│ │   └── core/             │           │                            │
│ ├── tsup.config.ts        │           │                            │
│ └── package.json v3.0.0   │           │                            │
│                           │           │                            │
│ packages/cli/             │           │                            │
│ └── templates/blueprints/ │  CLI add   │                            │
│     (20 样板注册)          │ ────────→ │                            │
└──────────────────────────┘           └──────────────────────────┘
```

### 3.2 组件库分层

```
@yyc3/ui v3.0.0
├── / (根入口 — 全量导出)
├── /shadcn (56 shadcn/ui 基础组件)
├── /business (40+ 业务组件)
│   ├── /ai          — AI 智能组件
│   ├── /enterprise  — 企业管理组件
│   ├── /data        — 数据可视化组件
│   ├── /system      — 系统监控组件
│   ├── /platform    — 平台能力组件
│   └── /charts      — 图表组件
├── /themes (28 主题)
└── /core (工具函数 + hooks)
```

### 3.3 CLI 工具衔接

```
@yyc3/cli v1.2.0
├── yyc3 add <component>     — 从 @yyc3/ui 添加组件到项目
├── yyc3 init <template>     — 从样板初始化项目
├── yyc3 theme <preset>      — 应用主题预设
├── yyc3 search <keyword>    — 搜索组件
└── yyc3 list                — 列出所有可用组件和样板
```

---

## 四、组件库入库方案

### 4.1 入库标准（入库门槛）

每个组件必须满足以下全部条件才能入库：

| 标准 | 要求 | 验证方式 |
|------|------|----------|
| **路径解耦** | 无 `@/` 别名，使用相对路径 | grep 检查 |
| **框架无关** | `peerDependencies` 声明 React，不硬依赖 next | package.json 检查 |
| **TypeScript 严格** | 无 `any`，完整 props 类型 | tsc --strict 通过 |
| **单元测试** | 至少 1 个渲染测试 + 1 个交互测试 | vitest 通过 |
| **Tailwind 兼容** | 使用 CSS variables，不硬编码色值 | 代码审查 |
| **可 Tree-shake** | 使用 `export type` 分离类型 | tsup 构建验证 |
| **无副作用** | `sideEffects: false` | package.json |
| **可访问性** | Radix UI 基础，支持 ARIA | axe-core 检查 |
| **文档注释** | JSDoc 头部注释 | 代码审查 |

### 4.2 入库流程（标准化流水线）

```
源组件 (UI-MONO)
    │
    ▼
┌───────────────────────────┐
│ 1. 路径迁移                │
│    @/components/ui/xxx →   │
│    ./ui/xxx 或相对路径      │
└─────────┬─────────────────┘
          ▼
┌───────────────────────────┐
│ 2. 依赖解耦                │
│    next-themes → 可选注入   │
│    design-system → CSS vars│
└─────────┬─────────────────┘
          ▼
┌───────────────────────────┐
│ 3. 类型补全                │
│    props interface 完整化  │
│    移除 any                │
└─────────┬─────────────────┘
          ▼
┌───────────────────────────┐
│ 4. 样式标准化              │
│    固定色值 → CSS variables │
│    design-system → tokens  │
└─────────┬─────────────────┘
          ▼
┌───────────────────────────┐
│ 5. 测试编写                │
│    渲染测试 + 交互测试      │
│    覆盖率 ≥ 80%            │
└─────────┬─────────────────┘
          ▼
┌───────────────────────────┐
│ 6. 入库注册                │
│    src/components/business/│
│    更新 index.ts 导出      │
└─────────┬─────────────────┘
          ▼
┌───────────────────────────┐
│ 7. 构建验证                │
│    tsup build 通过         │
│    tsc --strict 通过       │
│    vitest 全通过           │
└───────────────────────────┘
```

### 4.3 分批入库计划

#### 第一批 P0（核心业务组件，10 个）

| 序号 | 组件 | 源路径 | 目标路径 |
|------|------|--------|----------|
| 1 | AIAssistant | packages/ui/ai-assistant.tsx | src/components/business/ai/ai-assistant.tsx |
| 2 | AdvancedBIDashboard | packages/ui/advanced-bi-dashboard.tsx | src/components/business/data/bi-dashboard.tsx |
| 3 | NotificationCenter | packages/ui/notification-center.tsx | src/components/business/platform/notification-center.tsx |
| 4 | CustomerManagement | packages/ui/customer-management.tsx | src/components/business/enterprise/customer-management.tsx |
| 5 | OKRManagement | packages/ui/okr-management.tsx | src/components/business/enterprise/okr-management.tsx |
| 6 | TaskManagement | packages/ui/task-management.tsx | src/components/business/enterprise/task-management.tsx |
| 7 | FinanceModule | packages/ui/finance-module.tsx | src/components/business/enterprise/finance-module.tsx |
| 8 | PermissionManagement | packages/ui/permission-management.tsx | src/components/business/system/permission-management.tsx |
| 9 | DashboardRealtimeData | packages/ui/dashboard-realtime-data.tsx | src/components/business/data/realtime-dashboard.tsx |
| 10 | GlobalSearch | packages/ui/global-search.tsx | src/components/business/platform/global-search.tsx |

#### 第二批 P1（管理与数据组件，15 个）

| 序号 | 组件 | 分类 |
|------|------|------|
| 11 | SystemStatusMonitor | system |
| 12 | PerformanceMonitoringDashboard | system |
| 13 | KPITracking | data |
| 14 | AdvancedBIReports | data |
| 15 | DataAnalytics | data |
| 16 | DataIntegration | data |
| 17 | CustomerManagementEnhanced | enterprise |
| 18 | OKRManagementEnhanced | enterprise |
| 19 | TaskManagementEnhanced | enterprise |
| 20 | TeamCollaboration | enterprise |
| 21 | ModuleCards | platform |
| 22 | QuickActions | platform |
| 23 | FinanceChart | charts |
| 24 | OkrAnalyticsCharts | charts |
| 25 | PerformanceChart | charts |

#### 第三批 P2（增强与平台组件，15 个）

| 序号 | 组件 | 分类 |
|------|------|------|
| 26 | SecurityCenter | system |
| 27 | TenantManagement | system |
| 28 | OAApproval | enterprise |
| 29 | StoreManagement | enterprise |
| 30 | CustomerLifecycle | enterprise |
| 31 | PWAManager | platform |
| 32 | OfflineIndicator | platform |
| 33 | EnhancedMobileExperience | platform |
| 34 | InternationalizationManager | platform |
| 35 | EnhancedButton | ui |
| 36 | EnhancedCard | ui |
| 37 | AnimatedLogo | ui |
| 38 | FloatingNavButtons | ui |
| 39 | ProfileDialog | dialogs |
| 40 | SettingsDialog | dialogs |

---

## 五、样板项目体系方案

### 5.1 样板项目注册到 CLI

将 UI-MONO 的 20 套样板注册到 `@yyc3/cli` 的模板系统：

```typescript
// packages/cli/src/templates/index.ts (扩展)
export const templates = {
  // 现有框架模板
  next, vite, start, "react-router": reactRouter, astro, laravel,

  // 新增业务样板（来自 UI-MONO blueprints）
  "ai-intelligent-center": aiIntelligentCenter,
  "admin-dashboard": adminDashboard,
  "landing-page": landingPage,
  "ai-medical": aiMedical,
  "learning-platform": learningPlatform,
  "smart-city": smartCity,
  "3d-portal": threeDPortal,
  "crm-system": crmSystem,
  "data-dashboard": dataDashboard,
  "ai-code-ide": aiCodeIde,
  "financial-quant": financialQuant,
  "music-player": musicPlayer,
  "devops-monitor": devopsMonitor,
  "saas-platform": saasPlatform,
  "ai-call-center": aiCallCenter,
  "knowledge-wiki": knowledgeWiki,
  "ecommerce-shop": ecommerceShop,
  "portfolio": portfolio,
  "table-converter": tableConverter,
  "forum-community": forumCommunity,
}
```

### 5.2 样板项目适配标准

每个样板项目需要适配为 CLI 可用模板：

| 适配项 | 要求 |
|--------|------|
| **组件引用** | 从 `@yyc3/ui` 导入，不使用 `@/components` |
| **样式引用** | 从 `@yyc3/ui/themes` 导入主题 |
| **依赖声明** | `package.json` 声明 `@yyc3/ui` 为 dependency |
| **配置文件** | 包含 `components.json`（shadcn 配置） |
| **README** | 包含使用说明和截图 |
| **CLI 注册** | 在 `templates/index.ts` 中注册 |

### 5.3 样板项目使用流程

```bash
# 列出所有样板
yyc3 init --list

# 从样板创建项目
yyc3 init admin-dashboard my-project

# 添加组件到项目
yyc3 add ai-assistant

# 应用主题
yyc3 theme cyberpunk-neon
```

---

## 六、CLI 工具链衔接方案

### 6.1 CLI 命令扩展

| 命令 | 功能 | 示例 |
|------|------|------|
| `yyc3 init <template> [name]` | 从样板初始化 | `yyc3 init admin-dashboard my-app` |
| `yyc3 add <component>` | 添加组件到项目 | `yyc3 add ai-assistant` |
| `yyc3 theme <preset>` | 应用主题 | `yyc3 theme liquid-glass` |
| `yyc3 list` | 列出组件/样板/主题 | `yyc3 list --components` |
| `yyc3 search <keyword>` | 搜索组件 | `yyc3 search dashboard` |
| `yyc3 info <name>` | 查看详情 | `yyc3 info ai-assistant` |
| `yyc3 diff` | 对比差异 | `yyc3 diff button` |
| `yyc3 migrate` | 迁移旧组件 | `yyc3 migrate --from shadcn` |

### 6.2 组件注册表（Registry）

```json
{
  "name": "@yyc3/ui",
  "version": "3.0.0",
  "components": {
    "ai-assistant": {
      "type": "registry:component",
      "category": "business/ai",
      "dependencies": ["@radix-ui/react-dialog", "lucide-react"],
      "files": ["business/ai/ai-assistant.tsx"]
    }
  },
  "templates": {
    "admin-dashboard": {
      "type": "registry:template",
      "framework": "next",
      "components": ["ai-assistant", "data-analytics", "kpi-tracking"]
    }
  },
  "themes": {
    "cyberpunk-neon": {
      "type": "registry:theme",
      "cssVars": { "--primary": "180 100% 50%" }
    }
  }
}
```

---

## 七、阶段节点规划

### Phase 1：基础建设（Week 1-2）

| 节点 | 任务 | 产出 | 验收标准 |
|------|------|------|----------|
| 1.1 | 创建 `src/components/business/` 目录结构 | 目录树 | 结构完整 |
| 1.2 | 定义入库标准和适配规范 | CONTRIBUTING.md | 标准文档 |
| 1.3 | 创建组件适配脚手架工具 | `scripts/adapt-component.mjs` | 可执行 |
| 1.4 | 扩展 tsup 构建配置支持子路径导出 | `tsup.config.ts` | 构建通过 |
| 1.5 | 扩展 `package.json` exports 映射 | package.json v3.0.0 | 导出验证 |

### Phase 2：P0 组件入库（Week 3-4）

| 节点 | 任务 | 产出 | 验收标准 |
|------|------|------|----------|
| 2.1 | AIAssistant 入库 + 测试 | 组件 + 测试 | vitest 通过 |
| 2.2 | AdvancedBIDashboard 入库 + 测试 | 组件 + 测试 | vitest 通过 |
| 2.3 | NotificationCenter 入库 + 测试 | 组件 + 测试 | vitest 通过 |
| 2.4 | CustomerManagement 入库 + 测试 | 组件 + 测试 | vitest 通过 |
| 2.5 | OKRManagement 入库 + 测试 | 组件 + 测试 | vitest 通过 |
| 2.6 | TaskManagement 入库 + 测试 | 组件 + 测试 | vitest 通过 |
| 2.7 | FinanceModule 入库 + 测试 | 组件 + 测试 | vitest 通过 |
| 2.8 | PermissionManagement 入库 + 测试 | 组件 + 测试 | vitest 通过 |
| 2.9 | DashboardRealtimeData 入库 + 测试 | 组件 + 测试 | vitest 通过 |
| 2.10 | GlobalSearch 入库 + 测试 | 组件 + 测试 | vitest 通过 |
| 2.11 | P0 全量构建 + 测试 | @yyc3/ui v3.0.0-alpha.1 | build + test 通过 |

### Phase 3：P1 组件入库（Week 5-6）

| 节点 | 任务 | 产出 | 验收标准 |
|------|------|------|----------|
| 3.1 | 系统监控组件（4个）入库 | SystemStatusMonitor 等 | vitest 通过 |
| 3.2 | 数据可视化组件（5个）入库 | DataAnalytics 等 | vitest 通过 |
| 3.3 | 企业管理增强（4个）入库 | Enhanced 版本 | vitest 通过 |
| 3.4 | 图表组件（3个）入库 | FinanceChart 等 | vitest 通过 |
| 3.5 | 平台组件（2个）入库 | ModuleCards 等 | vitest 通过 |
| 3.6 | P0+P1 全量构建 + 测试 | @yyc3/ui v3.0.0-beta.1 | build + test 通过 |

### Phase 4：P2 组件入库（Week 7-8）

| 节点 | 任务 | 产出 | 验收标准 |
|------|------|------|----------|
| 4.1 | 安全组件（2个）入库 | SecurityCenter 等 | vitest 通过 |
| 4.2 | 平台能力组件（5个）入库 | PWAManager 等 | vitest 通过 |
| 4.3 | 增强 UI 组件（5个）入库 | EnhancedButton 等 | vitest 通过 |
| 4.4 | 对话框组件（2个）入库 | ProfileDialog 等 | vitest 通过 |
| 4.5 | 企业管理补充（2个）入库 | OAApproval 等 | vitest 通过 |
| 4.6 | 全量构建 + 测试 + 发布 | @yyc3/ui v3.0.0 | npm 发布 |

### Phase 5：样板项目集成（Week 9-10）

| 节点 | 任务 | 产出 | 验收标准 |
|------|------|------|----------|
| 5.1 | 适配 T02 admin-dashboard 样板 | CLI 模板 | `yyc3 init` 可用 |
| 5.2 | 适配 T03 landing-page 样板 | CLI 模板 | `yyc3 init` 可用 |
| 5.3 | 适配 T09 data-dashboard 样板 | CLI 模板 | `yyc3 init` 可用 |
| 5.4 | 适配 T08 crm-system 样板 | CLI 模板 | `yyc3 init` 可用 |
| 5.5 | 适配 T14 saas-platform 样板 | CLI 模板 | `yyc3 init` 可用 |
| 5.6 | CLI `init` 命令实现 | CLI v1.2.0 | 功能完整 |
| 5.7 | CLI `theme` 命令实现 | CLI v1.2.0 | 功能完整 |

### Phase 6：主题系统统一（Week 11）

| 节点 | 任务 | 产出 | 验收标准 |
|------|------|------|----------|
| 6.1 | 迁移 UI-MONO 7 预设主题到 π³ | themes/ 扩展 | 28 主题 |
| 6.2 | 统一主题 CSS variables 格式 | oklch 标准 | 格式统一 |
| 6.3 | CLI `theme` 命令集成 | CLI v1.2.0 | 可切换 |

### Phase 7：文档与发布（Week 12）

| 节点 | 任务 | 产出 | 验收标准 |
|------|------|------|----------|
| 7.1 | 组件文档生成（TypeDoc） | docs/ | 文档完整 |
| 7.2 | 样板项目文档 | README × 20 | 文档完整 |
| 7.3 | CLI 使用文档 | GUIDE.md | 文档完整 |
| 7.4 | npm 发布 @yyc3/ui v3.0.0 | npm | 公开可用 |
| 7.5 | npm 发布 @yyc3/cli v1.2.0 | npm | 公开可用 |
| 7.6 | UI-MONO 切换消费 @yyc3/ui v3.0.0 | 验证 | 应用正常运行 |

---

## 八、执行清单

### 立即可执行的第一个迭代

```
□ Step 1: 创建 src/components/business/ 目录结构
□ Step 2: 适配入库 AIAssistant（P0 第一个组件）
□ Step 3: 编写 AIAssistant 测试
□ Step 4: 更新 tsup.config.ts 支持 /business 子路径
□ Step 5: 更新 package.json exports
□ Step 6: 构建验证（tsup + tsc + vitest）
□ Step 7: 适配入库 AdvancedBIDashboard
□ Step 8: 验证完整流程可行后批量推进
```

### 技术决策清单

| 决策项 | 推荐方案 | 备选 |
|--------|----------|------|
| 组件路径 | `src/components/business/{category}/` | `src/business/` |
| 导出方式 | 子路径 `@yyc3/ui/business` | 全量导出 |
| 样式方案 | CSS variables + Tailwind tokens | CSS-in-JS |
| 测试框架 | Vitest + Testing Library | Jest |
| 构建工具 | tsup（保持现有） | unbuild |
| 文档工具 | TypeDoc + VitePress | Storybook |
| CLI 注册 | JSON Registry | TypeScript Registry |

---

## 附录 A：UI-MONO 组件到 π³ 的路径映射规则

```
源路径 (UI-MONO)                          → 目标路径 (π³)
─────────────────────────────────────────────────────────────
packages/ui/ai-assistant.tsx              → src/components/business/ai/ai-assistant.tsx
packages/ui/customer-management.tsx       → src/components/business/enterprise/customer-management.tsx
packages/ui/advanced-bi-dashboard.tsx     → src/components/business/data/bi-dashboard.tsx
packages/ui/ui/enhanced-button.tsx        → src/components/ui/enhanced-button.tsx
packages/ui/ui/animated-logo.tsx          → src/components/ui/animated-logo.tsx
packages/ui/design-system.ts              → src/core/design-tokens.ts
packages/ui/use-mobile.tsx                → src/hooks/use-mobile.ts
packages/ui/use-toast.ts                  → src/hooks/use-toast.ts
packages/base/lib/ai-service.ts           → src/components/business/ai/ai-service.ts
packages/base/lib/ai-models.ts            → src/components/business/ai/ai-models.ts
```

## 附录 B：导入路径替换规则

```
源导入 (UI-MONO)                          → 目标导入 (π³)
─────────────────────────────────────────────────────────────
@/components/ui/button                    → @yyc3/ui/shadcn 或相对路径
@/lib/utils                               → @yyc3/core 或相对路径
@/lib/design-system                       → @yyc3/ui/core
@/lib/ai-service                          → ./ai-service (同目录)
@/hooks/use-mobile                        → @yyc3/ui/hooks 或相对路径
next-themes                               → 保持（peerDependency）
```

---

> **文档版本**: v1.0.0
> **最后更新**: 2026-06-20
> **维护者**: YanYuCloudCube Team
> **下次评审**: Phase 1 完成后
