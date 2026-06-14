import { describe, it, expect } from 'vitest'
import {
  serverDefinitionToIDE,
  createMCPServerConfig,
  getAllIDEEndpoints,
  getIDEEndpointById,
  buildMCPToolsManifest,
} from '../adapter/ide.js'

describe('IDE Adapter', () => {
  describe('serverDefinitionToIDE', () => {
    it('应该将 Server 定义转换为 IDE 端点', () => {
      const endpoints = getAllIDEEndpoints()
      expect(endpoints.length).toBe(7)

      const brave = endpoints.find((e) => e.id === 'brave-search')
      expect(brave).toBeDefined()
      expect(brave!.name).toBe('Brave Search')
      expect(brave!.command).toBe('npx')
      expect(brave!.toolsCount).toBe(2)
      expect(brave!.category).toBe('search')
    })
  })

  describe('createMCPServerConfig', () => {
    it('应该根据 serverId 创建配置', () => {
      const config = createMCPServerConfig('brave-search')
      expect(config).toBeDefined()
      expect(config!.name).toBe('brave-search')
      expect(config!.command).toBe('npx')
    })

    it('应该支持覆盖配置', () => {
      const config = createMCPServerConfig('github', { env: { GITHUB_TOKEN: 'xxx' } })
      expect(config).toBeDefined()
      expect(config!.env).toEqual({ GITHUB_TOKEN: 'xxx' })
    })

    it('未知 serverId 应返回 undefined', () => {
      const config = createMCPServerConfig('nonexistent')
      expect(config).toBeUndefined()
    })
  })

  describe('getAllIDEEndpoints', () => {
    it('应返回全部端点', () => {
      const all = getAllIDEEndpoints()
      expect(all).toHaveLength(7)
    })

    it('enabledOnly 应过滤', () => {
      const enabled = getAllIDEEndpoints(true)
      expect(enabled.length).toBeGreaterThan(0)
      expect(enabled.every((e) => e.enabled)).toBe(true)
    })
  })

  describe('getIDEEndpointById', () => {
    it('应返回指定端点', () => {
      const ep = getIDEEndpointById('docker')
      expect(ep).toBeDefined()
      expect(ep!.name).toBe('Docker')
      expect(ep!.category).toBe('container')
    })

    it('不存在应返回 undefined', () => {
      expect(getIDEEndpointById('nope')).toBeUndefined()
    })
  })

  describe('buildMCPToolsManifest', () => {
    it('应生成工具描述文本', () => {
      const manifest = buildMCPToolsManifest()
      expect(manifest).toContain('MCP Tools')
      expect(manifest).toContain('Brave Search')
      expect(manifest).toContain('tools]')
    })
  })
})
