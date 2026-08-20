---
file: MAINTENANCE.md
description: "@yyc3/i18n-react 维护指南"
author: YanYuCloudCube Team <admin@0379.email>
version: v0.1.0
created: 2026-07-15
updated: 2026-07-15
status: active
tags: [maintenance],[guide]
category: package
---

# @yyc3/i18n-react 维护指南

## 发布流程

```bash
# 1. 更新版本号
pnpm version patch|minor|major

# 2. 运行完整验证
pnpm prepublishOnly  # clean + build + test + typecheck

# 3. 发布
pnpm publish --access public
```

## 故障排查

### Provider 上下文丢失

**症状**: `useTranslation must be used within an <I18nProvider>`

**原因**: 组件在 `I18nProvider` 外部调用了 `useTranslation()`

**解决**: 确保所有使用 `useTranslation` 的组件都在 `<I18nProvider>` 内部渲染。

### 语言切换不生效

**症状**: `setLocale` 调用后 UI 未更新

**排查**:
1. 确认 `engine.setLocale()` 返回的 Promise 已 resolve
2. 检查是否有多个 `I18nEngine` 实例（Provider 传入的实例与实际使用的不一致）
3. 确认翻译文件已通过 `engine.registerTranslation()` 注册

### `<Trans>` 组件不插值

**排查**:
1. ICU 模板中的标签名与 `components` prop 的 key 完全匹配
2. 标签格式：`<tagName>内容</tagName>` 或自闭合 `<tagName/>`
3. `components` 中的值必须是有效的 React 元素

## 测试

```bash
pnpm test              # 运行测试
pnpm test:coverage     # 覆盖率报告
```

覆盖率门槛：statements/lines ≥ 80%，branches/functions ≥ 75%。

## 构建

```bash
pnpm build    # 产出 dist/index.js + dist/next.js
pnpm dev      # watch 模式
```

外部依赖（不打包）：`react`、`react-dom`、`@yyc3/i18n-core`、`next`
