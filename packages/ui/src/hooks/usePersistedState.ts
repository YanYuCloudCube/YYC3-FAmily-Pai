/**
 * file usePersistedState.ts
 * description usePersistedState Hook · localStorage 持久化状态
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [hook],hook
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized/yyc3-zero-dependency/hooks
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_PREFIX = 'yyc3_';

/**
 * localStorage 持久化状态：读初始值、写每次变更。
 * Reads initial value from localStorage, falls back to defaultValue.
 */
export function usePersistedState<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const storageKey = STORAGE_PREFIX + key;

  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } catch {
      // Corrupted or missing — use default
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Storage full or unavailable — silent fail (offline-first)
    }
  }, [storageKey, state]);

  return [state, setState];
}

const MAX_RECENT = 8;

/**
 * 最近访问追踪：维护最近 N 个不重复的模块 key。
 */
export function useRecentViews(): [string[], (view: string) => void] {
  const [recent, setRecent] = usePersistedState<string[]>('recent_views', []);

  const addRecent = useCallback((view: string) => {
    if (view === 'dashboard') return; // Don't track dashboard
    setRecent(prev => {
      const filtered = prev.filter(v => v !== view);
      return [view, ...filtered].slice(0, MAX_RECENT);
    });
  }, [setRecent]);

  return [recent, addRecent];
}
