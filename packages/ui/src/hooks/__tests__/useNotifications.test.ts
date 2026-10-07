/**
 * @file useNotifications.test.ts
 * @description useNotifications Hook 测试（2026-10-07 新写——适配库化移植版：
 *              空初始、无自动推送、纯状态 API）
 * @author YYC³ Team
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useNotifications, type Notification } from '../useNotifications';

function makeNotification(overrides: Partial<Notification> = {}): Notification {
  return {
    id: `notif-${Math.random().toString(36).slice(2, 8)}`,
    type: 'business',
    priority: 'info',
    title: { en: 'Test Title', zh: '测试标题' },
    message: { en: 'Test message', zh: '测试消息' },
    timestamp: new Date().toISOString(),
    read: false,
    ...overrides,
  };
}

describe('useNotifications', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start with empty notifications', () => {
    const { result } = renderHook(() => useNotifications());

    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.hasNewNotification).toBe(false);
  });

  it('should add notification to front and flag new', () => {
    const { result } = renderHook(() => useNotifications());
    const first = makeNotification({ id: 'n1' });

    act(() => {
      result.current.addNotification(first);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].id).toBe('n1');
    expect(result.current.unreadCount).toBe(1);
    expect(result.current.hasNewNotification).toBe(true);

    // 新标志 3 秒后自动复位
    act(() => {
      vi.advanceTimersByTime(3100);
    });
    expect(result.current.hasNewNotification).toBe(false);
  });

  it('should mark single notification as read', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification(makeNotification({ id: 'n1' }));
      result.current.addNotification(makeNotification({ id: 'n2' }));
    });
    expect(result.current.unreadCount).toBe(2);

    act(() => {
      result.current.markAsRead('n1');
    });

    expect(result.current.unreadCount).toBe(1);
    expect(result.current.notifications.find(n => n.id === 'n1')?.read).toBe(true);
    expect(result.current.notifications.find(n => n.id === 'n2')?.read).toBe(false);
  });

  it('should mark all as read', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification(makeNotification());
      result.current.addNotification(makeNotification());
    });

    act(() => {
      result.current.markAllAsRead();
    });

    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications.every(n => n.read)).toBe(true);
  });

  it('should delete a notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification(makeNotification({ id: 'n1' }));
      result.current.addNotification(makeNotification({ id: 'n2' }));
    });

    act(() => {
      result.current.deleteNotification('n1');
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].id).toBe('n2');
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification(makeNotification());
    });

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
  });
});
