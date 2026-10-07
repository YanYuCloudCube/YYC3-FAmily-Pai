/**
 * file types.ts
 * description AI 类型定义（AIProvider/AIConfig/AIMessage/AIStreamCallback）
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-03-26
 * updated: 2026-10-07
 * status: active
 * tags: [ai],[types]
 *
 * notes: 2026-10-07 归属迁移自 @yyc3/ui hooks 批次（原始来源 yyc3-zero-dep-components/ai）
 */

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
