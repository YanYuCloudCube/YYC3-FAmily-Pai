#!/usr/bin/env node

import { resolve } from "path"
import { Command } from "commander"
import prompts from "prompts"
import chalk from "chalk"
import ora from "ora"
import fs from "fs-extra"
import {
  BLUEPRINTS,
  findBlueprint,
  scaffoldBlueprint,
  type BlueprintMeta,
} from "./templates"
import { findSample } from "./templates/samples"

type ThemeConfig = {
  title: string
  value: string
  description: string
  colors: { primary: string; bg: string; accent?: string }
  deps: string[]
  globalsCssExtra: string
}

type SceneConfig = {
  title: string
  value: string
  description: string
  port: number
  deps: Record<string, string>
  pages: string[]
}

const THEMES: ThemeConfig[] = [
  {
    title: "YYC³ Brand (默认)",
    value: "yyc3-brand",
    description: "YYC³ 品牌标准色 / Geist / Lucide",
    colors: { primary: "oklch(0.7 0.15 260)", bg: "#ffffff" },
    deps: [],
    globalsCssExtra: "",
  },
  {
    title: "赛博朋克",
    value: "cyberpunk",
    description: "霓虹发光 / 暗色 / 故障效果 / 霓虹卡片",
    colors: { primary: "#00f0ff", bg: "#0a0a0f", accent: "#ff00ff" },
    deps: ["@yyc3/effects"],
    globalsCssExtra: `
  --cyber-glow: 0 0 20px rgba(0, 240, 255, 0.3);
  --cyber-border: 1px solid rgba(0, 240, 255, 0.2);
  --cyber-text-glow: 0 0 10px rgba(0, 240, 255, 0.5);`,
  },
  {
    title: "未来科技",
    value: "futuristic",
    description: "玻璃拟态 / 粒子背景 / 渐变光晕",
    colors: { primary: "#8b5cf6", bg: "radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1a 100%)", accent: "#06b6d4" },
    deps: ["@yyc3/effects"],
    globalsCssExtra: `
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: blur(16px);`,
  },
  {
    title: "极光星空",
    value: "aurora",
    description: "极光渐变 / 深空背景 / 微光闪烁",
    colors: { primary: "#06b6d4", bg: "#0c0c1d", accent: "#a855f7" },
    deps: ["@yyc3/effects"],
    globalsCssExtra: `
  --aurora-gradient: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%);
  --aurora-shimmer: 0 0 40px rgba(6, 182, 212, 0.15);`,
  },
  {
    title: "液态玻璃",
    value: "liquid-glass",
    description: "透明毛玻璃 / 折射 / 浮动卡片",
    colors: { primary: "#ffffff", bg: "transparent", accent: "#3b82f6" },
    deps: ["@yyc3/effects"],
    globalsCssExtra: `
  --liquid-blur: blur(24px);
  --liquid-border: 1px solid rgba(255, 255, 255, 0.15);
  --liquid-bg: rgba(255, 255, 255, 0.08);`,
  },
  {
    title: "医疗洁净",
    value: "medical",
    description: "柔和蓝绿 / 干净圆角 / 安全感",
    colors: { primary: "#0891b2", bg: "#f8fafc" },
    deps: [],
    globalsCssExtra: "",
  },
  {
    title: "音乐律动",
    value: "musical",
    description: "紫蓝渐变 / 频谱动画 / 专辑封面",
    colors: { primary: "#a855f7", bg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", accent: "#6366f1" },
    deps: ["@yyc3/effects", "@yyc3/emotion"],
    globalsCssExtra: `
  --music-gradient: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);`,
  },
  {
    title: "黑客极客",
    value: "hacker",
    description: "绿色终端 / 等宽字体 / 矩阵风格",
    colors: { primary: "#22c55e", bg: "#0a0a0a" },
    deps: ["@yyc3/effects"],
    globalsCssExtra: `
  --hacker-glow: 0 0 8px rgba(34, 197, 94, 0.4);`,
  },
  {
    title: "暗黑极简",
    value: "dark-minimal",
    description: "极致暗色 / 锌色调 / 最少装饰",
    colors: { primary: "#f4f4f5", bg: "#09090b" },
    deps: [],
    globalsCssExtra: "",
  },
  {
    title: "商务专业",
    value: "professional",
    description: "蓝色标准 / 白色背景 / 企业级",
    colors: { primary: "#2563eb", bg: "#ffffff" },
    deps: [],
    globalsCssExtra: "",
  },
  {
    title: "YYC³ Dark",
    value: "yyc3-dark",
    description: "YYC³ 暗色主题 / Zinc 基底",
    colors: { primary: "#f4f4f5", bg: "#09090b" },
    deps: [],
    globalsCssExtra: "",
  },
]

const SCENES: SceneConfig[] = [
  {
    title: "AI 对话",
    value: "ai-chat",
    description: "聊天面板 / 历史记录 / 模型设置 / 流式响应",
    port: 3300,
    deps: { "@yyc3/ai-hub": "^1.4.2", "react-markdown": "^9.0.0" },
    pages: ["chat"],
  },
  {
    title: "管理后台",
    value: "admin-dashboard",
    description: "侧边栏 / 数据表格 / 统计卡片 / 时间线",
    port: 3201,
    deps: { recharts: "^2.15.0" },
    pages: ["dashboard", "users", "settings"],
  },
  {
    title: "数据仪表盘",
    value: "data-dashboard",
    description: "图表面板 / 实时数据 / 统计块",
    port: 3202,
    deps: { recharts: "^2.15.0" },
    pages: ["dashboard"],
  },
  {
    title: "企业官网",
    value: "landing",
    description: "Hero / 功能展示 / 定价 / CTA",
    port: 3200,
    deps: { "@yyc3/motion": "^1.0.0" },
    pages: [],
  },
  {
    title: "医疗健康",
    value: "medical",
    description: "患者列表 / 时间轴 / 处方管理",
    port: 3205,
    deps: {},
    pages: ["patients", "records"],
  },
  {
    title: "学习教育",
    value: "education",
    description: "课程网格 / 视频播放 / 题库测验",
    port: 3203,
    deps: {},
    pages: ["courses", "quiz"],
  },
  {
    title: "CRM 客户",
    value: "crm",
    description: "客户列表 / 销售漏斗 / 详情抽屉",
    port: 3208,
    deps: {},
    pages: ["customers", "pipeline"],
  },
  {
    title: "AI 全栈平台",
    value: "ai-platform",
    description: "多模型管理 / 工作流 / Agent 编排",
    port: 3301,
    deps: { "@yyc3/ai-hub": "^1.4.2" },
    pages: ["models", "agents", "workflows"],
  },
  {
    title: "音乐播放器",
    value: "music-player",
    description: "播放控制 / 歌单 / 频谱可视化",
    port: 3213,
    deps: {},
    pages: ["player", "playlist"],
  },
  {
    title: "DevOps",
    value: "devops",
    description: "CI/CD 流水线 / 日志 / 状态监控",
    port: 3211,
    deps: {},
    pages: ["pipelines", "logs"],
  },
  {
    title: "SaaS 平台",
    value: "saas",
    description: "多租户 / 计费 / 工作空间",
    port: 3212,
    deps: {},
    pages: ["workspace", "billing"],
  },
  {
    title: "电商商城",
    value: "ecommerce",
    description: "商品列表 / 购物车 / 结算",
    port: 3215,
    deps: {},
    pages: ["products", "cart", "checkout"],
  },
  {
    title: "知识库 Wiki",
    value: "knowledge-wiki",
    description: "文档树 / 搜索 / 编辑器",
    port: 3204,
    deps: {},
    pages: ["docs", "search"],
  },
  {
    title: "金融量化",
    value: "financial",
    description: "K线图 / 量化策略 / 实时行情",
    port: 3210,
    deps: { recharts: "^2.15.0" },
    pages: ["market", "strategy"],
  },
  {
    title: "AI 编程 IDE",
    value: "ai-code-ide",
    description: "代码编辑器 / AI 辅助 / 文件树",
    port: 3209,
    deps: {},
    pages: ["editor", "files"],
  },
  {
    title: "AI 呼叫中心",
    value: "ai-call-center",
    description: "通话列表 / 转写记录 / 智能分配",
    port: 3214,
    deps: {},
    pages: ["calls", "transcripts"],
  },
  {
    title: "作品集",
    value: "portfolio",
    description: "项目展示 / 技能时间线 / 联系表单",
    port: 3216,
    deps: { "@yyc3/motion": "^1.0.0" },
    pages: ["projects", "about"],
  },
  {
    title: "智慧城市",
    value: "smart-city",
    description: "地图面板 / IoT 监控 / 数据大屏",
    port: 3206,
    deps: {},
    pages: ["map", "monitor"],
  },
]

function getTheme(value: string): ThemeConfig | undefined {
  return THEMES.find((t) => t.value === value)
}

function getScene(value: string): SceneConfig | undefined {
  return SCENES.find((s) => s.value === value)
}

function generateGlobalsCss(theme: ThemeConfig): string {
  const base = `@import "tailwindcss";\n\n:root {\n  --primary: ${theme.colors.primary};\n  --background: ${theme.colors.bg};`
  const extra = theme.globalsCssExtra ? `\n${theme.globalsCssExtra}` : ""
  const closing = `\n}\n`
  return base + extra + closing
}

function generatePageContent(
  name: string,
  theme: ThemeConfig,
  scenes: SceneConfig[]
): string {
  const sceneImports = scenes
    .flatMap((s) => s.pages)
    .map((p) => `  {/* ${p} page placeholder */}`)
    .join("\n")

  const themeHint = theme.value !== "yyc3-brand"
    ? `\n      <p className="text-sm opacity-60">主题: ${theme.title}</p>`
    : ""

  const scenesHint = scenes.length > 0
    ? `\n      <p className="text-sm opacity-60">场景: ${scenes.map((s) => s.title).join(" + ")}</p>`
    : ""

  return `export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">${name}</h1>${themeHint}${scenesHint}
      <div className="flex gap-2 flex-wrap justify-center">
${scenes
  .flatMap((s) => s.pages)
  .map((p) => `        <a href="/${p}" className="px-4 py-2 rounded-md border hover:bg-accent">${p}</a>`)
  .join("\n")}
      </div>
    </div>
  )
}
`
}

function generateScenePages(targetDir: string, scenes: SceneConfig[]): Promise<void>[] {
  return scenes.flatMap((scene) =>
    scene.pages.map(async (page) => {
      const pageDir = resolve(targetDir, "src/app", page)
      await fs.ensureDir(pageDir)
      await fs.writeFile(
        resolve(pageDir, "page.tsx"),
        `export default function ${page.charAt(0).toUpperCase() + page.slice(1)}Page() {\n  return <div className="p-6">\n    <h2 className="text-xl font-semibold">${page}</h2>\n    <p className="mt-2 text-muted-foreground">${scene.title} — ${page} 页面占位</p>\n  </div>\n}\n`
      )
    })
  )
}

/**
 * 完整业务样板生成（T01-T20）
 *
 * 流程：复制蓝图 → package.json 定制（名称/端口/@yyc3 依赖）→
 *       components.json → 主题注入（可选）→ 依赖安装
 */
async function runBlueprintScaffold(
  blueprint: BlueprintMeta,
  name: string,
  targetDir: string,
  options: {
    theme?: string
    port?: number
    install?: boolean
  }
) {
  const sample = findSample(blueprint.name)
  const label = sample?.label ?? blueprint.name

  console.log(
    chalk.cyan(`\n📦 样板: ${blueprint.id} ${label} (${blueprint.dir})`)
  )

  const result = await scaffoldBlueprint({
    blueprint,
    targetDir,
    theme: options.theme,
    port: options.port,
    install: options.install !== false,
    onPhase: (phase, detail) => {
      const messages: Record<string, string> = {
        copy: "复制蓝图文件",
        customize: `定制 package.json（名称/端口/@yyc3 依赖）`,
        config: "写入 components.json",
        theme: `注入主题 ${detail ?? ""}`,
        install: "安装依赖（可能需要几分钟）",
      }
      console.log(chalk.gray(`  → ${messages[phase] ?? phase}`))
    },
  })

  console.log(chalk.green(`\n✅ 项目 ${result.projectName} 创建成功！`))
  console.log(chalk.blue("\n下一步："))
  console.log(`  cd ${name}`)
  if (result.installed) {
    console.log(`  pnpm dev    # http://localhost:${result.port}`)
  } else {
    console.log(`  pnpm install && pnpm dev    # http://localhost:${result.port}`)
  }
  console.log(
    chalk.gray(
      `\n样板: ${blueprint.id} ${label} | 主题: ${result.theme?.label ?? "蓝图原生"} | 端口: ${result.port}`
    )
  )
  console.log(
    chalk.gray(
      `可用样板: yyc3 samples | 切换主题: yyc3 themes | 添加组件: yyc3 add <name>`
    )
  )
}

async function createProject(
  name: string,
  options: {
    template?: string
    port?: number
    preset?: string
    theme?: string
    scenes?: string
    blueprint?: string
    install?: boolean
  }
) {
  const targetDir = resolve(process.cwd(), name)

  if (await fs.pathExists(targetDir)) {
    console.error(chalk.red(`目录 ${name} 已存在`))
    process.exit(1)
  }

  // ===== 完整业务样板模式（T01-T20 实体蓝图）=====
  let blueprintQuery = options.blueprint

  if (
    !blueprintQuery &&
    !options.template &&
    !options.theme &&
    !options.preset &&
    !options.scenes
  ) {
    // 全交互模式：首问创建方式
    const { mode } = await prompts([
      {
        type: "select",
        name: "mode",
        message: "选择创建方式",
        choices: [
          {
            title: "完整业务样板 (T01-T20)",
            description: "来自 UI-MONO 的 20 套完整 Next.js 应用，开箱即用",
            value: "blueprint",
          },
          {
            title: "主题 × 场景自由组合",
            description: "轻量脚手架，自选视觉主题与业务场景页面",
            value: "scenes",
          },
        ],
      },
    ])

    if (mode === "blueprint") {
      const { blueprint } = await prompts([
        {
          type: "select",
          name: "blueprint",
          message: "选择业务样板",
          choices: BLUEPRINTS.map((b) => {
            const sample = findSample(b.name)
            return {
              title: `${b.id} ${sample?.label ?? b.name}`,
              description: `${sample?.description ?? ""} · 端口 ${b.port}`,
              value: b.name,
            }
          }),
          initial: 1,
        },
      ])
      blueprintQuery = blueprint
    }
  }

  if (blueprintQuery) {
    const blueprint = findBlueprint(blueprintQuery)
    if (!blueprint) {
      console.error(
        chalk.red(
          `未知样板: ${blueprintQuery}\n可选: ${BLUEPRINTS.map((b) => b.name).join(", ")}`
        )
      )
      process.exit(1)
    }

    await runBlueprintScaffold(blueprint, name, targetDir, options)
    return
  }

  // ===== 主题 × 场景组合模式（原有流程）=====
  let themeValue = options.theme || options.preset
  let sceneValues: string[] = options.scenes ? options.scenes.split(",") : []
  let port = options.port

  if (!themeValue) {
    const answers = await prompts([
      {
        type: "select",
        name: "theme",
        message: "选择视觉主题",
        choices: THEMES.map((t) => ({
          title: t.title,
          description: t.description,
          value: t.value,
        })),
        initial: 0,
      },
    ])
    themeValue = answers.theme
  }

  const theme = getTheme(themeValue!) ?? THEMES[0]

  if (sceneValues.length === 0 && !options.template) {
    const answers = await prompts([
      {
        type: "multiselect",
        name: "scenes",
        message: "选择业务场景 (可多选，空格选中，回车确认)",
        choices: SCENES.map((s) => ({
          title: s.title,
          description: s.description,
          value: s.value,
        })),
      },
    ])
    sceneValues = answers.scenes || []
  }

  if (options.template && sceneValues.length === 0) {
    const legacyMap: Record<string, string> = {
      dashboard: "admin-dashboard",
      "ai-platform": "ai-platform",
      landing: "landing",
      api: "admin-dashboard",
    }
    const mapped = legacyMap[options.template]
    if (mapped) sceneValues = [mapped]
  }

  const scenes = sceneValues.map((v) => getScene(v)).filter((s): s is SceneConfig => s !== undefined)

  if (!port) {
    port = scenes.length > 0 ? scenes[0].port : 3200
  }

  const spinner = ora("正在创建项目...").start()

  await fs.ensureDir(targetDir)

  const allSceneDeps: Record<string, string> = {}
  for (const scene of scenes) {
    Object.assign(allSceneDeps, scene.deps)
  }

  const packageJson = {
    name,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: `next dev --port ${port} --turbopack`,
      build: "next build",
      start: `next start --port ${port}`,
      lint: "next lint",
    },
    dependencies: {
      next: "^15.3.0",
      react: "^19.1.0",
      "react-dom": "^19.1.0",
      "@yyc3/ui": "^2.0.2",
      ...Object.fromEntries(theme.deps.map((d) => [d, "latest"])),
      ...allSceneDeps,
    },
    devDependencies: {
      typescript: "^5.8.0",
      "@types/node": "^22.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      tailwindcss: "^4.1.0",
      "@tailwindcss/postcss": "^4.1.0",
    },
  }

  await fs.writeJson(resolve(targetDir, "package.json"), packageJson, { spaces: 2 })

  const dirs = [
    "src/app",
    "src/components",
    "src/components/ui",
    "src/lib",
    "public",
  ]
  for (const dir of dirs) {
    await fs.ensureDir(resolve(targetDir, dir))
  }

  await fs.writeFile(
    resolve(targetDir, "src/app/page.tsx"),
    generatePageContent(name, theme, scenes)
  )

  await fs.writeFile(
    resolve(targetDir, "src/app/layout.tsx"),
    `import type { Metadata } from "next"\nimport "./globals.css"\n\nexport const metadata: Metadata = { title: "${name}", description: "YYC³ Project" }\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html lang="zh-CN"><body>{children}</body></html>\n}\n`
  )

  await fs.writeFile(
    resolve(targetDir, "src/app/globals.css"),
    generateGlobalsCss(theme)
  )

  await Promise.all(generateScenePages(targetDir, scenes))

  await fs.writeFile(
    resolve(targetDir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./src/*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      },
      null,
      2
    )
  )

  await fs.writeFile(
    resolve(targetDir, "next.config.ts"),
    `import type { NextConfig } from "next"\n\nconst nextConfig: NextConfig = {}\n\nexport default nextConfig\n`
  )

  await fs.writeFile(
    resolve(targetDir, "postcss.config.mjs"),
    `/** @type {import('postcss-load-config').Config} */\nconst config = { plugins: { "@tailwindcss/postcss": {} } }\nexport default config\n`
  )

  await fs.writeJson(
    resolve(targetDir, "yyc3.config.json"),
    {
      theme: theme.value,
      scenes: scenes.map((s) => s.value),
      port,
    },
    { spaces: 2 }
  )

  spinner.succeed(chalk.green(`项目 ${name} 创建成功！`))

  console.log(chalk.blue("\n下一步："))
  console.log(`  cd ${name}`)
  console.log(`  pnpm install`)
  console.log(`  pnpm dev`)
  console.log(
    chalk.gray(
      `\n主题: ${theme.title} | 场景: ${scenes.length > 0 ? scenes.map((s) => s.title).join(" + ") : "基础骨架"} | 端口: ${port}`
    )
  )
  console.log(
    chalk.gray(
      `配置: yyc3.config.json | 主题数: ${THEMES.length} | 场景数: ${SCENES.length}`
    )
  )
}

const program = new Command()
  .name("create-yyc3-app")
  .description(
    "YYC³ 项目脚手架 — 完整业务样板 (T01-T20) 或 Theme × Scene 正交组合"
  )
  .argument("<name>", "项目名称")
  .option(
    "--blueprint <blueprint>",
    "完整业务样板（T01-T20 编号或语义名，如 T02 / admin-dashboard）"
  )
  .option(
    "--theme <theme>",
    `视觉主题 (${THEMES.map((t) => t.value).join("/")})`
  )
  .option(
    "--scenes <scenes>",
    "业务场景，逗号分隔 (ai-chat,admin-dashboard,...)"
  )
  .option("-t, --template <template>", "[兼容旧版] 项目模板")
  .option("-p, --port <port>", "开发端口", parseInt)
  .option("--preset <preset>", "[兼容旧版] 等同 --theme")
  .option("--no-install", "跳过依赖安装")
  .action(createProject)

program.parse()
