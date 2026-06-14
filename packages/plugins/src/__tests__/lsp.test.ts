import { describe, it, expect } from 'vitest'
import {
  LSPPluginDefinitions,
  getAllLSPPlugins,
  getLSPPluginByLanguage,
  PythonLSPPlugin,
  RubyLSPPlugin,
  RustLSPPlugin,
  SwiftLSPPlugin,
} from '../lsp/index'

describe('LSP Plugin Definitions', () => {
  it('contains all 4 language plugins', () => {
    const keys = Object.keys(LSPPluginDefinitions)
    expect(keys).toContain('python')
    expect(keys).toContain('ruby')
    expect(keys).toContain('rust')
    expect(keys).toContain('swift')
  })

  it('each plugin has required fields', () => {
    for (const plugin of Object.values(LSPPluginDefinitions)) {
      expect(plugin.id).toBeTruthy()
      expect(plugin.name).toBeTruthy()
      expect(plugin.language).toBeTruthy()
      expect(plugin.server).toBeTruthy()
      expect(plugin.description).toBeTruthy()
      expect(plugin.capabilities.length).toBeGreaterThan(0)
      expect(plugin.installation.command).toBeTruthy()
    }
  })

  it('getAllLSPPlugins returns array of all definitions', () => {
    const all = getAllLSPPlugins()
    expect(Array.isArray(all)).toBe(true)
    expect(all.length).toBe(4)
  })

  it('getLSPPluginByLanguage finds python', () => {
    const plugin = getLSPPluginByLanguage('python')
    expect(plugin).toBeDefined()
    expect(plugin!.language).toBe('python')
  })

  it('getLSPPluginByLanguage returns undefined for unknown', () => {
    expect(getLSPPluginByLanguage('cobol')).toBeUndefined()
  })

  it('PythonLSPPlugin has correct structure', () => {
    expect(PythonLSPPlugin.language).toBe('python')
    expect(PythonLSPPlugin.server).toBe('pyright')
  })

  it('RubyLSPPlugin has correct language', () => {
    expect(RubyLSPPlugin.language).toBe('ruby')
  })

  it('RustLSPPlugin has correct language', () => {
    expect(RustLSPPlugin.language).toBe('rust')
  })

  it('SwiftLSPPlugin has correct language', () => {
    expect(SwiftLSPPlugin.language).toBe('swift')
  })
})
