import type { MCPServerDefinition, MCPServerConfig } from '../types/index.js'
import { SERVER_DEFINITIONS } from '../registry/index.js'

export interface IDEMCPEndpoint {
  id: string
  name: string
  command: string
  args: string[]
  env: Record<string, string>
  enabled: boolean
  description: string
  category: string
  toolsCount: number
}

export function serverDefinitionToIDE(def: MCPServerDefinition): IDEMCPEndpoint {
  return {
    id: def.id,
    name: def.name,
    command: def.configTemplate.command,
    args: def.configTemplate.args,
    env: def.configTemplate.env ?? {},
    enabled: def.configTemplate.enabled,
    description: def.description,
    category: def.category,
    toolsCount: def.tools.length,
  }
}

export function createMCPServerConfig(
  serverId: string,
  overrides?: Partial<Pick<MCPServerConfig, 'env' | 'enabled' | 'args'>>,
): MCPServerConfig | undefined {
  const def = SERVER_DEFINITIONS.find((s) => s.id === serverId)
  if (!def) return undefined

  return {
    ...def.configTemplate,
    ...overrides,
    name: def.configTemplate.name,
    command: def.configTemplate.command,
  }
}

export function getAllIDEEndpoints(enabledOnly = false): IDEMCPEndpoint[] {
  const endpoints = SERVER_DEFINITIONS.map(serverDefinitionToIDE)
  if (enabledOnly) return endpoints.filter((e) => e.enabled)
  return endpoints
}

export function getIDEEndpointById(id: string): IDEMCPEndpoint | undefined {
  const def = SERVER_DEFINITIONS.find((s) => s.id === id)
  if (!def) return undefined
  return serverDefinitionToIDE(def)
}

export function buildMCPToolsManifest(): string {
  const endpoints = getAllIDEEndpoints(true)
  if (endpoints.length === 0) return ''

  const lines = endpoints.map(
    (ep) => `- **${ep.name}** (${ep.category}) → ${ep.command} ${ep.args.join(' ')} [${ep.toolsCount} tools]`,
  )

  return `## MCP Tools\n\n${lines.join('\n')}`
}
