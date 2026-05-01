---
file: CICD-升级存档文档.md
description: YYC³ AI Family CI/CD 升级存档 — 安全加固/Husky Hooks/流水线升级
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-24
updated: 2026-04-24
status: published
tags: [cicd],[升级],[存档],[安全加固]
category: archive
language: zh-CN
---

# 升级存档文档
          
## 🚀 开始执行 CI/CD 闭环优化

### 阶段 0：安全加固工具安装
          
### ✅ 阶段 0 完成！

| 任务 | 状态 |
|------|------|
| size-limit + license-checker 安装 | ✅ |
| .gitleaks.toml 配置 | ✅ |
| core size-limit: **100 kB** | ✅ |
| ai-hub size-limit: **55 kB** | ✅ |
| ui size-limit: **15 kB** | ✅ |
| plugins size-limit: **8 kB** | ✅ |
| i18n-core size-limit: **45 kB** | ✅ |

---

### 阶段 1：增强 Husky Hooks
          
### ✅ 阶段 1 完成！

| Hook | 增强 |
|------|------|
| **pre-commit** | 智能检测变更包，仅 lint 受影响包 |
| **pre-push** | 全量验证 + size/license 非阻断提醒 |

---

### 阶段 2：升级 CI 矩阵 (4 层防护网)
          
### ✅ 阶段 2 完成！

**packages-ci.yml 已升级为 7 层防护网：**

| Job | 功能 | 触发条件 |
|-----|------|----------|
| `build-and-test` | 构建+测试矩阵 (Node 20/22) | 始终 |
| `coverage` | 覆盖率上报 Codecov | 构建成功后 |
| **`audit`** 🆕 | pnpm 安全审计 | 构建成功后 |
| **`license`** 🆕 | 许可证合规检查 | 构建成功后 |
| **`size-limit`** 🆕 | 包体积限制检查 | 构建成功后 |
| **`secrets-scan`** 🆕 | Gitleaks 敏感信息扫描 | 始终（并行） |

---

### 阶段 3：创建 release.yml 发包流水线
          
### ✅ 阶段 3+4 完成！

**release.yml 已创建** — 完整发包流水线：

| Job | 功能 |
|-----|------|
| `quality-gate` | 复用 packages-ci.yml 全量检查 |
| `publish-packages` | 矩阵发布 5 个包 + **版本校验** + **dist-tag 自动判断** |
| `docker-release` | GHCR 发布 + cosign 签名 |
| `changelog-update` | 自动生成并提交 CHANGELOG |
| `post-release-verify` | 发布后验证 |

> 📌 **阶段4 (预发布通道) 已集成到 release.yml 中**：自动识别 tag 中的 `beta`/`rc`/`alpha` 并设置对应的 npm dist-tag

---

### 阶段 5：创建 docs.yml 文档部署
          
### ✅ 阶段 5 完成！

---

### 最终验证：全量测试确保无回归
          
## 🎉 全量验证通过！
          
---

# 🏆 CI/CD 闭环优化 — 执行完成报告

## ✅ 全部 9 个任务完成

| 阶段 | 任务 | 状态 | 产物 |
|------|------|------|------|
| **0** | 安全工具安装 | ✅ | size-limit, license-checker, .gitleaks.toml |
| **0** | 包体积限制配置 | ✅ | 5 个包的 size-limit 规则 |
| **1** | pre-commit 增强 | ✅ | 智能变更检测 |
| **1** | pre-push 增强 | ✅ | 非阻断质量提醒 |
| **2** | CI 矩阵升级 | ✅ | 4 层防护网 (audit/license/size/secrets) |
| **3** | release.yml 发包流水线 | ✅ | 版本校验 + npm + GHCR + changelog |
| **4** | 预发布通道 | ✅ | alpha/beta/rc dist-tag 自动判断 |
| **5** | docs.yml 文档部署 | ✅ | VitePress → GitHub Pages |
| **终** | 全量验证 | ✅ | Build + TypeCheck + Lint + Test 全通过 |

---

## 📦 新增/修改文件清单

```
新增文件:
├── .gitleaks.toml                              # Gitleaks 敏感信息扫描规则
├── .github/workflows/release.yml               # 发包总调度流水线
└── .github/workflows/docs.yml                  # 文档自动部署

修改文件:
├── .husky/pre-commit                           # 增强版：智能包级别 lint
├── .husky/pre-push                             # 增强版：+质量检查提醒
├── .github/workflows/packages-ci.yml           # +4 个安全 job
├── packages/core/package.json                  # +size-limit (100 kB)
├── packages/ai-hub/package.json                # +size-limit (55 kB)
├── packages/ui/package.json                    # +size-limit (15 kB)
├── packages/plugins/package.json               # +size-limit (8 kB)
└── packages/i18n-core/package.json             # +size-limit (45 kB)
```

---

## 🔒 4 层安全防护网

```
┌─────────────────────────────────────────────────────┐
│                 CI 安全防线                          │
├─────────────────────────────────────────────────────┤
│  Layer 1: 🔍 Secrets Scan   (Gitleaks)              │
│           ↓ 检测 AWS/GitHub/NPM/Slack 密钥          │
│  Layer 2: 🛡️ Security Audit  (pnpm audit)           │
│           ↓ 阻止 high/critical 漏洞依赖              │
│  Layer 3: 📜 License Check    (license-checker)     │
│           ↓ 阻止 GPL/LGPL/AGPL 传染性许可            │
│  Layer 4: 📦 Size Limit       (size-limit)          │
│           ↓ 防止包体积膨胀                             │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 发布流程（闭环）

```
本地开发 → Husky 门禁 → Push to main
                ↓
    ┌───────────────────────┐
    │  packages-ci.yml      │
    │  ✓ Build & Test       │
    │  ✓ Coverage           │
    │  ✓ Audit (安全)        │
    │  ✓ License (许可)      │
    │  ✓ Size Limit (体积)   │
    │  ✓ Secrets Scan (密钥) │
    └───────────┬───────────┘
                ↓
         git tag v1.3.0
         git push origin v1.3.0
                ↓
    ┌───────────────────────┐
    │  release.yml          │
    │  ✓ 版本号一致性校验     │
    │  ✓ npm publish ×5     │
    │  ✓ Docker + cosign    │
    │  ✓ CHANGELOG 更新     │
    │  ✓ Post-verify        │
    └───────────┬───────────┘
                ↓
    ┌───────────────────────┐
    │  docs.yml             │
    │  ✓ VitePress Build    │
    │  ✓ GitHub Pages 部署   │
    └───────────────────────┘
```

---

## 📋 后续操作指南

### 首次发布流程
```bash
# 1. 确保所有测试通过
pnpm -r build && pnpm -r test

# 2. 手动升级版本号 (以 core 为例)
cd packages/core && npm version patch  # 1.3.0 → 1.3.1

# 3. 其他包同步版本 (如需要)

# 4. 提交并打 tag
git add .
git commit -m "chore: release v1.3.1"
git tag v1.3.1
git push origin main --tags

# 5. GitHub Actions 自动完成：
#    - 质量门禁 → npm 发布 → Docker 构建 → 文档部署
```

### Beta/RC 预发布
```bash
# Beta 版
npm version prerelease --preid=beta  # 1.3.1-beta.0
git tag v1.3.1-beta.0
git push origin v1.3.1-beta.0
# → 自动使用 --tag beta，不影响 latest

# RC 版
npm version prerelease --preid=rc    # 1.3.1-rc.0
git tag v1.3.1-rc.0
git push origin v1.3.1-rc.0
# → 自动使用 --tag rc
```

### 紧急回滚
```bash
# 推荐：deprecate + 发布修复版本
npm deprecate "@yyc3/core@1.3.1" "Critical bug, use 1.3.2 instead"
npm version patch  # 1.3.2
git tag v1.3.2
git push origin v1.3.2
```

---

**YYC³ CI/CD 闭环体系现已完整部署！** 🎉