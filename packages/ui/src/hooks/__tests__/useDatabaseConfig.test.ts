/**
 * @file useDatabaseConfig.test.ts
 * @description useDatabaseConfig Hook 测试（2026-10-07 新写——基于 Mock 服务桩）
 * @author YYC³ Team
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDatabaseConfig } from '../useDatabaseConfig';
import { databaseService } from '../../services/DatabaseService';

describe('useDatabaseConfig', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('初始状态：默认配置 + 断开 + Mock 模式', () => {
    const { result } = renderHook(() => useDatabaseConfig());

    expect(result.current.config.provider).toBe('postgresql');
    expect(result.current.config.host).toBe('localhost');
    expect(result.current.config.port).toBe(5432);
    expect(result.current.connectionStatus).toBe('disconnected');
    expect(result.current.isMockMode).toBe(true);
    expect(result.current.isConnecting).toBe(false);
    expect(result.current.lastError).toBeNull();
    expect(result.current.syncStrategy).toEqual({ mode: 'auto', interval: 30000, retryAttempts: 3 });
    expect(result.current.stats).toEqual({ totalRecords: 0, lastSync: '', syncDuration: 0, conflicts: 0 });
  });

  it('connect 成功：状态转 connected 并写入 health', async () => {
    const saveSpy = vi.spyOn(databaseService, 'initializeConnection').mockResolvedValue({
      success: true,
      data: { latency: 12, available: true, lastChecked: '2026-10-07T00:00:00Z' },
    });
    const { result } = renderHook(() => useDatabaseConfig());

    let ok = false;
    await act(async () => {
      ok = await result.current.connect();
    });

    expect(ok).toBe(true);
    expect(result.current.connectionStatus).toBe('connected');
    expect(result.current.health?.latency).toBe(12);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('connect 失败：状态转 error 且记录 lastError', async () => {
    vi.spyOn(databaseService, 'initializeConnection').mockResolvedValue({
      success: false,
      error: 'ECONNREFUSED',
    });
    const { result } = renderHook(() => useDatabaseConfig());

    let ok = true;
    await act(async () => {
      ok = await result.current.connect();
    });

    expect(ok).toBe(false);
    expect(result.current.connectionStatus).toBe('error');
    expect(result.current.lastError).toBe('ECONNREFUSED');
  });

  it('connect 抛异常：走 catch 分支', async () => {
    vi.spyOn(databaseService, 'initializeConnection').mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useDatabaseConfig());

    let ok = true;
    await act(async () => {
      ok = await result.current.connect();
    });

    expect(ok).toBe(false);
    expect(result.current.lastError).toBe('boom');
  });

  it('disconnect：回到 disconnected 并清空 health', async () => {
    vi.spyOn(databaseService, 'initializeConnection').mockResolvedValue({
      success: true,
      data: { latency: 1, available: true, lastChecked: '' },
    });
    const disconnectSpy = vi.spyOn(databaseService, 'disconnect').mockImplementation(() => {});
    const { result } = renderHook(() => useDatabaseConfig());

    await act(async () => { await result.current.connect(); });
    act(() => { result.current.disconnect(); });

    expect(result.current.connectionStatus).toBe('disconnected');
    expect(result.current.health).toBeNull();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('testConnection 成功后断开不保留连接', async () => {
    vi.spyOn(databaseService, 'initializeConnection').mockResolvedValue({ success: true });
    const { result } = renderHook(() => useDatabaseConfig());

    let ok = false;
    await act(async () => {
      ok = await result.current.testConnection();
    });

    expect(ok).toBe(true);
    expect(result.current.connectionStatus).toBe('disconnected');
  });

  it('saveConfig 增量更新并落服务层', () => {
    const saveSpy = vi.spyOn(databaseService, 'saveConfig').mockImplementation(() => {});
    const { result } = renderHook(() => useDatabaseConfig());

    act(() => {
      result.current.saveConfig({ host: 'db.internal', poolSize: 20 });
    });

    expect(result.current.config.host).toBe('db.internal');
    expect(result.current.config.poolSize).toBe(20);
    expect(result.current.config.provider).toBe('postgresql');
    expect(saveSpy).toHaveBeenCalled();
  });

  it('saveProxyConfig 增量更新', () => {
    const saveSpy = vi.spyOn(databaseService, 'saveProxyConfig').mockImplementation(() => {});
    const { result } = renderHook(() => useDatabaseConfig());

    act(() => {
      result.current.saveProxyConfig({ timeout: 3000 });
    });

    expect(result.current.proxyConfig.timeout).toBe(3000);
    expect(result.current.proxyConfig.baseUrl).toBe('http://localhost:3721');
    expect(saveSpy).toHaveBeenCalled();
  });

  it('updateSyncStrategy 合并更新', () => {
    const setSpy = vi.spyOn(databaseService, 'setSyncStrategy').mockImplementation(() => {});
    const { result } = renderHook(() => useDatabaseConfig());

    act(() => {
      result.current.updateSyncStrategy({ interval: 60000 });
    });

    expect(result.current.syncStrategy.interval).toBe(60000);
    expect(result.current.syncStrategy.mode).toBe('auto');
    expect(setSpy).toHaveBeenCalled();
  });

  it('syncNow 返回服务结果', async () => {
    vi.spyOn(databaseService, 'syncNow').mockResolvedValue({ success: true, synced: 42 });
    const { result } = renderHook(() => useDatabaseConfig());

    let ok = false;
    await act(async () => {
      ok = await result.current.syncNow();
    });

    expect(ok).toBe(true);
  });

  it('服务层 getConfig 返回时覆盖默认配置', async () => {
    vi.spyOn(databaseService, 'getConfig').mockReturnValue({
      provider: 'mysql',
      host: 'remote.db',
      port: 3306,
    });
    const { result } = renderHook(() => useDatabaseConfig());

    await waitFor(() => expect(result.current.config.provider).toBe('mysql'));
    expect(result.current.config.host).toBe('remote.db');
  });
});
