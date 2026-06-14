import type { MCPServerDefinition, MCPTool } from '../../types/index.js'

const BRAVE_SEARCH_TOOLS: MCPTool[] = [
  {
    name: "brave_web_search",
    description: "使用 Brave Search API 搜索网页",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "搜索关键词" },
        count: { type: "string", description: "返回结果数量，默认10" },
        offset: { type: "string", description: "分页偏移量" },
      },
      required: ["query"],
    },
  },
  {
    name: "brave_local_search",
    description: "使用 Brave Search 搜索本地商家和地点",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "本地搜索关键词" },
        count: { type: "string", description: "返回结果数量" },
      },
      required: ["query"],
    },
  },
]

export const BRAVE_SEARCH_DEF: MCPServerDefinition = {
  id: "brave-search",
  name: "Brave Search",
  description: "使用 Brave Search API 进行网页搜索和本地搜索",
  version: "1.0.0",
  tools: BRAVE_SEARCH_TOOLS,
  configTemplate: {
    name: "brave-search",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-brave-search"],
    enabled: true,
    priority: 1,
  },
  category: "search",
}
