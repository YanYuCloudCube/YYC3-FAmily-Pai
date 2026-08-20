export default function PortfolioPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
      <section className="text-center"><div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><span className="text-3xl">Y³</span></div><h1 className="text-4xl font-bold">YYC³ Studio</h1><p className="text-lg text-muted-foreground mt-3">言启象限 · 语枢未来 · AI智能应用开发者</p></section>
      <section><h2 className="text-2xl font-bold mb-6">项目展示</h2><div className="grid grid-cols-2 gap-4">{[{t:"AI智能中心",d:"ChatGPT风格对话平台",t2:"Next.js + React"},{t:"管理后台",d:"企业级数据管理面板",t2:"shadcn/ui + Recharts"},{t:"数据看盘",d:"全屏可视化大屏",t2:"Tailwind + SVG"},{t:"知识库Wiki",d:"文档管理与搜索系统",t2:"Next.js App Router"}].map(p=><div key={p.t} className="rounded-xl border border-border p-5 hover:border-primary/50 transition-colors"><h3 className="font-semibold">{p.t}</h3><p className="text-sm text-muted-foreground mt-1">{p.d}</p><span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded mt-2 inline-block">{p.t2}</span></div>)}</div></section>
      <section><h2 className="text-2xl font-bold mb-4">技能</h2><div className="flex flex-wrap gap-2">{["TypeScript","React","Next.js","Tailwind CSS","shadcn/ui","Node.js","Python","PyTorch","CUDA","Docker"].map(s=><span key={s} className="px-3 py-1.5 rounded-lg border border-border text-sm">{s}</span>)}</div></section>
      <section className="text-center"><button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">联系我</button></section>
    </div>
  )
}
