/**
 * file useAI.ts
 * description AI React Hook · 提供 AI 对话功能，支持流式响应和多提供商
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-03-26
 * updated: 2026-10-07
 * status: active
 * tags: [hook],[ai],[react]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief: 核心 AI Hook，管理对话、配置和流式响应
 *
 * details:
 * - AI 对话功能（支持流式响应）
 * - 多提供商支持（OpenAI, Anthropic, Ollama 等）
 * - 配置管理（localStorage 持久化，支持版本迁移）
 * - 自动降级（网络失败时使用模拟响应）
 * - 超时控制（默认 2 秒超时）
 *
 * dependencies: React (useState, useEffect, useCallback), Fetch API, localStorage
 * exports: useAI, UseAIReturn
 * notes: 2026-10-07 归属迁移自 @yyc3/ui hooks 批次（原始来源
 *        yyc3-ui-organized/yyc3-zero-dep-components/ai 纯 react 版）
 */

import { useState, useEffect, useCallback } from 'react';
import type { AIConfig, AIMessage, AIStreamCallback } from './types';

export interface UseAIReturn {
  chat: (messages: AIMessage[], onChunk: AIStreamCallback) => Promise<void>;
  isStreaming: boolean;
  config: AIConfig;
  saveConfig: (newConfig: AIConfig) => void;
  loading: boolean;
}

const DEFAULT_CONFIG: AIConfig = {
  provider: 'ollama',
  apiKey: 'ollama',
  baseUrl: 'http://localhost:11434/v1',
  model: 'llama3',
  temperature: 0.7,
  version: 1,
};

const STORAGE_KEY = 'yyc3_ai_config';
const CURRENT_VERSION = 1;

/**
 * AI Hook
 *
 * 提供AI对话功能，支持流式响应、多提供商和配置管理
 *
 * @example
 * ```tsx
 * const { chat, isStreaming, config } = useAI();
 * await chat([{ role: 'user', content: 'Hi' }], (chunk) => console.log(chunk));
 * ```
 */
export function useAI(): UseAIReturn {
  const [config, setConfig] = useState<AIConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version !== CURRENT_VERSION) {
          const migrated = { ...DEFAULT_CONFIG, ...parsed, version: CURRENT_VERSION };
          setConfig(migrated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        } else {
          setConfig(parsed);
        }
      }
    } catch {
      // 加载失败使用默认配置 / Use default config on load failure
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfig = useCallback((newConfig: AIConfig) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch {
      // 保存失败静默处理 / Silent on save failure
    }
  }, []);

  const chat = useCallback(
    async (messages: AIMessage[], onChunk: AIStreamCallback) => {
      setIsStreaming(true);
      const currentConfig = config;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        try {
          const response = await fetch(`${currentConfig.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentConfig.apiKey}`,
            },
            body: JSON.stringify({
              model: currentConfig.model,
              messages,
              temperature: currentConfig.temperature,
              stream: true,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`AI API Error: ${response.statusText}`);
          }
          if (!response.body) {
            throw new Error('No response body');
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = (buffer + chunk).split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ')) {
                const dataStr = trimmed.slice(6);
                if (dataStr === '[DONE]') continue;

                try {
                  const data = JSON.parse(dataStr);
                  const content = data.choices?.[0]?.delta?.content || '';
                  if (content) {
                    onChunk(content);
                  }
                } catch {
                  // 流式块解析异常忽略 / Ignore stream chunk parse error
                }
              }
            }
          }
        } catch {
          // 网络失败时的模拟响应 / Simulated response on network failure
          const fallbackMessage =
            'Local inference node unreachable. Using simulated response.\n\n' +
            `Your message has been processed. In production, this would be the actual AI response from ${currentConfig.model}.`;

          const chunks = fallbackMessage.split(' ');
          for (const chunk of chunks) {
            await new Promise((r) => setTimeout(r, 50));
            onChunk(chunk + ' ');
          }
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        onChunk(`\n[SYSTEM_ERROR]: ${errorMessage}\n`);
      } finally {
        setIsStreaming(false);
      }
    },
    [config]
  );

  return { chat, isStreaming, config, saveConfig, loading };
}
