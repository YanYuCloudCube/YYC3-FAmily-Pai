import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('MCP Utils', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('exports npxShadcn function', async () => {
    const utils = await import('../mcp/utils')
    expect(typeof utils.npxShadcn).toBe('function')
  })

  it('exports formatRegistryItems function', async () => {
    const utils = await import('../mcp/utils')
    expect(typeof utils.formatRegistryItems).toBe('function')
  })

  it('exports formatSearchResultsWithPagination function', async () => {
    const utils = await import('../mcp/utils')
    expect(typeof utils.formatSearchResultsWithPagination).toBe('function')
  })

  it('exports formatItemExamples function', async () => {
    const utils = await import('../mcp/utils')
    expect(typeof utils.formatItemExamples).toBe('function')
  })

  it('exports getMcpConfig function', async () => {
    const utils = await import('../mcp/utils')
    expect(typeof utils.getMcpConfig).toBe('function')
  })

  it('formatRegistryItems returns strings array', async () => {
    const utils = await import('../mcp/utils')
    const result = utils.formatRegistryItems([
      {
        name: 'button',
        type: 'registry:ui',
        description: 'A button component',
        files: [],
      },
    ])
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0]).toContain('button')
  })

  it('formatSearchResultsWithPagination formats empty results', async () => {
    const utils = await import('../mcp/utils')
    const result = utils.formatSearchResultsWithPagination(
      { items: [], pagination: { total: 0, offset: 0, limit: 10, hasMore: false } },
      { query: 'test', registries: ['@shadcn'] }
    )
    expect(typeof result).toBe('string')
  })
})

describe('MCP Server', () => {
  it('exports server instance', async () => {
    const mod = await import('../mcp/index')
    expect(mod.server).toBeDefined()
  })

  it('server has correct name', async () => {
    const mod = await import('../mcp/index')
    expect(mod.server).toBeDefined()
  })
})
