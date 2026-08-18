/**
 * file registry.ts
 * description YYC³ 主题系统统一注册中心 — 28 套主题 / 三层正交架构
 * module @yyc3/cli/themes
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-06-20
 * status active
 *
 * brief 三层正交架构：
 *   - Base Preset Layer (7)   — shadcn 风格预设（字体/图标库/基础色）
 *   - Visual Style Layer (11) — 视觉调性（CSS变量/特效/整体观感）
 *   - Business Scenario Layer (10) — 业务场景（组件组合/布局/页面结构）
 *
 *   7 × 11 × 10 = 770 种正交组合
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

// ============================================================================
// 类型定义
// ============================================================================

export type ThemeLayer = "preset" | "visual" | "scenario"

export type ThemeCategory =
  | "brand"
  | "cyberpunk"
  | "futuristic"
  | "aurora"
  | "glass"
  | "medical"
  | "musical"
  | "hacker"
  | "minimal"
  | "professional"
  | "dark"
  | "education"
  | "finance"
  | "devops"
  | "business"
  | "dashboard"
  | "ai"
  | "ecommerce"
  | "forum"

export interface ThemeConfig {
  /** 唯一标识（kebab-case） */
  name: string
  /** 中文显示名 */
  label: string
  /** 主题描述 */
  description: string
  /** 所属层 */
  layer: ThemeLayer
  /** 分类标签 */
  categories: ThemeCategory[]
  /** 主色 */
  primaryColor: string
  /** 背景色 */
  backgroundColor: string
  /** 强调色（可选） */
  accentColor?: string
  /** 字体 */
  font?: string
  /** 标题字体 */
  fontHeading?: string
  /** 图标库 */
  iconLibrary?: "lucide" | "hugeicons" | "phosphor" | "radix-icons"
  /** baseColor（shadcn） */
  baseColor?: string
  /** 主题色（shadcn theme） */
  theme?: string
  /** 圆角 */
  radius?: "none" | "sm" | "default" | "md" | "lg" | "xl"
  /** 暗色模式 */
  darkMode?: boolean
  /** 依赖包 */
  deps?: string[]
  /** 额外 CSS 变量 */
  cssVars?: Record<string, string>
  /** 关联样板（scenario 层） */
  samples?: string[]
}

// ============================================================================
// Layer 1: Base Preset Layer (7) — shadcn 风格预设
// ============================================================================

export const BASE_PRESETS: ThemeConfig[] = [
  {
    name: "nova",
    label: "Nova",
    description: "Lucide 图标 / Geist 字体 / 中性色调",
    layer: "preset",
    categories: ["minimal", "professional"],
    primaryColor: "#0ea5e9",
    backgroundColor: "#ffffff",
    font: "geist",
    iconLibrary: "lucide",
    baseColor: "neutral",
    theme: "neutral",
    radius: "default",
    darkMode: false,
  },
  {
    name: "vega",
    label: "Vega",
    description: "Lucide 图标 / Inter 字体 / 简洁现代",
    layer: "preset",
    categories: ["minimal", "professional"],
    primaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    font: "inter",
    iconLibrary: "lucide",
    baseColor: "neutral",
    theme: "neutral",
    radius: "default",
    darkMode: false,
  },
  {
    name: "maia",
    label: "Maia",
    description: "Hugeicons / Figtree 字体 / 精致细节",
    layer: "preset",
    categories: ["professional"],
    primaryColor: "#8b5cf6",
    backgroundColor: "#ffffff",
    font: "figtree",
    iconLibrary: "hugeicons",
    baseColor: "neutral",
    theme: "neutral",
    radius: "default",
    darkMode: false,
  },
  {
    name: "lyra",
    label: "Lyra",
    description: "Phosphor 图标 / JetBrains Mono / 技术感",
    layer: "preset",
    categories: ["hacker", "devops"],
    primaryColor: "#10b981",
    backgroundColor: "#0a0a0a",
    font: "jetbrains-mono",
    iconLibrary: "phosphor",
    baseColor: "zinc",
    theme: "zinc",
    radius: "default",
    darkMode: true,
  },
  {
    name: "mira",
    label: "Mira",
    description: "Hugeicons / Inter 字体 / 国际化友好",
    layer: "preset",
    categories: ["professional", "business"],
    primaryColor: "#06b6d4",
    backgroundColor: "#ffffff",
    font: "inter",
    iconLibrary: "hugeicons",
    baseColor: "neutral",
    theme: "neutral",
    radius: "default",
    darkMode: false,
  },
  {
    name: "luma",
    label: "Luma",
    description: "Lucide / Inter / 通用平衡型",
    layer: "preset",
    categories: ["minimal", "professional"],
    primaryColor: "#f59e0b",
    backgroundColor: "#ffffff",
    font: "inter",
    iconLibrary: "lucide",
    baseColor: "neutral",
    theme: "neutral",
    radius: "default",
    darkMode: false,
  },
  {
    name: "sera",
    label: "Sera",
    description: "Lucide / Noto Sans + Playfair Display / 优雅衬线",
    layer: "preset",
    categories: ["professional"],
    primaryColor: "#d97706",
    backgroundColor: "#fffbeb",
    font: "noto-sans",
    fontHeading: "playfair-display",
    iconLibrary: "lucide",
    baseColor: "taupe",
    theme: "taupe",
    radius: "default",
    darkMode: false,
  },
]

// ============================================================================
// Layer 2: Visual Style Layer (11) — 视觉调性
// ============================================================================

export const VISUAL_STYLES: ThemeConfig[] = [
  {
    name: "yyc3-brand",
    label: "YYC³ Brand",
    description: "YYC³ 品牌标准色 / Geist / Lucide / 品牌识别首选",
    layer: "visual",
    categories: ["brand"],
    primaryColor: "oklch(0.7 0.15 260)",
    backgroundColor: "#ffffff",
    font: "geist",
    iconLibrary: "lucide",
    radius: "default",
    darkMode: false,
  },
  {
    name: "cyberpunk",
    label: "赛博朋克",
    description: "霓虹发光 / 暗色背景 / 故障效果 / 霓虹卡片",
    layer: "visual",
    categories: ["cyberpunk"],
    primaryColor: "#00f0ff",
    backgroundColor: "#0a0a0f",
    accentColor: "#ff00ff",
    deps: ["@yyc3/effects"],
    cssVars: {
      "--cyber-glow": "0 0 20px rgba(0, 240, 255, 0.3)",
      "--cyber-border": "1px solid rgba(0, 240, 255, 0.2)",
      "--cyber-text-glow": "0 0 10px rgba(0, 240, 255, 0.5)",
    },
    radius: "none",
    darkMode: true,
  },
  {
    name: "futuristic",
    label: "未来科技",
    description: "玻璃拟态 / 粒子背景 / 渐变光晕 / 未来感",
    layer: "visual",
    categories: ["futuristic"],
    primaryColor: "#8b5cf6",
    backgroundColor: "radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1a 100%)",
    accentColor: "#06b6d4",
    deps: ["@yyc3/effects"],
    cssVars: {
      "--glass-bg": "rgba(255, 255, 255, 0.05)",
      "--glass-border": "rgba(255, 255, 255, 0.1)",
      "--glass-blur": "blur(16px)",
    },
    radius: "lg",
    darkMode: true,
  },
  {
    name: "aurora",
    label: "极光星空",
    description: "极光渐变 / 深空背景 / 微光闪烁 / 梦幻感",
    layer: "visual",
    categories: ["aurora"],
    primaryColor: "#06b6d4",
    backgroundColor: "#0c0c1d",
    accentColor: "#a855f7",
    deps: ["@yyc3/effects"],
    cssVars: {
      "--aurora-gradient": "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
      "--aurora-shimmer": "0 0 40px rgba(6, 182, 212, 0.15)",
    },
    radius: "xl",
    darkMode: true,
  },
  {
    name: "liquid-glass",
    label: "液态玻璃",
    description: "透明毛玻璃 / 折射 / 浮动卡片 / Apple 风格",
    layer: "visual",
    categories: ["glass", "futuristic"],
    primaryColor: "#ffffff",
    backgroundColor: "transparent",
    accentColor: "#3b82f6",
    deps: ["@yyc3/effects"],
    cssVars: {
      "--liquid-blur": "blur(24px)",
      "--liquid-border": "1px solid rgba(255, 255, 255, 0.15)",
      "--liquid-bg": "rgba(255, 255, 255, 0.08)",
    },
    radius: "xl",
    darkMode: false,
  },
  {
    name: "medical",
    label: "医疗洁净",
    description: "柔和蓝绿 / 干净圆角 / 安全感 / 医疗卫生",
    layer: "visual",
    categories: ["medical"],
    primaryColor: "#0891b2",
    backgroundColor: "#f8fafc",
    radius: "lg",
    darkMode: false,
  },
  {
    name: "musical",
    label: "音乐律动",
    description: "紫蓝渐变 / 频谱动画 / 专辑封面 / 音乐主题",
    layer: "visual",
    categories: ["musical"],
    primaryColor: "#a855f7",
    backgroundColor: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    accentColor: "#6366f1",
    deps: ["@yyc3/effects", "@yyc3/emotion"],
    cssVars: {
      "--music-gradient": "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
    },
    radius: "default",
    darkMode: true,
  },
  {
    name: "hacker",
    label: "黑客极客",
    description: "绿色终端 / 等宽字体 / 矩阵风格 / 极客氛围",
    layer: "visual",
    categories: ["hacker"],
    primaryColor: "#22c55e",
    backgroundColor: "#0a0a0a",
    font: "jetbrains-mono",
    deps: ["@yyc3/effects"],
    cssVars: {
      "--hacker-glow": "0 0 8px rgba(34, 197, 94, 0.4)",
    },
    radius: "none",
    darkMode: true,
  },
  {
    name: "dark-minimal",
    label: "暗黑极简",
    description: "极致暗色 / 锌色调 / 最少装饰 / 极简主义",
    layer: "visual",
    categories: ["dark", "minimal"],
    primaryColor: "#f4f4f5",
    backgroundColor: "#09090b",
    radius: "sm",
    darkMode: true,
  },
  {
    name: "professional",
    label: "商务专业",
    description: "蓝色标准 / 白色背景 / 企业级 / 严肃商务",
    layer: "visual",
    categories: ["professional", "business"],
    primaryColor: "#2563eb",
    backgroundColor: "#ffffff",
    radius: "default",
    darkMode: false,
  },
  {
    name: "yyc3-dark",
    label: "YYC³ Dark",
    description: "YYC³ 暗色主题 / Zinc 基底 / 默认暗色",
    layer: "visual",
    categories: ["brand", "dark"],
    primaryColor: "#f4f4f5",
    backgroundColor: "#09090b",
    font: "geist",
    iconLibrary: "lucide",
    baseColor: "zinc",
    theme: "zinc",
    radius: "default",
    darkMode: true,
  },
]

// ============================================================================
// Layer 3: Business Scenario Layer (10) — 业务场景
// ============================================================================

export const BUSINESS_SCENARIOS: ThemeConfig[] = [
  {
    name: "ai-intelligent",
    label: "AI 智能",
    description: "AI 智能场景 / 多模型对话 / 知识库 / 智能助手",
    layer: "scenario",
    categories: ["ai"],
    primaryColor: "#00d4ff",
    backgroundColor: "#0a0e1a",
    accentColor: "#8b5cf6",
    radius: "lg",
    darkMode: true,
    samples: ["ai-intelligent-center", "ai-medical", "ai-code-ide", "ai-call-center"],
  },
  {
    name: "business-management",
    label: "企业管理",
    description: "企业级管理 / 权限 / 用户 / 数据看板",
    layer: "scenario",
    categories: ["business", "dashboard"],
    primaryColor: "#2563eb",
    backgroundColor: "#ffffff",
    radius: "default",
    darkMode: false,
    samples: ["admin-dashboard", "crm-system", "saas-platform"],
  },
  {
    name: "cli-devops",
    label: "CLI DevOps",
    description: "DevOps / CI/CD / 终端 / 命令行风格",
    layer: "scenario",
    categories: ["devops"],
    primaryColor: "#22c55e",
    backgroundColor: "#0a0a0a",
    font: "jetbrains-mono",
    radius: "none",
    darkMode: true,
    samples: ["ai-code-ide", "devops-monitor"],
  },
  {
    name: "cyber-futuristic",
    label: "赛博未来",
    description: "赛博朋克 + 未来科技融合 / 3D / 粒子 / 霓虹",
    layer: "scenario",
    categories: ["cyberpunk", "futuristic"],
    primaryColor: "#00f0ff",
    backgroundColor: "#0a0a0f",
    accentColor: "#ff00ff",
    deps: ["@yyc3/effects"],
    radius: "lg",
    darkMode: true,
    samples: ["landing-page", "3d-portal", "portfolio", "smart-city"],
  },
  {
    name: "dashboard-data",
    label: "数据仪表盘",
    description: "数据可视化 / 图表 / BI 报表 / 实时监控",
    layer: "scenario",
    categories: ["dashboard"],
    primaryColor: "#0ea5e9",
    backgroundColor: "#0f172a",
    accentColor: "#22d3ee",
    radius: "default",
    darkMode: true,
    samples: ["admin-dashboard", "data-dashboard", "financial-quant", "devops-monitor"],
  },
  {
    name: "education-learning",
    label: "教育学习",
    description: "在线教育 / 课程 / 直播 / 学习进度",
    layer: "scenario",
    categories: ["education"],
    primaryColor: "#16a34a",
    backgroundColor: "#f0fdf4",
    radius: "lg",
    darkMode: false,
    samples: ["learning-platform", "knowledge-wiki", "forum-community"],
  },
  {
    name: "finance-quantitative",
    label: "金融量化",
    description: "金融 / 量化 / K线 / 实时行情",
    layer: "scenario",
    categories: ["finance"],
    primaryColor: "#ca8a04",
    backgroundColor: "#0c0a09",
    accentColor: "#fbbf24",
    radius: "sm",
    darkMode: true,
    samples: ["financial-quant"],
  },
  {
    name: "medical-health",
    label: "医疗健康",
    description: "医疗卫生 / 患者 / 电子病历 / 影像",
    layer: "scenario",
    categories: ["medical"],
    primaryColor: "#0891b2",
    backgroundColor: "#f8fafc",
    radius: "lg",
    darkMode: false,
    samples: ["ai-medical"],
  },
  {
    name: "minimal-zero",
    label: "极简零干扰",
    description: "极致极简 / 零装饰 / 内容优先 / 工具类",
    layer: "scenario",
    categories: ["minimal"],
    primaryColor: "#171717",
    backgroundColor: "#ffffff",
    radius: "none",
    darkMode: false,
    samples: ["portfolio", "table-converter"],
  },
  {
    name: "aurora-gradient",
    label: "极光渐变",
    description: "极光渐变 / 梦幻色彩 / 创意展示",
    layer: "scenario",
    categories: ["aurora"],
    primaryColor: "#06b6d4",
    backgroundColor: "#0c0c1d",
    accentColor: "#a855f7",
    deps: ["@yyc3/effects"],
    radius: "xl",
    darkMode: true,
    samples: ["music-player", "ecommerce-shop", "forum-community"],
  },
]

// ============================================================================
// 全量主题聚合（28）
// ============================================================================

export const ALL_THEMES: ThemeConfig[] = [
  ...BASE_PRESETS,
  ...VISUAL_STYLES,
  ...BUSINESS_SCENARIOS,
]

export const THEME_COUNT = ALL_THEMES.length // 28

// ============================================================================
// 查询工具函数
// ============================================================================

/**
 * 根据名称查找主题
 */
export function findTheme(name: string): ThemeConfig | undefined {
  return ALL_THEMES.find((t) => t.name === name)
}

/**
 * 根据层筛选主题
 */
export function filterThemesByLayer(layer: ThemeLayer): ThemeConfig[] {
  return ALL_THEMES.filter((t) => t.layer === layer)
}

/**
 * 根据分类筛选主题
 */
export function filterThemesByCategory(category: ThemeCategory): ThemeConfig[] {
  return ALL_THEMES.filter((t) => t.categories.includes(category))
}

/**
 * 列出所有主题名称
 */
export function listThemeNames(): string[] {
  return ALL_THEMES.map((t) => t.name)
}

/**
 * 列出所有分类
 */
export function listAllCategories(): ThemeCategory[] {
  const set = new Set<ThemeCategory>()
  for (const theme of ALL_THEMES) {
    for (const c of theme.categories) {
      set.add(c)
    }
  }
  return Array.from(set).sort()
}

/**
 * 获取暗色主题
 */
export function getDarkThemes(): ThemeConfig[] {
  return ALL_THEMES.filter((t) => t.darkMode === true)
}

/**
 * 获取亮色主题
 */
export function getLightThemes(): ThemeConfig[] {
  return ALL_THEMES.filter((t) => t.darkMode === false)
}

/**
 * 生成 CSS 变量字符串
 */
export function generateCssVars(theme: ThemeConfig): string {
  const vars: string[] = []
  vars.push(`  --primary: ${theme.primaryColor};`)
  vars.push(`  --background: ${theme.backgroundColor};`)
  if (theme.accentColor) {
    vars.push(`  --accent: ${theme.accentColor};`)
  }
  if (theme.cssVars) {
    for (const [key, value] of Object.entries(theme.cssVars)) {
      vars.push(`  ${key}: ${value};`)
    }
  }
  return `:root[data-theme="${theme.name}"] {\n${vars.join("\n")}\n}`
}

/**
 * 三层正交组合查询
 * @param presetName 基础预设名
 * @param visualName 视觉风格名
 * @param scenarioName 业务场景名
 */
export function composeTheme(
  presetName: string,
  visualName: string,
  scenarioName: string
): {
  preset: ThemeConfig | undefined
  visual: ThemeConfig | undefined
  scenario: ThemeConfig | undefined
  composed: {
    primaryColor: string
    backgroundColor: string
    accentColor?: string
    font?: string
    fontHeading?: string
    iconLibrary?: string
    radius?: string
    darkMode?: boolean
    cssVars: Record<string, string>
  }
} {
  const preset = findTheme(presetName)
  const visual = findTheme(visualName)
  const scenario = findTheme(scenarioName)

  // 合并优先级：scenario > visual > preset
  const composed = {
    primaryColor: scenario?.primaryColor ?? visual?.primaryColor ?? preset?.primaryColor ?? "#000000",
    backgroundColor: scenario?.backgroundColor ?? visual?.backgroundColor ?? preset?.backgroundColor ?? "#ffffff",
    accentColor: scenario?.accentColor ?? visual?.accentColor ?? preset?.accentColor,
    font: scenario?.font ?? visual?.font ?? preset?.font,
    fontHeading: scenario?.fontHeading ?? visual?.fontHeading ?? preset?.fontHeading,
    iconLibrary: scenario?.iconLibrary ?? visual?.iconLibrary ?? preset?.iconLibrary,
    radius: scenario?.radius ?? visual?.radius ?? preset?.radius,
    darkMode: scenario?.darkMode ?? visual?.darkMode ?? preset?.darkMode,
    cssVars: {
      ...(preset?.cssVars ?? {}),
      ...(visual?.cssVars ?? {}),
      ...(scenario?.cssVars ?? {}),
    },
  }

  return { preset, visual, scenario, composed }
}

/**
 * 验证主题配置完整性
 */
export function validateTheme(theme: ThemeConfig): string[] {
  const errors: string[] = []
  if (!theme.name) errors.push("Missing name")
  if (!theme.label) errors.push("Missing label")
  if (!theme.description) errors.push("Missing description")
  if (!theme.layer) errors.push("Missing layer")
  if (!theme.primaryColor) errors.push("Missing primaryColor")
  if (!theme.backgroundColor) errors.push("Missing backgroundColor")
  if (theme.categories.length === 0) errors.push("Missing categories")
  return errors
}
