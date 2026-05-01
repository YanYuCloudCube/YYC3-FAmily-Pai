# @yyc3/core

> AI Family 核心引擎 — 认证 / MCP / 技能 / 智能体 / 多模态

## 概览

`@yyc3/core` 是 YYC³ AI Family 的核心引擎，提供统一的认证管理、MCP 协议实现、技能系统、智能体管理和多模态处理能力。

## 安装

```bash
pnpm add @yyc3/core
```

## 核心模块

| 模块 | 说明 |
|------|------|
| **UnifiedAuthManager** | 统一认证管理器，支持 OpenAI / Ollama / Anthropic |
| **MCPProtocol** | MCP 协议实现，支持 stdio / SSE 传输 |
| **SkillRegistry** | 技能注册与发现 |
| **AIFamilyManager** | AI Family 成员管理与任务编排 |
| **MultimodalProcessor** | 多模态输入处理 |

## 快速开始

```typescript
import { UnifiedAuthManager, AIFamilyManager } from '@yyc3/core';

const auth = new UnifiedAuthManager({ autoDetect: true });
await auth.autoDetect();

const family = new AIFamilyManager({ authManager: auth });
const result = await family.executeTask({
  role: 'meta-oracle',
  task: { description: '分析项目架构', priority: 'high' },
});
```

## 测试覆盖

| 指标 | 值 |
|------|-----|
| 测试文件 | 10 |
| 测试用例 | 207 passed |
| 覆盖率阈值 | Statements ≥ 80%, Branches ≥ 70% |

## 相关链接

- [npm](https://www.npmjs.com/package/@yyc3/core)
- [GitHub](https://github.com/YanYuCloudCube/Family-PAI/tree/main/packages/core)
- [CHANGELOG](https://github.com/YanYuCloudCube/Family-PAI/blob/main/packages/core/CHANGELOG.md)
