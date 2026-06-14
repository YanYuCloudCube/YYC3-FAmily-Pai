import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import { MCPServerBase } from '../server/index.js'

export interface HTTPTransportConfig {
  port: number
  host?: string
  cors?: boolean
  apiKey?: string
}

interface ParsedBody {
  jsonrpc: string
  id?: string | number
  method: string
  params?: Record<string, unknown>
}

export class StreamableHTTPTransport {
  private server: MCPServerBase
  private config: HTTPTransportConfig
  private httpServer: ReturnType<typeof createServer> | null = null

  constructor(server: MCPServerBase, config: HTTPTransportConfig) {
    this.server = server
    this.config = config
  }

  async start(): Promise<void> {
    const host = this.config.host ?? '0.0.0.0'
    const cors = this.config.cors ?? true

    this.httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      if (cors) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      }

      if (req.method === 'OPTIONS') {
        res.writeHead(204)
        res.end()
        return
      }

      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Method not allowed' }))
        return
      }

      if (this.config.apiKey) {
        const auth = req.headers.authorization
        if (auth !== `Bearer ${this.config.apiKey}`) {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Unauthorized' }))
          return
        }
      }

      try {
        const body = await this.parseBody(req)
        const response = await this.handleJSONRPC(body)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(response))
      } catch (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32700,
            message: err instanceof Error ? err.message : 'Parse error',
          },
        }))
      }
    })

    return new Promise((resolve, reject) => {
      if (!this.httpServer) {
        reject(new Error('HTTP server not created'))
        return
      }
      this.httpServer.listen(this.config.port, host, () => {
        resolve()
      })
    })
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.httpServer) {
        resolve()
        return
      }
      this.httpServer.close((err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  get address(): string | null {
    const addr = this.httpServer?.address()
    if (!addr || typeof addr === 'string') return addr ?? null
    return `http://${addr.address}:${addr.port}/mcp`
  }

  private parseBody(req: IncomingMessage): Promise<ParsedBody> {
    return new Promise((resolve, reject) => {
      let data = ''
      req.on('data', (chunk: Buffer) => {
        data += chunk.toString()
      })
      req.on('end', () => {
        try {
          resolve(JSON.parse(data) as ParsedBody)
        } catch {
          reject(new Error('Invalid JSON'))
        }
      })
      req.on('error', reject)
    })
  }

  private async handleJSONRPC(body: ParsedBody): Promise<unknown> {
    const { jsonrpc, id, method, params } = body

    if (jsonrpc !== '2.0') {
      return { jsonrpc: '2.0', id: id ?? null, error: { code: -32600, message: 'Invalid Request' } }
    }

    try {
      const result = await this.server.handleRemoteRequest(method, params)
      return { jsonrpc: '2.0', id, result }
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: err instanceof Error && 'code' in err ? (err as { code: number }).code : -32603,
          message: err instanceof Error ? err.message : String(err),
        },
      }
    }
  }
}
