/**
 * file DatabaseService.ts
 * description 数据库服务层 · Mock 桩实现（类型与默认服务合并自 types/database.ts）
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [service],[database]
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized（类型并入服务文件以消除目录歧义）。
 *        库形态默认提供 Mock 桩；真实应用应替换为完整实现（保持同接口签名）。
 */

export interface DatabaseConfig {
  id?: string;
  name?: string;
  provider: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  schema?: string;
  sslMode?: string;
  poolSize?: number;
  connectionTimeout?: number;
  idleTimeout?: number;
  autoMigrate?: boolean;
  enableLogging?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocalAPIProxyConfig {
  baseUrl?: string;
  apiVersion?: string;
  authToken?: string;
  timeout?: number;
  enableRetry?: boolean;
  maxRetries?: number;
  heartbeatInterval?: number;
  enabled?: boolean;
  port?: number;
  basePath?: string;
  allowedOrigins?: string[];
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface ConnectionHealth {
  latency: number;
  available: boolean;
  lastChecked: string;
}

export interface SyncStrategy {
  mode: string;
  interval: number;
  retryAttempts: number;
}

export interface DatabaseStats {
  totalRecords: number;
  lastSync: string;
  syncDuration: number;
  conflicts: number;
}

export const databaseService = {
  getSyncStrategy(): SyncStrategy { return { mode: 'auto', interval: 30000, retryAttempts: 3 }; },
  getConfig(): DatabaseConfig | null { return null; },
  getProxyConfig(): LocalAPIProxyConfig | null { return null; },
  onStatusChange(_callback: (event: any) => void): () => void { return () => {}; },
  saveConfig(_config: DatabaseConfig): void {},
  saveProxyConfig(_config: LocalAPIProxyConfig): void {},
  async initializeConnection(_config: DatabaseConfig): Promise<{ success: boolean; error?: string; data?: ConnectionHealth }> { return { success: true, data: { latency: 0, available: true, lastChecked: '' } }; },
  disconnect(): void {},
  async syncNow(): Promise<{ success: boolean; synced: number }> { return { success: true, synced: 0 }; },
  setSyncStrategy(_strategy: SyncStrategy): void {},
  getStats(): DatabaseStats { return { totalRecords: 0, lastSync: '', syncDuration: 0, conflicts: 0 }; },
  isMockMode(): boolean { return true; },
  getReconnectStats(): { attempts: number; probeInterval: number; consecutiveSuccess: number } { return { attempts: 0, probeInterval: 5000, consecutiveSuccess: 0 }; },
};
