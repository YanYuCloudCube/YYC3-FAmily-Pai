# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-15

### Added

- 初始版本 — 从独立仓库 `YYC3-i18n-Core` 移植至 monorepo
- `I18nProvider` — Context Provider，注入 `I18nEngine` 并监听语言变更
- `useTranslation()` Hook — 返回 `{ t, locale, setLocale, ready, engine }`
- `<Trans>` 组件 — 声明式 ICU 翻译 + JSX 插值
- `createI18nMiddleware()` — Next.js App Router 路由中间件
- `createServerEngine()` — Next.js Server Component 引擎工厂
- `detectLocaleFromHeader()` — Accept-Language 头解析工具函数
- 24 个单元测试（Provider、Hook、Trans、中间件）
- TypeScript strict mode + JSDoc 标头规范
