/**
 * file useTranslation.ts
 * description useTranslation hook — 零样板 i18n React Hook
 * module @yyc3/i18n-react
 * author YanYuCloudCube Team <admin@0379.email>
 * version 0.1.0
 * created 2026-07-15
 * updated 2026-07-15
 * status active
 * tags [ui],[react],[i18n],[hooks]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 提供翻译函数 t、当前语言、语言切换方法
 */

import { useCallback } from 'react'
import type { Locale } from '@yyc3/i18n-core'
import { useI18nContext } from './I18nProvider.js'
import type { I18nEngine } from '@yyc3/i18n-core'

export interface UseTranslationReturn {
  t: (key: string, params?: Record<string, string>) => string
  locale: Locale
  setLocale: (locale: Locale) => Promise<void>
  ready: boolean
  engine: I18nEngine
}

export function useTranslation(): UseTranslationReturn {
  const ctx = useI18nContext()

  const t = useCallback(
    (key: string, params?: Record<string, string>) => ctx.t(key, params),
    [ctx],
  )

  return {
    t,
    locale: ctx.locale,
    setLocale: ctx.setLocale,
    ready: ctx.ready,
    engine: ctx.engine,
  }
}
