/**
 * file samples.ts
 * description YYC³ 样板项目注册中心 — 20 套样板
 * module @yyc3/cli
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.2.0
 * created 2026-06-20
 * status active
 *
 * brief 集中管理 20 套业务样板项目的元数据，供 CLI samples 命令调用
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

export type SampleCategory =
  | "ai"
  | "admin"
  | "dashboard"
  | "enterprise"
  | "saas"
  | "landing"
  | "3d"
  | "ecommerce"
  | "education"
  | "medical"
  | "finance"
  | "devops"
  | "music"
  | "knowledge"
  | "forum"
  | "portfolio"
  | "tool"
  | "government"

export interface SampleConfig {
  /** 唯一标识（kebab-case） */
  name: string
  /** 中文显示名 */
  label: string
  /** 样板描述 */
  description: string
  /** 主题样式 */
  style: string
  /** 框架 */
  framework: "next" | "vite" | "astro" | "laravel" | "react-router" | "start"
  /** 分类标签 */
  categories: SampleCategory[]
  /** 样板包含的核心组件 */
  components: string[]
  /** 可用主题 */
  themes: string[]
  /** 源仓库标识 */
  source: string
  /** 文件结构 */
  files: string[]
}

/**
 * 20 套样板项目注册表
 *
 * 分类分布：
 *   AI 智能      × 4  (ai-intelligent-center, ai-medical, ai-code-ide, ai-call-center)
 *   数据仪表盘   × 4  (admin-dashboard, data-dashboard, financial-quant, devops-monitor)
 *   企业 SaaS    × 4  (crm-system, saas-platform, learning-platform, knowledge-wiki)
 *   门户展示     × 4  (landing-page, portfolio, 3d-portal, smart-city)
 *   行业应用     × 4  (ecommerce-shop, music-player, table-converter, forum-community)
 */
export const SAMPLES: SampleConfig[] = [
  {
    name: "ai-intelligent-center",
    label: "AI 智能中心",
    description: "集成多模型对话、知识库与智能助手的 AI 综合中心样板",
    style: "ai-intelligent",
    framework: "next",
    categories: ["ai", "dashboard"],
    components: ["AIAssistant", "BIDashboard", "NotificationCenter", "AIModelSwitcher"],
    themes: ["ai-intelligent"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "admin-dashboard",
    label: "管理仪表盘",
    description: "企业级后台管理仪表盘样板，包含权限、用户、数据看板",
    style: "business-management",
    framework: "next",
    categories: ["admin", "dashboard", "enterprise"],
    components: ["AdvancedBIDashboard", "PermissionManagement", "NotificationCenter", "SystemStatusMonitor"],
    themes: ["business-management"],
    source: "yyc3-Cloud-admin-dashboard",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "landing-page",
    label: "落地页",
    description: "营销转化落地页样板，3D 视觉 + 粒子动效 + 表单收集",
    style: "cyber-futuristic",
    framework: "next",
    categories: ["landing", "3d"],
    components: ["Spotlight", "Card3D", "ParticleCanvas", "EnhancedButton"],
    themes: ["cyber-futuristic", "aurora-gradient"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "ai-medical",
    label: "AI 医疗",
    description: "AI 辅助医疗诊断样板，集成影像分析、智能问诊与电子病历",
    style: "medical-health",
    framework: "next",
    categories: ["ai", "medical"],
    components: ["AIAssistant", "AdvancedBIReports", "ProtectedRoute", "NotificationCenter"],
    themes: ["medical-health"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "learning-platform",
    label: "学习平台",
    description: "在线教育学习平台样板，课程管理、直播课堂、学习进度追踪",
    style: "education-learning",
    framework: "next",
    categories: ["education"],
    components: ["TaskManagement", "AdvancedBIReports", "NotificationCenter", "EnhancedMobileExperience"],
    themes: ["education-learning"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "smart-city",
    label: "智慧城市",
    description: "智慧城市大屏样板，实时数据可视化、3D 地图、事件联动",
    style: "cyber-futuristic",
    framework: "next",
    categories: ["dashboard", "government"],
    components: ["DashboardRealtimeData", "AdvancedBIReports", "SplineScene", "NotificationCenter"],
    themes: ["cyber-futuristic", "dashboard-data"],
    source: "yyc3-Cloud-admin-dashboard",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "3d-portal",
    label: "3D 门户",
    description: "3D 沉浸式门户样板，Spline 场景 + 粒子背景 + 3D 卡片",
    style: "cyber-futuristic",
    framework: "next",
    categories: ["3d", "landing"],
    components: ["SplineScene", "Card3D", "ParticleCanvas", "Spotlight"],
    themes: ["cyber-futuristic", "aurora-gradient"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "crm-system",
    label: "CRM 系统",
    description: "客户关系管理系统样板，客户全生命周期、销售漏斗、合同管理",
    style: "business-management",
    framework: "next",
    categories: ["enterprise", "admin"],
    components: ["CustomerManagement", "TaskManagement", "AdvancedBIReports", "NotificationCenter"],
    themes: ["business-management"],
    source: "yyc3-Cloud-admin-dashboard",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "data-dashboard",
    label: "数据仪表盘",
    description: "数据分析仪表盘样板，多维度数据可视化、实时图表、BI 报表",
    style: "dashboard-data",
    framework: "next",
    categories: ["dashboard"],
    components: ["AdvancedBIDashboard", "DashboardRealtimeData", "KPITracking", "AdvancedBIReports"],
    themes: ["dashboard-data"],
    source: "yyc3-Cloud-admin-dashboard",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "ai-code-ide",
    label: "AI 代码 IDE",
    description: "AI 辅助代码编辑器样板，Monaco Editor + AI 补全 + 多文件管理",
    style: "cli-devops",
    framework: "next",
    categories: ["ai", "devops"],
    components: ["AIAssistant", "MonacoEditor", "AdvancedSearch", "NotificationCenter"],
    themes: ["cli-devops"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "financial-quant",
    label: "金融量化",
    description: "金融量化分析平台样板，实时行情、策略回测、风险监控",
    style: "finance-quantitative",
    framework: "next",
    categories: ["finance", "dashboard"],
    components: ["FinanceModule", "AdvancedBIDashboard", "DashboardRealtimeData", "ProtectedRoute"],
    themes: ["finance-quantitative", "dashboard-data"],
    source: "yyc3-Cloud-admin-dashboard",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "music-player",
    label: "音乐播放器",
    description: "音乐播放器样板，播放列表、歌词同步、可视化频谱",
    style: "aurora-gradient",
    framework: "next",
    categories: ["music"],
    components: ["ParticleCanvas", "EnhancedMobileExperience", "TouchGestures", "QuickActions"],
    themes: ["aurora-gradient", "cyber-futuristic"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "devops-monitor",
    label: "DevOps 监控",
    description: "DevOps 监控平台样板，CI/CD 流水线、服务健康、日志聚合",
    style: "cli-devops",
    framework: "next",
    categories: ["devops", "dashboard"],
    components: ["SystemStatusMonitor", "DashboardRealtimeData", "NotificationCenter", "AdvancedBIReports"],
    themes: ["cli-devops"],
    source: "yyc3-Cloud-admin-dashboard",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "saas-platform",
    label: "SaaS 平台",
    description: "多租户 SaaS 平台样板，订阅计费、多租户隔离、白标定制",
    style: "business-management",
    framework: "next",
    categories: ["saas", "enterprise"],
    components: ["TenantManagement", "PermissionManagement", "AdvancedBIDashboard", "NotificationCenter"],
    themes: ["business-management"],
    source: "yyc3-Cloud-admin-dashboard",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "ai-call-center",
    label: "AI 呼叫中心",
    description: "AI 智能呼叫中心样板，语音识别、智能路由、实时质检",
    style: "ai-intelligent",
    framework: "next",
    categories: ["ai", "enterprise"],
    components: ["AIAssistant", "DashboardRealtimeData", "NotificationCenter", "AdvancedBIReports"],
    themes: ["ai-intelligent", "business-management"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "knowledge-wiki",
    label: "知识 Wiki",
    description: "企业知识库 Wiki 样板，协同编辑、全文检索、权限分级",
    style: "education-learning",
    framework: "next",
    categories: ["knowledge", "enterprise"],
    components: ["AdvancedSearch", "TeamCollaboration", "PermissionManagement", "NotificationCenter"],
    themes: ["education-learning", "business-management"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "ecommerce-shop",
    label: "电商商店",
    description: "电商商店样板，商品管理、购物车、订单流程、支付集成",
    style: "business-management",
    framework: "next",
    categories: ["ecommerce", "enterprise"],
    components: ["AdvancedSearch", "EnhancedMobileExperience", "NotificationCenter", "QuickActions"],
    themes: ["business-management", "aurora-gradient"],
    source: "yyc3-Cloud-admin-dashboard",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "portfolio",
    label: "个人作品集",
    description: "个人作品集样板，3D 头像、动效展示、项目卡片",
    style: "minimal-zero",
    framework: "next",
    categories: ["portfolio", "3d"],
    components: ["Spotlight", "Card3D", "ParticleCanvas", "EnhancedButton"],
    themes: ["minimal-zero", "aurora-gradient"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "table-converter",
    label: "表格转换器",
    description: "表格数据转换工具样板，CSV/Excel/JSON 互转、数据清洗、可视化预览",
    style: "minimal-zero",
    framework: "next",
    categories: ["tool"],
    components: ["DataTable", "AdvancedSearch", "MonacoEditor", "QuickActions"],
    themes: ["minimal-zero"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
  {
    name: "forum-community",
    label: "论坛社区",
    description: "论坛社区样板，话题讨论、用户等级、实时通知、富文本编辑",
    style: "education-learning",
    framework: "next",
    categories: ["forum"],
    components: ["NotificationCenter", "AdvancedSearch", "TeamCollaboration", "ProfileDialog"],
    themes: ["education-learning", "aurora-gradient"],
    source: "yyc3-xy-ai",
    files: [
      "app",
      "components",
      "lib",
      "hooks",
      "styles",
      "public",
      "package.json",
      "tsconfig.json",
      "tailwind.config.ts",
      "components.json",
      "next.config.mjs",
    ],
  },
]

/**
 * 根据名称查找样板
 */
export function findSample(name: string): SampleConfig | undefined {
  return SAMPLES.find((s) => s.name === name)
}

/**
 * 根据分类筛选样板
 */
export function filterSamplesByCategory(category: SampleCategory): SampleConfig[] {
  return SAMPLES.filter((s) => s.categories.includes(category))
}

/**
 * 列出所有样板名称
 */
export function listSampleNames(): string[] {
  return SAMPLES.map((s) => s.name)
}

/**
 * 获取所有分类
 */
export function listCategories(): SampleCategory[] {
  const set = new Set<SampleCategory>()
  for (const sample of SAMPLES) {
    for (const c of sample.categories) {
      set.add(c)
    }
  }
  return Array.from(set).sort()
}
