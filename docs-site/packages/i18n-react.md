# @yyc3/i18n-react

> React 绑定 — useTranslation Hook / `<Trans>` 组件 / Next.js 中间件

## 概览

`@yyc3/i18n-react` 为 `@yyc3/i18n-core` 提供零样板 React 绑定。通过 Context Provider 注入引擎，`useTranslation` Hook 提供翻译函数，`<Trans>` 组件支持 JSX 插值。内置 Next.js App Router 中间件。

## 安装

```bash
pnpm add @yyc3/i18n-react @yyc3/i18n-core react react-dom
```

## 快速开始

### 1. 用 I18nProvider 包裹应用

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

### 2. 使用 Hook

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

## API

| 导出 | 类型 | 说明 |
|------|------|------|
| `I18nProvider` | Component | Context Provider — 包裹应用根组件 |
| `useTranslation()` | Hook | 返回 `{ t, locale, setLocale, ready, engine }` |
| `<Trans>` | Component | ICU 翻译 + JSX 插值 |
| `createI18nMiddleware()` | Factory | Next.js 路由中间件（语言检测） |
| `createServerEngine()` | Factory | Next.js Server Component 引擎工厂 |
| `detectLocaleFromHeader()` | Utility | 从 Accept-Language 头解析语言 |

## 语言检测优先级

中间件按以下顺序检测语言：

1. **URL 前缀** — `/zh-CN/about`
2. **Cookie** — `yyc3-locale`
3. **Accept-Language 头** — 浏览器偏好
4. **默认语言** — 配置的 `defaultLocale`

## License

MIT © YanYuCloudCube Team
