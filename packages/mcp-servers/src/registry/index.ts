import type { MCPServerDefinition, MCPTool } from "../types/index.js";

import { BRAVE_SEARCH_DEF } from "./servers/brave-search.js";
import { GITHUB_DEF } from "./servers/github.js";
import { FILESYSTEM_DEF } from "./servers/filesystem.js";
import { DOCKER_DEF } from "./servers/docker.js";
import { POSTGRESQL_DEF } from "./servers/postgresql.js";
import { CLAUDE_PROMPTS_DEF } from "./servers/claude-prompts.js";
import { YYC3CN_DEF } from "./servers/yyc3cn.js";

export const SERVER_DEFINITIONS: MCPServerDefinition[] = [
  BRAVE_SEARCH_DEF,
  GITHUB_DEF,
  FILESYSTEM_DEF,
  DOCKER_DEF,
  POSTGRESQL_DEF,
  CLAUDE_PROMPTS_DEF,
  YYC3CN_DEF,
];

export function getServerDefinition(id: string): MCPServerDefinition | undefined {
  return SERVER_DEFINITIONS.find((s) => s.id === id);
}

export function getServersByCategory(category: MCPServerDefinition["category"]): MCPServerDefinition[] {
  return SERVER_DEFINITIONS.filter((s) => s.category === category);
}

export function getAllTools(): MCPTool[] {
  return SERVER_DEFINITIONS.flatMap((s) => s.tools);
}

export function getToolByName(toolName: string): MCPTool | undefined {
  for (const server of SERVER_DEFINITIONS) {
    const tool = server.tools.find((t) => t.name === toolName);
    if (tool) return tool;
  }
  return undefined;
}
