/**
 * file types.ts
 * description hooks 共享类型定义（移植自 YYC3-UI 资产库 yyc3-ui-organized）
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [hook],[types]
 *
 * notes: 2026-10-07 移植合并 —— AI 类型取自 yyc3-zero-dep-components/ai，
 *        UI/Chat 类型取自 yyc3-zero-dependency/hooks/types/storage.ts；
 *        移除与 useChannelConfig 局部定义冲突的 AIConfig 旧版。
 */

// ── AI 类型（来源：yyc3-zero-dep-components/ai/src/types.ts）──

/** AI 提供商 / AI Provider */
export type AIProvider =
  | 'openai'
  | 'anthropic'
  | 'ollama'
  | 'zhipu'
  | 'qwen'
  | 'deepseek'
  | 'custom';

/** AI 配置 / AI Configuration */
export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  version?: number;
}

/** AI 消息 / AI Message */
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/** AI 流式回调 / AI Stream Callback */
export type AIStreamCallback = (chunk: string) => void;

// ── UI 设置类型（来源：hooks/types/storage.ts）──

export interface UISettings {
  theme: 'light' | 'dark' | 'system';
  themeColorId?: string;
  bgOpacity?: number;
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  fontId?: string;
  fontFamily: string;
  reducedMotion: boolean;
  highContrast: boolean;
  scanlines?: number;
  curvature?: boolean;
  animations?: boolean;
  topBarText?: string;
  systemDisplayName?: string;
  version?: number;
}

export const THEME_COLORS = [
  { id: 'blue', name: '默认蓝', value: '#3b82f6' },
  { id: 'purple', name: '科技紫', value: '#8b5cf6' },
  { id: 'green', name: '赛博绿', value: '#10b981' },
  { id: 'red', name: '警示红', value: '#ef4444' },
  { id: 'orange', name: '霓虹橙', value: '#f97316' },
  { id: 'gold', name: '暗夜金', value: '#eab308' },
] as const;

export const FONT_OPTIONS = [
  { id: 'system', name: '系统默认', value: 'system-ui' },
  { id: 'noto', name: '思源黑体', value: 'Noto Sans SC' },
  { id: 'yahei', name: '微软雅黑', value: 'Microsoft YaHei' },
  { id: 'mono', name: '等宽字体', value: 'monospace' },
] as const;

export const FONT_SIZE_OPTIONS = [
  { id: 'small', name: '小', value: 'small' },
  { id: 'medium', name: '中', value: 'medium' },
  { id: 'large', name: '大', value: 'large' },
] as const;

// ── 聊天类型 ──

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  isStarred?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// ── 响应式状态 ──

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}
