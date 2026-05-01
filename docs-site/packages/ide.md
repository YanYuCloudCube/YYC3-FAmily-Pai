# @yyc3/ide

> IDE 智能开发环境 — AI 管道 / 协作面板 / 60+ 组件

## 概览

`@yyc3/ide` 是基于 Tauri + React 的智能开发环境，提供 AI 管道、实时协作、Monaco Editor 集成和 60+ 个功能组件。

## 状态

> 🔒 **内部开发包** — 当前为 private，不对外发布。

## 核心功能

| 模块 | 说明 |
|------|------|
| **AI Pipeline** | AI 任务管道，连接八位家人 |
| **Monaco Editor** | 深度集成的代码编辑器 |
| **Collab Service** | 实时协作服务 |
| **Plugin System** | 插件系统，动态加载扩展 |
| **Settings Bridge** | 设置管理，支持 Tauri 原生 |
| **Storage** | IndexedDB + 优化的持久化存储 |
| **Logger** | 统一日志系统（生产级静默） |

## 架构亮点

- **统一日志系统**：所有模块使用 `createLogger()` 替代 `console.*`，生产环境自动静默
- **Tauri 类型安全**：完整的 `tauri.d.ts` 类型声明，消除 `as any`
- **YYC3Error**：结构化错误码，中英双语

## 相关链接

- [GitHub](https://github.com/YanYuCloudCube/Family-PAI/tree/main/packages/ide)
