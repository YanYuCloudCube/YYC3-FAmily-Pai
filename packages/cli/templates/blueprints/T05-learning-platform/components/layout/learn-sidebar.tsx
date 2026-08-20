export function LearnSidebar() {
  const navItems = [
    { label: "课程中心", href: "/courses", icon: "📚" },
    { label: "学习进度", href: "/progress", icon: "📊" },
  ]

  return (
    <aside className="w-64 border-r border-border bg-sidebar-background flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">Y³</span>
          </div>
          <div>
            <div className="text-sm font-semibold">YYC³ 学习</div>
            <div className="text-xs text-muted-foreground">智能学习平台</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors"
          >
            <span>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="rounded-xl bg-primary/10 p-3">
          <div className="text-xs font-medium text-primary mb-1">今日学习</div>
          <div className="text-lg font-bold">2h 35min</div>
          <div className="text-xs text-muted-foreground mt-1">目标: 3h · 还需25分钟</div>
          <div className="h-1.5 rounded-full bg-primary/20 mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: "86%" }} />
          </div>
        </div>
      </div>
    </aside>
  )
}
