/**
 * file Trans.test.tsx
 * description Trans 组件单元测试 — JSX 插值 + ICU 参数
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
 * brief 测试 Trans 声明式翻译 + 组件插值
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Trans } from '../Trans.js'
import { I18nProvider } from '../I18nProvider.js'
import { I18nEngine } from '@yyc3/i18n-core'

function createTestEngine() {
  const engine = new I18nEngine({ locale: 'en', fallbackLocale: 'en' })
  engine.registerTranslation('en', {
    'simple': 'Hello World',
    'with_params': 'Hello, {name}! You have {count} messages.',
    'with_link': 'Read the <link>documentation</link> for v{version}',
    'self_closing': 'Click <btn/> to continue',
  })
  return engine
}

function renderWithEngine(node: React.ReactNode) {
  return render(<I18nProvider engine={createTestEngine()}>{node}</I18nProvider>)
}

describe('Trans component', () => {
  it('should render simple translation', () => {
    renderWithEngine(<Trans id="simple" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should render translation with ICU params', () => {
    renderWithEngine(
      <Trans id="with_params" values={{ name: 'YYC³', count: 5 }} />,
    )
    expect(screen.getByText(/Hello, YYC³! You have 5 messages\./)).toBeInTheDocument()
  })

  it('should render fallback when key is missing', () => {
    renderWithEngine(<Trans id="missing.key" fallback="Fallback Text" />)
    expect(screen.getByText('Fallback Text')).toBeInTheDocument()
  })

  it('should render key as fallback when no fallback provided', () => {
    renderWithEngine(<Trans id="another.missing" />)
    expect(screen.getByText('another.missing')).toBeInTheDocument()
  })

  it('should interpolate JSX components with content', () => {
    renderWithEngine(
      <Trans
        id="with_link"
        values={{ version: '2.0' }}
        components={{ link: <a href="/docs" /> }}
      />,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/docs')
    expect(link).toHaveTextContent('documentation')
    expect(screen.getByText(/Read the/)).toBeInTheDocument()
    expect(screen.getByText(/for v2\.0/)).toBeInTheDocument()
  })

  it('should interpolate self-closing JSX components', () => {
    renderWithEngine(
      <Trans
        id="self_closing"
        components={{ btn: <button>Continue</button> }}
      />,
    )
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Continue')
    expect(screen.getByText(/Click/)).toBeInTheDocument()
    expect(screen.getByText(/to continue/)).toBeInTheDocument()
  })
})
