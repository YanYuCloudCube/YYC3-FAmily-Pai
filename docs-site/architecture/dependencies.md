# 包依赖关系

## 依赖拓扑

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

## 依赖说明

| 包 | 直接依赖 | 被依赖 |
|----|---------|--------|
| `@yyc3/core` | 无（零依赖） | ai-hub, ui, ide |
| `@yyc3/ai-hub` | core | emotion, mcp-servers, ide |
| `@yyc3/emotion` | ai-hub | ide |
| `@yyc3/ui` | core, react | ide |
| `@yyc3/plugins` | 无 | ide |
| `@yyc3/i18n-core` | 无（零依赖） | ide |
| `@yyc3/mcp-servers` | ai-hub | — |
| `@yyc3/ide` | 全部上述包 | — |

## 层级关系

```
Layer 0 (基础层)   : core · i18n-core
Layer 1 (能力层)   : ai-hub · ui · plugins
Layer 2 (扩展层)   : emotion · mcp-servers
Layer 3 (应用层)   : ide
```

## 技术栈依赖

| 依赖 | 用途 | 使用包 |
|------|------|--------|
| TypeScript 5.3+ | 语言 | 全部 |
| Vitest | 测试 | 全部 |
| tsup | 构建 | core, ai-hub, ui, plugins, emotion |
| tsc | 构建 | i18n-core |
| React | UI | ui, ide |
| Zustand | 状态管理 | ide |
| EventEmitter3 | 事件系统 | core, ai-hub |
| Zod | Schema 验证 | core, ai-hub |
| idb | IndexedDB | ide |
