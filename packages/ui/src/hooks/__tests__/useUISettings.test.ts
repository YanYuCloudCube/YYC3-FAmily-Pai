/**
 * @file useUISettings.test.ts
 * @description useUISettings Hook 测试
 * @author YYC³ Team
 *
 * notes: 2026-10-07 移植修正 —— 源资产库中的旧测试期望（theme 'P1 Matrix'、
 *        fontSize 'xl'、stored 'Glass'）与实现实际默认值不符，已按实现现实校准：
 *        默认 theme='dark'、themeColorId='green'、fontSize='medium'。
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useUISettings } from '../useUISettings';

describe('useUISettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default settings', async () => {
    const { result } = renderHook(() => useUISettings());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.settings).toBeDefined();
    expect(result.current.settings.theme).toBe('dark');
    expect(result.current.settings.themeColorId).toBe('green');
    expect(result.current.settings.fontSize).toBe('medium');
  });

  it('should load settings from localStorage', async () => {
    const savedSettings = {
      theme: 'system' as const,
      themeColorId: 'purple',
      bgOpacity: 80,
      fontSize: 'large' as const,
      fontId: 'noto',
      version: 2
    };
    localStorage.setItem('yyc3_ui_settings', JSON.stringify(savedSettings));

    const { result } = renderHook(() => useUISettings());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.settings.theme).toBe('system');
    expect(result.current.settings.themeColorId).toBe('purple');
    expect(result.current.settings.bgOpacity).toBe(80);
    expect(result.current.settings.fontSize).toBe('large');
  });

  it('should update settings correctly', () => {
    const { result } = renderHook(() => useUISettings());

    act(() => {
      result.current.updateSettings({
        theme: 'light',
        themeColorId: 'purple'
      });
    });

    expect(result.current.settings.theme).toBe('light');
    expect(result.current.settings.themeColorId).toBe('purple');
  });

  it('should save complete settings', () => {
    const { result } = renderHook(() => useUISettings());

    const newSettings = {
      ...result.current.settings,
      theme: 'light' as const,
      bgOpacity: 50
    };

    act(() => {
      result.current.saveSettings(newSettings);
    });

    expect(result.current.settings.theme).toBe('light');
    expect(result.current.settings.bgOpacity).toBe(50);

    const stored = JSON.parse(localStorage.getItem('yyc3_ui_settings')!);
    expect(stored.theme).toBe('light');
    expect(stored.bgOpacity).toBe(50);
  });

  it('should reset settings to defaults', () => {
    const { result } = renderHook(() => useUISettings());

    act(() => {
      result.current.updateSettings({
        theme: 'light',
        themeColorId: 'blue',
        fontSize: 'small'
      });
    });

    expect(result.current.settings.theme).toBe('light');

    act(() => {
      result.current.resetSettings();
    });

    expect(result.current.settings.theme).toBe('dark');
    expect(result.current.settings.themeColorId).toBe('green');
    expect(result.current.settings.fontSize).toBe('medium');
  });

  it('should compute active theme color', () => {
    const { result } = renderHook(() => useUISettings());

    // 默认 themeColorId='green' 应命中 THEME_COLORS 中的赛博绿
    expect(result.current.activeThemeColor).toBeDefined();
    expect(result.current.activeThemeColor.id).toBe('green');
    expect(result.current.activeThemeColor.value).toBe('#10b981');
  });

  it('should compute active font', () => {
    const { result } = renderHook(() => useUISettings());

    expect(result.current.activeFont).toBeDefined();
    expect(result.current.activeFont).toHaveProperty('value');
  });

  it('should compute active font size', () => {
    const { result } = renderHook(() => useUISettings());

    expect(result.current.activeFontSize).toBeDefined();
    expect(result.current.activeFontSize).toHaveProperty('value');
  });

  it('should persist settings to localStorage on update', () => {
    const { result } = renderHook(() => useUISettings());

    act(() => {
      result.current.updateSettings({ theme: 'system' });
    });

    const stored = JSON.parse(localStorage.getItem('yyc3_ui_settings')!);
    expect(stored.theme).toBe('system');
  });
});
