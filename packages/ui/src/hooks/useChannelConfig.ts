/**
 * file useChannelConfig.ts
 * description useChannelConfig Hook · 按渠道持久化的 AI 渠道配置
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [hook],hook
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized；局部 AIConfig 不导出以避免与 types.ts 冲突
 */

import { useState, useEffect, useCallback } from "react";

const CONFIG_KEY_PREFIX = "yyc3_config_";

interface AIConfig {
  provider: string;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
}

const DEFAULT_CONFIG: AIConfig = {
  provider: "ollama",
  model: "llama3",
  apiKey: "ollama",
  baseUrl: "http://localhost:11434/v1",
  temperature: 0.7
};

export const PRESETS: Record<string, Partial<AIConfig>> = {
  "General": { ...DEFAULT_CONFIG },
  "Coding": {
    provider: "anthropic",
    model: "claude-3-opus-20240229",
    temperature: 0.2
  },
  "Creative": {
    provider: "openai",
    model: "gpt-4-turbo",
    temperature: 0.9
  },
  "Local-Secure": {
    provider: "ollama",
    model: "llama3",
    baseUrl: "http://localhost:11434/v1",
    temperature: 0.5
  }
};

export function useChannelConfig(channelId: string) {
  const [config, setConfig] = useState<AIConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${CONFIG_KEY_PREFIX}${channelId}`);
      if (stored) {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(stored) });
      } else {
        setConfig(DEFAULT_CONFIG);
      }
    } catch (e) {
      console.error("Failed to load channel config:", e);
    }
  }, [channelId]);

  const saveConfig = useCallback((newConfig: AIConfig) => {
    localStorage.setItem(`${CONFIG_KEY_PREFIX}${channelId}`, JSON.stringify(newConfig));
    setConfig(newConfig);
  }, [channelId]);

  const applyPreset = useCallback((presetName: string) => {
    const preset = PRESETS[presetName];
    if (preset) {
      saveConfig({ ...config, ...preset });
    }
  }, [config, saveConfig]);

  return {
    config,
    saveConfig,
    applyPreset
  };
}
