import { MCPServerBase } from '../server/index.js'
import { StreamableHTTPTransport } from '../transport/http.js'

export interface CLIRunOptions {
  mode: 'stdio' | 'http'
  port?: number
  host?: string
  apiKey?: string
  cors?: boolean
}

export function parseCLIMode(args: string[]): CLIRunOptions {
  const mode = args.includes('--http') ? 'http' : 'stdio'
  const portIdx = args.indexOf('--port')
  const port = portIdx >= 0 ? parseInt(args[portIdx + 1], 10) || 3000 : 3000
  const hostIdx = args.indexOf('--host')
  const host = hostIdx >= 0 ? args[hostIdx + 1] : '0.0.0.0'
  const apiKeyIdx = args.indexOf('--api-key')
  const apiKey = apiKeyIdx >= 0 ? args[apiKeyIdx + 1] : undefined
  const cors = !args.includes('--no-cors')

  return { mode, port, host, apiKey, cors }
}

export async function runWithCLI(server: MCPServerBase, options: CLIRunOptions): Promise<void> {
  if (options.mode === 'http') {
    const transport = new StreamableHTTPTransport(server, {
      port: options.port ?? 3000,
      host: options.host,
      apiKey: options.apiKey,
      cors: options.cors,
    })

    await transport.start()
    const addr = transport.address
    process.stderr.write(`MCP HTTP server listening on ${addr}\n`)

    const shutdown = async () => {
      await transport.stop()
      process.exit(0)
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  } else {
    await server.start()
  }
}
