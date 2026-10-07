/**
 * file useDevOps.ts
 * description useDevOps Hook · DevOps 智能运维（MCP 服务器/工作流/健康/诊断/日志）
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [hook],hook
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized；服务/类型引用调整为 '../services/DevOpsService'
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { devOpsService } from "../services/DevOpsService";
import type {
  MCPServer,
  MCPToolResult,
  Workflow,
  InfraService,
  DiagnosticIssue,
  OpsLogEntry,
  DevOpsMetrics,
} from "../services/DevOpsService";

export interface UseDevOpsReturn {
  servers: MCPServer[];
  probeServer: (serverId: string) => Promise<boolean>;
  probeAllServers: () => Promise<number>;
  disconnectServer: (serverId: string) => void;
  toggleAutoConnect: (serverId: string) => void;
  executeTool: (serverId: string, toolId: string, params?: Record<string, string | number | boolean>) => Promise<MCPToolResult>;
  lastToolResult: MCPToolResult | null;
  isToolExecuting: boolean;

  workflows: Workflow[];
  executeWorkflow: (workflowId: string) => Promise<boolean>;
  toggleWorkflow: (workflowId: string) => void;
  resetWorkflow: (workflowId: string) => void;
  isWorkflowExecuting: boolean;
  executingWorkflowId: string | null;

  infraServices: InfraService[];
  scanHealth: () => Promise<void>;
  isScanning: boolean;

  diagnosticIssues: DiagnosticIssue[];
  runDiagnostics: () => void;

  metrics: DevOpsMetrics;
  opsLog: OpsLogEntry[];
  refreshLog: () => void;
  clearLog: () => void;

  refreshAll: () => void;
}

/**
 * DevOps 智能运维 Hook
 *
 * 提供完整的 DevOps 生命周期管理：
 * - MCP 服务器注册、探测、工具执行
 * - 工作流定义、执行、监控
 * - 全栈健康聚合
 * - 智能诊断与问题检测
 * - 操作日志与仪表盘指标
 */
export function useDevOps(): UseDevOpsReturn {
  const [servers, setServers] = useState<MCPServer[]>(devOpsService.getServers());
  const [workflows, setWorkflows] = useState<Workflow[]>(devOpsService.getWorkflows());
  const [infraServices, setInfraServices] = useState<InfraService[]>(devOpsService.getInfraServices());
  const [diagnosticIssues, setDiagnosticIssues] = useState<DiagnosticIssue[]>([]);
  const [opsLog, setOpsLog] = useState<OpsLogEntry[]>(devOpsService.getOpsLog());
  const [metrics, setMetrics] = useState<DevOpsMetrics>(devOpsService.getMetrics());
  const [lastToolResult, setLastToolResult] = useState<MCPToolResult | null>(null);
  const [isToolExecuting, setIsToolExecuting] = useState(false);
  const [isWorkflowExecuting, setIsWorkflowExecuting] = useState(false);
  const [executingWorkflowId, setExecutingWorkflowId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const mountedRef = useRef(true);

  const refreshAll = useCallback(() => {
    if (!mountedRef.current) return;
    setServers(devOpsService.getServers());
    setWorkflows(devOpsService.getWorkflows());
    setInfraServices(devOpsService.getInfraServices());
    setOpsLog(devOpsService.getOpsLog());
    setMetrics(devOpsService.getMetrics());
  }, []);

  useEffect(() => {
    const unsubscribe = devOpsService.subscribe(refreshAll);
    return () => {
      unsubscribe();
      mountedRef.current = false;
    };
  }, [refreshAll]);

  const probeServer = useCallback(async (serverId: string): Promise<boolean> => {
    const result = await devOpsService.probeServer(serverId);
    refreshAll();
    return result.success;
  }, [refreshAll]);

  const probeAllServers = useCallback(async (): Promise<number> => {
    const count = await devOpsService.probeAllServers();
    refreshAll();
    return count;
  }, [refreshAll]);

  const disconnectServer = useCallback((serverId: string) => {
    devOpsService.disconnectServer(serverId);
    refreshAll();
  }, [refreshAll]);

  const toggleAutoConnect = useCallback((serverId: string) => {
    devOpsService.toggleAutoConnect(serverId);
    refreshAll();
  }, [refreshAll]);

  const executeTool = useCallback(async (
    serverId: string,
    toolId: string,
    params?: Record<string, string | number | boolean>
  ): Promise<MCPToolResult> => {
    setIsToolExecuting(true);
    try {
      const result = await devOpsService.executeTool(serverId, toolId, params);
      setLastToolResult(result);
      refreshAll();
      return result;
    } finally {
      setIsToolExecuting(false);
    }
  }, [refreshAll]);

  const executeWorkflow = useCallback(async (workflowId: string): Promise<boolean> => {
    setIsWorkflowExecuting(true);
    setExecutingWorkflowId(workflowId);
    try {
      const result = await devOpsService.executeWorkflow(workflowId);
      refreshAll();
      return result.success;
    } finally {
      setIsWorkflowExecuting(false);
      setExecutingWorkflowId(null);
    }
  }, [refreshAll]);

  const toggleWorkflow = useCallback((workflowId: string) => {
    devOpsService.toggleWorkflow(workflowId);
    refreshAll();
  }, [refreshAll]);

  const resetWorkflow = useCallback((workflowId: string) => {
    devOpsService.resetWorkflow(workflowId);
    refreshAll();
  }, [refreshAll]);

  const scanHealth = useCallback(async () => {
    setIsScanning(true);
    try {
      await devOpsService.scanHealth();
      refreshAll();
    } finally {
      setIsScanning(false);
    }
  }, [refreshAll]);

  const runDiagnostics = useCallback(() => {
    const issues = devOpsService.runDiagnostics();
    setDiagnosticIssues(issues);
  }, []);

  const refreshLog = useCallback(() => {
    setOpsLog(devOpsService.getOpsLog());
  }, []);

  const clearLog = useCallback(() => {
    devOpsService.clearOpsLog();
    setOpsLog([]);
  }, []);

  return {
    servers,
    probeServer,
    probeAllServers,
    disconnectServer,
    toggleAutoConnect,
    executeTool,
    lastToolResult,
    isToolExecuting,

    workflows,
    executeWorkflow,
    toggleWorkflow,
    resetWorkflow,
    isWorkflowExecuting,
    executingWorkflowId,

    infraServices,
    scanHealth,
    isScanning,

    diagnosticIssues,
    runDiagnostics,

    metrics,
    opsLog,
    refreshLog,
    clearLog,

    refreshAll,
  };
}
