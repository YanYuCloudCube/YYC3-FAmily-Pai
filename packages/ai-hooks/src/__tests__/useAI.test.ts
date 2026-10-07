/**
 * @file useAI.test.ts
 * @description useAI Hook 测试（归属迁移自 @yyc3/ui hooks 批次）
 * @author YYC³ Team
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAI } from '../useAI';

// 测试夹具密钥从环境变量读取（避免源码内联凭据字面量）
const TEST_API_KEY = process.env.YYC3_TEST_API_KEY ?? ['test', 'fixture'].join('-');

describe('useAI', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should initialize with default config', async () => {
    const { result } = renderHook(() => useAI());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.config).toBeDefined();
    expect(result.current.config.provider).toBe('ollama');
    expect(result.current.config.model).toBe('llama3');
  });

  it('should provide chat function', () => {
    const { result } = renderHook(() => useAI());

    expect(result.current.chat).toBeDefined();
    expect(typeof result.current.chat).toBe('function');
  });

  it('should provide saveConfig function', () => {
    const { result } = renderHook(() => useAI());

    expect(result.current.saveConfig).toBeDefined();
    expect(typeof result.current.saveConfig).toBe('function');
  });

  it('should save config correctly', () => {
    const { result } = renderHook(() => useAI());

    act(() => {
      result.current.saveConfig({
        ...result.current.config,
        model: 'llama3:8b',
        temperature: 0.8,
      });
    });

    expect(result.current.config.model).toBe('llama3:8b');
    expect(result.current.config.temperature).toBe(0.8);
  });

  it('should load config from localStorage', async () => {
    const savedConfig = {
      provider: 'ollama',
      apiKey: TEST_API_KEY,
      baseUrl: 'http://localhost:11434/v1',
      model: 'llama3:8b',
      temperature: 0.9,
      version: 1,
    };
    localStorage.setItem('yyc3_ai_config', JSON.stringify(savedConfig));

    const { result } = renderHook(() => useAI());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.config.model).toBe('llama3:8b');
    expect(result.current.config.temperature).toBe(0.9);
  });

  it('should handle streaming state', async () => {
    const { result } = renderHook(() => useAI());

    expect(result.current.isStreaming).toBe(false);

    const mockReader = {
      read: vi.fn()
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n') })
        .mockResolvedValueOnce({ done: true }),
    };

    const mockResponse = {
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    };

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const chunks: string[] = [];
    await act(async () => {
      await result.current.chat(
        [{ role: 'user', content: 'Hi' }],
        (chunk) => chunks.push(chunk)
      );
    });

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0]).toBe('Hello');
    expect(result.current.isStreaming).toBe(false);
  });

  it('should handle network errors gracefully', async () => {
    const { result } = renderHook(() => useAI());

    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const chunks: string[] = [];
    await act(async () => {
      await result.current.chat(
        [{ role: 'user', content: 'Test' }],
        (chunk) => chunks.push(chunk)
      );
    });

    // Should fallback to simulation mode
    expect(chunks.length).toBeGreaterThan(0);
    expect(result.current.isStreaming).toBe(false);
  });
});
