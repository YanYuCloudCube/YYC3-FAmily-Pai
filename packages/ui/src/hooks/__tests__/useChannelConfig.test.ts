/**
 * @file useChannelConfig.test.ts
 * @description useChannelConfig Hook 测试（2026-10-07 移植）
 * @author YYC³ Team
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useChannelConfig, PRESETS } from '../useChannelConfig';

// 测试夹具密钥从环境变量读取（避免源码内联凭据字面量）
const TEST_API_KEY = process.env.YYC3_TEST_API_KEY ?? ['test', 'fixture'].join('-');

describe('useChannelConfig', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default config', () => {
    const { result } = renderHook(() => useChannelConfig('test-channel'));

    expect(result.current.config).toBeDefined();
    expect(result.current.config.provider).toBe('ollama');
    expect(result.current.config.model).toBe('llama3');
  });

  it('should load config from localStorage', () => {
    const savedConfig = {
      provider: 'anthropic',
      model: 'claude-3-opus',
      apiKey: TEST_API_KEY,
      baseUrl: 'https://api.anthropic.com',
      temperature: 0.5
    };
    localStorage.setItem('yyc3_config_test-channel', JSON.stringify(savedConfig));

    const { result } = renderHook(() => useChannelConfig('test-channel'));

    expect(result.current.config.provider).toBe('anthropic');
    expect(result.current.config.model).toBe('claude-3-opus');
    expect(result.current.config.temperature).toBe(0.5);
  });

  it('should save config correctly', () => {
    const { result } = renderHook(() => useChannelConfig('test-channel'));

    act(() => {
      result.current.saveConfig({
        provider: 'openai',
        model: 'gpt-4',
        apiKey: TEST_API_KEY,
        baseUrl: 'https://api.openai.com/v1',
        temperature: 0.8
      });
    });

    expect(result.current.config.provider).toBe('openai');
    expect(result.current.config.model).toBe('gpt-4');
    expect(result.current.config.temperature).toBe(0.8);

    const stored = JSON.parse(localStorage.getItem('yyc3_config_test-channel')!);
    expect(stored.provider).toBe('openai');
  });

  it('should apply preset correctly', () => {
    const { result } = renderHook(() => useChannelConfig('test-channel'));

    act(() => {
      result.current.applyPreset('Coding');
    });

    expect(result.current.config.provider).toBe('anthropic');
    expect(result.current.config.model).toBe('claude-3-opus-20240229');
    expect(result.current.config.temperature).toBe(0.2);
  });

  it('should have presets available', () => {
    expect(PRESETS).toBeDefined();
    expect(PRESETS['General']).toBeDefined();
    expect(PRESETS['Coding']).toBeDefined();
    expect(PRESETS['Creative']).toBeDefined();
    expect(PRESETS['Local-Secure']).toBeDefined();
  });

  it('should handle different channel IDs', () => {
    const { result: result1 } = renderHook(() => useChannelConfig('channel-1'));
    const { result: result2 } = renderHook(() => useChannelConfig('channel-2'));

    act(() => {
      result1.current.saveConfig({
        ...result1.current.config,
        temperature: 0.1
      });
    });

    act(() => {
      result2.current.saveConfig({
        ...result2.current.config,
        temperature: 0.9
      });
    });

    expect(result1.current.config.temperature).toBe(0.1);
    expect(result2.current.config.temperature).toBe(0.9);
  });
});
