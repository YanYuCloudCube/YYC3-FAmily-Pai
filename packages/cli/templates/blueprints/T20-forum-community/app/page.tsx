export default function ForumPage() {
  return (
    <div className="space-y-4">
      {[{t:"YYC³ v3.0 正式发布 — 20套样板即拉即用",a:"YYC³官方",r:42,l:128,tags:["公告","发布"]},{t:"DPO训练数据清洗经验分享：从1806条到457条",a:"千行",r:28,l:89,tags:["AI","经验"]},{t:"Next.js 15 App Router 最佳实践总结",a:"引路",r:35,l:156,tags:["技术","Next.js"]},{t:"shadcn/ui 56+组件使用心得",a:"灵韵",r:21,l:67,tags:["UI","组件"]},{t:"DGX Spark QLoRA DPO训练踩坑记录",a:"先知",r:56,l:234,tags:["AI","训练"]}].map((p,i)=>(
        <div key={i} className="rounded-xl border border-border p-4 hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">{p.tags.map(tag=><span key={tag} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{tag}</span>)}</div>
          <h3 className="font-semibold text-lg">{p.t}</h3>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground"><span>{p.a}</span><span>·</span><span>💬 {p.r} 回复</span><span>·</span><span>👀 {p.l} 浏览</span></div>
        </div>
      ))}
    </div>
  )
}
