---
file: CONTRIBUTING.md
description: YYC³ FAmily π³ 贡献指南 — 代码规范/提交规范/PR流程
author: YanYuCloudCube Team <admin@0379.email>
version: v1.1.0
created: 2026-03-21
updated: 2026-04-29
status: published
tags: [贡献],[规范],[开发],[代码标准]
category: project
language: zh-CN
---

# 🤝 YYC³ FAmily π³ 贡献指南

感谢你对 YYC³ AI Family 项目的关注！本文档描述了如何为项目做出贡献。

---

## 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [Issue 报告](#issue-报告)

---

## 行为准则

- 尊重所有贡献者
- 建设性的讨论和反馈
- 遵循 MIT 开源精神

---

## 如何贡献

### 报告 Bug

1. 在 [GitHub Issues](https://github.com/YanYuCloudCube/Family-PAI/issues) 搜索是否已有相同问题
2. 如无，创建新 Issue，包含：
   - 清晰的标题和描述
   - 复现步骤
   - 期望行为 vs 实际行为
   - 环境信息（Node.js 版本、操作系统等）

### 提交功能请求

1. 在 Issues 中描述你的需求
2. 说明使用场景和预期收益
3. 等待维护者反馈后再开始开发

### 提交代码

1. Fork 仓库
2. 创建功能分支
3. 编写代码和测试
4. 提交 Pull Request

---

## 开发环境设置

### 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### 安装步骤

```bash
git clone https://github.com/YanYuCloudCube/Family-PAI.git
cd Family-PAI
pnpm install
```

### 开发命令

```bash
pnpm -r build          # 构建所有包
pnpm -r test           # 测试所有包
pnpm -r typecheck      # 类型检查所有包
pnpm -r lint           # Lint 检查所有包
pnpm -C packages/core dev  # 开发单个包（监听模式）
```

---

## 代码规范

### TypeScript

- 启用 `strict` 模式
- 禁止使用 `any`（除非 `@ts-expect-error` 注释说明原因）
- 公共 API 必须有完整的类型定义和 JSDoc 注释
- 使用统一日志系统 (`createLogger`)，禁止直接调用 `console.log/warn/error`

### 命名约定

| 类型 | 风格 | 示例 |
|------|------|------|
| 包名 | kebab-case | `@yyc3/ai-hub` |
| 文件名 | kebab-case | `task-manager.ts` |
| 类/接口 | PascalCase | `AIFamilyManager` |
| 函数/方法 | camelCase | `executeTask()` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |

### 代码标头

所有源码文件必须包含统一 JSDoc 标头：

```typescript
/**
 * file {文件名}
 * description {一句话描述}
 * module {@yyc3/xxx}
 * author YanYuCloudCube Team <admin@0379.email>
 * version {x.y.z}
 * created {YYYY-MM-DD}
 * updated {YYYY-MM-DD}
 * status active
 * tags [标签1],[标签2]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief {简要说明}
 */
```

### 文件大小

- 单文件不超过 500 行（不含注释和空行）
- 超过时拆分为多个模块

---

## 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(core): add streaming support` |
| `fix` | Bug 修复 | `fix(auth): correct token refresh logic` |
| `docs` | 文档更新 | `docs(readme): update installation guide` |
| `style` | 代码格式 | `style: fix indentation` |
| `refactor` | 重构 | `refactor(mcp): simplify transport layer` |
| `perf` | 性能优化 | `perf(cache): reduce memory footprint` |
| `test` | 测试相关 | `test(skills): add edge case tests` |
| `chore` | 构建/工具 | `chore: upgrade TypeScript to 5.4` |

### Scope 范围

| Scope | 对应包 |
|-------|--------|
| `core` | @yyc3/core |
| `ai-hub` | @yyc3/ai-hub |
| `emotion` | @yyc3/emotion |
| `ui` | @yyc3/ui |
| `plugins` | @yyc3/plugins |
| `i18n` | @yyc3/i18n-core |
| `mcp-servers` | @yyc3/mcp-servers |
| `ide` | @yyc3/ide |
| `root` | 根配置 |

---

## Pull Request 流程

### 提交前检查

- [ ] 所有测试通过 (`pnpm -r test`)
- [ ] 类型检查通过 (`pnpm -r typecheck`)
- [ ] Lint 检查通过 (`pnpm -r lint`)
- [ ] 构建成功 (`pnpm -r build`)
- [ ] CHANGELOG.md 已更新（如适用）
- [ ] 新功能有对应的测试用例
- [ ] 公共 API 有 JSDoc 注释

### PR 标题格式

```
<type>(<scope>): <description>
```

示例：`feat(ui): add AgentStatus component`

### PR 描述模板

```markdown
## 变更摘要
简要描述本次变更的内容和目的。

## 变更类型
- [ ] feat: 新功能
- [ ] fix: Bug 修复
- [ ] docs: 文档更新
- [ ] refactor: 重构
- [ ] perf: 性能优化
- [ ] test: 测试
- [ ] chore: 构建/工具

## 测试
描述如何测试本次变更。

## 检查清单
- [ ] 测试通过
- [ ] 类型检查通过
- [ ] Lint 通过
- [ ] 文档已更新
```

### 审查流程

1. 自动化检查（CI）必须通过
2. 至少一位维护者审查
3. 解决所有审查意见
4. 维护者合并

---

## Issue 报告

### Bug 报告模板

```markdown
**描述**: 清晰描述问题

**复现步骤**:
1. ...
2. ...

**期望行为**: ...

**实际行为**: ...

**环境**:
- OS:
- Node.js:
- 包版本:
```

### Feature Request 模板

```markdown
**需求描述**: ...

**使用场景**: ...

**建议方案**: ...

**替代方案**: ...
```

---

## 包文档标准

每个包必须包含以下 5 类文档（闭环五件套）：

| 文件 | 用途 | 格式 |
|------|------|------|
| `README.md` | 使用指导 | Markdown |
| `CHANGELOG.md` | 版本变更记录 | Keep a Changelog |
| `MAINTENANCE.md` | 维护指南 | Markdown |
| `LICENSE` | 开源许可证 | MIT |
| `COMPLIANCE.md` | 合规达标报告 | YAML front matter + 表格 |

---

<div align="center">

**感谢你的贡献！**

**© 2025-2026 YanYuCloudCube Team. All Rights Reserved.**

</div>
