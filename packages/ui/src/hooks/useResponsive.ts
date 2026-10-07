/**
 * file useResponsive.ts
 * description useResponsive Hook · 响应式状态全家桶（设备类型/方向/视口/滚动/可见性/网络/电池/折叠屏）
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [hook],hook
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized；移除 useMediaQuery（与 core/hooks.ts
 *        已有同名导出冲突，统一使用 core 版本）
 */

import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'wide';
export type Orientation = 'portrait' | 'landscape';

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1536,
} as const;

interface ResponsiveState {
  deviceType: DeviceType;
  orientation: Orientation;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isTouchDevice: boolean;
  pixelRatio: number;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        deviceType: 'desktop',
        orientation: 'landscape',
        width: 1920,
        height: 1080,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isWide: false,
        isPortrait: false,
        isLandscape: true,
        isTouchDevice: false,
        pixelRatio: 1,
      };
    }

    return getResponsiveState();
  });

  useEffect(() => {
    const handleResize = () => {
      setState(getResponsiveState());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return state;
}

function getResponsiveState(): ResponsiveState {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const orientation: Orientation = width > height ? 'landscape' : 'portrait';
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const pixelRatio = window.devicePixelRatio || 1;

  let deviceType: DeviceType;
  if (width < breakpoints.tablet) {
    deviceType = 'mobile';
  } else if (width < breakpoints.desktop) {
    deviceType = 'tablet';
  } else if (width < breakpoints.wide) {
    deviceType = 'desktop';
  } else {
    deviceType = 'wide';
  }

  return {
    deviceType,
    orientation,
    width,
    height,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isWide: deviceType === 'wide',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    isTouchDevice,
    pixelRatio,
  };
}

// 视口尺寸Hook
export function useViewport() {
  const [viewport, setViewport] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 1920, height: 1080 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}

// 滚动位置Hook
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    return {
      x: window.scrollX,
      y: window.scrollY,
    };
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}

// 可见性Hook
export function useVisibility() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === 'undefined') return true;
    return !document.hidden;
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
}

// 网络状态Hook
export function useNetworkStatus() {
  const [status, setStatus] = useState(() => {
    if (typeof navigator === 'undefined' || !('onLine' in navigator)) {
      return { online: true, effectiveType: '4g' as const };
    }

    const connection = (navigator as any).connection;
    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType || '4g',
    };
  });

  useEffect(() => {
    const handleOnline = () => setStatus((prev) => ({ ...prev, online: true }));
    const handleOffline = () => setStatus((prev) => ({ ...prev, online: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection;
    if (connection) {
      const handleChange = () => {
        setStatus({
          online: navigator.onLine,
          effectiveType: connection.effectiveType || '4g',
        });
      };
      connection.addEventListener('change', handleChange);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}

// 电池状态Hook
export function useBatteryStatus() {
  const [battery, setBattery] = useState<{
    charging: boolean;
    level: number;
    chargingTime: number;
    dischargingTime: number;
  } | null>(null);

  useEffect(() => {
    if (!('getBattery' in navigator)) return;

    (navigator as any).getBattery().then((battery: any) => {
      const updateBattery = () => {
        setBattery({
          charging: battery.charging,
          level: battery.level,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        });
      };

      updateBattery();

      battery.addEventListener('chargingchange', updateBattery);
      battery.addEventListener('levelchange', updateBattery);

      return () => {
        battery.removeEventListener('chargingchange', updateBattery);
        battery.removeEventListener('levelchange', updateBattery);
      };
    });
  }, []);

  return battery;
}

// 折叠屏检测Hook
export function useFoldableScreen() {
  const [isFoldable, setIsFoldable] = useState(false);
  const [isSpanned, setIsSpanned] = useState(false);

  useEffect(() => {
    const checkFoldable = () => {
      const spanning = window.matchMedia('(spanning: single-fold-vertical)').matches ||
                       window.matchMedia('(spanning: single-fold-horizontal)').matches;

      setIsFoldable(spanning);
      setIsSpanned(spanning);
    };

    checkFoldable();

    window.addEventListener('resize', checkFoldable);
    return () => window.removeEventListener('resize', checkFoldable);
  }, []);

  return { isFoldable, isSpanned };
}
