import type { MCPServerDefinition, MCPTool } from '../../types/index.js'

const POSTGRESQL_TOOLS: MCPTool[] = [
  {
    name: "postgres_query",
    description: "执行 PostgreSQL 查询",
    inputSchema: {
      type: "object",
      properties: {
        sql: { type: "string", description: "SQL 查询语句" },
        params: { type: "string", description: "查询参数（JSON 数组）" },
      },
      required: ["sql"],
    },
  },
  {
    name: "postgres_list_tables",
    description: "列出数据库中的表",
    inputSchema: {
      type: "object",
      properties: {
        schema: { type: "string", description: "Schema 名称，默认 public" },
      },
      required: [],
    },
  },
  {
    name: "postgres_describe_table",
    description: "查看表结构",
    inputSchema: {
      type: "object",
      properties: {
        tableName: { type: "string", description: "表名" },
        schema: { type: "string", description: "Schema 名称" },
      },
      required: ["tableName"],
    },
  },
]

export const POSTGRESQL_DEF: MCPServerDefinition = {
  id: "postgresql",
  name: "PostgreSQL",
  description: "PostgreSQL 数据库操作 — 查询、表管理、结构查看",
  version: "1.0.0",
  tools: POSTGRESQL_TOOLS,
  configTemplate: {
    name: "postgresql",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-postgres"],
    enabled: true,
    priority: 5,
  },
  category: "database",
}
