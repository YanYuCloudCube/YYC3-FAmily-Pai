/**
 * @file usePersistedState.test.ts
 * @description usePersistedState Hook 测试（2026-10-07 移植）
 * @author YYC³ Team
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { usePersistedState, useRecentViews } from '../usePersistedState';

describe('usePersistedState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => usePersistedState('test-key', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('should load value from localStorage', () => {
    localStorage.setItem('yyc3_test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() => usePersistedState('test-key', 'default'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('should update state and localStorage', () => {
    const { result } = renderHook(() => usePersistedState('test-key', 'default'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem('yyc3_test-key')).toBe(JSON.stringify('new-value'));
  });

  it('should handle complex objects', () => {
    const defaultValue = { name: 'test', count: 0 };
    const { result } = renderHook(() => usePersistedState('obj-key', defaultValue));

    act(() => {
      result.current[1]({ name: 'updated', count: 1 });
    });

    expect(result.current[0]).toEqual({ name: 'updated', count: 1 });
    expect(JSON.parse(localStorage.getItem('yyc3_obj-key')!)).toEqual({
      name: 'updated',
      count: 1,
    });
  });

  it('should handle arrays', () => {
    const { result } = renderHook(() => usePersistedState('arr-key', [1, 2, 3]));

    act(() => {
      result.current[1]([4, 5, 6]);
    });

    expect(result.current[0]).toEqual([4, 5, 6]);
    expect(JSON.parse(localStorage.getItem('yyc3_arr-key')!)).toEqual([4, 5, 6]);
  });

  it('should handle functional updates', () => {
    const { result } = renderHook(() => usePersistedState('count', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it('should use storage prefix', () => {
    const { result } = renderHook(() => usePersistedState('my-key', 'value'));

    act(() => {
      result.current[1]('test');
    });

    expect(localStorage.getItem('yyc3_my-key')).toBeDefined();
    expect(localStorage.getItem('my-key')).toBeNull();
  });
});

describe('useRecentViews', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty array', () => {
    const { result } = renderHook(() => useRecentViews());

    expect(result.current[0]).toEqual([]);
  });

  it('should add views to recent list', () => {
    const { result } = renderHook(() => useRecentViews());

    act(() => {
      result.current[1]('orders');
    });

    expect(result.current[0]).toEqual(['orders']);

    act(() => {
      result.current[1]('customers');
    });

    expect(result.current[0]).toEqual(['customers', 'orders']);
  });

  it('should not track dashboard', () => {
    const { result } = renderHook(() => useRecentViews());

    act(() => {
      result.current[1]('dashboard');
    });

    expect(result.current[0]).toEqual([]);
  });

  it('should move existing view to front', () => {
    const { result } = renderHook(() => useRecentViews());

    act(() => {
      result.current[1]('orders');
      result.current[1]('customers');
    });

    expect(result.current[0]).toEqual(['customers', 'orders']);

    act(() => {
      result.current[1]('orders');
    });

    expect(result.current[0]).toEqual(['orders', 'customers']);
  });

  it('should limit to MAX_RECENT views', () => {
    const { result } = renderHook(() => useRecentViews());

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current[1](`view-${i}`);
      }
    });

    expect(result.current[0].length).toBe(8);
    expect(result.current[0][0]).toBe('view-9');
    expect(result.current[0][7]).toBe('view-2');
  });
});
