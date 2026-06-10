/**
 * file dark-theme.ts
 * description 暗色主题配置
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
 * brief 暗色主题配置 — 统一品牌色 #00d4ff 赛博朋克深空黑
 */
import type { Theme } from './theme-provider'

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#00d4ff',
    secondary: '#BF00FF',
    background: '#060e1f',
    surface: '#0f1d35',
    text: '#e0f0ff',
    textSecondary: 'rgba(224, 240, 255, 0.5)',
    border: 'rgba(0, 180, 255, 0.08)',
    error: '#f87171',
    success: '#4ade80',
    warning: '#fbbf24',
  },
}

export default darkTheme
