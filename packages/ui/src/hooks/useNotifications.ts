/**
 * file useNotifications.ts
 * description useNotifications Hook · 应用内通知状态管理
 * author YanYuCloudCube Team
 * version v1.1.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [hook],hook
 *
 * notes: 2026-10-07 移植适配自 yyc3-ui-organized ——
 *        1) Notification 类型内联（原依赖 ../components/NotificationCenter）；
 *        2) 移除业务模拟数据与随机自动推送（库包应提供纯状态 API，推送由调用方驱动）；
 *        3) 保留 add/markAsRead/markAllAsRead/delete/clearAll/unreadCount/hasNewNotification 完整 API。
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/** 应用内通知 / In-app notification */
export interface Notification {
  id: string;
  /** 通知类型（业务自定义字符串，如 business/alert/approval/system） */
  type: string;
  /** 优先级 */
  priority?: 'critical' | 'warning' | 'info';
  /** 标题（支持多语言对象或字符串） */
  title: string | { en: string; zh: string };
  /** 消息内容（支持多语言对象或字符串） */
  message: string | { en: string; zh: string };
  /** ISO 时间戳 */
  timestamp: string;
  /** 是否已读 */
  read: boolean;
  /** 是否可操作 */
  actionable?: boolean;
  /** 操作按钮文案 */
  actionLabel?: string | { en: string; zh: string };
  /** 操作目标模块 */
  actionTarget?: string;
  /** 附加数据 */
  data?: Record<string, unknown>;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const notificationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  /** 添加通知（新通知置顶并点亮新标志 3 秒） */
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setHasNewNotification(true);

    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setHasNewNotification(false);
    }, 3000);
  }, []);

  /** 标记为已读 */
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  /** 标记全部已读 */
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  /** 删除通知 */
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /** 清空所有通知 */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  /** 未读数量 */
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    hasNewNotification,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };
}
