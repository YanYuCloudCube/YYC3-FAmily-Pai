/**
 * file server-base.ts
 * description MCP Server 基础类 — JSON-RPC 2.0 stdio transport, Resources, Prompts, Notifications
 * module @yyc3/mcp-servers
 * author YanYuCloudCube Team <admin@0379.email>
 * version 2.0.0
 * created 2026-04-27
 * updated 2026-05-21
 * status active
 * tags [module],[mcp]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief MCP Server 基础类 — 支持 Tools / Resources / Prompts / Notifications
 */
import type {
  MCPNotification,
  MCPPrompt,
  MCPPromptResult,
  MCPResource,
  MCPResourceContent,
  MCPServerHandler,
  MCPTool,
  MCPToolResult,
} from '../types/index.js'

export interface MCPServerBaseConfig {
  name: string
  version: string
  description?: string
}

export interface MCPServerCapabilities {
  tools?: { listChanged?: boolean }
  resources?: { subscribe?: boolean; listChanged?: boolean }
  prompts?: { listChanged?: boolean }
  logging?: Record<string, unknown>
}

interface JSONRPCRequest {
  jsonrpc: '2.0'
  id?: string | number
  method: string
  params?: Record<string, unknown>
}

interface JSONRPCResponse {
  jsonrpc: '2.0'
  id: string | number | null
  result?: unknown
  error?: {
    code: number
    message: string
    data?: unknown
  }
}

type LifecycleHook = () => void
type ErrorHook = (error: Error) => void
type NotificationHook = (notification: MCPNotification) => void

export abstract class MCPServerBase implements MCPServerHandler {
  protected config: MCPServerBaseConfig
  protected running = false
  private encoder = new TextEncoder()
  private onConnectHooks: LifecycleHook[] = []
  private onDisconnectHooks: LifecycleHook[] = []
  private onErrorHooks: ErrorHook[] = []
  private onNotificationHooks: NotificationHook[] = []

  constructor(config: MCPServerBaseConfig) {
    this.config = config
  }

  abstract getTools(): MCPTool[]
  abstract callTool(toolName: string, args: Record<string, unknown>): Promise<MCPToolResult>

  getResources(): MCPResource[] {
    return []
  }

  readResource(_uri: string): Promise<MCPResourceContent> {
    return Promise.reject(new Error('Resources not supported'))
  }

  getPrompts(): MCPPrompt[] {
    return []
  }

  getPrompt(name: string, _args?: Record<string, string>): Promise<MCPPromptResult> {
    return Promise.reject(new Error(`Prompt not found: ${name}`))
  }

  getCapabilities(): MCPServerCapabilities {
    const caps: MCPServerCapabilities = {
      tools: { listChanged: false },
    }
    if (this.getResources().length > 0) {
      caps.resources = { subscribe: false, listChanged: false }
    }
    if (this.getPrompts().length > 0) {
      caps.prompts = { listChanged: false }
    }
    return caps
  }

  onConnect(hook: LifecycleHook): this {
    this.onConnectHooks.push(hook)
    return this
  }

  onDisconnect(hook: LifecycleHook): this {
    this.onDisconnectHooks.push(hook)
    return this
  }

  onError(hook: ErrorHook): this {
    this.onErrorHooks.push(hook)
    return this
  }

  onNotification(hook: NotificationHook): this {
    this.onNotificationHooks.push(hook)
    return this
  }

  protected sendNotification(notification: MCPNotification): void {
    const message = JSON.stringify({
      jsonrpc: '2.0',
      method: notification.method,
      params: notification.params,
    })
    process.stdout.write(this.encoder.encode(message + '\n'))
    for (const hook of this.onNotificationHooks) {
      hook(notification)
    }
  }

  async start(): Promise<void> {
    this.running = true
    const decoder = new TextDecoder()
    let buffer = ''

    const stdin = process.stdin

    for (const hook of this.onConnectHooks) {
      hook()
    }

    stdin.on('data', (chunk: Buffer) => {
      buffer += decoder.decode(chunk, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const request = JSON.parse(line) as JSONRPCRequest
          this.handleRequestAsync(request).catch(() => { })
        } catch {
          // ignore parse errors
        }
      }
    })

    stdin.on('end', () => {
      this.running = false
      for (const hook of this.onDisconnectHooks) {
        hook()
      }
    })
  }

  stop(): void {
    this.running = false
    for (const hook of this.onDisconnectHooks) {
      hook()
    }
  }

  async handleRemoteRequest(method: string, params?: Record<string, unknown>): Promise<unknown> {
    return this.dispatchMethod(method, params)
  }

  private async handleRequestAsync(request: JSONRPCRequest): Promise<void> {
    const id = request.id ?? null

    try {
      const result = await this.dispatchMethod(request.method, request.params)
      const response: JSONRPCResponse = { jsonrpc: '2.0', id, result }
      this.writeResponse(response)
    } catch (error) {
      const response: JSONRPCResponse = {
        jsonrpc: '2.0',
        id,
        error: {
          code: error instanceof Error && 'code' in error ? (error as { code: number }).code : -32603,
          message: error instanceof Error ? error.message : String(error),
        },
      }
      this.writeResponse(response)
      for (const hook of this.onErrorHooks) {
        hook(error instanceof Error ? error : new Error(String(error)))
      }
    }
  }

  protected async dispatchMethod(method: string, params?: Record<string, unknown>): Promise<unknown> {
    switch (method) {
      case 'initialize':
        return {
          protocolVersion: '2024-11-05',
          capabilities: this.getCapabilities(),
          serverInfo: {
            name: this.config.name,
            version: this.config.version,
          },
        }

      case 'notifications/initialized':
        return {}

      case 'ping':
        return {}

      case 'tools/list':
        return { tools: this.getTools() }

      case 'tools/call': {
        const toolName = (params?.name as string) || ''
        const args = (params?.arguments as Record<string, unknown>) || {}
        return await this.callTool(toolName, args)
      }

      case 'resources/list':
        return { resources: this.getResources() }

      case 'resources/read': {
        const uri = (params?.uri as string) || ''
        const contents = await this.readResource(uri)
        return { contents: [contents] }
      }

      case 'resources/subscribe':
      case 'resources/unsubscribe':
        return {}

      case 'prompts/list':
        return { prompts: this.getPrompts() }

      case 'prompts/get': {
        const name = (params?.name as string) || ''
        const args = (params?.arguments as Record<string, string>) || {}
        return await this.getPrompt(name, args)
      }

      case 'logging/setLevel':
        return {}

      case 'completion/complete':
        return { completion: { values: [], total: 0, hasMore: false } }

      default:
        throw Object.assign(new Error(`Method not found: ${method}`), { code: -32601 })
    }
  }

  private writeResponse(response: JSONRPCResponse): void {
    process.stdout.write(this.encoder.encode(JSON.stringify(response) + '\n'))
  }

  protected success(text: string): MCPToolResult {
    return {
      content: [{ type: 'text', text }],
    }
  }

  protected error(message: string): MCPToolResult {
    return {
      content: [{ type: 'text', text: `Error: ${message}` }],
      isError: true,
    }
  }
}
