/**
 * file index.ts
 * description theme-manager 子模块汇总导出（ThemeManager 运行时主题管理）
 * module @yyc3/ui/theme-manager
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created: 2026-10-07
 * updated: 2026-10-07
 * status: active
 * tags: [theme],[exports]
 *
 * notes: Theme/ThemeMode 与主入口 theme-provider 的同名类型形状不同，
 *        故以独立子路径导出避免冲突。
 */

export { ThemeManager } from './ThemeManager';
export type {
  ColorValue,
  ThemeManagerMode,
  ColorScheme,
  FontScheme,
  SpacingScheme,
  BorderRadiusScheme,
  TransitionScheme,
  ThemeDefinition,
  ThemeConfig,
  ApplyThemeOptions,
} from './ThemeManager';
