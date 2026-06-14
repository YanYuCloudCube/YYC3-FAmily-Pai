import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BraveSearchServer } from '../implementations/brave-search.js'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('BraveSearchServer', () => {
  let server: BraveSearchServer

  beforeEach(() => {
    server = new BraveSearchServer({ apiKey: 'test-key' })
    mockFetch.mockReset()
  })

  it('应该创建实例', () => {
    expect(server).toBeDefined()
  })

  it('应该返回工具列表', () => {
    const tools = server.getTools()
    expect(tools).toHaveLength(2)
    expect(tools[0].name).toBe('brave_web_search')
    expect(tools[1].name).toBe('brave_local_search')
  })

  it('web search 应返回结果', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        web: {
          results: [
            { title: 'Test Result', url: 'https://example.com', description: 'A test result' },
            { title: 'Another', url: 'https://other.com', description: 'Another result' },
          ],
        },
      }),
    })

    const result = await server.callTool('brave_web_search', { query: 'test' })
    expect(result.isError).toBeFalsy()
    expect(result.content[0].text).toContain('Test Result')
    expect(result.content[0].text).toContain('example.com')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url.toString()).toContain('/web/search')
    expect(url.toString()).toContain('q=test')
    expect(options.headers['X-Subscription-Token']).toBe('test-key')
  })

  it('web search 无结果时应返回提示', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ web: { results: [] } }),
    })

    const result = await server.callTool('brave_web_search', { query: 'empty' })
    expect(result.isError).toBeFalsy()
    expect(result.content[0].text).toBe('No results found')
  })

  it('web search API 错误应返回错误', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    })

    const result = await server.callTool('brave_web_search', { query: 'test' })
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain('429')
  })

  it('web search 无 query 应返回错误', async () => {
    const result = await server.callTool('brave_web_search', {})
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain('query is required')
  })

  it('local search 应返回结果', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { name: 'Cafe Test', address: '123 Main St', phone: '555-1234', rating: 4.5 },
        ],
      }),
    })

    const result = await server.callTool('brave_local_search', { query: 'cafe' })
    expect(result.isError).toBeFalsy()
    expect(result.content[0].text).toContain('Cafe Test')
    expect(result.content[0].text).toContain('555-1234')
    expect(result.content[0].text).toContain('4.5')
  })

  it('local search 无 query 应返回错误', async () => {
    const result = await server.callTool('brave_local_search', {})
    expect(result.isError).toBe(true)
  })

  it('未知工具应返回错误', async () => {
    const result = await server.callTool('unknown_tool', {})
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain('Unknown tool')
  })

  it('应使用自定义 baseUrl', async () => {
    const customServer = new BraveSearchServer({ apiKey: 'key', baseUrl: 'https://custom.api.com/v1' })
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ web: { results: [] } }),
    })

    await customServer.callTool('brave_web_search', { query: 'test' })
    const calledUrl = mockFetch.mock.calls[0][0].toString()
    expect(calledUrl).toContain('custom.api.com')
  })
})
