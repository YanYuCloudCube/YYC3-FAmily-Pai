---
file: CICD-团队存档文档.md
description: YYC³ AI Family CI/CD 团队存档信息 — 项目基础/NPM发包/安全合规
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-24
updated: 2026-04-24
status: published
tags: [cicd],[存档],[团队],[配置]
category: archive
language: zh-CN
---

# CICD存档文档

---

## 团队存档信息

### 1. 项目基础信息
```
- 项目名称 & 描述：YYC³ AI Family (yyc3-family-pai) — 八位拟人化AI家人的智能中枢 (Monorepo)

- 项目仓库地址（GitHub/GitLab/其它）：https://github.com/YanYuCloudCube/Family-PAI.git

- 包管理器：pnpm v9

- Node.js 要求版本（engines）：>=18.0.0 (CI 矩阵: 20, 22, 24)

- 是否使用 TypeScript：✅ 是 (strict mode, ES2022 target)

- monorepo 吗？如果是，用什么工具：✅ pnpm workspaces (5 packages + server)
   ├── @yyc3/core       — 核心包 (认证/MCP/技能系统/AI家人/多模态)
   ├── @yyc3/ai-hub     — AI 能力中心
   ├── @yyc3/ui         — UI 组件库 (React)
   ├── @yyc3/plugins    — 插件系统
   └── @yyc3/i18n-core  — 国际化核心 (443 tests)
```

---

### 2. NPM 发包策略
```
- 使用公共 npm registry 还是私有源：公共 npm registry (https://registry.npmjs.org/)

- scope（如 @company）：@yyc3

- 发包权限：YYC3_NPM_TOKEN (GitHub Secrets)，当前无双人审批流程

- 版本策略：conventional-changelog (angular 规范) 自动生成 CHANGELOG
            手动升级 package.json version → prepublishOnly 钩子触发构建测试

- 是否启用双因素认证（2FA）：⚠️ 建议启用 (npm publish --provenance 已配置)

- 是否需要支持 alpha/beta/rc 此类预发布标签：✅ 支持 (semver tags: v*.*.*)
```

---

### 3. 代码质量与测试
```
- 使用哪个代码风格工具：ESLint v10 (Flat Config) + TypeScript ESLint v8
                         globals v17 | 无 Prettier (使用 ESLint 内置格式化)

- 是否有 commitlint / husky：✅ Husky v9.1.7
   ├── pre-commit  → 智能检测变更包，执行 lint
   ├── pre-push    → 全量 typecheck + lint + test + build
   └── commit-msg  → commitlint 规范提交信息

- 测试框架：Vitest v1.6.1 (@vitest/coverage-v8 覆盖率 provider)

- 期望的最低测试覆盖率：
   📦 core:      statements ≥70% | branches ≥65% | functions ≥55% | lines ≥70%
   📦 ai-hub:    statements ≥40% | branches ≥75% | functions ≥55% | lines ≥40%
   📦 ui:        statements ≥35% | branches ≥45% | functions ≥25% | lines ≥35%
   📦 plugins:   statements ≥90% | branches ≥95% | functions N/A   | lines ≥90%
   📦 i18n-core: 全量通过 (443 tests, 最高覆盖)

- 是否使用 e2e 测试：❌ 当前仅单元测试 (建议后续添加 Playwright/Cypress)

- 是否有 web 构建步骤：✅ tsup v8 (ESM + DTS 双输出)
                        server 目录独立 npm + Docker 构建
```

---

### 4. CI/CD 环境
```
- 使用 GitHub Actions 作为 CI/CD 平台：✅ 6 个 Workflow
   ├── packages-ci.yml     → 包矩阵测试 (Node 20+22) + Codecov 覆盖率上报
   ├── ci.yml              → server Jest 单元测试 (Node 24)
   ├── pr-validation.yml   → PR 合规性验证
   ├── mcp-compliance.yml  → MCP 协议合规检查
   ├── renovate-config-validator.yml → Renovate 配置验证
   └── docker-publish.yml  → Docker 镜像构建 + GHCR 发布 + cosign 签名

- 是否需要手动审批发布：❌ 当前自动发布 (tags: v*.*.* 触发)
                          ⚠️ 建议配置 Environment protection rules

- 是否需要自动化 CHANGELOG 生成和 Git 标签管理：
   ✅ conventional-changelog -p angular -i CHANGELOG.md -s
   ✅ version 钩子自动 git add CHANGELOG.md

- 是否与 Jira / Slack / 钉钉 / 飞书通知集成：❌ 未集成 (建议后续添加)

- 生产发布是否需要升级到特定分支：❌ 直接 main 分支 push / tag 触发
                                    (建议后续引入 release/ 分支策略)
```

---

### 5. 安全与合规
```
- 是否强制 npm audit（安全漏洞阈值）：⚠️ 未在 CI 中强制 (建议添加 audit --audit-level=high)

- 是否使用 Snyk / Dependabot 等第三方安全扫描：
   ✅ Dependabot (通过 Renovate bot 管理依赖更新)
   ✅ cosign v2.2.2 (Docker 镜像签名 + Rekor 透明日志)

- 是否检查许可证合规：✅ MIT License (所有包统一)
                       ❌ 未配置 license-checker (建议添加)

- 是否有限制包体积要求：❌ 未配置 bundlewatch/size-limit
                         (tsup 输出已优化 tree-shaking)

- 是否有敏感信息检查：❌ 未配置 git-secrets/gitleaks
                       (⚠️ 强烈建议添加，防止密钥泄露)
```

---

### 6. 发布后动作
```
- 是否需要发布后将版本号提交回仓库：✅ version 脚本自动处理
                                     (conventional-changelog + git add)

- 是否需要自动部署文档站点：⚠️ docs.yml workflow 已存在但未激活
                            (VitePress 文档站点，待配置 GitHub Pages)

- 是否需要通知下游项目更新：❌ 未配置 webhook/webhook 触发
                             (monorepo 内部依赖通过 workspace:* 自动同步)

- 紧急回滚时，偏向 deprecate 还是 unpublish：📜 建议 deprecate + 发布 patch 版本
                                          (unpublish 仅限发布后 72h 内)
```

### 6. 发布后动作
```
- 是否需要发布后将版本号提交回仓库：

- 是否需要自动部署文档站点（如 storybook / dumi）：


- 是否需要通知下游项目更新（例如触发另一个仓库的 CI）：

- 紧急回滚时，偏向 deprecate 还是 unpublish（公司政策）：


```

---

## 附录：关键配置速查

### 包结构映射
| 包名 | NPM Scope | 入口文件 | 构建工具 | 测试数 |
|------|-----------|----------|----------|--------|
| core | @yyc3/core | dist/index.js | tsup | ~250+ |
| ai-hub | @yyc3/ai-hub | dist/index.js | tsup | 110 |
| ui | @yyc3/ui | dist/index.js | tsup | 25 |
| plugins | @yyc3/plugins | dist/index.js | tsup | 5 |
| i18n-core | @yyc3/i18n-core | dist/index.js | tsc | 443 |

### CI 矩阵配置
```yaml
packages-ci:
  node-version: [20, 22]  # 包测试矩阵
  cache: pnpm             # pnpm 缓存

ci (server):
  node-version: 24         # 服务端测试
  cache: npm               # npm 缓存 (server 独立)

docker-publish:
  registry: ghcr.io        # GitHub Container Registry
  signing: cosign          # 镜像签名
```

### Secrets 清单
| Secret 名称 | 用途 | 必需 |
|-------------|------|------|
| CODECOV_TOKEN | 覆盖率上报 | 可选 |
| YYC3_NPM_TOKEN | NPM 发布权限 | 必须 |
| GITHUB_TOKEN | GHCR 推送 + cosign | 自动 |

---

**文档版本**: v1.0  
**最后更新**: 2026-04-24  
**维护者**: YYC³ Quality Assurance Team
