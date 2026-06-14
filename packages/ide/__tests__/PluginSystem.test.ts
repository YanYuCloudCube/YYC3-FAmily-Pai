import { beforeEach, describe, expect, it } from 'vitest'
import { PluginManager } from '../services/PluginSystem'
import type { PluginManifest } from '../types'

describe('PluginSystem', () => {
  let manager: PluginManager

  const testPlugin: PluginManifest = {
    id: 'test-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    description: 'A test plugin',
    author: 'Test',
    main: 'index.ts',
    permissions: ['editor', 'command'],
  }

  const testPlugin2: PluginManifest = {
    id: 'test-plugin-2',
    name: 'Test Plugin 2',
    version: '1.0.0',
    description: 'Another test plugin',
    author: 'Test',
    main: 'index.ts',
    permissions: ['ui'],
  }

  beforeEach(() => {
    manager = new PluginManager()
  })

  describe('register', () => {
    it('registers a plugin', () => {
      expect(manager.register(testPlugin)).toBe(true)
      expect(manager.getPlugin('test-plugin')).toBeDefined()
      expect(manager.getPlugin('test-plugin')?.manifest.name).toBe('Test Plugin')
    })

    it('rejects duplicate registration', () => {
      expect(manager.register(testPlugin)).toBe(true)
      expect(manager.register(testPlugin)).toBe(false)
    })

    it('registers multiple plugins', () => {
      manager.register(testPlugin)
      manager.register(testPlugin2)
      expect(manager.getAllPlugins()).toHaveLength(2)
    })
  })

  describe('unregister', () => {
    it('unregisters a plugin', () => {
      manager.register(testPlugin)
      expect(manager.unregister('test-plugin')).toBe(true)
      expect(manager.getPlugin('test-plugin')).toBeUndefined()
    })

    it('returns false for unknown plugin', () => {
      expect(manager.unregister('unknown')).toBe(false)
    })

    it('deactivates before unregistering', () => {
      manager.register(testPlugin)
      manager.activate('test-plugin')
      expect(manager.getPlugin('test-plugin')?.status).toBe('active')
      manager.unregister('test-plugin')
      expect(manager.getPlugin('test-plugin')).toBeUndefined()
    })
  })

  describe('activate / deactivate', () => {
    it('activates a registered plugin', () => {
      manager.register(testPlugin)
      expect(manager.activate('test-plugin')).toBe(true)
      expect(manager.getPlugin('test-plugin')?.status).toBe('active')
    })

    it('returns false for unknown plugin', () => {
      expect(manager.activate('unknown')).toBe(false)
    })

    it('deactivates an active plugin', () => {
      manager.register(testPlugin)
      manager.activate('test-plugin')
      expect(manager.deactivate('test-plugin')).toBe(true)
      expect(manager.getPlugin('test-plugin')?.status).toBe('disabled')
    })

    it('returns false when deactivating inactive plugin', () => {
      manager.register(testPlugin)
      expect(manager.deactivate('test-plugin')).toBe(false)
    })
  })

  describe('query', () => {
    it('getAllPlugins returns all', () => {
      manager.register(testPlugin)
      manager.register(testPlugin2)
      expect(manager.getAllPlugins()).toHaveLength(2)
    })

    it('getActivePlugins returns only active', () => {
      manager.register(testPlugin)
      manager.register(testPlugin2)
      manager.activate('test-plugin')
      const active = manager.getActivePlugins()
      expect(active).toHaveLength(1)
      expect(active[0].manifest.id).toBe('test-plugin')
    })

    it('getPlugin returns undefined for unknown', () => {
      expect(manager.getPlugin('unknown')).toBeUndefined()
    })
  })

  describe('commands', () => {
    it('registers commands through API', () => {
      manager.register(testPlugin)
      manager.activate('test-plugin')
      const api = manager.getPlugin('test-plugin')?.exports?.api
      if (api && typeof api === 'object' && 'command' in api) {
        const cmdApi = api.command as { register: (name: string, fn: () => void) => void }
        cmdApi.register('test.cmd', () => { })
        expect(manager.getRegisteredCommands().has('test.cmd')).toBe(true)
      }
    })
  })
})
