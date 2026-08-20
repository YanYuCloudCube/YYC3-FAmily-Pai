export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">Y³</span>
          </div>
          <span className="text-lg font-bold">YYC³</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">特性</a>
          <a href="#stats" className="text-muted-foreground hover:text-foreground transition-colors">数据</a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">定价</a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">联系</a>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            登录
          </a>
          <a href="#" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            免费开始
          </a>
        </div>
      </div>
    </header>
  )
}
