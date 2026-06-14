import { MCPServerBase } from '../server/index.js'
import type { MCPTool, MCPToolResult } from '../types/index.js'
import { BRAVE_SEARCH_DEF } from '../registry/servers/brave-search.js'

export interface BraveSearchConfig {
  apiKey: string
  baseUrl?: string
}

export class BraveSearchServer extends MCPServerBase {
  private apiKey: string
  private baseUrl: string

  constructor(config: BraveSearchConfig) {
    super({ name: 'brave-search', version: '1.0.0' })
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl ?? 'https://api.search.brave.com/res/v1'
  }

  getTools(): MCPTool[] {
    return BRAVE_SEARCH_DEF.tools
  }

  async callTool(toolName: string, args: Record<string, unknown>): Promise<MCPToolResult> {
    switch (toolName) {
      case 'brave_web_search':
        return this.webSearch(args)
      case 'brave_local_search':
        return this.localSearch(args)
      default:
        return this.error(`Unknown tool: ${toolName}`)
    }
  }

  private async webSearch(args: Record<string, unknown>): Promise<MCPToolResult> {
    const query = args.query as string
    if (!query) return this.error('query is required')

    try {
      const url = new URL('/web/search', this.baseUrl)
      url.searchParams.set('q', query)
      if (args.count) url.searchParams.set('count', String(args.count))
      if (args.offset) url.searchParams.set('offset', String(args.offset))

      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': this.apiKey,
        },
      })

      if (!response.ok) {
        return this.error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json() as { web?: { results?: Array<{ title?: string; url?: string; description?: string }> } }
      const results = data.web?.results ?? []

      const text = results
        .map((r, i) => `${i + 1}. **${r.title ?? 'Untitled'}**\n   ${r.url ?? ''}\n   ${r.description ?? ''}`)
        .join('\n\n')

      return this.success(text || 'No results found')
    } catch (err) {
      return this.error(err instanceof Error ? err.message : 'Search failed')
    }
  }

  private async localSearch(args: Record<string, unknown>): Promise<MCPToolResult> {
    const query = args.query as string
    if (!query) return this.error('query is required')

    try {
      const url = new URL('/local/search', this.baseUrl)
      url.searchParams.set('q', query)
      if (args.count) url.searchParams.set('count', String(args.count))

      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': this.apiKey,
        },
      })

      if (!response.ok) {
        return this.error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json() as { results?: Array<{ name?: string; address?: string; phone?: string; rating?: number }> }
      const results = data.results ?? []

      const text = results
        .map((r, i) => `${i + 1}. **${r.name ?? 'Unknown'}**\n   ${r.address ?? ''}\n   ${r.phone ? `Phone: ${r.phone}` : ''}${r.rating ? ` | Rating: ${r.rating}` : ''}`)
        .join('\n\n')

      return this.success(text || 'No local results found')
    } catch (err) {
      return this.error(err instanceof Error ? err.message : 'Local search failed')
    }
  }
}
