/**
 * @file useGestures.test.tsx
 * @description useGestures Hook 与手势组件测试（2026-10-07 新写）
 *              jsdom 无 TouchEvent，直接以合成事件对象调用 hook 返回的 handler
 * @author YYC³ Team
 */

import { renderHook, act } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGestures, Swipeable, PinchZoom, Draggable } from '../useGestures';

function touch(x: number, y: number) {
  return { clientX: x, clientY: y };
}

function makeEvent(touches: Array<{ clientX: number; clientY: number }>, changed: Array<{ clientX: number; clientY: number }> = touches) {
  return { touches, changedTouches: changed } as unknown as TouchEvent;
}

describe('useGestures', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-07T00:00:00Z'));
  });

  it('水平右滑触发 onSwipeRight', () => {
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() => useGestures({ onSwipeRight }));

    act(() => { result.current.onTouchStart(makeEvent([touch(0, 0)])); });
    act(() => { result.current.onTouchEnd(makeEvent([], [touch(120, 5)])); });

    expect(onSwipeRight).toHaveBeenCalledTimes(1);
  });

  it('水平左滑触发 onSwipeLeft', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useGestures({ onSwipeLeft }));

    act(() => { result.current.onTouchStart(makeEvent([touch(120, 0)])); });
    act(() => { result.current.onTouchEnd(makeEvent([], [touch(0, 5)])); });

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
  });

  it('垂直上滑/下滑分别触发对应回调', () => {
    const onSwipeUp = vi.fn();
    const onSwipeDown = vi.fn();
    const { result } = renderHook(() => useGestures({ onSwipeUp, onSwipeDown }));

    act(() => { result.current.onTouchStart(makeEvent([touch(0, 100)])); });
    act(() => { result.current.onTouchEnd(makeEvent([], [touch(0, 0)])); });
    expect(onSwipeUp).toHaveBeenCalledTimes(1);

    act(() => { result.current.onTouchStart(makeEvent([touch(0, 0)])); });
    act(() => { result.current.onTouchEnd(makeEvent([], [touch(5, 100)])); });
    expect(onSwipeDown).toHaveBeenCalledTimes(1);
  });

  it('小于阈值的位移不触发滑动', () => {
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() => useGestures({ onSwipeRight }));

    act(() => { result.current.onTouchStart(makeEvent([touch(0, 0)])); });
    act(() => { result.current.onTouchEnd(makeEvent([], [touch(30, 0)])); });

    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('轻点触发 onTap，快速两次触发 onDoubleTap', () => {
    const onTap = vi.fn();
    const onDoubleTap = vi.fn();
    const { result } = renderHook(() => useGestures({ onTap, onDoubleTap }));

    const tap = () => {
      act(() => { result.current.onTouchStart(makeEvent([touch(10, 10)])); });
      act(() => { result.current.onTouchEnd(makeEvent([], [touch(10, 10)])); });
    };

    tap();
    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onDoubleTap).not.toHaveBeenCalled();

    // 双击间隔内（<300ms 模拟时间）再点 → double tap
    act(() => { vi.advanceTimersByTime(100); });
    tap();
    expect(onDoubleTap).toHaveBeenCalledTimes(1);
  });

  it('长按在延迟后触发 onLongPress，移动即取消', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useGestures({ onLongPress }));

    act(() => { result.current.onTouchStart(makeEvent([touch(5, 5)])); });
    act(() => { vi.advanceTimersByTime(500); });
    expect(onLongPress).toHaveBeenCalledTimes(1);

    // 移动取消长按
    act(() => { result.current.onTouchStart(makeEvent([touch(5, 5)])); });
    act(() => { result.current.onTouchMove(makeEvent([touch(20, 20)])); });
    act(() => { vi.advanceTimersByTime(600); });
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('双指捏合触发 onPinchIn / onPinchOut（带 scale）', () => {
    const onPinchIn = vi.fn();
    const onPinchOut = vi.fn();
    const { result } = renderHook(() => useGestures({ onPinchIn, onPinchOut }));

    // 初始两点距 100
    act(() => { result.current.onTouchStart(makeEvent([touch(0, 0), touch(100, 0)])); });

    // 张开到 150 → pinch-out scale 1.5
    act(() => { result.current.onTouchMove(makeEvent([touch(0, 0), touch(150, 0)])); });
    expect(onPinchOut).toHaveBeenCalledWith(1.5);

    // 收拢到 50 → pinch-in scale 0.5
    act(() => { result.current.onTouchStart(makeEvent([touch(0, 0), touch(100, 0)])); });
    act(() => { result.current.onTouchMove(makeEvent([touch(0, 0), touch(50, 0)])); });
    expect(onPinchIn).toHaveBeenCalledWith(0.5);
  });

  it('无起点的 touchEnd 安全返回', () => {
    const { result } = renderHook(() => useGestures({}));
    expect(() => {
      act(() => { result.current.onTouchEnd(makeEvent([], [touch(0, 0)])); });
    }).not.toThrow();
  });
});

describe('Swipeable / PinchZoom / Draggable 组件', () => {
  it('Swipeable 渲染子内容', () => {
    render(<Swipeable onSwipeLeft={() => {}}>可滑动内容</Swipeable>);
    expect(screen.getByText('可滑动内容')).toBeInTheDocument();
  });

  it('PinchZoom 渲染并应用初始 scale 1', () => {
    render(<PinchZoom>缩放内容</PinchZoom>);
    const inner = screen.getByText('缩放内容').closest('div')!;
    expect(inner.style.transform).toContain('scale(1)');
  });

  it('Draggable 渲染且 touch 拖动更新位移', () => {
    render(<Draggable>拖我</Draggable>);
    const el = screen.getByText('拖我').closest('div')!;

    fireEvent.touchStart(el, { touches: [{ clientX: 100, clientY: 100 }] });
    fireEvent.touchMove(el, { touches: [{ clientX: 140, clientY: 130 }] });
    fireEvent.touchEnd(el);

    expect(el.style.transform).toContain('translate(40px, 30px)');
  });
});
