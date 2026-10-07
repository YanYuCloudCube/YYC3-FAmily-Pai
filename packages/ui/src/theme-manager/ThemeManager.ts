/**
 * file ThemeManager.ts
 * description ThemeManager · 主题运行时管理系统（多主题/深浅模式/继承覆盖/CSS 变量/预览/偏好持久化）
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [theme],[manager],[runtime]
 *
 * notes: 2026-10-07 移植自 YYC3-UI-MONO-v2/packages/theme ——
 *        1) EventEmitter 由 Node 'events' 改为 eventemitter3（浏览器安全，包内已有依赖）；
 *        2) 源文件引用的 ./utils/logger 实际不存在（死引用），内联轻量实现；
 *        3) matchMedia/document 增加 SSR 与测试环境防御。
 *
 * @module ThemeManager
 */

import { EventEmitter } from 'eventemitter3';

const createLogger = (ctx: string) => ({
  warn: (...args: unknown[]) => console.warn(`[${ctx}]`, ...args),
});
const logger = createLogger('ThemeManager');

// ================================================
// 1. 类型定义
// ================================================

export type ColorValue = string;

export type ThemeManagerMode = 'light' | 'dark' | 'auto';

export interface ColorScheme {
  primary: ColorValue;
  primaryHover: ColorValue;
  primaryActive: ColorValue;

  secondary: ColorValue;
  secondaryHover: ColorValue;
  secondaryActive: ColorValue;

  background: ColorValue;
  backgroundSecondary: ColorValue;
  backgroundTertiary: ColorValue;

  foreground: ColorValue;
  foregroundSecondary: ColorValue;
  foregroundTertiary: ColorValue;

  border: ColorValue;
  borderHover: ColorValue;

  success: ColorValue;
  warning: ColorValue;
  error: ColorValue;
  info: ColorValue;

  shadow: ColorValue;
  shadowHeavy: ColorValue;
}

export interface FontScheme {
  fontFamily: string;
  fontFamilyMono: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface SpacingScheme {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface BorderRadiusScheme {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface TransitionScheme {
  fast: string;
  normal: string;
  slow: string;
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

export interface ThemeDefinition {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  colors: ColorScheme;
  fonts: FontScheme;
  spacing: SpacingScheme;
  borderRadius: BorderRadiusScheme;
  transitions: TransitionScheme;
  extends?: string;
  custom?: Record<string, any>;
}

export interface ThemeConfig {
  defaultTheme: string;
  defaultMode: ThemeManagerMode;
  enableTransitions: boolean;
  transitionDuration: number;
  persistPreference: boolean;
  autoDetectMode: boolean;
}

export interface ApplyThemeOptions {
  transition?: boolean;
  duration?: number;
  preview?: boolean;
}

// ================================================
// 2. 预设主题
// ================================================

const FONT_SCHEME: FontScheme = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMono: '"Fira Code", "Courier New", monospace',
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75 },
};

const SPACING_SCHEME: SpacingScheme = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

const BORDER_RADIUS_SCHEME: BorderRadiusScheme = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
};

const TRANSITION_SCHEME: TransitionScheme = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

const PRESET_THEMES: Record<string, ThemeDefinition> = {
  light: {
    id: 'light',
    name: 'Light',
    mode: 'light',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      primaryActive: '#1d4ed8',
      secondary: '#8b5cf6',
      secondaryHover: '#7c3aed',
      secondaryActive: '#6d28d9',
      background: '#ffffff',
      backgroundSecondary: '#f9fafb',
      backgroundTertiary: '#f3f4f6',
      foreground: '#111827',
      foregroundSecondary: '#4b5563',
      foregroundTertiary: '#9ca3af',
      border: '#e5e7eb',
      borderHover: '#d1d5db',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowHeavy: 'rgba(0, 0, 0, 0.2)',
    },
    fonts: FONT_SCHEME,
    spacing: SPACING_SCHEME,
    borderRadius: BORDER_RADIUS_SCHEME,
    transitions: TRANSITION_SCHEME,
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    mode: 'dark',
    extends: 'light',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#60a5fa',
      primaryActive: '#93c5fd',
      secondary: '#8b5cf6',
      secondaryHover: '#a78bfa',
      secondaryActive: '#c4b5fd',
      background: '#111827',
      backgroundSecondary: '#1f2937',
      backgroundTertiary: '#374151',
      foreground: '#f9fafb',
      foregroundSecondary: '#d1d5db',
      foregroundTertiary: '#9ca3af',
      border: '#374151',
      borderHover: '#4b5563',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowHeavy: 'rgba(0, 0, 0, 0.5)',
    },
    fonts: FONT_SCHEME,
    spacing: SPACING_SCHEME,
    borderRadius: BORDER_RADIUS_SCHEME,
    transitions: TRANSITION_SCHEME,
  },
};

// ================================================
// 3. 主题管理器核心
// ================================================

export class ThemeManager extends EventEmitter {
  private themes: Map<string, ThemeDefinition> = new Map();
  private currentTheme: ThemeDefinition | null = null;
  private currentMode: ThemeManagerMode = 'auto';
  private config: ThemeConfig;
  private previewElement: HTMLStyleElement | null = null;

  constructor(config: Partial<ThemeConfig> = {}) {
    super();

    this.config = {
      defaultTheme: 'light',
      defaultMode: 'auto',
      enableTransitions: true,
      transitionDuration: 300,
      persistPreference: true,
      autoDetectMode: true,
      ...config,
    };

    for (const [id, theme] of Object.entries(PRESET_THEMES)) {
      this.registerTheme(theme);
    }

    if (this.config.persistPreference) {
      this.loadPreferences();
    }

    this.applyTheme(this.config.defaultTheme);

    if (this.config.autoDetectMode && this.currentMode === 'auto') {
      this.watchSystemTheme();
    }
  }

  registerTheme(theme: ThemeDefinition): void {
    if (theme.extends) {
      const baseTheme = this.themes.get(theme.extends);
      if (baseTheme) {
        theme = this.mergeThemes(baseTheme, theme);
      }
    }

    this.themes.set(theme.id, theme);
    this.emit('themeRegistered', { theme });
  }

  applyTheme(themeId: string, options: ApplyThemeOptions = {}): void {
    const theme = this.themes.get(themeId);
    if (!theme) {
      logger.warn(`Theme "${themeId}" not found`);
      return;
    }

    if (options.preview) {
      this.previewTheme(theme, options);
      return;
    }

    const oldTheme = this.currentTheme;
    this.currentTheme = theme;

    if (options.transition !== false && this.config.enableTransitions) {
      this.enableTransition(options.duration);
    }

    this.applyCSSVariables(theme);
    this.updateBodyClasses(theme);

    if (this.config.persistPreference) {
      this.savePreferences();
    }

    this.emit('themeChanged', { oldTheme, newTheme: theme });
  }

  setMode(mode: ThemeManagerMode): void {
    this.currentMode = mode;

    let themeId: string;
    if (mode === 'auto') {
      themeId = this.detectSystemTheme();
    } else {
      themeId = mode;
    }

    this.applyTheme(themeId);

    if (this.config.persistPreference) {
      this.savePreferences();
    }

    this.emit('modeChanged', { mode });
  }

  toggleMode(): void {
    const newMode = this.getCurrentMode() === 'light' ? 'dark' : 'light';
    this.setMode(newMode);
  }

  getCurrentTheme(): ThemeDefinition | null {
    return this.currentTheme;
  }

  getCurrentMode(): 'light' | 'dark' {
    if (this.currentMode === 'auto') {
      return this.detectSystemTheme() as 'light' | 'dark';
    }
    return this.currentMode;
  }

  getAllThemes(): ThemeDefinition[] {
    return Array.from(this.themes.values());
  }

  customizeTheme(baseThemeId: string, customizations: Partial<ThemeDefinition>): ThemeDefinition {
    const baseTheme = this.themes.get(baseThemeId);
    if (!baseTheme) {
      throw new Error(`Base theme "${baseThemeId}" not found`);
    }

    const customTheme: ThemeDefinition = {
      ...baseTheme,
      ...customizations,
      id: customizations.id || `custom-${Date.now()}`,
      name: customizations.name || `Custom ${baseTheme.name}`,
      colors: { ...baseTheme.colors, ...customizations.colors },
      fonts: { ...baseTheme.fonts, ...customizations.fonts },
      spacing: { ...baseTheme.spacing, ...customizations.spacing },
      borderRadius: { ...baseTheme.borderRadius, ...customizations.borderRadius },
      transitions: { ...baseTheme.transitions, ...customizations.transitions },
    };

    this.registerTheme(customTheme);
    return customTheme;
  }

  private previewTheme(theme: ThemeDefinition, options: ApplyThemeOptions): void {
    if (typeof document === 'undefined') return;

    if (!this.previewElement) {
      this.previewElement = document.createElement('style');
      this.previewElement.id = 'theme-preview';
      document.head.appendChild(this.previewElement);
    }

    const cssVars = this.generateCSSVariables(theme);
    this.previewElement.textContent = `:root { ${cssVars} }`;

    setTimeout(() => {
      this.clearPreview();
    }, options.duration || 5000);
  }

  clearPreview(): void {
    if (this.previewElement) {
      this.previewElement.remove();
      this.previewElement = null;

      if (this.currentTheme) {
        this.applyCSSVariables(this.currentTheme);
      }
    }
  }

  private applyCSSVariables(theme: ThemeDefinition): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const cssVars = this.generateCSSVariables(theme);

    const vars = cssVars.split(';').filter(v => v.trim());
    for (const varDef of vars) {
      const [name, value] = varDef.split(':').map(s => s.trim());
      if (name && value) {
        root.style.setProperty(name, value);
      }
    }
  }

  private generateCSSVariables(theme: ThemeDefinition): string {
    const vars: string[] = [];

    for (const [key, value] of Object.entries(theme.colors)) {
      vars.push(`--color-${this.camelToKebab(key)}: ${value}`);
    }

    vars.push(`--font-family: ${theme.fonts.fontFamily}`);
    vars.push(`--font-family-mono: ${theme.fonts.fontFamilyMono}`);
    for (const [key, value] of Object.entries(theme.fonts.fontSize)) {
      vars.push(`--font-size-${key}: ${value}`);
    }
    for (const [key, value] of Object.entries(theme.fonts.fontWeight)) {
      vars.push(`--font-weight-${key}: ${value}`);
    }
    for (const [key, value] of Object.entries(theme.fonts.lineHeight)) {
      vars.push(`--line-height-${key}: ${value}`);
    }

    for (const [key, value] of Object.entries(theme.spacing)) {
      vars.push(`--spacing-${key}: ${value}`);
    }

    for (const [key, value] of Object.entries(theme.borderRadius)) {
      vars.push(`--border-radius-${key}: ${value}`);
    }

    vars.push(`--transition-fast: ${theme.transitions.fast}`);
    vars.push(`--transition-normal: ${theme.transitions.normal}`);
    vars.push(`--transition-slow: ${theme.transitions.slow}`);
    for (const [key, value] of Object.entries(theme.transitions.easing)) {
      vars.push(`--easing-${key}: ${value}`);
    }

    if (theme.custom) {
      for (const [key, value] of Object.entries(theme.custom)) {
        vars.push(`--${this.camelToKebab(key)}: ${value}`);
      }
    }

    return vars.join('; ');
  }

  private updateBodyClasses(theme: ThemeDefinition): void {
    if (typeof document === 'undefined' || !document.body) return;

    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme.mode}`);
    document.body.setAttribute('data-theme', theme.id);
  }

  private enableTransition(duration?: number): void {
    if (typeof document === 'undefined') return;

    const dur = duration || this.config.transitionDuration;
    const root = document.documentElement;

    root.style.setProperty('--theme-transition-duration', `${dur}ms`);
    root.classList.add('theme-transitioning');

    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, dur);
  }

  private mergeThemes(base: ThemeDefinition, override: ThemeDefinition): ThemeDefinition {
    return {
      ...base,
      ...override,
      colors: { ...base.colors, ...override.colors },
      fonts: { ...base.fonts, ...override.fonts },
      spacing: { ...base.spacing, ...override.spacing },
      borderRadius: { ...base.borderRadius, ...override.borderRadius },
      transitions: { ...base.transitions, ...override.transitions },
    };
  }

  private detectSystemTheme(): string {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return darkModeQuery.matches ? 'dark' : 'light';
  }

  private watchSystemTheme(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    darkModeQuery.addEventListener('change', (e: MediaQueryListEvent) => {
      if (this.currentMode === 'auto') {
        const themeId = e.matches ? 'dark' : 'light';
        this.applyTheme(themeId);
      }
    });
  }

  private savePreferences(): void {
    try {
      const prefs = {
        themeId: this.currentTheme?.id,
        mode: this.currentMode,
      };
      localStorage.setItem('theme-preferences', JSON.stringify(prefs));
    } catch (error) {
      logger.warn('Failed to save theme preferences:', error);
    }
  }

  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem('theme-preferences');
      if (stored) {
        const prefs = JSON.parse(stored);
        if (prefs.mode) {
          this.currentMode = prefs.mode;
        }
      }
    } catch (error) {
      logger.warn('Failed to load theme preferences:', error);
    }
  }

  private camelToKebab(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  exportTheme(themeId: string): string {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme "${themeId}" not found`);
    }
    return JSON.stringify(theme, null, 2);
  }

  importTheme(themeJson: string): ThemeDefinition {
    try {
      const theme = JSON.parse(themeJson) as ThemeDefinition;
      this.registerTheme(theme);
      return theme;
    } catch (error) {
      throw new Error(`Failed to import theme: ${error}`);
    }
  }

  destroy(): void {
    this.clearPreview();
    this.removeAllListeners();
  }
}
