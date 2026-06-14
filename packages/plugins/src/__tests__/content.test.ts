import { describe, it, expect } from 'vitest'
import {
  ContentPluginDefinitions,
  getAllContentPlugins,
  getContentPluginByName,
  EmmetPlugin,
} from '../content/index'

describe('Content Plugin Definitions', () => {
  it('contains expected content plugins', () => {
    const keys = Object.keys(ContentPluginDefinitions)
    expect(keys.length).toBeGreaterThanOrEqual(4)
  })

  it('each plugin has required fields', () => {
    for (const plugin of Object.values(ContentPluginDefinitions)) {
      expect(plugin.id).toBeTruthy()
      expect(plugin.name).toBeTruthy()
      expect(plugin.package).toBeTruthy()
      expect(plugin.description).toBeTruthy()
      expect(plugin.capabilities.length).toBeGreaterThan(0)
    }
  })

  it('getAllContentPlugins returns array', () => {
    const all = getAllContentPlugins()
    expect(Array.isArray(all)).toBe(true)
    expect(all.length).toBeGreaterThanOrEqual(4)
  })

  it('getContentPluginByName finds Emmet', () => {
    const plugin = getContentPluginByName('Emmet')
    expect(plugin).toBeDefined()
    expect(plugin!.name).toBe('Emmet')
  })

  it('getContentPluginByName returns undefined for unknown', () => {
    expect(getContentPluginByName('NonExistent')).toBeUndefined()
  })

  it('EmmetPlugin has correct structure', () => {
    expect(EmmetPlugin.name).toBe('Emmet')
    expect(EmmetPlugin.capabilities.length).toBeGreaterThan(0)
  })
})
