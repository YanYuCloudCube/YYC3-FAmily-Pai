/**
 * file I18nProvider.test.tsx
 * description I18nProvider + useTranslation 单元测试
 * module @yyc3/i18n-react
 * author YanYuCloudCube Team <admin@0379.email>
 * version 0.1.0
 * created 2026-07-15
 * updated 2026-07-15
 * status active
 * tags [test],[unit]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 测试 Provider 注入、语言切换、订阅机制
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { I18nProvider, useI18nContext } from '../I18nProvider.js'
import { useTranslation } from '../useTranslation.js'
import { I18nEngine } from '@yyc3/i18n-core'
import type { Locale } from '@yyc3/i18n-core'

function createTestEngine(locale: Locale = 'en') {
  const engine = new I18nEngine({ locale, fallbackLocale: 'en' })
  engine.registerTranslation('en', {
    'hello': 'Hello',
    'welcome': 'Welcome, {name}!',
  })
  engine.registerTranslation('zh-CN', {
    'hello': '你好',
    'welcome': '欢迎，{name}！',
  })
  return engine
}

function Consumer() {
  const { t, locale, ready } = useTranslation()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="ready">{String(ready)}</span>
      <span data-testid="hello">{t('hello')}</span>
      <span data-testid="welcome">{t('welcome', { name: 'YYC³' })}</span>
    </div>
  )
}

describe('I18nProvider', () => {
  it('should provide engine context to children', () => {
    const engine = createTestEngine('en')
    render(
      <I18nProvider engine={engine}>
        <Consumer />
      </I18nProvider>,
    )

    expect(screen.getByTestId('locale')).toHaveTextContent('en')
    expect(screen.getByTestId('ready')).toHaveTextContent('true')
  })

  it('should translate keys using engine.t()', () => {
    const engine = createTestEngine('en')
    render(
      <I18nProvider engine={engine}>
        <Consumer />
      </I18nProvider>,
    )

    expect(screen.getByTestId('hello')).toHaveTextContent('Hello')
  })

  it('should translate with ICU params', () => {
    const engine = createTestEngine('en')
    render(
      <I18nProvider engine={engine}>
        <Consumer />
      </I18nProvider>,
    )

    expect(screen.getByTestId('welcome')).toHaveTextContent('Welcome, YYC³!')
  })

  it('should update locale when engine locale changes via subscription', async () => {
    const engine = createTestEngine('en')
    render(
      <I18nProvider engine={engine}>
        <Consumer />
      </I18nProvider>,
    )

    expect(screen.getByTestId('locale')).toHaveTextContent('en')

    await act(async () => {
      await engine.setLocale('zh-CN')
    })

    expect(screen.getByTestId('locale')).toHaveTextContent('zh-CN')
    expect(screen.getByTestId('hello')).toHaveTextContent('你好')
  })

  it('should throw when useI18nContext is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    function NoProvider() {
      useI18nContext()
      return null
    }
    expect(() => render(<NoProvider />)).toThrow(/within an <I18nProvider>/)
    spy.mockRestore()
  })
})
