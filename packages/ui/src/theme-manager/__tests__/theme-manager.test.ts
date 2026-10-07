/**
 * @file theme-manager.test.ts
 * @description ThemeManager 单元测试（2026-10-07 移植批次新写——
 *              源资产仅附 Playwright E2E spec，不适用于包测试）
 * @author YYC³ Team
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeManager, type ThemeDefinition } from '../ThemeManager';

// jsdom 无 matchMedia —— 提供可控行的 stub
function stubMatchMedia(matches = false) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const mql: MediaQueryList = {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: (_: string, cb: any) => listeners.push(cb),
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList;
  (mql as any).__emit = (m: boolean) =>
    listeners.forEach(cb => cb({ matches: m } as MediaQueryListEvent));
  vi.stubGlobal('matchMedia', () => mql);
  return mql;
}

describe('ThemeManager', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.getAttribute('style')?.split(';').forEach(() => {});
    document.documentElement.removeAttribute('style');
    document.body.className = '';
    document.body.removeAttribute('data-theme');
    vi.unstubAllGlobals();
  });

  it('构造后应用默认主题并挂载 body 标记', () => {
    stubMatchMedia();
    const tm = new ThemeManager({ defaultTheme: 'light', defaultMode: 'light' });

    expect(tm.getCurrentTheme()?.id).toBe('light');
    expect(document.body.classList.contains('theme-light')).toBe(true);
    expect(document.body.getAttribute('data-theme')).toBe('light');
    tm.destroy();
  });

  it('应用主题会写入 CSS 变量', () => {
    stubMatchMedia();
    const tm = new ThemeManager({ defaultMode: 'light' });

    expect(
      document.documentElement.style.getPropertyValue('--color-primary')
    ).toBe('#3b82f6');
    expect(
      document.documentElement.style.getPropertyValue('--font-family')
    ).toContain('sans-serif');
    expect(
      document.documentElement.style.getPropertyValue('--spacing-md')
    ).toBe('1rem');
    tm.destroy();
  });

  it('setMode("dark") 切换变量与 body 类', () => {
    stubMatchMedia();
    const tm = new ThemeManager({ defaultMode: 'light' });

    tm.setMode('dark');

    expect(tm.getCurrentTheme()?.id).toBe('dark');
    expect(
      document.documentElement.style.getPropertyValue('--color-background')
    ).toBe('#111827');
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(tm.getCurrentMode()).toBe('dark');
    tm.destroy();
  });

  it('toggleMode 在深浅间往返', () => {
    stubMatchMedia();
    const tm = new ThemeManager({ defaultMode: 'light' });

    tm.toggleMode();
    expect(tm.getCurrentMode()).toBe('dark');
    tm.toggleMode();
    expect(tm.getCurrentMode()).toBe('light');
    tm.destroy();
  });

  it('继承合并：dark 主题覆盖色生效且保留基础字段', () => {
    stubMatchMedia();
    const tm = new ThemeManager({ defaultMode: 'light' });
    const dark = tm.getAllThemes().find(t => t.id === 'dark')!;

    // 覆盖值
    expect(dark.colors.background).toBe('#111827');
    // 继承体系中的共用值（与 light 定义一致）
    const light = tm.getAllThemes().find(t => t.id === 'light')!;
    expect(dark.colors.success).toBe(light.colors.success);
    expect(dark.fonts.fontFamily).toBe(light.fonts.fontFamily);
    tm.destroy();
  });

  it('customizeTheme 生成部分覆盖的自定义主题', () => {
    stubMatchMedia();
    const tm = new ThemeManager({ defaultMode: 'light' });

    const custom = tm.customizeTheme('light', {
      id: 'brand',
      name: 'Brand',
      colors: { primary: '#ff0000' },
    } as Partial<ThemeDefinition>);

    expect(custom.id).toBe('brand');
    expect(custom.colors.primary).toBe('#ff0000');
    // 未覆盖字段继承
    expect(custom.colors.background).toBe('#ffffff');
    // 已注册可应用
    tm.applyTheme('brand');
    expect(tm.getCurrentTheme()?.id).toBe('brand');
    expect(
      document.documentElement.style.getPropertyValue('--color-primary')
    ).toBe('#ff0000');
    tm.destroy();
  });

  it('未注册主题应用时安全降级不抛错', () => {
    stubMatchMedia();
    const tm = new ThemeManager({ defaultMode: 'light' });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => tm.applyTheme('nonexistent')).not.toThrow();
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
    tm.destroy();
  });

  it('themeChanged 事件在切换时触发', () => {
    stubMatchMedia();
    const tm = new ThemeManager({ defaultMode: 'light' });
    const handler = vi.fn();
    tm.on('themeChanged', handler);

    tm.setMode('dark');

    expect(handler).toHaveBeenCalledTimes(1);
    expect((handler.mock.calls[0][0] as any).newTheme.id).toBe('dark');
    tm.destroy();
  });

  it('偏好持久化并可被新实例读取 mode', () => {
    stubMatchMedia();
    const tm = new ThemeManager({ defaultMode: 'light' });
    tm.setMode('dark');

    const saved = JSON.parse(localStorage.getItem('theme-preferences')!);
    expect(saved.themeId).toBe('dark');
    expect(saved.mode).toBe('dark');
    tm.destroy();

    const tm2 = new ThemeManager({ defaultMode: 'light' });
    expect(tm2.getCurrentMode()).toBe('dark');
    tm2.destroy();
  });

  it('exportTheme / importTheme 往返', () => {
    stubMatchMedia();
    const tm = new ThemeManager({ defaultMode: 'light' });

    const json = tm.exportTheme('light');
    const restored = tm.importTheme(json);
    expect(restored.id).toBe('light');
    expect(restored.colors.primary).toBe('#3b82f6');

    // 导入改名后成为可用新主题
    const modified = JSON.parse(json);
    modified.id = 'imported';
    const t2 = tm.importTheme(JSON.stringify(modified));
    expect(tm.getAllThemes().some(t => t.id === 'imported')).toBe(true);
    expect(t2.id).toBe('imported');
    tm.destroy();
  });

  it('auto 模式跟随系统偏好切换', () => {
    const mql = stubMatchMedia(false);
    const tm = new ThemeManager({ defaultMode: 'auto', defaultTheme: 'light' });

    // 初始：系统浅色 → light
    expect(tm.getCurrentMode()).toBe('light');

    // 系统切到深色 → 自动应用 dark
    (mql as any).__emit(true);
    expect(tm.getCurrentTheme()?.id).toBe('dark');
    tm.destroy();
  });

  it('preview 模式写临时样式并可清除', () => {
    stubMatchMedia();
    vi.useFakeTimers();
    const tm = new ThemeManager({ defaultMode: 'light', enableTransitions: false });

    tm.applyTheme('dark', { preview: true, duration: 100 });
    const styleEl = document.getElementById('theme-preview');
    expect(styleEl).not.toBeNull();
    expect(styleEl!.textContent).toContain('--color-background');

    vi.advanceTimersByTime(150);
    expect(document.getElementById('theme-preview')).toBeNull();
    // 清除后恢复当前主题变量
    expect(
      document.documentElement.style.getPropertyValue('--color-background')
    ).toBe('#ffffff');
    vi.useRealTimers();
    tm.destroy();
  });

  it('destroy 移除监听与预览', () => {
    stubMatchMedia();
    const tm = new ThemeManager({ defaultMode: 'light' });
    const handler = vi.fn();
    tm.on('themeChanged', handler);

    tm.destroy();
    tm.setMode('dark');
    expect(handler).not.toHaveBeenCalled();
  });
});
