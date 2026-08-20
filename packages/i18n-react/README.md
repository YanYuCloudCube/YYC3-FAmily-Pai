# @yyc3/i18n-react

> React 绑定 for [@yyc3/i18n-core](https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/tree/main/packages/i18n-core) — 零样板 i18n React Hook + `<Trans>` 组件 + Next.js 中间件

[![npm](https://img.shields.io/npm/v/@yyc3/i18n-react?style=flat-square)](https://www.npmjs.com/package/@yyc3/i18n-react)
[![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)

## 安装

```bash
pnpm add @yyc3/i18n-react @yyc3/i18n-core react react-dom
```

## 快速开始

### 1. 用 `I18nProvider` 包裹应用

```tsx
import { I18nProvider } from '@yyc3/i18n-react'
import { I18nEngine } from '@yyc3/i18n-core'

const engine = new I18nEngine({ locale: 'en', fallbackLocale: 'en' })

function App() {
  return (
    <I18nProvider engine={engine}>
      <MyComponent />
    </I18nProvider>
  )
}
```

### 2. 使用 `useTranslation` Hook

```tsx
import { useTranslation } from '@yyc3/i18n-react'

function MyComponent() {
  const { t, locale, setLocale } = useTranslation()

  return (
    <div>
      <h1>{t('welcome.message', { name: 'YYC³' })}</h1>
      <button onClick={() => setLocale('zh-CN')}>中文</button>
      <button onClick={() => setLocale('en')}>English</button>
    </div>
  )
}
```

### 3. 使用 `<Trans>` 组件（JSX 插值）

```tsx
import { Trans } from '@yyc3/i18n-react'

// ICU: "Read the <link>documentation</link> for v{version}"
function DocsLink() {
  return (
    <Trans
      id="docs.read"
      values={{ version: '2.0' }}
      components={{ link: <a href="/docs" /> }}
    />
  )
}
```

## Next.js App Router

### middleware.ts

```ts
import { createI18nMiddleware } from '@yyc3/i18n-react/next'

export const middleware = createI18nMiddleware({
  defaultLocale: 'en',
})

export const config = {
  matcher: ['/((?!api|_next|favicon).*)'],
}
```

### app/[locale]/layout.tsx

```tsx
import { createServerEngine } from '@yyc3/i18n-react/next'
import { I18nProvider } from '@yyc3/i18n-react'

export default async function Layout({ children, params }) {
  const engine = await createServerEngine(params.locale)
  return <I18nProvider engine={engine}>{children}</I18nProvider>
}
```

## API 参考

| 导出 | 类型 | 说明 |
|------|------|------|
| `I18nProvider` | Component | Context Provider — 包裹应用根组件 |
| `useTranslation()` | Hook | 返回 `{ t, locale, setLocale, ready, engine }` |
| `<Trans>` | Component | ICU 翻译 + JSX 插值 |
| `createI18nMiddleware()` | Factory | Next.js 路由中间件（语言检测） |
| `createServerEngine()` | Factory | Next.js Server Component 引擎工厂 |
| `detectLocaleFromHeader()` | Utility | 从 Accept-Language 头解析语言 |

## `useTranslation()` 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `t` | `(key, params?) => string` | 翻译函数，支持 ICU 参数 |
| `locale` | `Locale` | 当前语言 |
| `setLocale` | `(locale) => Promise<void>` | 切换语言 |
| `ready` | `boolean` | 引擎是否就绪 |
| `engine` | `I18nEngine` | 底层引擎实例 |

## `<Trans>` Props

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | ✅ | 翻译键 |
| `values` | `Record<string, string \| number>` | ❌ | ICU 参数 |
| `components` | `Record<string, ReactNode>` | ❌ | JSX 插值组件 |
| `fallback` | `string` | ❌ | 缺失键时的回退文本 |

## 语言检测优先级

中间件按以下顺序检测语言：

1. **URL 前缀** — `/zh-CN/about`
2. **Cookie** — `yyc3-locale`
3. **Accept-Language 头** — 浏览器偏好（支持 q-value）
4. **默认语言** — 配置的 `defaultLocale`

## 支持的语言

10 种：`en` / `zh-CN` / `zh-TW` / `ja` / `ko` / `fr` / `de` / `es` / `pt-BR` / `ar`

## 技术栈

- TypeScript 5.5+ (ESM)
- React 18+ / 19+
- tsup (esbuild) 构建
- Vitest + @testing-library/react 测试

## License

MIT © [YanYuCloudCube Team](mailto:admin@0379.email)
