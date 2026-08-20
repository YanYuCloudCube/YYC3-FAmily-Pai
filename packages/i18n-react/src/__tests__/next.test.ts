/**
 * file next.test.ts
 * description Next.js 中间件 + 服务端助手单元测试
 * module @yyc3/i18n-react
 * author YanYuCloudCube Team <admin@0379.email>
 * version 0.1.0
 * created 2026-07-15
 * updated 2026-07-15
 * status active
 * tags [test],[unit],[nextjs]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 测试 createI18nMiddleware 语言检测 + detectLocaleFromHeader
 */

import { describe, it, expect } from 'vitest'
import {
  createI18nMiddleware,
  detectLocaleFromHeader,
  DEFAULT_LOCALES,
} from '../next.js'
import type { I18nMiddlewareRequest } from '../next.js'

function mockRequest(
  pathname: string,
  cookie?: string,
  acceptLang?: string,
): I18nMiddlewareRequest {
  return {
    nextUrl: { pathname },
    cookies: {
      get: (name: string) =>
        name === 'yyc3-locale' && cookie ? { value: cookie } : undefined,
    },
    headers: {
      get: (name: string) =>
        name === 'accept-language' && acceptLang ? acceptLang : null,
    },
  }
}

describe('createI18nMiddleware', () => {
  const middleware = createI18nMiddleware({ defaultLocale: 'en' })

  it('should detect locale from URL prefix', () => {
    const result = middleware(mockRequest('/zh-CN/about'))
    expect(result.locale).toBe('zh-CN')
    expect(result.shouldRedirect).toBe(false)
  })

  it('should detect locale from cookie', () => {
    const result = middleware(mockRequest('/about', 'ja'))
    expect(result.locale).toBe('ja')
  })

  it('should detect locale from Accept-Language header', () => {
    const result = middleware(mockRequest('/about', undefined, 'zh-CN,zh;q=0.9'))
    expect(result.locale).toBe('zh-CN')
  })

  it('should map base language to supported locale', () => {
    const result = middleware(mockRequest('/about', undefined, 'zh;q=0.9'))
    expect(result.locale).toBe('zh-CN')
  })

  it('should fallback to default locale', () => {
    const result = middleware(mockRequest('/about', undefined, 'x-invalid'))
    expect(result.locale).toBe('en')
  })

  it('should respect custom default locale', () => {
    const m = createI18nMiddleware({ defaultLocale: 'de' })
    const result = m(mockRequest('/about'))
    expect(result.locale).toBe('de')
  })

  it('should respect custom locales list', () => {
    const m = createI18nMiddleware({
      locales: ['en', 'fr'],
      defaultLocale: 'en',
    })
    const result = m(mockRequest('/fr/page'))
    expect(result.locale).toBe('fr')
  })

  it('should prefer URL prefix over cookie', () => {
    const result = middleware(mockRequest('/en/page', 'ja'))
    expect(result.locale).toBe('en')
  })
})

describe('DEFAULT_LOCALES', () => {
  it('should have 10 locales', () => {
    expect(DEFAULT_LOCALES).toHaveLength(10)
  })

  it('should include all supported locales', () => {
    expect(DEFAULT_LOCALES).toContain('en')
    expect(DEFAULT_LOCALES).toContain('zh-CN')
    expect(DEFAULT_LOCALES).toContain('ar')
  })
})

describe('detectLocaleFromHeader', () => {
  it('should return null for empty header', () => {
    expect(detectLocaleFromHeader('', ['en'])).toBeNull()
  })

  it('should respect q-values', () => {
    const result = detectLocaleFromHeader(
      'en;q=0.8, ja;q=0.9, zh-CN;q=1.0',
      ['en', 'ja', 'zh-CN'],
    )
    expect(result).toBe('zh-CN')
  })

  it('should match base language to first supported locale', () => {
    const result = detectLocaleFromHeader('ko-KR', ['ko', 'en'])
    expect(result).toBe('ko')
  })
})
