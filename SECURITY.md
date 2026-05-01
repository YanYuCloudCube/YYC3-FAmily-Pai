---
file: SECURITY.md
description: YYC³ FAmily π³ 安全政策 — 漏洞披露/响应时间/安全最佳实践
author: YanYuCloudCube Team <admin@0379.email>
version: v1.1.0
created: 2026-03-21
updated: 2026-04-29
status: published
tags: [安全],[政策],[漏洞披露]
category: project
language: zh-CN
---

# 🔒 安全政策 (Security Policy)

> **YanYuCloudCube Team** 安全承诺

---

## 支持的版本

| 包 | 版本 | 支持状态 |
|---|---|---|
| @yyc3/core | >= 1.4.0 | ✅ 支持 |
| @yyc3/ai-hub | >= 1.4.0 | ✅ 支持 |
| @yyc3/emotion | >= 1.0.0 | ✅ 支持 |
| @yyc3/ui | >= 2.0.0 | ✅ 支持 |
| @yyc3/plugins | >= 1.4.0 | ✅ 支持 |
| @yyc3/i18n-core | >= 1.4.0 | ✅ 支持 |
| @yyc3/mcp-servers | >= 1.0.0 | ✅ 支持 |

---

## 报告安全漏洞

我们高度重视安全问题。如果你发现安全漏洞，请**不要**通过公开的 GitHub Issue 报告。

### 负责任披露流程

1. **发送邮件**至 [admin@0379.email](mailto:admin@0379.email?subject=Security%20Vulnerability%20Report)
2. **邮件主题**以 `Security Vulnerability Report` 开头
3. **包含以下信息**：
   - 漏洞描述
   - 影响范围（受影响的包和版本）
   - 复现步骤
   - 可能的修复方案（如有）
   - 你的联系方式

### 报告内容要求

- 使用英文或中文
- 尽可能详细描述漏洞
- 提供最小复现代码（如适用）
- 说明漏洞的潜在影响

---

## 响应时间

| 严重程度 | 响应时间 | 修复时间 |
|----------|----------|----------|
| **Critical** | 24 小时内 | 7 天内 |
| **High** | 48 小时内 | 14 天内 |
| **Medium** | 72 小时内 | 30 天内 |
| **Low** | 1 周内 | 下个版本周期 |

---

## 安全最佳实践

### 对使用者

- 始终使用最新版本
- 不要在代码中硬编码 API Key 或 Token
- 使用环境变量管理敏感配置
- 定期运行 `npm audit` 检查依赖安全

### 对贡献者

- 遵循安全编码规范
- 对用户输入进行验证和消毒
- 使用 Zod Schema 进行运行时类型检查
- 禁止引入已知有漏洞的依赖

### 安全特性（@yyc3/i18n-core）

| 特性 | 实现方式 | 用途 |
|------|----------|------|
| ReDoS 防护 | `safeRegexCompile()` | 防止正则表达式拒绝服务攻击 |
| 时序攻击防护 | `safeEqualSecret()` | 常量时间字符串比较 |
| 路径遍历防护 | `isPathInside()` | 防止目录遍历攻击 |
| 注入检测 | `isDangerousOperation()` | 检测危险操作模式 |
| 安全随机数 | `generateSecureToken()` | 密码学安全的随机数生成 |

---

## 披露政策

- 漏洞修复并发布后，我们会在 CHANGELOG 中记录
- 感谢报告者的贡献（如报告者同意）
- 遵循协调漏洞披露（CVD）原则

---

<div align="center">

**© 2025-2026 YanYuCloudCube Team. All Rights Reserved.**

</div>
