/**
 * file blueprints.ts
 * description YYC³ 完整业务样板注册表 — T01-T20 实体蓝图片层
 * module @yyc3/cli/templates
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-08-19
 * status active
 *
 * brief 蓝图 = templates/blueprints/ 下的完整 Next.js 应用实体（源自 UI-MONO）。
 *   本模块在 samples.ts 展示元数据之上叠加脚手架所需的实体信息：
 *   - 编号（T01-T20）与蓝图目录名
 *   - 端口（对齐 verify-all.sh 与蓝图 package.json）
 *   - 蓝图根目录解析（dist / src / cwd 三态）
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

import path from "path"
import { fileURLToPath } from "url"
import fs from "fs-extra"
import { findSample } from "./samples"

/**
 * 蓝图生成项目时的 @yyc3/ui 目标版本。
 * 与 packages/ui 的发布版本保持同步（v3.0.0 起业务组件全量可用）。
 */
export const BLUEPRINT_UI_VERSION = "^3.0.0"

/** 蓝图实体附加依赖（@yyc3 系列统一升级目标） */
export const BLUEPRINT_DEP_OVERRIDES: Record<string, string> = {
  "@yyc3/ui": BLUEPRINT_UI_VERSION,
}

export interface BlueprintMeta {
  /** 样板编号（T01-T20） */
  id: string
  /** 语义名（与 samples.ts / 蓝图 package.json 对齐） */
  name: string
  /** 蓝图目录名（templates/blueprints/ 下） */
  dir: string
  /** 开发端口（对齐蓝图 package.json scripts.dev） */
  port: number
}

/**
 * 20 套蓝图实体注册表（顺序与编号一致）
 *
 * 端口为蓝图 package.json 的真实值：
 *   T01 3300 | T02 3201 | T03 3200 | T04 3205 | T05 3203
 *   T06 3206 | T07 3207 | T08 3208 | T09 3202 | T10 3209
 *   T11 3210 | T12 3213 | T13 3211 | T14 3212 | T15 3214
 *   T16 3204 | T17 3215 | T18 3216 | T19 3217 | T20 3218
 */
export const BLUEPRINTS: BlueprintMeta[] = [
  { id: "T01", name: "ai-intelligent-center", dir: "T01-ai-intelligent-center", port: 3300 },
  { id: "T02", name: "admin-dashboard", dir: "T02-admin-dashboard", port: 3201 },
  { id: "T03", name: "landing-page", dir: "T03-landing-page", port: 3200 },
  { id: "T04", name: "ai-medical", dir: "T04-ai-medical", port: 3205 },
  { id: "T05", name: "learning-platform", dir: "T05-learning-platform", port: 3203 },
  { id: "T06", name: "smart-city", dir: "T06-smart-city", port: 3206 },
  { id: "T07", name: "3d-portal", dir: "T07-3d-portal", port: 3207 },
  { id: "T08", name: "crm-system", dir: "T08-crm-system", port: 3208 },
  { id: "T09", name: "data-dashboard", dir: "T09-data-dashboard", port: 3202 },
  { id: "T10", name: "ai-code-ide", dir: "T10-ai-code-ide", port: 3209 },
  { id: "T11", name: "financial-quant", dir: "T11-financial-quant", port: 3210 },
  { id: "T12", name: "music-player", dir: "T12-music-player", port: 3213 },
  { id: "T13", name: "devops-monitor", dir: "T13-devops-monitor", port: 3211 },
  { id: "T14", name: "saas-platform", dir: "T14-saas-platform", port: 3212 },
  { id: "T15", name: "ai-call-center", dir: "T15-ai-call-center", port: 3214 },
  { id: "T16", name: "knowledge-wiki", dir: "T16-knowledge-wiki", port: 3204 },
  { id: "T17", name: "ecommerce-shop", dir: "T17-ecommerce-shop", port: 3215 },
  { id: "T18", name: "portfolio", dir: "T18-portfolio", port: 3216 },
  { id: "T19", name: "table-converter", dir: "T19-table-converter", port: 3217 },
  { id: "T20", name: "forum-community", dir: "T20-forum-community", port: 3218 },
]

/**
 * 解析蓝图查找：支持 编号（T02 / t02）、语义名（admin-dashboard）、目录名（T02-admin-dashboard）
 */
export function findBlueprint(query: string): BlueprintMeta | undefined {
  const normalized = query.trim().toLowerCase()
  return BLUEPRINTS.find(
    (b) =>
      b.name === normalized ||
      b.dir.toLowerCase() === normalized ||
      b.id.toLowerCase() === normalized
  )
}

/**
 * 解析蓝图根目录（templates/blueprints）。
 * 候选顺序：环境变量覆盖 → dist 相邻（发包态）→ src 相邻（开发态）→ cwd 相对。
 */
export function resolveBlueprintsRoot(): string {
  const candidates: string[] = []
  if (process.env.YYC3_BLUEPRINTS_DIR) {
    candidates.push(process.env.YYC3_BLUEPRINTS_DIR)
  }

  const here = path.dirname(fileURLToPath(import.meta.url))
  // 发包态：dist/templates/blueprints.js → ../templates/blueprints
  candidates.push(path.resolve(here, "..", "templates", "blueprints"))
  // 开发态：src/templates/blueprints.ts → ../../templates/blueprints
  candidates.push(path.resolve(here, "..", "..", "templates", "blueprints"))
  // 仓库根/包根运行态
  candidates.push(path.resolve(process.cwd(), "templates", "blueprints"))
  candidates.push(
    path.resolve(process.cwd(), "packages", "cli", "templates", "blueprints")
  )

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }

  // 兜底返回 dist 相邻路径，让调用方以明确错误提示
  return candidates[1] ?? candidates[candidates.length - 1]
}

/**
 * 校验某个蓝图的实体目录是否存在
 */
export function blueprintDirExists(blueprint: BlueprintMeta): boolean {
  return fs.existsSync(path.join(resolveBlueprintsRoot(), blueprint.dir))
}

/**
 * 蓝图默认主题（取 samples 元数据 themes[0]，与场景调性对齐）
 */
export function blueprintDefaultTheme(blueprint: BlueprintMeta): string {
  return findSample(blueprint.name)?.themes[0] ?? "yyc3-brand"
}
