# 发布清单

## 发布前检查

### 代码质量

- [x] TypeScript 编译通过 (`pnpm -r typecheck`)
- [x] ESLint 检查通过 (`pnpm -r lint`)
- [x] 统一日志系统（无裸 `console.*` 调用）
- [x] 无 `as any` 类型不安全（TauriBridge 已修复）
- [x] 错误码体系规范化

### 测试

- [x] 全量测试通过 (`pnpm -r test`)
- [x] core 包覆盖率阈值 ≥ 80%
- [x] 828+ 测试用例全部通过

### 文档

- [x] README.md 反映 8 包架构
- [x] CONTRIBUTING.md 包含全部 Scope
- [x] SECURITY.md 包含全部包
- [x] FULLCHAIN.md 达标矩阵完整
- [x] 统一文档站 docs.yyc3.top

### CI/CD

- [x] push/PR 自动触发质量门控
- [x] 安全审计 (Gitleaks + npm audit)
- [x] 包矩阵包含全部 8 个包

### 安全

- [x] 无高危漏洞
- [x] API Key 不硬编码
- [x] .env.example 完整

## 已知问题

| 编号 | 描述 | 影响 |
|------|------|------|
| KNOWN-01 | i18n-core 存在 typecheck 错误（locale 模块） | 非阻塞，预存问题 |
| KNOWN-02 | mcp-servers 文档达标率 2/5 | 后续补齐 |
| KNOWN-03 | IDE 包为 private，不对外发布 | 设计决策 |

## 发布命令

```bash
pnpm -r build          # 构建全部
pnpm -r test           # 测试全部
pnpm -r typecheck      # 类型检查
pnpm -r lint           # Lint 检查
git tag vx.x.x
git push --tags        # 触发 release.yml
```
