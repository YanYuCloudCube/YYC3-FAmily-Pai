/**
 * file useGestures.tsx
 * description useGestures Hook · 触摸手势识别（滑动/捏合/双击/长按）+ Swipeable/PinchZoom/Draggable 组件
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [component],[hook],hook
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized/yyc3-zero-dependency/hooks（原样）
 */

import { useRef, useEffect, useState } from 'react';

export type GestureType =
  | 'swipe-left'
  | 'swipe-right'
  | 'swipe-up'
  | 'swipe-down'
  | 'pinch-in'
  | 'pinch-out'
  | 'double-tap'
  | 'long-press'
  | 'tap';

interface GestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchIn?: (scale: number) => void;
  onPinchOut?: (scale: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onTap?: () => void;

  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  pinchThreshold?: number;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export function useGestures(config: GestureConfig = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchIn,
    onPinchOut,
    onDoubleTap,
    onLongPress,
    onTap,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    pinchThreshold = 0.1,
  } = config;

  const startPoint = useRef<TouchPoint | null>(null);
  const lastTapTime = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const initialDistance = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    startPoint.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance.current = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    }

    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (e.touches.length === 2 && initialDistance.current) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const scale = currentDistance / initialDistance.current;

      if (Math.abs(scale - 1) > pinchThreshold) {
        if (scale < 1 && onPinchIn) {
          onPinchIn(scale);
        } else if (scale > 1 && onPinchOut) {
          onPinchOut(scale);
        }
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!startPoint.current) return;

    const touch = e.changedTouches[0];
    const endPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    const deltaX = endPoint.x - startPoint.current.x;
    const deltaY = endPoint.y - startPoint.current.y;
    const deltaTime = endPoint.timestamp - startPoint.current.timestamp;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > swipeThreshold || absY > swipeThreshold) {
      if (absX > absY) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    } else if (absX < 10 && absY < 10) {
      const now = Date.now();
      if (now - lastTapTime.current < doubleTapDelay && onDoubleTap) {
        onDoubleTap();
        lastTapTime.current = 0;
      } else {
        if (onTap && deltaTime < 200) {
          onTap();
        }
        lastTapTime.current = now;
      }
    }

    startPoint.current = null;
    initialDistance.current = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

// 滑动组件
interface SwipeableProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
}

export function Swipeable({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = '',
}: SwipeableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const gestures = useGestures({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', gestures.onTouchStart as EventListener);
    element.addEventListener('touchmove', gestures.onTouchMove as EventListener);
    element.addEventListener('touchend', gestures.onTouchEnd as EventListener);

    return () => {
      element.removeEventListener('touchstart', gestures.onTouchStart as EventListener);
      element.removeEventListener('touchmove', gestures.onTouchMove as EventListener);
      element.removeEventListener('touchend', gestures.onTouchEnd as EventListener);
    };
  }, [gestures]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// 缩放组件
interface PinchZoomProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  className?: string;
}

export function PinchZoom({
  children,
  minScale = 0.5,
  maxScale = 3,
  className = '',
}: PinchZoomProps) {
  const [scale, setScale] = useState(1);
  const ref = useRef<HTMLDivElement>(null);

  const gestures = useGestures({
    onPinchIn: (newScale) => {
      setScale((prev) => Math.max(minScale, prev * newScale));
    },
    onPinchOut: (newScale) => {
      setScale((prev) => Math.min(maxScale, prev * newScale));
    },
    onDoubleTap: () => {
      setScale((prev) => (prev === 1 ? 2 : 1));
    },
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', gestures.onTouchStart as EventListener);
    element.addEventListener('touchmove', gestures.onTouchMove as EventListener);
    element.addEventListener('touchend', gestures.onTouchEnd as EventListener);

    return () => {
      element.removeEventListener('touchstart', gestures.onTouchStart as EventListener);
      element.removeEventListener('touchmove', gestures.onTouchMove as EventListener);
      element.removeEventListener('touchend', gestures.onTouchEnd as EventListener);
    };
  }, [gestures]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 0.3s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// 拖拽组件
interface DraggableProps {
  children: React.ReactNode;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  className?: string;
}

export function Draggable({
  children,
  onDrag,
  onDragEnd,
  className = '',
}: DraggableProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    startPos.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const x = touch.clientX - startPos.current.x;
    const y = touch.clientY - startPos.current.y;

    setPosition({ x, y });
    onDrag?.(x, y);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  return (
    <div
      ref={ref}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={className}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
      }}
    >
      {children}
    </div>
  );
}
