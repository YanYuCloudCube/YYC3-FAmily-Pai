/**
 * file next.ts
 * description Next.js App Router 集成 — 中间件 + 服务端助手
 * module @yyc3/i18n-react
 * author YanYuCloudCube Team <admin@0379.email>
 * version 0.1.0
 * created 2026-07-15
 * updated 2026-07-15
 * status active
 * tags [ui],[react],[i18n],[nextjs]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 自动语言检测路由中间件 + Server Component 引擎工厂
 */

import type { Locale } from '@yyc3/i18n-core'

export const DEFAULT_LOCALES: Locale[] = [
  'en',
  'zh-CN',
  'zh-TW',
  'ja',
  'ko',
  'fr',
  'de',
  'es',
  'pt-BR',
  'ar',
]

export interface I18nMiddlewareConfig {
  locales?: Locale[]
  defaultLocale?: Locale
  strategy?: 'prefix' | 'cookie'
}

export interface I18nMiddlewareRequest {
  nextUrl: { pathname: string }
  cookies: { get: (name: string) => { value: string } | undefined }
  headers: { get: (name: string) => string | null }
}

export interface I18nMiddlewareResult {
  locale: Locale
  shouldRedirect: boolean
  redirectUrl?: string
}

export function createI18nMiddleware(config: I18nMiddlewareConfig = {}) {
  const locales = config.locales ?? DEFAULT_LOCALES
  const defaultLocale = config.defaultLocale ?? 'en'

  return function i18nMiddleware(request: I18nMiddlewareRequest): I18nMiddlewareResult {
    const pathname = request.nextUrl.pathname
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0]

    if (firstSegment && locales.includes(firstSegment as Locale)) {
      return { locale: firstSegment as Locale, shouldRedirect: false }
    }

    const cookieLocale = request.cookies.get('yyc3-locale')?.value
    if (cookieLocale && locales.includes(cookieLocale as Locale)) {
      return { locale: cookieLocale as Locale, shouldRedirect: false }
    }

    const acceptLang = request.headers.get('accept-language')
    if (acceptLang) {
      const detected = detectLocaleFromHeader(acceptLang, locales)
      if (detected) {
        return { locale: detected, shouldRedirect: false }
      }
    }

    return { locale: defaultLocale, shouldRedirect: false }
  }
}

export function detectLocaleFromHeader(
  header: string,
  supported: Locale[],
): Locale | null {
  if (!header || !header.trim()) return null

  const parsed = header
    .split(',')
    .map((part) => {
      const [lang, q = 'q=1'] = part.trim().split(';')
      const quality = parseFloat(q.split('=')[1] ?? '1')
      return { lang: lang.trim(), quality }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { lang } of parsed) {
    if (supported.includes(lang as Locale)) {
      return lang as Locale
    }
    const base = lang.split('-')[0]
    const match = supported.find((l) => l.startsWith(base))
    if (match) return match
  }

  return null
}

export async function createServerEngine(locale: Locale) {
  const { I18nEngine } = await import('@yyc3/i18n-core')
  const engine = new I18nEngine({ locale, fallbackLocale: 'en' })
  await engine.setLocale(locale)
  return engine
}
