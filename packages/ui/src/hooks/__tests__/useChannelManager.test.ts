/**
 * @file useChannelManager.test.ts
 * @description useChannelManager Hook 测试（2026-10-07 移植）
 * @author YYC³ Team
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useChannelManager } from '../useChannelManager';

describe('useChannelManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default channel', () => {
    const { result } = renderHook(() => useChannelManager());

    expect(result.current.channels).toHaveLength(1);
    expect(result.current.channels[0].id).toBe('main');
    expect(result.current.activeChannelId).toBe('main');
  });

  it('should create a new channel', () => {
    const { result } = renderHook(() => useChannelManager());

    let channelId: string;
    act(() => {
      channelId = result.current.createChannel('Test Channel');
    });

    expect(result.current.channels).toHaveLength(2);
    expect(result.current.channels[1].name).toBe('Test Channel');
    expect(channelId!).toBeDefined();
  });

  it('should delete a channel', () => {
    const { result } = renderHook(() => useChannelManager());

    act(() => {
      result.current.createChannel('To Delete');
    });

    expect(result.current.channels).toHaveLength(2);

    const channelId = result.current.channels[1].id;
    act(() => {
      result.current.deleteChannel(channelId);
    });

    expect(result.current.channels).toHaveLength(1);
  });

  it('should not delete main channel', () => {
    const { result } = renderHook(() => useChannelManager());

    act(() => {
      result.current.deleteChannel('main');
    });

    expect(result.current.channels).toHaveLength(1);
    expect(result.current.channels[0].id).toBe('main');
  });

  it('should update channel name', () => {
    const { result } = renderHook(() => useChannelManager());

    let channelId: string;
    act(() => {
      channelId = result.current.createChannel('Original Name');
    });

    act(() => {
      result.current.updateChannelName(channelId!, 'Updated Name');
    });

    expect(result.current.channels[1].name).toBe('Updated Name');
  });

  it('should set active channel', () => {
    const { result } = renderHook(() => useChannelManager());

    let channelId: string;
    act(() => {
      channelId = result.current.createChannel('New Channel');
    });

    expect(result.current.activeChannelId).toBe('main');

    act(() => {
      result.current.setActiveChannelId(channelId!);
    });

    expect(result.current.activeChannelId).toBe(channelId!);
  });

  it('should switch to main when active channel is deleted', () => {
    const { result } = renderHook(() => useChannelManager());

    let channelId: string;
    act(() => {
      channelId = result.current.createChannel('Test');
    });

    act(() => {
      result.current.setActiveChannelId(channelId!);
    });

    expect(result.current.activeChannelId).toBe(channelId!);

    act(() => {
      result.current.deleteChannel(channelId!);
    });

    expect(result.current.activeChannelId).toBe('main');
  });

  it('should persist channels to localStorage', () => {
    const { result } = renderHook(() => useChannelManager());

    act(() => {
      result.current.createChannel('Channel 1');
    });

    const stored = localStorage.getItem('yyc3_channels_meta');
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(2); // main + 1 new channel
  });

  it('should load channels from localStorage', () => {
    const savedChannels = [
      { id: 'main', name: 'Main Console', createdAt: new Date().toISOString() },
      { id: 'chan_1', name: 'Saved Channel', createdAt: new Date().toISOString() }
    ];
    localStorage.setItem('yyc3_channels_meta', JSON.stringify(savedChannels));

    const { result } = renderHook(() => useChannelManager());

    expect(result.current.channels).toHaveLength(2);
    expect(result.current.channels[1].name).toBe('Saved Channel');
  });
});
