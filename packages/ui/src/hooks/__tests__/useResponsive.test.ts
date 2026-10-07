/**
 * @file useResponsive.test.ts
 * @description useResponsive Hook 测试（2026-10-07 移植）
 * @author YYC³ Team
 */

import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useResponsive, useViewport, useVisibility } from '../useResponsive';

describe('useResponsive', () => {
  it('should return responsive state object', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current).toHaveProperty('deviceType');
    expect(result.current).toHaveProperty('orientation');
    expect(result.current).toHaveProperty('width');
    expect(result.current).toHaveProperty('height');
    expect(result.current).toHaveProperty('isMobile');
    expect(result.current).toHaveProperty('isTablet');
    expect(result.current).toHaveProperty('isDesktop');
    expect(result.current).toHaveProperty('isWide');
    expect(result.current).toHaveProperty('isPortrait');
    expect(result.current).toHaveProperty('isLandscape');
    expect(result.current).toHaveProperty('isTouchDevice');
    expect(result.current).toHaveProperty('pixelRatio');
  });

  it('should return boolean values for breakpoint flags', () => {
    const { result } = renderHook(() => useResponsive());

    expect(typeof result.current.isMobile).toBe('boolean');
    expect(typeof result.current.isTablet).toBe('boolean');
    expect(typeof result.current.isDesktop).toBe('boolean');
    expect(typeof result.current.isWide).toBe('boolean');
  });

  it('should return numeric width and height', () => {
    const { result } = renderHook(() => useResponsive());

    expect(typeof result.current.width).toBe('number');
    expect(typeof result.current.height).toBe('number');
    expect(result.current.width).toBeGreaterThan(0);
    expect(result.current.height).toBeGreaterThan(0);
  });

  it('should return device type', () => {
    const { result } = renderHook(() => useResponsive());

    expect(['mobile', 'tablet', 'desktop', 'wide']).toContain(result.current.deviceType);
  });

  it('should return orientation', () => {
    const { result } = renderHook(() => useResponsive());

    expect(['portrait', 'landscape']).toContain(result.current.orientation);
  });

  it('should return pixel ratio', () => {
    const { result } = renderHook(() => useResponsive());

    expect(typeof result.current.pixelRatio).toBe('number');
    expect(result.current.pixelRatio).toBeGreaterThan(0);
  });

  it('should return touch device flag', () => {
    const { result } = renderHook(() => useResponsive());

    expect(typeof result.current.isTouchDevice).toBe('boolean');
  });
});

describe('useViewport', () => {
  it('should return viewport dimensions', () => {
    const { result } = renderHook(() => useViewport());

    expect(typeof result.current.width).toBe('number');
    expect(typeof result.current.height).toBe('number');
    expect(result.current.width).toBeGreaterThan(0);
  });
});

describe('useVisibility', () => {
  it('should return visibility boolean', () => {
    const { result } = renderHook(() => useVisibility());

    expect(typeof result.current).toBe('boolean');
  });
});
