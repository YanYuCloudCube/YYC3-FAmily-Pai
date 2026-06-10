/**
 * file server.ts
 * description MCP 服务端实现
 * module @yyc3/i18n-core
 * author YanYuCloudCube Team <admin@0379.email>
 * version 2.3.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [module],[mcp]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief MCP 服务端实现
 */
import { logger } from "../infra/logger.js";
import type {
  MCPMessage,
  MCPResource,
  MCPServerCapabilities,
  MCPServerConfig,
  MCPServerInfo,
  MCPTool,
  MCPToolResult,
  MCPTransport,
} from "./types.js";

export type ToolHandler = (args: Record<string, unknown>) => Promise<MCPToolResult>;

export interface MCPToolRegistration {
  tool: MCPTool;
  handler: ToolHandler;
}

export class MCPServer {
  private config: MCPServerConfig;
  private transport: MCPTransport;
  private toolRegistrations = new Map<string, MCPToolRegistration>();
  private resources: MCPResource[] = [];
  private isRunning = false;
  private onDisconnect?: () => void;

  constructor(config: MCPServerConfig) {
    this.config = config;
    this.transport = config.transport;
    this.onDisconnect = (config as MCPServerConfig & { onDisconnect?: () => void }).onDisconnect;
  }

  registerTool(tool: MCPTool, handler: ToolHandler): void {
    this.toolRegistrations.set(tool.name, { tool, handler });
    logger.info(`MCP tool registered: "${tool.name}"`);
  }

  registerResource(resource: MCPResource): void {
    this.resources.push(resource);
  }

  getTools(): MCPTool[] {
    return Array.from(this.toolRegistrations.values()).map((r) => r.tool);
  }

  getResources(): MCPResource[] {
    return [...this.resources];
  }

  async start(): Promise<void> {
    this.transport.onMessage((message: MCPMessage) => {
      this.handleMessage(message).catch((error) => {
        logger.error(`MCP message handling error: ${error}`);
      });
    });

    await this.transport.connect();
    this.isRunning = true;
    logger.info(`MCP Server "${this.config.name}" v${this.config.version} started`);
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    await this.transport.close();
    logger.info(`MCP Server "${this.config.name}" stopped`);
  }

  /** Check if server is running and transport is connected */
  get connected(): boolean {
    return this.isRunning && this.transport.connected;
  }

  /** Attempt to reconnect the transport */
  async reconnect(): Promise<void> {
    if (this.isRunning) {
      logger.warn(`MCP Server "${this.config.name}" already running, stopping first...`);
      await this.stop();
    }
    await this.start();
  }

  /** Handle transport disconnect detected externally */
  handleDisconnect(): void {
    this.isRunning = false;
    logger.warn(`MCP Server "${this.config.name}" transport disconnected`);
    if (this.onDisconnect) {
      this.onDisconnect();
    }
  }

  private async handleMessage(message: MCPMessage): Promise<void> {
    if (message.method) {
      switch (message.method) {
        case "initialize":
          await this.handleInitialize(message);
          break;
        case "notifications/initialized":
          break;
        case "tools/list":
          await this.sendResponse(message.id, { tools: this.getTools() });
          break;
        case "tools/call":
          await this.handleToolCall(message);
          break;
        case "resources/list":
          await this.sendResponse(message.id, { resources: this.resources });
          break;
        case "resources/read":
          await this.handleResourceRead(message);
          break;
        case "ping":
          await this.sendResponse(message.id, {});
          break;
        default:
          await this.sendError(message.id, -32601, `Method not found: ${message.method}`);
      }
    }
  }

  private async handleInitialize(message: MCPMessage): Promise<void> {
    const serverInfo: MCPServerInfo = {
      name: this.config.name,
      version: this.config.version,
      protocolVersion: "2024-11-05",
    };

    const capabilities: MCPServerCapabilities = {
      tools: { listChanged: false },
      resources: { subscribe: false, listChanged: false },
    };

    await this.sendResponse(message.id, {
      protocolVersion: "2024-11-05",
      capabilities,
      serverInfo,
    });
  }

  private async handleToolCall(message: MCPMessage): Promise<void> {
    const params = message.params ?? {};
    const toolName = params.name as string;
    const args = (params.arguments as Record<string, unknown>) ?? {};

    const registration = this.toolRegistrations.get(toolName);
    if (!registration) {
      await this.sendError(message.id, -32602, `Unknown tool: ${toolName}`);
      return;
    }

    try {
      const result = await registration.handler(args);
      await this.sendResponse(message.id, result);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      await this.sendResponse(message.id, {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true,
      });
    }
  }

  private async handleResourceRead(message: MCPMessage): Promise<void> {
    const params = message.params ?? {};
    const uri = params.uri as string;
    const resource = this.resources.find((r) => r.uri === uri);

    if (!resource) {
      await this.sendError(message.id, -32602, `Resource not found: ${uri}`);
      return;
    }

    await this.sendResponse(message.id, {
      contents: [{ uri, mimeType: resource.mimeType ?? "text/plain", text: "" }],
    });
  }

  private async sendResponse(
    id: string | number | undefined,
    result: unknown
  ): Promise<void> {
    if (id === undefined) return;
    const response: MCPMessage = { jsonrpc: "2.0", id, result };
    await this.transport.send(response);
  }

  private async sendError(
    id: string | number | undefined,
    code: number,
    message: string
  ): Promise<void> {
    if (id === undefined) return;
    const response: MCPMessage = {
      jsonrpc: "2.0",
      id,
      error: { code, message },
    };
    await this.transport.send(response);
  }
}
