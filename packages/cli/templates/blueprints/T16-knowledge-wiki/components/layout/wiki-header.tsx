export function WikiHeader() {
  return (
    <header className="h-14 border-b border-border flex items-center px-4 gap-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">Y³</span>
        </div>
        <span className="text-sm font-semibold">YYC³ Wiki</span>
      </div>

      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <input
            type="search"
            placeholder="搜索文档... (Ctrl+K)"
            className="w-full rounded-lg border border-input bg-muted/50 px-3 py-1.5 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">
          新建文档
        </button>
      </div>
    </header>
  )
}
