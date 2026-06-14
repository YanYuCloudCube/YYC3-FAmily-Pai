---
file: CHANGELOG.md
description: "@yyc3/mcp-servers 版本变更记录"
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-27
updated: 2026-05-19
status: active
tags: [changelog],[versioning]
category: package
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-05-22

### Added

- IDE 适配层 — `serverDefinitionToIDE()`, `createMCPServerConfig()`, `getAllIDEEndpoints()`, `getIDEEndpointById()`, `buildMCPToolsManifest()`
- BraveSearch 具体实现 — `BraveSearchServer` 类, web search + local search, API Key 注入
- Filesystem 具体实现 — `FilesystemServer` 类, read/write/list/search, 路径安全校验, Resources 支持
- HTTP Transport — `StreamableHTTPTransport` 类, CORS, Bearer Auth, JSON-RPC 2.0 over HTTP
- CLI 工具 — `runWithCLI()`, `parseCLIMode()`, stdio/http 双模式, --port/--host/--api-key/--no-cors
- `MCPServerBase.handleRemoteRequest()` — public 方法供 Transport 调用
- 41 个新增测试 — BraveSearch(10), Filesystem(12), IDE Adapter(9), CLI(8), 全部通过
- 8 个新文件 — adapter/ide.ts, implementations/*.ts, transport/http.ts, cli/index.ts

### Changed

- `dispatchMethod` 从 private 改为 protected (Transport 可访问)
- 零运行时依赖保持

## [2.0.0] - 2026-05-22

### Added

- MCP Resources 协议 — `resources/list`, `resources/read`, `resources/subscribe/unsubscribe`
- MCP Prompts 协议 — `prompts/list`, `prompts/get`
- MCP Notifications — 7 种通知类型 (`notifications/cancelled`, `notifications/progress` 等)
- 生命周期钩子 — `onConnect()`, `onDisconnect()`, `onError()`, `onNotification()` (链式调用)
- `sendNotification()` 方法 — 服务端主动推送通知
- 异步 `dispatchMethod()` — 消除 `tools/call` 的 `_pending` 伪响应
- Dynamic Capabilities — 自动检测 Resources/Prompts 能力声明
- Registry 拆分 — 7 Server 定义从 398 行单文件拆分为独立模块
- 13 个新增类型导出 — `MCPResource`, `MCPPrompt`, `MCPNotification` 等
- `logging/setLevel`, `completion/complete` 协议方法
- 17 个新增测试 — 协议扩展 + 生命周期 + 默认实现 (36→53)
- 100% 覆盖率保持

### Changed

- `MCPServerBase.handleRequest` → `handleRequestAsync` (异步)
- `MCPServerBase.start()` 触发 `onConnect` 钩子
- `MCPServerBase.stop()` 触发 `onDisconnect` 钩子
- `getCapabilities()` 自动检测 Resources/Prompts
- `MCPServerHandler` 接口新增可选方法 `getResources`, `readResource`, `getPrompts`, `getPrompt`

## [1.0.0] - 2026-04-27

### Added

- 7 个即插即用 MCP Server 定义 (Brave Search / GitHub / Filesystem / Docker / PostgreSQL / Claude Prompts / YYC³ 中文助手)
- `MCPServerBase` 抽象基类 — JSON-RPC 2.0 stdio transport
- Server Registry — 按ID/分类/工具名查询
- TypeScript 类型定义 — MCPTool / MCPServerConfig / MCPServerDefinition 等
- 20 个单元测试 (Registry + Server Base)
- 零运行时依赖

---

[3.0.0]: https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/releases/tag/v3.0.0
[2.0.0]: https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/releases/tag/v2.0.0
[1.0.0]: https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/releases/tag/v1.0.0
