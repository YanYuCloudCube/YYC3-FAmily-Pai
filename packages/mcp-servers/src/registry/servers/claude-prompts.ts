import type { MCPServerDefinition, MCPTool } from '../../types/index.js'

const CLAUDE_PROMPTS_TOOLS: MCPTool[] = [
  {
    name: "claude_get_prompt",
    description: "获取 Claude 提示词模板",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "提示词分类" },
        name: { type: "string", description: "提示词名称" },
      },
      required: ["category", "name"],
    },
  },
  {
    name: "claude_list_prompts",
    description: "列出所有可用的 Claude 提示词",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "按分类过滤" },
      },
      required: [],
    },
  },
]

export const CLAUDE_PROMPTS_DEF: MCPServerDefinition = {
  id: "claude-prompts",
  name: "Claude Prompts",
  description: "Claude 提示词模板库 — 获取和列出提示词",
  version: "1.0.0",
  tools: CLAUDE_PROMPTS_TOOLS,
  configTemplate: {
    name: "claude-prompts",
    command: "npx",
    args: ["-y", "@anthropic/mcp-server-claude-prompts"],
    enabled: true,
    priority: 6,
  },
  category: "ai",
}
