export default function DocPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
        <a href="/docs" className="hover:text-foreground">文档</a>
        <span>/</span>
        <a href="/docs/getting-started" className="hover:text-foreground">快速开始</a>
        <span>/</span>
        <span className="text-foreground">安装指南</span>
      </nav>

      <article>
        <h1 className="text-3xl font-bold mb-2">安装指南</h1>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-8">
          <span>最后更新: 2026-05-08</span>
          <span>·</span>
          <span>阅读时间: 3分钟</span>
          <span>·</span>
          <span className="px-2 py-0.5 rounded bg-secondary">v3.0</span>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold">前置条件</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mt-2">
              <li>Node.js ≥ 18.0.0</li>
              <li>pnpm ≥ 9.0.0</li>
              <li>Git</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">快速创建项目</h2>
            <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto">
              <code>{`# 使用YYC³ CLI创建项目
npx @yyc3/cli init my-project

# 选择模板
? 选择项目模板: AI智能中心

# 选择主题
? 选择主题预设: YYC³ Dark (Cyberpunk)

# 安装依赖
cd my-project
pnpm install

# 启动开发服务器
pnpm dev`}</code>
            </pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold">手动安装</h2>
            <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto">
              <code>{`# 安装核心依赖
pnpm add @yyc3/ui @yyc3/core

# 安装CLI工具
pnpm add -D @yyc3/cli`}</code>
            </pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold">验证安装</h2>
            <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto">
              <code>{`# 检查CLI版本
npx @yyc3/cli --version
# 输出: @yyc3/cli/1.0.0

# 查看可用组件
npx @yyc3/cli search button`}</code>
            </pre>
          </section>
        </div>
      </article>

      <div className="mt-12 pt-6 border-t border-border flex justify-between">
        <a href="/docs/configuration" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          配置说明
        </a>
        <a href="/docs/project-structure" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          项目结构
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}
