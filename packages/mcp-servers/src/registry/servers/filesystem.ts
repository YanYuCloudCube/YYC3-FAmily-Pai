import type { MCPServerDefinition, MCPTool } from '../../types/index.js'

const FILESYSTEM_TOOLS: MCPTool[] = [
  {
    name: "read_file",
    description: "读取文件内容",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "文件路径" },
        encoding: { type: "string", description: "编码方式", enum: ["utf-8", "base64", "latin1"] },
      },
      required: ["path"],
    },
  },
  {
    name: "write_file",
    description: "写入文件内容",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "文件路径" },
        content: { type: "string", description: "文件内容" },
        createDirs: { type: "string", description: "是否创建父目录" },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "list_directory",
    description: "列出目录内容",
    inputSchema: {
      type: "object",
      properties: {
        dirPath: { type: "string", description: "目录路径" },
        recursive: { type: "string", description: "是否递归" },
      },
      required: ["dirPath"],
    },
  },
  {
    name: "search_files",
    description: "搜索文件",
    inputSchema: {
      type: "object",
      properties: {
        rootDir: { type: "string", description: "搜索根目录" },
        query: { type: "string", description: "搜索关键词" },
      },
      required: ["rootDir", "query"],
    },
  },
]

export const FILESYSTEM_DEF: MCPServerDefinition = {
  id: "filesystem",
  name: "Filesystem",
  description: "文件系统操作 — 读写文件、目录管理、文件搜索",
  version: "1.0.0",
  tools: FILESYSTEM_TOOLS,
  configTemplate: {
    name: "filesystem",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem"],
    enabled: true,
    priority: 3,
  },
  category: "filesystem",
}
