---
file: MAINTENANCE.md
description: "@yyc3/cli 维护指南 — 发布流程/故障排查/命令维护"
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-05-19
updated: 2026-05-19
status: active
tags: [maintenance],[release],[troubleshooting]
category: package
---

# @yyc3/cli 维护指南

## 发布流程

### 前置检查

```bash
cd packages/cli

pnpm lint
pnpm test
pnpm build
```

### 发布步骤

1. 更新 `package.json` 中的 `version`
2. 更新 `CHANGELOG.md` 添加新版本记录
3. 运行完整检查: `pnpm lint && pnpm test && pnpm build`
4. 发布: `pnpm publish --access public`
5. 验证: `npm view @yyc3/cli@<version>`
6. 测试 CLI: `npx @yyc3/cli@<version> --version`

### 回滚

```bash
npm unpublish @yyc3/cli@<version> --force
```

> 注意: npm 仅允许发布后 72 小时内回滚

---

## 故障排查

### 构建失败

| 症状 | 原因 | 解决方案 |
|------|------|----------|
| tsup 入口找不到 | bin 入口路径配置错误 | 检查 tsup.config.ts 的 entry 包含 bin.ts 和 create-app.ts |
| Babel 解析错误 | @babel/core 版本不兼容 | 检查 @babel/core 和 @babel/parser 版本匹配 |

### 运行时问题

| 症状 | 原因 | 解决方案 |
|------|------|----------|
| `command not found: yyc3` | 未全局安装或 PATH 未配置 | 使用 `npx @yyc3/cli` |
| 组件下载失败 | 注册表 API 不可达 | 检查网络连接或使用 `--registry` 指定镜像 |
| 模板生成失败 | 模板路径不存在 | 确认 templates/ 目录完整 |
| MCP 命令失败 | @modelcontextprotocol/sdk 版本不匹配 | 检查 SDK 版本兼容性 |

### 测试失败

```bash
pnpm test                    # 运行测试
pnpm vitest --reporter=verbose  # 详细输出
pnpm vitest run --reporter=verbose src/commands/add.test.ts  # 单文件
```

---

## 新增命令流程

1. 在 `src/commands/` 创建命令文件
2. 在 `src/bin.ts` 或 `src/create-app.ts` 中注册
3. 在 `src/registry/` 中添加组件注册表 (如适用)
4. 编写测试到 `src/commands/` 同目录
5. 更新 `CHANGELOG.md`
6. 运行完整检查并发布

---

## 安全更新

- 定期运行 `pnpm audit` 检查依赖漏洞
- 本包依赖较多 (30+)，需特别关注安全公告
- `@modelcontextprotocol/sdk` 更新需验证 MCP 协议兼容性
- 环境变量通过 `@dotenvx/dotenvx` 管理，不硬编码密钥

---

## 联系方式

- **邮箱**: admin@0379.email
- **GitHub Issues**: https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/issues
