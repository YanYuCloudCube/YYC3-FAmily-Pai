import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { FILESYSTEM_DEF } from '../registry/servers/filesystem.js'
import { MCPServerBase } from '../server/index.js'
import type { MCPResource, MCPResourceContent, MCPTool, MCPToolResult } from '../types/index.js'

export interface FilesystemServerConfig {
  rootDirs: string[]
  allowedExtensions?: string[]
  maxFileSize?: number
}

export class FilesystemServer extends MCPServerBase {
  private rootDirs: string[]
  private maxFileSize: number

  constructor(config: FilesystemServerConfig) {
    super({ name: 'filesystem', version: '1.0.0' })
    this.rootDirs = config.rootDirs
    this.maxFileSize = config.maxFileSize ?? 10 * 1024 * 1024
  }

  getTools(): MCPTool[] {
    return FILESYSTEM_DEF.tools
  }

  override getResources(): MCPResource[] {
    const resources: MCPResource[] = []
    for (const dir of this.rootDirs) {
      resources.push({
        uri: `fs://${dir}`,
        name: `Directory: ${dir}`,
        description: `Files in ${dir}`,
        mimeType: 'text/directory',
      })
    }
    return resources
  }

  override async readResource(uri: string): Promise<MCPResourceContent> {
    if (!uri.startsWith('fs://')) {
      throw new Error(`Invalid resource URI: ${uri}`)
    }
    const filePath = uri.slice(5)
    this.validatePath(filePath)
    const content = readFileSync(filePath, 'utf-8')
    return { uri, mimeType: 'text/plain', text: content }
  }

  async callTool(toolName: string, args: Record<string, unknown>): Promise<MCPToolResult> {
    switch (toolName) {
      case 'read_file':
        return this.readFile(args)
      case 'write_file':
        return this.writeFile(args)
      case 'list_directory':
        return this.listDirectory(args)
      case 'search_files':
        return this.searchFiles(args)
      default:
        return this.error(`Unknown tool: ${toolName}`)
    }
  }

  private readFile(args: Record<string, unknown>): MCPToolResult {
    const filePath = args.path as string
    if (!filePath) return this.error('path is required')

    try {
      this.validatePath(filePath)
      const stat = statSync(filePath)
      if (stat.size > this.maxFileSize) {
        return this.error(`File too large: ${stat.size} bytes (max: ${this.maxFileSize})`)
      }
      const encoding = (args.encoding as string) ?? 'utf-8'
      const content = readFileSync(filePath, encoding as BufferEncoding)
      return this.success(content)
    } catch (err) {
      return this.error(err instanceof Error ? err.message : 'Read failed')
    }
  }

  private writeFile(args: Record<string, unknown>): MCPToolResult {
    const filePath = args.path as string
    const content = args.content as string
    if (!filePath) return this.error('path is required')
    if (content === undefined) return this.error('content is required')

    try {
      this.validatePath(filePath)
      if (args.createDirs === 'true' || args.createDirs === true) {
        mkdirSync(dirname(filePath), { recursive: true })
      }
      writeFileSync(filePath, content, 'utf-8')
      return this.success(`Written ${content.length} bytes to ${filePath}`)
    } catch (err) {
      return this.error(err instanceof Error ? err.message : 'Write failed')
    }
  }

  private listDirectory(args: Record<string, unknown>): MCPToolResult {
    const dirPath = args.dirPath as string
    if (!dirPath) return this.error('dirPath is required')

    try {
      this.validatePath(dirPath)
      const recursive = args.recursive === 'true' || args.recursive === true

      if (recursive) {
        const entries = this.walkDir(dirPath)
        return this.success(entries.map((e) => `${e.type === 'dir' ? '📁' : '📄'} ${relative(dirPath, e.path)}`).join('\n'))
      }

      const entries = readdirSync(dirPath, { withFileTypes: true })
      const lines = entries.map((e) => `${e.isDirectory() ? '📁' : '📄'} ${e.name}`)
      return this.success(lines.join('\n') || 'Empty directory')
    } catch (err) {
      return this.error(err instanceof Error ? err.message : 'List failed')
    }
  }

  private searchFiles(args: Record<string, unknown>): MCPToolResult {
    const rootDir = args.rootDir as string
    const query = args.query as string
    if (!rootDir) return this.error('rootDir is required')
    if (!query) return this.error('query is required')

    try {
      this.validatePath(rootDir)
      const lowerQuery = query.toLowerCase()
      const matches = this.walkDir(rootDir)
        .filter((e) => e.type === 'file' && e.path.toLowerCase().includes(lowerQuery))
        .map((e) => relative(rootDir, e.path))

      return this.success(matches.length > 0 ? matches.join('\n') : 'No matches found')
    } catch (err) {
      return this.error(err instanceof Error ? err.message : 'Search failed')
    }
  }

  private validatePath(filePath: string): void {
    const resolved = filePath.startsWith('/') ? filePath : join(process.cwd(), filePath)
    const allowed = this.rootDirs.some((dir) => resolved.startsWith(dir))
    if (!allowed && this.rootDirs.length > 0) {
      throw new Error(`Path outside allowed directories: ${filePath}`)
    }
  }

  private walkDir(dir: string): Array<{ path: string; type: 'file' | 'dir' }> {
    const results: Array<{ path: string; type: 'file' | 'dir' }> = []
    try {
      const entries = readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        if (entry.isDirectory()) {
          results.push({ path: fullPath, type: 'dir' })
          results.push(...this.walkDir(fullPath))
        } else if (entry.isFile()) {
          results.push({ path: fullPath, type: 'file' })
        }
      }
    } catch {
      // skip unreadable directories
    }
    return results
  }
}
