import type { MCPServerDefinition, MCPTool } from '../../types/index.js'

const GITHUB_TOOLS: MCPTool[] = [
  {
    name: "github_search_repos",
    description: "搜索 GitHub 仓库",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "搜索关键词" },
        maxResults: { type: "string", description: "最大返回数量" },
      },
      required: ["query"],
    },
  },
  {
    name: "github_get_file_contents",
    description: "获取仓库文件内容",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string", description: "仓库所有者" },
        repo: { type: "string", description: "仓库名称" },
        path: { type: "string", description: "文件路径" },
        branch: { type: "string", description: "分支名" },
      },
      required: ["owner", "repo", "path"],
    },
  },
  {
    name: "github_create_issue",
    description: "创建 GitHub Issue",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string", description: "仓库所有者" },
        repo: { type: "string", description: "仓库名称" },
        title: { type: "string", description: "Issue 标题" },
        body: { type: "string", description: "Issue 内容" },
      },
      required: ["owner", "repo", "title"],
    },
  },
  {
    name: "github_list_issues",
    description: "列出仓库的 Issues",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string", description: "仓库所有者" },
        repo: { type: "string", description: "仓库名称" },
        state: { type: "string", description: "Issue 状态", enum: ["open", "closed", "all"] },
      },
      required: ["owner", "repo"],
    },
  },
]

export const GITHUB_DEF: MCPServerDefinition = {
  id: "github",
  name: "GitHub",
  description: "GitHub 仓库管理 — 搜索仓库、文件操作、Issue/PR 管理",
  version: "1.0.0",
  tools: GITHUB_TOOLS,
  configTemplate: {
    name: "github",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-github"],
    enabled: true,
    priority: 2,
  },
  category: "code",
}
