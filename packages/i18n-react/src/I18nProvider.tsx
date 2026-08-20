/**
 * file I18nProvider.tsx
 * description React Context Provider — 将 I18nEngine 注入 React 组件树
 * module @yyc3/i18n-react
 * author YanYuCloudCube Team <admin@0379.email>
 * version 0.1.0
 * created 2026-07-15
 * updated 2026-07-15
 * status active
 * tags [ui],[react],[i18n]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief Context Provider，监听 I18nEngine 语言变更并同步至 React 状态
 */

import { I18nEngine, type Locale } from '@yyc3/i18n-core'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface I18nContextValue {
  engine: I18nEngine
  locale: Locale
  setLocale: (locale: Locale) => Promise<void>
  t: (key: string, params?: Record<string, string>) => string
  ready: boolean
}

const I18nContext = createContext<I18nContextValue | null>(null)

export interface I18nProviderProps {
  engine: I18nEngine
  children: ReactNode
}

export function I18nProvider({ engine, children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(engine.getLocale())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    setReady(true)
    setLocaleState(engine.getLocale())

    const unsubscribe = engine.subscribe((newLocale) => {
      if (mounted) setLocaleState(newLocale)
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [engine])

  const value = useMemo<I18nContextValue>(
    () => ({
      engine,
      locale,
      ready,
      setLocale: async (newLocale: Locale) => {
        await engine.setLocale(newLocale)
        setLocaleState(newLocale)
      },
      t: (key: string, params?: Record<string, string>) => engine.t(key, params),
    }),
    [engine, locale, ready],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18nContext(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error(
      'useTranslation must be used within an <I18nProvider>. ' +
        'Wrap your component tree with <I18nProvider engine={engine}>.',
    )
  }
  return ctx
}
