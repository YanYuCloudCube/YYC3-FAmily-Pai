/**
 * file useDatabaseConfig.ts
 * description useDatabaseConfig Hook · 数据库连接生命周期管理
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [hook],hook
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized；服务/类型引用调整为 '../services/DatabaseService'
 */

import { useState, useEffect, useCallback } from "react";
import { databaseService, type SyncStrategy, type DatabaseStats } from "../services/DatabaseService";
import type {
  DatabaseConfig,
  LocalAPIProxyConfig,
  ConnectionStatus,
  ConnectionHealth,
} from "../services/DatabaseService";

export interface UseDatabaseConfigReturn {
  config: DatabaseConfig;
  proxyConfig: LocalAPIProxyConfig;
  connectionStatus: ConnectionStatus;
  health: ConnectionHealth | null;
  stats: DatabaseStats;
  syncStrategy: SyncStrategy;
  isConnecting: boolean;
  isMockMode: boolean;
  reconnectStats: { attempts: number; probeInterval: number; consecutiveSuccess: number };
  lastError: string | null;
  saveConfig: (config: Partial<DatabaseConfig>) => void;
  saveProxyConfig: (config: Partial<LocalAPIProxyConfig>) => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  testConnection: () => Promise<boolean>;
  syncNow: () => Promise<boolean>;
  updateSyncStrategy: (strategy: Partial<SyncStrategy>) => void;
}

const DEFAULT_CONFIG: DatabaseConfig = {
  id: "pg_local_default",
  name: "YYC3_LOCAL_PG15",
  provider: "postgresql",
  host: "localhost",
  port: 5432,
  database: "yyc3_family",
  username: "yyc3_admin",
  password: "",
  schema: "public",
  sslMode: "prefer",
  poolSize: 10,
  connectionTimeout: 5000,
  idleTimeout: 30000,
  autoMigrate: true,
  enableLogging: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_PROXY: LocalAPIProxyConfig = {
  baseUrl: "http://localhost:3721",
  apiVersion: "v1",
  authToken: "",
  timeout: 10000,
  enableRetry: true,
  maxRetries: 3,
  heartbeatInterval: 30000,
};

/**
 * 数据库配置管理 Hook
 *
 * 提供完整的数据库连接生命周期管理：
 * - 配置持久化（localStorage）
 * - 连接/断开/测试
 * - 数据同步
 * - 健康监控
 */
export function useDatabaseConfig(): UseDatabaseConfigReturn {
  const [config, setConfig] = useState<DatabaseConfig>(DEFAULT_CONFIG);
  const [proxyConfig, setProxyConfig] = useState<LocalAPIProxyConfig>(DEFAULT_PROXY);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [health, setHealth] = useState<ConnectionHealth | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [syncStrategy, setSyncStrategy] = useState<SyncStrategy>(
    databaseService.getSyncStrategy()
  );

  useEffect(() => {
    const savedConfig = databaseService.getConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    }

    const savedProxy = databaseService.getProxyConfig();
    if (savedProxy) {
      setProxyConfig(savedProxy);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = databaseService.onStatusChange((event) => {
      setConnectionStatus(event.currentStatus);

      if (event.previousStatus === "error" && event.currentStatus === "connected") {
        setLastError(null);
      }

      if (event.isMockMode && event.currentStatus === "error") {
        setLastError(`MOCK_MODE_ACTIVE / 模拟模式激活 (重连尝试: ${event.reconnectAttempts})`);
      }
    });

    return unsubscribe;
  }, []);

  const saveConfig = useCallback(
    (partial: Partial<DatabaseConfig>) => {
      const updated: DatabaseConfig = {
        ...config,
        ...partial,
        updatedAt: new Date().toISOString(),
      };
      setConfig(updated);
      databaseService.saveConfig(updated);
    },
    [config]
  );

  const saveProxyConfig = useCallback(
    (partial: Partial<LocalAPIProxyConfig>) => {
      const updated: LocalAPIProxyConfig = {
        ...proxyConfig,
        ...partial,
      };
      setProxyConfig(updated);
      databaseService.saveProxyConfig(updated);
    },
    [proxyConfig]
  );

  const connect = useCallback(async (): Promise<boolean> => {
    setIsConnecting(true);
    setLastError(null);

    try {
      const result = await databaseService.initializeConnection(config);

      if (result.success && result.data) {
        setConnectionStatus("connected");
        setHealth(result.data);
        return true;
      } else {
        setConnectionStatus("error");
        setLastError(result.error ?? "CONNECTION_FAILED / 连接失败");
        return false;
      }
    } catch (err) {
      setConnectionStatus("error");
      setLastError(err instanceof Error ? err.message : "UNKNOWN_ERROR / 未知错误");
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [config]);

  const disconnect = useCallback(() => {
    databaseService.disconnect();
    setConnectionStatus("disconnected");
    setHealth(null);
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    setIsConnecting(true);
    setLastError(null);

    try {
      const result = await databaseService.initializeConnection(config);
      const success = result.success;

      if (!success) {
        setLastError(result.error ?? "TEST_FAILED / 测试失败");
      }

      databaseService.disconnect();
      setConnectionStatus("disconnected");

      return success;
    } catch (err) {
      setLastError(err instanceof Error ? err.message : "TEST_ERROR / 测试错误");
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [config]);

  const syncNow = useCallback(async (): Promise<boolean> => {
    try {
      const result = await databaseService.syncNow();
      return result.success;
    } catch {
      return false;
    }
  }, []);

  const updateSyncStrategy = useCallback(
    (partial: Partial<SyncStrategy>) => {
      const updated = { ...syncStrategy, ...partial };
      setSyncStrategy(updated);
      databaseService.setSyncStrategy(updated);
    },
    [syncStrategy]
  );

  useEffect(() => {
    return () => {
      databaseService.disconnect();
    };
  }, []);

  return {
    config,
    proxyConfig,
    connectionStatus,
    health,
    stats: databaseService.getStats(),
    syncStrategy,
    isConnecting,
    isMockMode: databaseService.isMockMode(),
    reconnectStats: databaseService.getReconnectStats(),
    lastError,
    saveConfig,
    saveProxyConfig,
    connect,
    disconnect,
    testConnection,
    syncNow,
    updateSyncStrategy,
  };
}
