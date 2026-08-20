export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-sm mb-4">产品</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">AI智能中心</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">管理后台</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">数据看盘</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">知识库</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">开发者</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">文档</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">CLI</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">公司</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">关于</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">博客</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">招聘</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">联系</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">法律</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">隐私政策</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">服务条款</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cookie</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 YanYuCloudCube. 言启象限 · 语枢未来</span>
          <span>YYC³ FAmily π³</span>
        </div>
      </div>
    </footer>
  )
}
