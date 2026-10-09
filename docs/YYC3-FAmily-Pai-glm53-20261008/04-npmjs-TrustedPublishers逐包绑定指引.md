---
file: 04-npmjs-TrustedPublishers逐包绑定指引.md
description: YYC3-FAmily-Pai OIDC Trusted Publishing npmjs.com 逐包绑定操作指引
author: AI Tutor <GLM-5.3-Flash>
version: v1.0.0
created: 2026-10-08
updated: 2026-10-08
status: active
tags: [guide],[oidc],[npm],[release]
category: guide
---

# 🔑 npmjs.com Trusted Publishers 逐包绑定操作指引

> **目标**：为 `release.yml` 发布流水线完成 OIDC Trusted Publishing 注册表侧绑定，实现零静态 token 发布（`8009be02` 已移除 `NODE_AUTH_TOKEN`）。
> **原理**：GitHub Actions 以 `id-token: write` 换取短时 OIDC 凭证，npm 据此校验「来源仓库 + workflow 文件名」白名单后放行发布，无需任何长期 token。

## Phase 0：工作流侧预检（✅ 已由本次提交完成，无需操作）

| 检查项 | 状态 | 说明 |
|--------|------|------|
| `id-token: write` 权限 | ✅ 既有 | publish job L76 |
| 移除 `NODE_AUTH_TOKEN` env | ✅ 8009be02 | token 通道已断开 |
| **移除 setup-node `registry-url`** | ✅ 本次 | ⚠️ 关键坑：`registry-url` 会写入空 token 的 `.npmrc`（`//registry.npmjs.org/:_authToken=`），**反而阻断 OIDC 交换** |
| **升级 npm CLI ≥ 11.5.1** | ✅ 本次 | Trusted Publishing 硬性要求 npm ≥ 11.5.1 + Node ≥ 22.14.0；Node 22 自带 npm 10.x，新增 `npm install -g npm@^11` 步骤 |
| **publish 改为 pnpm pack + npm publish** | ✅ 本次 | pnpm 9 的 OIDC 交换无把握；改为 `pnpm pack`（负责替换 workspace: 协议）+ `npm publish <tarball> --provenance`（官方 OIDC 路径），确定可行 |
| 11 个包均已在 npm 存在 | ✅ 核验 | npm/cli#8544：包不存在时无法配置 Trusted Publisher；本仓 11 包全部已发布过 |

**回退预案**：绑定与 token 并存不冲突（npm OIDC 优先、回落 token）。若 canary 验证失败，临时把 `NODE_AUTH_TOKEN: ${{ secrets.YYC3_NPM_TOKEN }}` 加回 Publish 步骤即恢复旧通道（一行改动）。

## Phase 1：逐包绑定（共 11 包，全部一次会话内完成）

**前置**：浏览器登录 npmjs.com，账号必须是这 11 个包的 Maintainer/Owner；建议开 2FA（绑定表单可能要求确认密码/OTP）。

### 统一绑定值（11 包全部相同，仅 URL 不同）

| 表单字段 | 填写值 | 注意 |
|----------|--------|------|
| Publisher / CI provider | **GitHub Actions** | 按钮三选一 |
| Organization or user | `YanYuCloudCube` | **大小写敏感** |
| Repository | `YYC3-FAmily-Pai` | **仅仓库名**，不含 org 前缀 |
| Workflow filename | `release.yml` | **仅文件名**含扩展名，不含 `.github/workflows/` 路径 |
| Environment name | （留空） | workflow 未使用 environment |
| Allow `npm publish` | ✅ **勾选** | 流水线直接 publish，必须勾 |
| Allow `npm stage publish` | ☐ 不勾 | 阶段式发布暂不用 |

**⚠️ 每包填完务必点击 Save changes**——表单不自动保存，「填了没保存」是最常见的 401 根因。

### 逐包入口（直达 /access 页，从上往下勾掉即可）

| # | 包 | 当前版本 | 直达链接 |
|---|----|---------|---------|
| 1 | @yyc3/ui | latest 2.0.2 / beta 3.0.0-alpha.4 | https://www.npmjs.com/package/@yyc3/ui/access |
| 2 | @yyc3/cli | 1.2.0 | https://www.npmjs.com/package/@yyc3/cli/access |
| 3 | @yyc3/mcp-servers | 3.0.0 | https://www.npmjs.com/package/@yyc3/mcp-servers/access |
| 4 | @yyc3/effects | 1.1.0 | https://www.npmjs.com/package/@yyc3/effects/access |
| 5 | @yyc3/theme | 1.0.0 | https://www.npmjs.com/package/@yyc3/theme/access |
| 6 | @yyc3/ai-hooks | 1.0.0 | https://www.npmjs.com/package/@yyc3/ai-hooks/access |
| 7 | @yyc3/ai-hub | 1.4.3 | https://www.npmjs.com/package/@yyc3/ai-hub/access |
| 8 | @yyc3/core | 1.4.0 | https://www.npmjs.com/package/@yyc3/core/access |
| 9 | @yyc3/emotion | 1.0.0 | https://www.npmjs.com/package/@yyc3/emotion/access |
| 10 | @yyc3/motion | 1.0.0 | https://www.npmjs.com/package/@yyc3/motion/access |
| 11 | @yyc3/plugins | 1.4.2 | https://www.npmjs.com/package/@yyc3/plugins/access |

（`@yyc3/i18n-core` 由独立仓 YYC3-i18n-Core 发布，不在本表；见 Phase 4。）

页面路径（直达链接失效时）：包页面 → 顶部 **Settings** 标签 → **Trusted Publisher** 区块 → 点 **GitHub Actions** 按钮 → 填上表 → **Save changes**。

## Phase 2：绑定后验证（canary，低风险）

OIDC 交换只在真实发布时发生，无法 dry-run——用一条 patch 小版本做 canary（沿用 v1.4.3 单包试跑经验）。推荐 theme（包小、无下游依赖、刚发过 1.0.0）：

```bash
cd /Users/yanyu/YYC3-FAmily-Pai && git pull

# 1. theme 1.0.0 → 1.0.1（patch）
cd packages/theme
npm version patch --no-git-tag-version   # 或手动编辑 package.json
cd ../..
git add packages/theme/package.json
git commit -m "chore(release): theme 1.0.1（OIDC Trusted Publishing canary 验证版）"
git push origin main

# 2. 单条 tag 触发（≤3 条铁律）
git tag v1.0.1 HEAD && git push origin v1.0.1

# 3. 跟踪 run
gh run watch $(gh run list --workflow release.yml --limit 1 --json databaseId -q '.[0].databaseId')
```

**验证点**：

| 检查项 | 预期 |
|--------|------|
| `Publish @yyc3/theme` job | ✅ success，日志无 401/403/ENEEDAUTH |
| npm 页面 https://www.npmjs.com/package/@yyc3/theme | 出现 Provenance 区块（绿色 GitHub Actions 徽章） |
| `npm view @yyc3/theme version --registry=https://registry.npmjs.org` | 1.0.1 |
| 其余 11 个矩阵 job | 幂等 skip（notice，不红） |

> npm 侧元数据处理偶发延迟数分钟（alpha.4 前车之鉴），查不到先等再查，加 `--prefer-online`。

## Phase 3：验证通过后收尾

```bash
# 1. 删除静态 token（按仓隔离，不影响 i18n-Core 仓）
gh secret delete YYC3_NPM_TOKEN --repo YanYuCloudCube/YYC3-FAmily-Pai

# 2. 更新文档状态：docs/CICD-团队存档文档.md 中 YYC3_NPM_TOKEN「已退役」→「已删除」
```

可选加固：npm 账号 Settings → 两处「2FA for publishes」按需收紧（绑定后 CI 发布不再吃账号 OTP）。

## Phase 4：i18n-Core 仓（可选，本次不动）

`@yyc3/i18n-core` 由 `YYC-Cube/YYC3-i18n-Core` 的 `ci.yml` 发布，**仍用 token**（secrets 按仓隔离，删本仓 secret 无影响）。如需同迁：
1. 绑定值：Repository=`YYC3-i18n-Core`，Workflow filename=`ci.yml`，其余同上表；
2. 改其 workflow：publish 步骤删掉 `npm config set //registry.npmjs.org/:_authToken` 与 `NODE_AUTH_TOKEN` env（写入 .npmrc 的 token 同样会阻断 OIDC 交换），加 `npm install -g npm@^11`。

## 故障排查

| 症状 | 根因 | 处置 |
|------|------|------|
| publish 403「Publish from CI/CD or provide an automation token」 | 绑定未保存 / 字段拼写错 | 核对大小写、仓库名不含 org、文件名不含路径、确认点了 Save |
| `ENEEDAUTH` | npm < 11.5.1 或 .npmrc 残留空 token | 确认 Upgrade npm 步骤在 run 中执行；确认 setup-node 无 registry-url |
| provenance 报 repository mismatch | 包 `repository.url` 与 workflow 实际仓不符 | 修该包 package.json 的 repository 字段 |
| 全部 job 都成功但 npm 查不到新版本 | 注册表元数据处理延迟（非丢包） | 等 2-5 分钟，`npm view --registry=https://registry.npmjs.org --prefer-online` |
| 推 tag 后无 run | 单次 push >3 条 tag 的 GitHub 限制 | 分批 ≤3 条/次（v1.4.3 战役铁律） |

## 参考

- npm 官方文档：https://docs.npmjs.com/trusted-publishers/
- 版本要求出处：npm CLI ≥ 11.5.1、Node ≥ 22.14.0（npm docs "Note" 原文）
- registry-url 空 token 坑与 npm 升级步骤：社区生产 workflow 同款实践（setup-node 注释「a setup-node registry-url would write an empty-token .npmrc that breaks the exchange」）
