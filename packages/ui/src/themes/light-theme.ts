/**
 * file light-theme.ts
 * description 亮色主题配置
 * module @yyc3/ui
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.2.0
 * created 2026-04-24
 * updated 2026-05-22
 * status active
 * tags [module],[theme]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 亮色主题配置 — 统一品牌色 #00d4ff
 */
import type { Theme } from './theme-provider'

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#00d4ff',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f0f9ff',
    text: '#0c1a2e',
    textSecondary: '#64748b',
    border: '#bae6fd',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
  },
}

export default lightTheme
