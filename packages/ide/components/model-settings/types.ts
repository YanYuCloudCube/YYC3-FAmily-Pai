/**
 * @file model-settings/types.ts
 * @description AI 模型设置模块共享类型与常量（自 ModelSettings.tsx 拆出）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-11-07
 * @updated 2026-11-07
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings,models,types,constants
 */

import { BUILTIN_PROVIDERS } from "../../constants/providers";
import {
  SK_PROVIDER_API_KEYS,
  SK_PROVIDER_URLS,
  SK_MCP_SERVERS,
  SK_CUSTOM_PROVIDERS,
  SK_OLLAMA_CACHE_PREFIX,
} from "../../constants/storage-keys";

/* ================================================================
   Types (local to ModelSettings)
   ================================================================ */

export interface MCPServerConfig {
  id: string;
  name: string;
  description: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  enabled: boolean;
}

export interface DiagnosticResult {
  providerId: string;
  modelName: string;
  status: "idle" | "testing" | "success" | "error";
  latency?: number;
  message: string;
  modelResponse?: string;
  timestamp?: number;
}

export interface OllamaDetectedModel {
  name: string;
  size: string;
  status: "online" | "offline";
  quantization: string;
}

/* ================================================================
   Provider Definitions — 引用共享常量
   ================================================================ */

export const PROVIDERS = BUILTIN_PROVIDERS;

export const DEFAULT_MCP_SERVERS: MCPServerConfig[] = [
  {
    id: "mcp-filesystem",
    name: "Filesystem",
    description: "文件系统读写操作",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/app/designs"],
    env: {},
    enabled: true,
  },
  {
    id: "mcp-fetch",
    name: "Fetch",
    description: "HTTP 请求工具",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-fetch"],
    env: {},
    enabled: true,
  },
  {
    id: "mcp-postgres",
    name: "PostgreSQL",
    description: "数据库查询工具",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-postgres"],
    env: { DATABASE_URL: "postgresql://user:pwd@localhost:5432/yanyucloud" },
    enabled: false,
  },
];

export const SIMULATED_OLLAMA_MODELS: OllamaDetectedModel[] = [
  {
    name: "llama3.1:8b",
    size: "4.7 GB",
    status: "online",
    quantization: "Q4_K_M",
  },
  {
    name: "codellama:13b",
    size: "7.4 GB",
    status: "online",
    quantization: "Q4_0",
  },
  {
    name: "qwen2.5:7b",
    size: "4.4 GB",
    status: "online",
    quantization: "Q4_K_M",
  },
  {
    name: "deepseek-coder:6.7b",
    size: "3.8 GB",
    status: "offline",
    quantization: "Q5_K_M",
  },
  {
    name: "mistral:7b",
    size: "4.1 GB",
    status: "online",
    quantization: "Q4_0",
  },
  { name: "glm4:9b", size: "5.5 GB", status: "online", quantization: "Q4_K_M" },
];

/* ================================================================
   Local Storage Keys — 引用共享常量
   ================================================================ */

export const STORAGE_KEYS = {
  providerKeys: SK_PROVIDER_API_KEYS,
  providerUrls: SK_PROVIDER_URLS,
  mcpServers: SK_MCP_SERVERS,
  customProviders: SK_CUSTOM_PROVIDERS,
  ollamaCache: SK_OLLAMA_CACHE_PREFIX,
};
// loadJSON / saveJSON imported from constants/storage-keys