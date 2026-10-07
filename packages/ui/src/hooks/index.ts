/**
 * file index.ts
 * description hooks 汇总导出（2026-10-07 移植批次）
 * module @yyc3/ui
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created: 2026-10-07
 * updated: 2026-10-07
 * status: active
 * tags: [hooks],[exports]
 */

// ── AI ──
export { useAI } from './useAI';
export type { UseAIReturn } from './useAI';

// ── 持久化 ──
export { usePersistedState, useRecentViews } from './usePersistedState';

// ── 渠道 ──
export { useChannelConfig, PRESETS } from './useChannelConfig';
export { useChannelManager } from './useChannelManager';
export type { Channel } from './useChannelManager';

// ── 聊天 ──
export { useChatPersistence } from './useChatPersistence';

// ── UI 设置 ──
export { useUISettings } from './useUISettings';

// ── 响应式（useMediaQuery 由 core/hooks.ts 提供，此处不重复导出）──
export {
  useResponsive,
  useViewport,
  useScrollPosition,
  useVisibility,
  useNetworkStatus,
  useBatteryStatus,
  useFoldableScreen,
  breakpoints,
} from './useResponsive';
export type { DeviceType, Orientation } from './useResponsive';

// ── 导航上下文 ──
export { useNavigationContext, generateRecommendations } from './useNavigationContext';
export type { NavigationContext, UseNavigationContextResult } from './useNavigationContext';

// ── 通知 ──
export { useNotifications } from './useNotifications';
export type { Notification } from './useNotifications';

// ── 共享类型（ChatMessage 与 components 既有导出冲突，不在此重导出）──
export type {
  AIProvider,
  AIConfig,
  AIMessage,
  AIStreamCallback,
  UISettings,
  Chat,
  ResponsiveState,
} from './types';
export { THEME_COLORS, FONT_OPTIONS, FONT_SIZE_OPTIONS } from './types';
