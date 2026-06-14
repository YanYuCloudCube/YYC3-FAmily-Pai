# @yyc3/mcp-servers

> YYC³ AI Family — Model Context Protocol Server 框架

[![npm version](https://img.shields.io/npm/v/@yyc3/mcp-servers.svg)](https://www.npmjs.com/package/@yyc3/mcp-servers)
[![license](https://img.shields.io/npm/l/@yyc3/mcp-servers.svg)](https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/blob/main/packages/mcp-servers/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)

MCP (Model Context Protocol) Server 框架，提供完整的 JSON-RPC 2.0 协议实现、Server 注册表、IDE 适配层和具体 Server 实现。

## 特性

- 🧩 **MCPServerBase** — 抽象基类，支持 Tools / Resources / Prompts / Notifications
- 📋 **Server Registry** — 7 个即插即用的 Server 定义
- 🔌 **IDE 适配器** — 直接对接 @yyc3/ide 的 MCPClient
- 🔍 **BraveSearch** — 具体实现，Web + Local 搜索
- 📁 **Filesystem** — 具体实现，read/write/list/search
- 🌐 **HTTP Transport** — Streamable HTTP + CORS + Auth
- 🖥️ **CLI** — stdio / http 双模式
- 📚 **134 PromptSkills** — 8 大类 AI 技能注册中心
- ⚡ **零运行时依赖**

## 安装

```bash
pnpm add @yyc3/mcp-servers
```

## 快速开始

### 1. 继承 MCPServerBase 创建自定义 Server

```typescript
import { MCPServerBase } from '@yyc3/mcp-servers'
import type { MCPTool, MCPToolResult } from '@yyc3/mcp-servers'

class MyServer extends MCPServerBase {
  getTools(): MCPTool[] {
    return [
      {
        name: 'hello',
        description: 'Say hello',
        inputSchema: {
          type: 'object',
          properties: { name: { type: 'string', description: 'Name' } },
          required: ['name'],
        },
      },
    ]
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<MCPToolResult> {
    if (name === 'hello') return this.success(`Hello, ${args.name}!`)
    return this.error(`Unknown tool: ${name}`)
  }
}
```

### 2. 使用内置 Server 实现

```typescript
import { BraveSearchServer, FilesystemServer } from '@yyc3/mcp-servers'

const search = new BraveSearchServer({ apiKey: 'YOUR_API_KEY' })
const fs = new FilesystemServer({ rootDirs: ['/path/to/project'] })
```

### 3. HTTP 模式运行

```typescript
import { StreamableHTTPTransport, runWithCLI, parseCLIMode } from '@yyc3/mcp-servers'

const server = new MyServer({ name: 'my-server', version: '1.0.0' })
const transport = new StreamableHTTPTransport(server, { port: 3000, cors: true })
await transport.start()
```

### 4. CLI 运行

```typescript
import { runWithCLI, parseCLIMode } from '@yyc3/mcp-servers'

const options = parseCLIMode(process.argv.slice(2))
await runWithCLI(server, options)
```

```bash
node server.js              # stdio 模式
node server.js --http       # HTTP 模式 (默认 3000)
node server.js --http --port 8080 --api-key secret
```

### 5. IDE 适配

```typescript
import {
  getAllIDEEndpoints,
  createMCPServerConfig,
  buildMCPToolsManifest,
} from '@yyc3/mcp-servers'

const endpoints = getAllIDEEndpoints(true)  // 仅启用的
const config = createMCPServerConfig('brave-search', { env: { BRAVE_API_KEY: 'xxx' } })
const manifest = buildMCPToolsManifest()   // 生成 AI 可读的工具描述
```

## API

### 核心类型

| 类型 | 说明 |
|------|------|
| `MCPTool` | 工具定义 (name, description, inputSchema) |
| `MCPToolResult` | 工具调用结果 (content, isError) |
| `MCPResource` | 资源定义 (uri, name, mimeType) |
| `MCPPrompt` | 提示词定义 (name, arguments) |
| `MCPNotification` | 通知 (method, params) |
| `MCPServerDefinition` | Server 完整定义 |

### Server 注册表

| 函数 | 说明 |
|------|------|
| `SERVER_DEFINITIONS` | 7 个 Server 定义数组 |
| `getServerDefinition(id)` | 按 ID 查询 |
| `getServersByCategory(cat)` | 按分类查询 |
| `getAllTools()` | 所有工具列表 |
| `getToolByName(name)` | 按名称查工具 |

### PromptSkills

| 函数 | 说明 |
|------|------|
| `getAllSkills()` | 134 个技能 |
| `searchSkills(query)` | 搜索技能 |
| `getSkillsByCategory(cat)` | 按分类获取 |
| `getSkillByName(name)` | 按名称获取 |

## 生命周期钩子

```typescript
server
  .onConnect(() => console.log('Connected'))
  .onDisconnect(() => console.log('Disconnected'))
  .onError((err) => console.error(err))
  .onNotification((n) => console.log('Notification:', n.method))
```

## 开发

```bash
pnpm install
pnpm typecheck    # TypeScript 检查
pnpm lint         # ESLint 检查
pnpm test         # 运行测试
pnpm test:coverage # 覆盖率报告
pnpm build        # 构建
```

## License

MIT © YanYuCloudCube Team
