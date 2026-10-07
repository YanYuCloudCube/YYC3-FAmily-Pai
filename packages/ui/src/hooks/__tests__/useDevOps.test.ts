/**
 * @file useDevOps.test.ts
 * @description useDevOps Hook 测试（2026-10-07 新写——基于 Mock 服务桩）
 * @author YYC³ Team
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDevOps } from '../useDevOps';
import { devOpsService } from '../../services/DevOpsService';

describe('useDevOps', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('初始状态来自服务层（Mock 空态）', () => {
    const { result } = renderHook(() => useDevOps());

    expect(result.current.servers).toEqual([]);
    expect(result.current.workflows).toEqual([]);
    expect(result.current.infraServices).toEqual([]);
    expect(result.current.opsLog).toEqual([]);
    expect(result.current.metrics).toEqual({ uptime: 0, responseTime: 0, errorRate: 0, activeConnections: 0 });
    expect(result.current.lastToolResult).toBeNull();
    expect(result.current.isToolExecuting).toBe(false);
    expect(result.current.executingWorkflowId).toBeNull();
  });

  it('probeServer 返回成功布尔', async () => {
    vi.spyOn(devOpsService, 'probeServer').mockResolvedValue({ success: true });
    const { result } = renderHook(() => useDevOps());

    let ok = false;
    await act(async () => {
      ok = await result.current.probeServer('srv-1');
    });

    expect(ok).toBe(true);
  });

  it('executeTool 记录 lastToolResult 且执行态复位', async () => {
    vi.spyOn(devOpsService, 'executeTool').mockResolvedValue({ success: true, data: { out: 'ok' } });
    const { result } = renderHook(() => useDevOps());

    expect(result.current.isToolExecuting).toBe(false);

    let res: any;
    await act(async () => {
      res = await result.current.executeTool('srv-1', 'tool-9', { q: 1 });
    });

    expect(res.success).toBe(true);
    expect(result.current.lastToolResult?.data).toEqual({ out: 'ok' });
    expect(result.current.isToolExecuting).toBe(false);
  });

  it('executeWorkflow 返回成功且清除执行中标记', async () => {
    vi.spyOn(devOpsService, 'executeWorkflow').mockResolvedValue({ success: true });
    const { result } = renderHook(() => useDevOps());

    let ok = false;
    await act(async () => {
      ok = await result.current.executeWorkflow('wf-1');
    });

    expect(ok).toBe(true);
    expect(result.current.isWorkflowExecuting).toBe(false);
    expect(result.current.executingWorkflowId).toBeNull();
  });

  it('scanHealth 完成后复位 isScanning', async () => {
    const scanSpy = vi.spyOn(devOpsService, 'scanHealth').mockResolvedValue(undefined);
    const { result } = renderHook(() => useDevOps());

    await act(async () => {
      await result.current.scanHealth();
    });

    expect(scanSpy).toHaveBeenCalled();
    expect(result.current.isScanning).toBe(false);
  });

  it('runDiagnostics 写入问题列表', () => {
    vi.spyOn(devOpsService, 'runDiagnostics').mockReturnValue([
      { id: 'd1', severity: 'high', message: 'CPU 过载', source: 'infra' },
    ]);
    const { result } = renderHook(() => useDevOps());

    act(() => {
      result.current.runDiagnostics();
    });

    expect(result.current.diagnosticIssues).toHaveLength(1);
    expect(result.current.diagnosticIssues[0].severity).toBe('high');
  });

  it('clearLog 清空操作日志', () => {
    const clearSpy = vi.spyOn(devOpsService, 'clearOpsLog').mockImplementation(() => {});
    const { result } = renderHook(() => useDevOps());

    act(() => {
      result.current.clearLog();
    });

    expect(result.current.opsLog).toEqual([]);
    expect(clearSpy).toHaveBeenCalled();
  });

  it('服务层状态刷新会同步到 Hook 状态', async () => {
    let notify: (() => void) | null = null;
    vi.spyOn(devOpsService, 'subscribe').mockImplementation((cb) => {
      notify = cb;
      return () => {};
    });
    const getServersSpy = vi.spyOn(devOpsService, 'getServers');

    const { result } = renderHook(() => useDevOps());
    expect(result.current.servers).toEqual([]);

    getServersSpy.mockReturnValue([
      { id: 's1', name: 'MCP Main', url: 'http://x', status: 'connected' },
    ]);

    act(() => {
      notify?.();
    });

    await waitFor(() => expect(result.current.servers).toHaveLength(1));
    expect(result.current.servers[0].id).toBe('s1');
  });
});
