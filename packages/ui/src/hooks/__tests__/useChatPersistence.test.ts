/**
 * @file useChatPersistence.test.ts
 * @description useChatPersistence Hook 测试（2026-10-07 移植）
 * @author YYC³ Team
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useChatPersistence } from '../useChatPersistence';
import type { Chat } from '../types';

describe('useChatPersistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockChats: Chat[] = [
    {
      id: 'chat-1',
      title: 'Test Chat 1',
      messages: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      isStarred: false,
    },
    {
      id: 'chat-2',
      title: 'Test Chat 2',
      messages: [],
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      isStarred: true,
    },
  ];

  it('should initialize with empty chats', () => {
    const { result } = renderHook(() => useChatPersistence('main'));

    expect(result.current.chats).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should initialize with initial chats', () => {
    const { result } = renderHook(() =>
      useChatPersistence('main', mockChats)
    );

    expect(result.current.chats).toEqual(mockChats);
  });

  it('should add a new chat', () => {
    const { result } = renderHook(() => useChatPersistence('main'));

    act(() => {
      result.current.setChats([mockChats[0]]);
    });

    expect(result.current.chats).toHaveLength(1);
    expect(result.current.chats[0].id).toBe('chat-1');
  });

  it('should clear all chats', () => {
    const { result } = renderHook(() =>
      useChatPersistence('main', mockChats)
    );

    act(() => {
      result.current.setChats([]);
    });

    expect(result.current.chats).toHaveLength(0);
  });

  it('should persist chats to localStorage', () => {
    const { result } = renderHook(() => useChatPersistence('main'));

    act(() => {
      result.current.setChats(mockChats);
    });

    const stored = localStorage.getItem('yyc3_chat_history');
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(2);
  });

  it('should load chats from localStorage on mount', () => {
    localStorage.setItem('yyc3_chat_history', JSON.stringify(mockChats));

    const { result } = renderHook(() => useChatPersistence('main'));

    expect(result.current.chats).toHaveLength(2);
    expect(result.current.chats[0].id).toBe('chat-1');
  });

  it('should use main storage key for main channel', () => {
    const { result } = renderHook(() => useChatPersistence('main'));

    act(() => {
      result.current.setChats(mockChats);
    });

    expect(localStorage.getItem('yyc3_chat_history')).toBeDefined();
  });

  it('should use custom storage key for other channels', () => {
    const { result } = renderHook(() => useChatPersistence('custom-channel'));

    act(() => {
      result.current.setChats(mockChats);
    });

    expect(localStorage.getItem('yyc3_chat_history_custom-channel')).toBeDefined();
  });

  it('should export data correctly', () => {
    // jsdom 未实现 Blob URL，需 mock
    URL.createObjectURL = vi.fn(() => 'blob:mock');
    URL.revokeObjectURL = vi.fn();

    const { result } = renderHook(() =>
      useChatPersistence('main', mockChats)
    );

    const mockAnchor = document.createElement('a');
    const clickSpy = vi.spyOn(mockAnchor, 'click');

    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);

    act(() => {
      result.current.exportData();
    });

    expect(clickSpy).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('should import data correctly', () => {
    const { result } = renderHook(() => useChatPersistence('main'));

    const importData = {
      channelId: 'main',
      timestamp: new Date().toISOString(),
      chats: mockChats,
    };

    let success = false;
    act(() => {
      success = result.current.importData(JSON.stringify(importData));
    });

    expect(success).toBe(true);
    expect(result.current.chats).toHaveLength(2);
  });
});
