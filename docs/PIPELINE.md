---
file: PIPELINE.md
description: YYC³ FAmily π³ 发布流水线 — 5包发布状态总览
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-23
updated: 2026-04-23
status: published
tags: [流水线],[发布],[状态]
category: archive
language: zh-CN
---

# 📦 YYC³ FAmily π³ — 发布流水线

> **战略原则：一包一包做到极致 → 锁仓发布 → 进入下一个**
> 
> **状态**: 🏆 全部 5/5 包已发布 (2026-04-23)

---

## 发布状态总览

```
███████████████████████████████████████  100% ✅

阶段 1: @yyc3/ai-hub     ✅ v1.0.0 已发布 → 锁仓
阶段 2: @yyc3/core       ✅ v1.3.0 已发布 → 锁仓
阶段 3: @yyc3/ui         ✅ v1.1.0 已发布 → 锁仓
阶段 4: @yyc3/plugins    ✅ v1.1.0 已发布 → 锁仓 (瘦身版)
阶段 5: @yyc3/i18n-core  ✅ v2.3.0 已发布 → 锁仓 (审计版)
```

---

## 各包详情

### ✅ 阶段 1: @yyc3/ai-hub v1.0.0

| 项目 | 值 |
|------|-----|
| **目录** | `packages/ai-hub/` |
| **描述** | AI Family 八位家人定义 + Provider管理 + MCP工具集成 |
| **大小** | 130.9 KB packed / 46 files |
| **测试** | 148 passed |
| **依赖** | @yyc3/core |
| **审计修复** | 品牌残留清理 / README重写 / 元数据统一 |

### ✅ 阶段 2: @yyc3/core v1.3.0

| 项目 | 值 |
|------|-----|
| **目录** | `packages/family-core/` |
| **描述** | 核心引擎 — 家人系统/任务管理/Compass时钟罗盘/LRU缓存 |
| **大小** | 271.9 KB packed / 28 files |
| **测试** | 207 passed |
| **依赖** | 零运行时依赖 |
| **审计修复** | Compass罗盘bug(当前≠下一位) / peerDep格式 / 品牌统一 |

### ✅ 阶段 3: @yyc3/ui v1.1.0

| 项目 | 值 |
|------|-----|
| **目录** | `packages/family-ui/` |
| **描述** | React UI组件库 — FamilyPanel/Avatar/StatusCard/DutyRoster等 |
| **大小** | 32.0 KB packed / 19 files |
| **测试** | 25 passed |
| **依赖** | react>=18, react-dom>=18, @yyc3/core |
| **审计修复** | peerDependencies格式 / 组件精简 / 文档完善 |

### ✅ 阶段 4: @yyc3/plugins v1.1.0

| 项目 | 值 |
|------|-----|
| **目录** | `packages/family-plugins/` |
| **描述** | 插件集合 — LSP语言服务器(4) + 内容处理插件(4) |
| **大小** | **7.0 KB** packed / **10 files** (最精简) |
| **测试** | 5 passed |
| **依赖** | @yyc3/core, react>=18 |
| **审计修复** | **17处品牌残留清除** / exports瘦身(6→3子路径) / README+LICENSE+CHANGELOG从无到有 |

### ✅ 阶段 5: @yyc3/i18n-core v2.3.0

| 项目 | 值 |
|------|-----|
| **目录** | `packages/i18n-core/` |
| **描述** | 国际化框架 — ICU MessageFormat/AI翻译/MCP协议/10语言/零依赖 |
| **大小** | 78.2 KB packed / **200 files** (最大包) |
| **测试** | **443 passed** / 28 test files |
| **依赖** | 零运行时依赖 (lit可选peerDep) |
| **审计修复** | 从归档文件迁移 / 5处URL修正 / 12大模块功能完整性验证 |

---

## 审计标准（每个包执行）

### 通用检查项
- [x] **品牌清洁度**: `grep -r "@family-ai" src/` → 0 结果
- [x] **README 准确性**: 与实际代码对齐
- [x] **package.json**: version/license/repository/publishConfig 正确
- [x] **构建验证**: `pnpm build` 无错误
- [x] **测试通过**: `vitest run` 全绿
- [x] **exports 配置**: 子路径导出与实际文件匹配
- [x] **files 字段**: 只包含必要文件
- [x] **author/email**: 统一为 YYC³ AI Team \<yyc3@family.ai\>
- [x] **repository URL**: 指向 YanYuCloudCube/Family-PAI

### 包专属检查项
- core: Compass罗盘逻辑正确性 (当前值班人 ≠ 下一位)
- ui: peerDependencies格式正确
- plugins: exports子路径与实际模块一一对应
- i18n-core: 10语言完整性 + 12大模块覆盖

---

## 发布验证流程

```
1. pnpm install          → 依赖安装
2. pnpm build            → TypeScript 编译通过
3. pnpm test             → 全部测试绿
4. git add + commit      → 版本化提交
5. pnpm publish          → npmjs.org 公开发布
6. npm view @yyc3/<pkg>  → 验证可安装
```

---

## 历史记录

| 日期 | 操作 | 详情 |
|------|------|------|
| 2026-04-23 | 🏆 五包连发完成 | ai-hub v1.0.0 / core v1.3.0 / ui v1.1.0 / plugins v1.1.0 / i18n-core v2.3.0 |
| 2026-04-23 | 🔧 审计修复 | 品牌残留清理 / URL统一 / Compass bug修复 / exports瘦身 |
| 2026-04-23 | 📦 迁移 | i18n-core 从 归档文件/yyc3-i18n 迁移至 packages/i18n-core |
