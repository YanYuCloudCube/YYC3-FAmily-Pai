---
file: MAINTENANCE.md
description: "@yyc3/mcp-servers 维护指南 — 发布流程/故障排查/安全更新"
author: YanYuCloudCube Team <admin@0379.email>
version: v3.0.0
created: 2026-05-19
updated: 2026-05-22
status: active
tags: [maintenance],[release],[troubleshooting]
category: package
---

# @yyc3/mcp-servers 维护指南

## 发布流程

### 前置检查

```bash
cd packages/mcp-servers

pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

### 发布步骤

1. 更新 `package.json` 中的 `version`
2. 更新 `CHANGELOG.md` 添加新版本记录
3. 运行完整检查: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
4. 发布: `pnpm publish --access public`
5. 验证: `npm view @yyc3/mcp-servers@<version>`

### 回滚

```bash
npm unpublish @yyc3/mcp-servers@<version> --force
```

> 注意: npm 仅允许发布后 72 小时内回滚

---

## 故障排查

### 构建失败

| 症状 | 原因 | 解决方案 |
|------|------|----------|
| `Cannot find module '../types/index.js'` | tsconfig paths 配置错误 | 检查 tsconfig.json 的 rootDir/outDir |
| `dist/ 为空` | tsup 入口配置错误 | 检查 tsup.config.ts 的 entry |
| TypeScript strict 错误 | 类型不匹配 | 运行 `tsc --noEmit` 定位具体错误 |

### 测试失败

```bash
pnpm test        # 运行测试
pnpm vitest --reporter=verbose  # 详细输出
```

### MCP Server 连接问题

| 症状 | 原因 | 解决方案 |
|------|------|----------|
| Server 无法启动 | configTemplate.command 路径错误 | 确认 npx 命令可用 |
| JSON-RPC 解析错误 | stdin 数据格式不正确 | 确认每行一个 JSON-RPC 消息 |
| 工具调用超时 | callTool 实现阻塞 | 检查异步实现 |
| HTTP Transport 401 | API Key 不匹配 | 检查 --api-key 参数 |
| CORS 被拒绝 | 浏览器跨域限制 | 默认启用 CORS, 或使用 --no-cors 关闭 |

---

## 新增 MCP Server 流程 (v3.0.0)

1. 在 `src/registry/servers/` 中创建新的独立文件 (如 `my-server.ts`)
2. 导入并使用 `MCPServerDefinition` 和 `MCPTool` 类型定义工具数组
3. 在 `src/registry/index.ts` 中导入并添加到 `SERVER_DEFINITIONS`
4. (可选) 在 `src/implementations/` 中创建具体实现类
5. 在 `src/__tests__/` 中添加测试
6. 更新 `CHANGELOG.md`
7. 运行完整检查并发布

---

## 架构概览

```
src/
├── types/         — 类型定义 (MCPTool, MCPResource, MCPPrompt, ...)
├── server/        — MCPServerBase 抽象基类
├── registry/      — Server 注册表 + PromptSkill 注册中心
│   └── servers/   — 7 个独立 Server 定义文件
├── adapter/       — IDE 适配层
├── implementations/ — 具体 Server 实现 (BraveSearch, Filesystem)
├── transport/     — HTTP Transport
├── cli/           — CLI 工具 (stdio/http)
└── index.ts       — 公共 API 入口
```

---

## 安全更新

- 定期运行 `pnpm audit` 检查依赖漏洞
- 本包零运行依赖，风险极低
- devDependencies 更新需通过 CI 验证
- API Key 通过构造函数参数注入，不硬编码密钥
- Filesystem 实现通过 `rootDirs` 限制文件访问范围

---

## 联系方式

- **邮箱**: admin@0379.email
- **GitHub Issues**: https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/issues
