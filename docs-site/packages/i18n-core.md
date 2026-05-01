# @yyc3/i18n-core

> 国际化框架 — ICU / AI 翻译 / MCP / 10 语言 / 零依赖

## 概览

`@yyc3/i18n-core` 是生产级国际化框架，原生中文优化，支持 ICU 消息格式、AI 翻译、MCP 集成和 10 种语言，零外部依赖。

## 安装

```bash
pnpm add @yyc3/i18n-core
```

## 核心特性

| 特性 | 说明 |
|------|------|
| **ICU 消息格式** | 完整的 ICU MessageFormat 支持 |
| **AI 翻译** | 基于大语言模型的智能翻译 |
| **MCP 集成** | 通过 MCP 协议提供翻译服务 |
| **10 种语言** | zh-CN / en / ja / ko / fr / de / es / ar / pt / ru |
| **零依赖** | 无外部运行时依赖 |
| **安全特性** | ReDoS 防护 / 路径遍历防护 / 注入检测 |

## 快速开始

```typescript
import { createI18n } from '@yyc3/i18n-core';

const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en',
});

i18n.setMessages('zh-CN', {
  welcome: '欢迎来到 {name}',
  items: '{count, plural, =0 {无项目} =1 {1 个项目} other {# 个项目}}',
});

console.log(i18n.t('welcome', { name: 'YYC³' }));
```

## 测试覆盖

| 指标 | 值 |
|------|-----|
| 测试文件 | 28 |
| 测试用例 | 443 passed |

## 独立文档站

- 🌐 [i18.yyccube.com](https://i18.yyccube.com) — 独立 VitePress 文档站

## 相关链接

- [npm](https://www.npmjs.com/package/@yyc3/i18n-core)
- [GitHub](https://github.com/YanYuCloudCube/Family-PAI/tree/main/packages/i18n-core)
- [CHANGELOG](https://github.com/YanYuCloudCube/Family-PAI/blob/main/packages/i18n-core/CHANGELOG.md)
