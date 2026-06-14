import { describe, it, expect, vi } from 'vitest'
import { MCPServerBase } from '../server/index.js'
import type {
  MCPTool,
  MCPToolResult,
  MCPResource,
  MCPResourceContent,
  MCPPrompt,
  MCPPromptResult,
} from '../types/index.js'

class FullMCPServer extends MCPServerBase {
  private tools: MCPTool[] = [
    {
      name: 'echo',
      description: 'Echo input',
      inputSchema: { type: 'object', properties: { msg: { type: 'string', description: 'Message' } }, required: ['msg'] },
    },
  ]

  private resources: MCPResource[] = [
    { uri: 'config://app', name: 'App Config', description: 'Application configuration', mimeType: 'application/json' },
    { uri: 'docs://readme', name: 'README', description: 'Project readme', mimeType: 'text/markdown' },
  ]

  private prompts: MCPPrompt[] = [
    { name: 'code-review', description: 'Code review prompt', arguments: [{ name: 'language', description: 'Programming language', required: true }] },
    { name: 'summarize', description: 'Summarize text' },
  ]

  getTools(): MCPTool[] {
    return this.tools
  }

  async callTool(toolName: string, args: Record<string, unknown>): Promise<MCPToolResult> {
    if (toolName === 'echo') return this.success(String(args.msg))
    return this.error(`Unknown tool: ${toolName}`)
  }

  override getResources(): MCPResource[] {
    return this.resources
  }

  override async readResource(uri: string): Promise<MCPResourceContent> {
    if (uri === 'config://app') return { uri, mimeType: 'application/json', text: '{"name":"test"}' }
    if (uri === 'docs://readme') return { uri, mimeType: 'text/markdown', text: '# Hello' }
    throw new Error(`Resource not found: ${uri}`)
  }

  override getPrompts(): MCPPrompt[] {
    return this.prompts
  }

  override async getPrompt(name: string, args?: Record<string, string>): Promise<MCPPromptResult> {
    if (name === 'code-review') {
      return {
        description: 'Code review prompt',
        messages: [
          { role: 'user', content: { type: 'text', text: `Review this ${args?.language || 'unknown'} code:` } },
        ],
      }
    }
    if (name === 'summarize') {
      return {
        messages: [
          { role: 'user', content: { type: 'text', text: 'Summarize the following:' } },
        ],
      }
    }
    throw new Error(`Prompt not found: ${name}`)
  }
}

describe('MCPServerBase v2 — Resources', () => {
  it('应该返回资源列表', () => {
    const server = new FullMCPServer({ name: 'test', version: '2.0.0' })
    const resources = server.getResources()
    expect(resources).toHaveLength(2)
    expect(resources[0].uri).toBe('config://app')
    expect(resources[1].name).toBe('README')
  })

  it('应该读取资源内容', async () => {
    const server = new FullMCPServer({ name: 'test', version: '2.0.0' })
    const content = await server.readResource('config://app')
    expect(content.uri).toBe('config://app')
    expect(content.text).toBe('{"name":"test"}')
    expect(content.mimeType).toBe('application/json')
  })

  it('应该对未知资源抛出错误', async () => {
    const server = new FullMCPServer({ name: 'test', version: '2.0.0' })
    await expect(server.readResource('unknown://x')).rejects.toThrow('Resource not found')
  })
})

describe('MCPServerBase v2 — Prompts', () => {
  it('应该返回提示词列表', () => {
    const server = new FullMCPServer({ name: 'test', version: '2.0.0' })
    const prompts = server.getPrompts()
    expect(prompts).toHaveLength(2)
    expect(prompts[0].name).toBe('code-review')
    expect(prompts[0].arguments).toHaveLength(1)
    expect(prompts[1].name).toBe('summarize')
    expect(prompts[1].arguments).toBeUndefined()
  })

  it('应该获取带参数的提示词', async () => {
    const server = new FullMCPServer({ name: 'test', version: '2.0.0' })
    const result = await server.getPrompt('code-review', { language: 'typescript' })
    expect(result.messages).toHaveLength(1)
    expect(result.messages[0].content.text).toContain('typescript')
  })

  it('应该获取无参数的提示词', async () => {
    const server = new FullMCPServer({ name: 'test', version: '2.0.0' })
    const result = await server.getPrompt('summarize')
    expect(result.messages).toHaveLength(1)
    expect(result.messages[0].role).toBe('user')
  })

  it('应该对未知提示词抛出错误', async () => {
    const server = new FullMCPServer({ name: 'test', version: '2.0.0' })
    await expect(server.getPrompt('nonexistent')).rejects.toThrow('Prompt not found')
  })
})

describe('MCPServerBase v2 — Capabilities', () => {
  it('默认 Server 不包含 resources 能力', () => {
    const server = new (class extends MCPServerBase {
      getTools() { return [] }
      callTool() { return Promise.resolve({ content: [] }) }
    })({ name: 'bare', version: '1.0.0' })
    const caps = server.getCapabilities()
    expect(caps.resources).toBeUndefined()
    expect(caps.prompts).toBeUndefined()
    expect(caps.tools?.listChanged).toBe(false)
  })

  it('完整 Server 包含 resources 和 prompts 能力', () => {
    const server = new FullMCPServer({ name: 'full', version: '2.0.0' })
    const caps = server.getCapabilities()
    expect(caps.resources).toBeDefined()
    expect(caps.resources?.subscribe).toBe(false)
    expect(caps.prompts).toBeDefined()
    expect(caps.prompts?.listChanged).toBe(false)
  })
})

describe('MCPServerBase v2 — Lifecycle Hooks', () => {
  it('应该注册 onConnect 钩子', () => {
    const server = new FullMCPServer({ name: 'test', version: '2.0.0' })
    const fn = vi.fn()
    server.onConnect(fn)
    expect(fn).not.toHaveBeenCalled()
  })

  it('应该注册 onDisconnect 钩子', () => {
    const server = new FullMCPServer({ name: 'test', version: '2.0.0' })
    const fn = vi.fn()
    server.onDisconnect(fn)
    server.stop()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应该注册 onError 钩子', () => {
    const server = new FullMCPServer({ name: 'test', version: '2.0.0' })
    const fn = vi.fn()
    server.onError(fn)
    expect(fn).not.toHaveBeenCalled()
  })

  it('应该链式注册多个钩子', () => {
    const server = new FullMCPServer({ name: 'test', version: '2.0.0' })
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    server.onConnect(fn1).onConnect(fn2).onDisconnect(fn1).onDisconnect(fn2)
    server.stop()
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
  })
})

describe('MCPServerBase v2 — Default implementations', () => {
  it('默认 getResources 返回空数组', () => {
    const server = new (class extends MCPServerBase {
      getTools() { return [] }
      callTool() { return Promise.resolve({ content: [] }) }
    })({ name: 'bare', version: '1.0.0' })
    expect(server.getResources()).toEqual([])
  })

  it('默认 readResource 拒绝', async () => {
    const server = new (class extends MCPServerBase {
      getTools() { return [] }
      callTool() { return Promise.resolve({ content: [] }) }
    })({ name: 'bare', version: '1.0.0' })
    await expect(server.readResource('any://thing')).rejects.toThrow('Resources not supported')
  })

  it('默认 getPrompts 返回空数组', () => {
    const server = new (class extends MCPServerBase {
      getTools() { return [] }
      callTool() { return Promise.resolve({ content: [] }) }
    })({ name: 'bare', version: '1.0.0' })
    expect(server.getPrompts()).toEqual([])
  })

  it('默认 getPrompt 拒绝', async () => {
    const server = new (class extends MCPServerBase {
      getTools() { return [] }
      callTool() { return Promise.resolve({ content: [] }) }
    })({ name: 'bare', version: '1.0.0' })
    await expect(server.getPrompt('any')).rejects.toThrow('Prompt not found')
  })
})
