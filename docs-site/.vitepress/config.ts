import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'YYC³ AI Family',
  description: '八位拟人化 AI 家人的智能中枢 · 全栈文档门户',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'og:site_name', content: 'YYC³ AI Family' }],
  ],

  locales: {
    root: { label: '简体中文', lang: 'zh-CN' },
    'zh-TW': { label: '繁體中文', lang: 'zh-TW', link: '/zh-TW/' },
    en: { label: 'English', lang: 'en', link: '/en/' },
    ja: { label: '日本語', lang: 'ja', link: '/ja/' },
    ko: { label: '한국어', lang: 'ko', link: '/ko/' },
    fr: { label: 'Français', lang: 'fr', link: '/fr/' },
    de: { label: 'Deutsch', lang: 'de', link: '/de/' },
    es: { label: 'Español', lang: 'es', link: '/es/' },
    pt: { label: 'Português', lang: 'pt-BR', link: '/pt/' },
    ar: { label: 'العربية', lang: 'ar', link: '/ar/', dir: 'rtl' },
  },

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'YYC³',

    nav: [
      { text: '首页', link: '/' },
      {
        text: '包文档',
        items: [
          { text: '@yyc3/core — 核心引擎', link: '/packages/core' },
          { text: '@yyc3/ai-hub — AI 集成中心', link: '/packages/ai-hub' },
          { text: '@yyc3/emotion — 情感引擎', link: '/packages/emotion' },
          { text: '@yyc3/i18n-core — 国际化', link: '/packages/i18n-core' },
          { text: '@yyc3/ui — UI 组件库', link: '/packages/ui' },
          { text: '@yyc3/effects — 特效组件库', link: '/packages/effects' },
          { text: '@yyc3/plugins — 插件集合', link: '/packages/plugins' },
          { text: '@yyc3/mcp-servers — MCP 服务器', link: '/packages/mcp-servers' },
          { text: '@yyc3/ide — IDE 环境', link: '/packages/ide' },
          { text: '@yyc3/motion — 动效引擎', link: '/packages/motion' },
          { text: '@yyc3/cli — 智能编程库 CLI', link: '/packages/cli' },
        ],
      },
      {
        text: '架构',
        items: [
          { text: '五维五高架构', link: '/architecture/overview' },
          { text: 'AI Family 八位家人', link: '/architecture/family' },
          { text: '包依赖关系', link: '/architecture/dependencies' },
        ],
      },
      {
        text: '质量',
        items: [
          { text: '审核报告', link: '/quality/audit-report' },
          { text: '测试覆盖率', link: '/quality/test-coverage' },
          { text: '发布清单', link: '/quality/release-checklist' },
        ],
      },
      {
        text: '资源',
        items: [
          { text: 'GitHub', link: 'https://github.com/YanYuCloudCube/YYC3-FAmily-Pai' },
          { text: 'NPM @yyc3', link: 'https://www.npmjs.com/org/yyc3' },
          { text: '贡献指南', link: 'https://github.com/YanYuCloudCube/YYC3-FAmily-Pai/blob/main/CONTRIBUTING.md' },
        ],
      },
    ],

    sidebar: {
      '/packages/': [
        {
          text: '核心包',
          items: [
            { text: '@yyc3/core', link: '/packages/core' },
            { text: '@yyc3/ai-hub', link: '/packages/ai-hub' },
          ],
        },
        {
          text: '功能包',
          items: [
            { text: '@yyc3/emotion', link: '/packages/emotion' },
            { text: '@yyc3/i18n-core', link: '/packages/i18n-core' },
          ],
        },
        {
          text: '界面与扩展',
          items: [
            { text: '@yyc3/ui', link: '/packages/ui' },
            { text: '@yyc3/effects', link: '/packages/effects' },
            { text: '@yyc3/plugins', link: '/packages/plugins' },
            { text: '@yyc3/mcp-servers', link: '/packages/mcp-servers' },
            { text: '@yyc3/ide', link: '/packages/ide' },
            { text: '@yyc3/motion', link: '/packages/motion' },
            { text: '@yyc3/cli', link: '/packages/cli' },
          ],
        },
      ],
      '/architecture/': [
        {
          text: '架构设计',
          items: [
            { text: '五维五高架构', link: '/architecture/overview' },
            { text: 'AI Family 八位家人', link: '/architecture/family' },
            { text: '包依赖关系', link: '/architecture/dependencies' },
          ],
        },
      ],
      '/quality/': [
        {
          text: '质量报告',
          items: [
            { text: '审核报告', link: '/quality/audit-report' },
            { text: '测试覆盖率', link: '/quality/test-coverage' },
            { text: '发布清单', link: '/quality/release-checklist' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/YanYuCloudCube/YYC3-FAmily-Pai' },
    ],

    footer: {
      message: 'YYC³ AI Family — 五高 · 五标 · 五化 · 五维',
      copyright: '© 2025-2026 YanYuCloudCube Team',
    },

    search: {
      provider: 'local',
    },
  },
})
