/**
 * file scaffold-blueprint.ts
 * description 完整业务样板脚手架管线 — 复制蓝图 → 定制化改写 → 主题注入 → 安装
 * module @yyc3/cli/templates
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-08-19
 * status active
 *
 * brief 生成流程（对齐《YYC3-UI-MONO-一体化入库规划方案》§5.2 样板适配标准）：
 *   1. 复制蓝图目录树（过滤 node_modules/.next/.git/.DS_Store）
 *   2. package.json 定制：项目名 / 端口 / @yyc3 依赖版本统一
 *   3. components.json 写入（shadcn 协议，别名对齐蓝图 tsconfig）
 *   4. 主题注入（可选，改写 app/globals.css 的 :root/.dark 关键变量）
 *   5. yyc3.config.json + README 快速上手
 *   6. 依赖安装（可跳过）
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

import path from "path"
import fs from "fs-extra"
import { execa } from "execa"
import {
  BLUEPRINT_DEP_OVERRIDES,
  blueprintDirExists,
  resolveBlueprintsRoot,
  type BlueprintMeta,
} from "./blueprints"
import { findTheme, type ThemeConfig } from "../themes/registry"
import { findSample } from "./samples"
import { getPackageManager } from "../utils/get-package-manager"

export interface ScaffoldBlueprintOptions {
  blueprint: BlueprintMeta
  /** 目标项目目录（绝对或相对 cwd） */
  targetDir: string
  /** 项目名（默认取 targetDir 目录名） */
  projectName?: string
  /** 主题覆盖（themes registry 中的名称；缺省保留蓝图原生配色） */
  theme?: string
  /** 端口覆盖（缺省用蓝图默认端口） */
  port?: number
  /** 是否执行依赖安装，默认 true */
  install?: boolean
  /** 阶段回调（复制/定制/配置/主题/安装），供调用方打印进度 */
  onPhase?: (phase: ScaffoldPhase, detail?: string) => void
}

export type ScaffoldPhase = "copy" | "customize" | "config" | "theme" | "install"

export interface ScaffoldBlueprintResult {
  /** 实际使用的项目名 */
  projectName: string
  /** 实际使用的端口 */
  port: number
  /** 实际使用的主题（未注入时为 undefined） */
  theme?: ThemeConfig
  /** 蓝图源目录 */
  sourceDir: string
  /** 是否执行了依赖安装 */
  installed: boolean
}

const COPY_FILTER = [
  "node_modules",
  ".next",
  ".git",
  ".DS_Store",
  "dist",
  "coverage",
]

/**
 * 样板脚手架主流程
 */
export async function scaffoldBlueprint(
  options: ScaffoldBlueprintOptions
): Promise<ScaffoldBlueprintResult> {
  const { blueprint } = options

  const root = resolveBlueprintsRoot()
  const sourceDir = path.join(root, blueprint.dir)
  if (!blueprintDirExists(blueprint)) {
    throw new Error(
      `蓝图实体目录不存在: ${sourceDir}（可通过 YYC3_BLUEPRINTS_DIR 指定根目录）`
    )
  }

  const targetDir = path.resolve(process.cwd(), options.targetDir)
  if (await fs.pathExists(targetDir)) {
    throw new Error(`目标目录已存在: ${targetDir}`)
  }

  const projectName = options.projectName ?? path.basename(targetDir)
  if (!/^[a-z][a-z0-9-]*$/i.test(projectName)) {
    throw new Error(
      `项目名不合规: ${projectName}（需匹配 ^[a-z][a-z0-9-]*$）`
    )
  }

  const port = options.port ?? blueprint.port
  const notify = (phase: ScaffoldPhase, detail?: string) =>
    options.onPhase?.(phase, detail)

  // 1. 复制蓝图目录树
  notify("copy", sourceDir)
  await fs.copy(sourceDir, targetDir, {
    filter: (src) => {
      const name = path.basename(src)
      return !COPY_FILTER.includes(name)
    },
  })

  // 2. package.json 定制
  notify("customize", projectName)
  await customizePackageJson(targetDir, projectName, port)

  // 3. components.json（shadcn 协议，别名对齐蓝图 tsconfig 的 `@/*`）
  notify("config")
  await fs.writeJson(
    path.join(targetDir, "components.json"),
    buildComponentsJson(),
    { spaces: 2 }
  )

  // 4. 主题注入（可选）
  let theme: ThemeConfig | undefined
  if (options.theme) {
    const resolved = findTheme(options.theme)
    if (!resolved) {
      throw new Error(`未知主题: ${options.theme}（可先执行 yyc3 themes 查看）`)
    }
    theme = resolved
    notify("theme", resolved.label)
    await injectTheme(targetDir, resolved)
  }

  // 5. yyc3.config.json + README
  await fs.writeJson(
    path.join(targetDir, "yyc3.config.json"),
    {
      blueprint: blueprint.name,
      blueprintId: blueprint.id,
      theme: theme?.name ?? null,
      port,
    },
    { spaces: 2 }
  )
  await fs.writeFile(
    path.join(targetDir, "README.md"),
    buildReadme(blueprint, projectName, port, theme?.label),
    "utf8"
  )

  // 6. 依赖安装
  let installed = false
  if (options.install !== false) {
    notify("install")
    await installDependencies(targetDir)
    installed = true
  }

  return { projectName, port, theme, sourceDir, installed }
}

/**
 * package.json 定制：项目名 / dev 与 start 端口 / @yyc3 依赖统一
 */
export async function customizePackageJson(
  targetDir: string,
  projectName: string,
  port: number
): Promise<void> {
  const packageJsonPath = path.join(targetDir, "package.json")
  const pkg = await fs.readJson(packageJsonPath)

  pkg.name = projectName
  if (pkg.scripts?.dev) {
    pkg.scripts.dev = replacePort(pkg.scripts.dev, port)
  }
  if (pkg.scripts?.start) {
    pkg.scripts.start = replacePort(pkg.scripts.start, port)
  }
  for (const depKey of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ] as const) {
    const deps = pkg[depKey]
    if (!deps) continue
    for (const [name, version] of Object.entries(deps)) {
      const override = BLUEPRINT_DEP_OVERRIDES[name]
      if (override && version !== override) {
        deps[name] = override
      }
    }
  }

  await fs.writeJson(packageJsonPath, pkg, { spaces: 2 })
}

/**
 * 替换脚本中的 --port 参数
 */
export function replacePort(script: string, port: number): string {
  if (/--port\s+\d+/.test(script)) {
    return script.replace(/--port\s+\d+/, `--port ${port}`)
  }
  if (/-p\s+\d+/.test(script)) {
    return script.replace(/-p\s+\d+/, `-p ${port}`)
  }
  return `${script} --port ${port}`
}

/**
 * 生成 components.json（shadcn 协议）
 *
 * 蓝图 tsconfig 的路径别名为 `@/*` → `./*`，
 * utils 位于 lib/utils.ts，组件位于 components/。
 */
export function buildComponentsJson(): Record<string, unknown> {
  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "",
      css: "app/globals.css",
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    iconLibrary: "lucide",
  }
}

/**
 * 主题注入：改写 globals.css 中 :root 与 .dark 块的关键变量。
 *
 * 策略（保守，保持蓝图可读性）：
 *   - :root  → --primary / --ring / --background / --accent
 *   - .dark  → --primary / --ring（保留蓝图暗色背景体系）
 */
export async function injectTheme(
  targetDir: string,
  theme: ThemeConfig
): Promise<void> {
  const cssPath = path.join(targetDir, "app", "globals.css")
  if (!(await fs.pathExists(cssPath))) {
    return
  }

  const css = await fs.readFile(cssPath, "utf8")
  const updated = injectThemeIntoGlobalsCss(css, theme)
  await fs.writeFile(cssPath, updated, "utf8")
}

/**
 * 纯函数形式的主题注入（便于单测）
 */
export function injectThemeIntoGlobalsCss(
  css: string,
  theme: ThemeConfig
): string {
  let result = replaceVarsInBlock(css, ":root", {
    "--primary": theme.primaryColor,
    "--ring": theme.primaryColor,
    "--background": theme.backgroundColor,
    ...(theme.accentColor ? { "--accent": theme.accentColor } : {}),
  })

  result = replaceVarsInBlock(result, ".dark", {
    "--primary": theme.primaryColor,
    "--ring": theme.primaryColor,
  })

  // 主题附带的额外 CSS 变量（如 --cyber-glow）追加到 :root 尾部
  if (theme.cssVars && Object.keys(theme.cssVars).length > 0) {
    const extra = Object.entries(theme.cssVars)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join("\n")
    result = result.replace(/:root\s*\{/, `:root {\n${extra}`)
  }

  return result
}

/**
 * 在指定选择器块内替换/追加 CSS 变量
 */
function replaceVarsInBlock(
  css: string,
  selector: string,
  vars: Record<string, string>
): string {
  const pattern = new RegExp(`(${escapeRegExp(selector)}\\s*\\{)([^}]*)(\\})`)
  const match = css.match(pattern)
  if (!match) {
    return css
  }

  let body = match[2]
  for (const [key, value] of Object.entries(vars)) {
    const varPattern = new RegExp(`(${escapeRegExp(key)}\\s*:\\s*)[^;]+;`)
    if (varPattern.test(body)) {
      body = body.replace(varPattern, `$1${value};`)
    } else {
      body = `${body.trimEnd()}\n  ${key}: ${value};`
    }
  }

  return css.replace(pattern, `$1${body}$3`)
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * 生成快速上手 README
 */
export function buildReadme(
  blueprint: BlueprintMeta,
  projectName: string,
  port: number,
  themeLabel?: string
): string {
  const sample = findSample(blueprint.name)
  const label = sample?.label ?? blueprint.name
  const description = sample?.description ?? ""
  const components = sample?.components ?? []

  return `# ${projectName}

> 由 \`yyc3\` 从业务样板 **${blueprint.id} ${label}** 生成${themeLabel ? `，主题：${themeLabel}` : ""}

${description}

## 快速开始

\`\`\`bash
pnpm install
pnpm dev   # http://localhost:${port}
\`\`\`

## 核心组件（来自 @yyc3/ui）

${components.length > 0 ? components.map((c) => `- ${c}`).join("\n") : "- 见 app/ 页面"}

## 更多

- 添加组件：\`yyc3 add <component>\`
- 切换主题：\`yyc3 themes\`
- 文档：https://docs.yyc3.top
`
}

/**
 * 执行依赖安装（沿用包管理器自动探测）
 */
async function installDependencies(targetDir: string): Promise<void> {
  const packageManager = await getPackageManager(targetDir)
  const args =
    packageManager === "pnpm"
      ? ["install", "--no-frozen-lockfile"]
      : ["install"]

  await execa(packageManager, args, {
    cwd: targetDir,
    stdio: "inherit",
  })
}
