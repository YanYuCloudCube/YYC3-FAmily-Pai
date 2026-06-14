---
file: README.md
description: "@yyc3/ide — YYC³ AI Family 智能设计开发环境"
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-03-06
updated: 2026-05-22
status: active
tags: [ide, ai, editor, monaco, mcp, collab, plugins, zustand]
category: package
---

# 💻 @yyc3/ide

<p align="center">
  <strong>YYC³ AI Family 智能设计开发环境</strong><br/>
  <em>AI 管道 · Monaco 编辑器 · MCP 协议 · 协作系统 · 插件生态 · 面板管理</em>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"/></a>
  <a href="https://github.com/YanYuCloudCube/YYC3-FAmily-Pai"><img src="https://img.shields.io/badge/GitHub-YYC3--FAmily--Pai-black?style=flat-square&logo=github" alt="GitHub"/></a>
  <img src="https://img.shields.io/badge/private-true-orange?style=flat-square" alt="Private Package"/>
</p>

---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***

---

## 目录

- [✨ 核心特性](#-核心特性)
- [📦 依赖](#-依赖)
- [🏗️ 架构设计](#-架构设计)
- [🔌 模块详解](#-模块详解)
- [🧩 内置插件](#-内置插件)
- [📊 状态管理](#-状态管理)
- [🪝 React Hooks](#-react-hooks)
- [🧪 测试](#-测试)
- [📄 维护指南](#-维护指南)
- [📜 License](#-license)

---

## ✨ 核心特性

### 🤖 AI 服务层
- **LLM 多Provider** — Ollama / OpenAI / 智谱GLM / 通义千问 / DeepSeek / 自定义
- **AI Pipeline** — ContextCollector → SystemPromptBuilder → LLM → CodeApplicator 端到端流水线
- **代码智能** — 错误分析 / 安全扫描 / 测试生成 / 性能优化建议
- **Agent 编排** — AIAgentWorkflow 多Agent任务编排

### ✏️ 编辑器集成
- **Monaco Editor** — 深海军蓝/赛博朋克双主题、滚动同步、智能提示
- **Sandpack** — 在线代码沙箱预览
- **实时预览** — PreviewEngine 多设备预览引擎
- **Diff 预览** — 代码变更可视化对比

### 🔌 MCP 协议
- **MCP Client** — 标准 Model Context Protocol 客户端
- **MCP Tools** — 工具注册与调用
- **MCP Resources** — 资源管理
- **MCP Prompts** — Prompt 注册与复用

### 👥 协作功能
- **CollabService** — 基于 Yjs 的实时协作
- **CloudSyncService** — 云端同步
- **SnapshotService** — 版本快照与差异对比
- **VersioningService** — 文件版本管理

### 🧩 插件系统
- **PluginSystem** — 注册 / 生命周期 / 沙箱隔离 / 事件通信
- **7 个内置插件** — AI助手 / 代码统计 / 快速修复 / 主题切换 / Git统计 / 代码片段 / 文件浏览器增强

### 📐 面板系统
- **LeftPanel** — 聊天面板 / 模型选择 / 连接状态
- **CenterPanel** — Monaco 编辑器 / 预览
- **RightPanel** — AI 辅助 / 设置
- **BottomNav** — 终端 / 问题 / 输出
- **FloatingPanel** — 可拖拽浮动面板容器

### 🌉 平台桥接
- **TauriBridge** — Tauri 原生API桥接 (Web环境自动降级)
- **IndexedDBAdapter** — 本地持久化存储
- **ProjectExporter** — 项目导出

---

## 📦 依赖

### 运行时依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| react | ^19.2.5 | UI 框架 |
| react-dom | ^19.2.5 | DOM 渲染 |
| zustand | ^5.0.12 | 状态管理 |
| yjs | ^13.6.30 | 实时协作 CRDT |
| lucide-react | ^1.12.0 | 图标库 |
| idb | ^8.0.3 | IndexedDB 封装 |

---

## 🏗️ 架构设计

```
@yyc3/ide
├── ai/                    # AI 管道 (10 files)
│   ├── AIPipeline         # 端到端代码生成流水线
│   ├── CodeApplicator     # 代码应用与Diff生成
│   ├── CommandRegistry    # 命令注册
│   ├── ContextCollector   # 上下文收集与压缩
│   ├── ErrorAnalyzer      # 错误分析
│   ├── PerformanceOptimizer # 性能优化建议
│   ├── SecurityScanner    # 安全扫描
│   ├── SystemPromptBuilder # 系统Prompt构建
│   ├── TaskInferenceEngine # 任务推理引擎
│   └── TestGenerator      # 测试代码生成
├── adapters/              # 适配器层 (4 files)
│   ├── IndexedDBAdapter   # IndexedDB 持久化
│   ├── IndexedDBAdapter.optimized # 优化版
│   ├── ProjectExporter    # 项目导出
│   └── TauriBridge        # Tauri/Web 平台桥接
├── services/              # 服务层 (15 files)
│   ├── AIAgentWorkflow    # Agent 工作流编排
│   ├── CloudSyncService   # 云端同步
│   ├── DataExporter/Importer # 数据导入导出
│   ├── ErrorReportingService # 错误上报
│   ├── MCPClient          # MCP 协议客户端
│   ├── MCPPrompts         # Prompt 注册管理
│   ├── MCPResources       # 资源管理
│   ├── MCPTools           # 工具调用
│   ├── NLCommandService   # 自然语言命令
│   ├── RetryCircuitBreaker # 重试+熔断器
│   ├── SentryService      # Sentry 集成
│   ├── SnapshotService    # 快照服务
│   ├── StorageCleanup     # 存储清理
│   ├── StorageMonitor     # 存储监控
│   └── VersioningService  # 版本管理
├── stores/                # Zustand 状态 (12+ stores)
├── hooks/                 # React Hooks (11 hooks)
├── plugins/               # 内置插件 (7 plugins)
└── [面板组件]             # UI 面板 (20+ 组件)
```

---

## 🔌 模块详解

### AI 管道 (ai/)

端到端代码生成流水线：

```
用户输入 → ContextCollector → SystemPromptBuilder → LLMService → CodeApplicator → 文件更新
```

- **ContextCollector** — 收集文件内容、Git状态、打开标签页等上下文
- **SystemPromptBuilder** — 意图检测 + 系统Prompt构建
- **LLMService** — 多Provider SSE 流式调用 + 熔断重试
- **CodeApplicator** — 代码块解析 / Diff生成 / 文件写入

### MCP 协议 (services/)

标准 Model Context Protocol 实现：

- **MCPClient** — 服务器连接 / 工具调用 / 资源管理 / Prompt 注册
- **MCPTools** — 工具发现与执行
- **MCPResources** — 资源注册与获取
- **MCPPrompts** — Prompt 模板管理

### 协作系统 (services/)

- **CollabService** — Yjs CRDT 实时协作编辑
- **CloudSyncService** — 云端数据同步
- **SnapshotService** — 版本快照与 Diff 对比
- **VersioningService** — 文件级版本管理

---

## 🧩 内置插件

| 插件 | 文件 | 功能 |
|------|------|------|
| AI 助手 | `AIAssistantPlugin.ts` | AI 对话 / 代码解释 / 优化 / 测试生成 |
| 代码统计 | `CodeStatsPlugin.ts` | 行数 / 函数数 / 代码密度统计 |
| 快速修复 | `QuickFixPlugin.ts` | console.log / debugger / TODO 检测修复 |
| 主题切换 | `ThemeSwitcherPlugin.ts` | 5种预设主题快速切换 |
| Git 统计 | `GitStatsPlugin.ts` | Git 提交统计可视化 |
| 代码片段 | `CodeSnippetsPlugin.ts` | 代码片段管理 |
| 文件浏览器增强 | `FileExplorerPlusPlugin.ts` | 书签 / 最近文件 / 快速搜索 |

---

## 📊 状态管理

Zustand Stores 统一管理所有应用状态：

| Store | 文件 | 职责 |
|-------|------|------|
| useFileStoreZustand | `useFileStoreZustand.ts` | 文件内容 / 打开标签 / Git状态 |
| useModelStoreZustand | `useModelStoreZustand.ts` | AI模型选择 / 连接状态 / 心跳 |
| useProxyStoreZustand | `useProxyStoreZustand.ts` | 代理配置 |
| useAIFixStore | `useAIFixStore.ts` | AI 修复记录 |
| usePreviewStore | `usePreviewStore.ts` | 预览模式 / 设备 / 快照 |
| useScrollSyncStore | `useScrollSyncStore.ts` | 编辑器-预览滚动同步 |
| usePanelTabGroupStore | `usePanelTabGroupStore.ts` | 面板标签组管理 |
| usePanelPinStore | `usePanelPinStore.ts` | 面板钉住状态 |
| useFloatingPanelStore | `useFloatingPanelStore.ts` | 浮动面板配置 |
| usePreviewHistoryStore | `usePreviewHistoryStore.ts` | 预览历史快照 |
| useSettingsStore | `useSettingsStore.ts` | 全局设置 / Agent / MCP配置 |
| useQuickActionsStore | `useQuickActionsStore.ts` | 快速操作 / 剪贴板历史 |
| useTaskBoardStore | `useTaskBoardStore.ts` | 任务看板 (Kanban) |
| useWindowStore | `useWindowStore.ts` | 多窗口管理 |
| useWorkspaceStore | `useWorkspaceStore.ts` | 工作空间管理 |
| useSessionStore | `useSessionStore.ts` | 会话管理 |
| useIPCStore | `useIPCStore.ts` | 进程间通信 |

---

## 🪝 React Hooks

| Hook | 文件 | 功能 |
|------|------|------|
| usePerformanceMonitor | `usePerformanceMonitor.ts` | Web Vitals 性能采集 |
| useThemeTokens | `useThemeTokens.ts` | 主题 Token 管理 |
| useSentry | `useSentry.ts` | Sentry 错误监控 |
| usePWA | `usePWA.ts` | PWA 安装与更新 |
| useSettingsSync | `useSettingsSync.ts` | 设置跨实例同步 |
| useChatSessionSync | `useChatSessionSync.ts` | 聊天会话同步 |
| useMultiInstanceSync | `useMultiInstanceSync.ts` | 多实例数据同步 |
| useErrorDiagnostics | `useErrorDiagnostics.ts` | 错误诊断面板 |
| useKeyboardNavigation | `useKeyboardNavigation.ts` | 键盘导航 |
| useTouchGestures | `useTouchGestures.ts` | 触控手势 |
| useWorkspaceFileSync | `useWorkspaceFileSync.ts` | 工作空间文件同步 |

---

## 🧪 测试

```bash
# 运行测试
pnpm test

# 监听模式
pnpm test:watch

# 覆盖率
pnpm test:coverage

# 代码检查
pnpm lint
```

### 测试统计

| 指标 | 数量 |
|------|------|
| 测试文件 | 39 |
| 测试用例 | 535 |
| Hooks | 11 |
| Services | 16 |
| Stores | 18+ |
| Plugins | 7 |

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
