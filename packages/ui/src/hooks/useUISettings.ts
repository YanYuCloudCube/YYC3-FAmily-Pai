/**
 * file useUISettings.ts
 * description useUISettings Hook · UI 设置持久化管理（主题色/字体/字号等）
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [hook],hook
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized；类型引用改为 './types'
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { UISettings, THEME_COLORS, FONT_OPTIONS, FONT_SIZE_OPTIONS } from './types';

const STORAGE_KEY = 'yyc3_ui_settings';
const CURRENT_VERSION = 2;

const DEFAULT_SETTINGS: UISettings = {
  theme: 'dark',
  themeColorId: 'green',
  bgOpacity: 100,
  scanlines: 15,
  curvature: true,
  fontSize: 'medium',
  fontId: 'vt323',
  animations: true,
  topBarText: 'CODE | AI | FAMILY',
  systemDisplayName: 'YYC\u00b3 AI Family',
  version: CURRENT_VERSION,
  primaryColor: '#10b981',
  fontFamily: 'monospace',
  reducedMotion: false,
  highContrast: false,
};

export const useUISettings = () => {
  const [settings, setSettings] = useState<UISettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<UISettings>;

        const migrated: UISettings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          themeColorId: parsed.themeColorId || DEFAULT_SETTINGS.themeColorId,
          bgOpacity: typeof parsed.bgOpacity === 'number' ? parsed.bgOpacity : DEFAULT_SETTINGS.bgOpacity,
          fontId: parsed.fontId || DEFAULT_SETTINGS.fontId,
          topBarText: parsed.topBarText || DEFAULT_SETTINGS.topBarText,
          systemDisplayName: parsed.systemDisplayName || DEFAULT_SETTINGS.systemDisplayName,
          version: CURRENT_VERSION,
        };

        setSettings(migrated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      }
    } catch {
      /* 静默降级到默认值 / Silent fallback to defaults */
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettings = useCallback((newSettings: UISettings) => {
    try {
      const updated = { ...newSettings, version: CURRENT_VERSION };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSettings(updated);
    } catch {
      /* 写入失败静默处理 / Silent on write failure */
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<UISettings>) => {
    setSettings(prev => {
      const next: UISettings = { ...prev, ...updates, version: CURRENT_VERSION };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* 静默 / Silent */
      }
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS);
  }, [saveSettings]);

  const activeThemeColor = useMemo(
    () => THEME_COLORS.find(c => c.id === settings.themeColorId) || THEME_COLORS[0],
    [settings.themeColorId]
  );

  const activeFont = useMemo(
    () => FONT_OPTIONS.find(f => f.id === settings.fontId) || FONT_OPTIONS[0],
    [settings.fontId]
  );

  const activeFontSize = useMemo(
    () => FONT_SIZE_OPTIONS.find(s => s.id === settings.fontSize) || FONT_SIZE_OPTIONS[1],
    [settings.fontSize]
  );

  return {
    settings,
    loading,
    updateSettings,
    saveSettings,
    resetSettings,
    activeThemeColor,
    activeFont,
    activeFontSize,
  };
};
