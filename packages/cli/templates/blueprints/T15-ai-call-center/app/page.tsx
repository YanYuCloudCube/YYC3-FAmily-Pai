export default function CallCenterPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">通话面板</h1><div className="flex gap-2"><button className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm">接听</button><button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm">挂断</button></div></div>
      <div className="grid grid-cols-3 gap-4">{[{ l: "当前通话", v: "3", c: "进行中" }, { l: "排队等待", v: "7", c: "最长3分钟" }, { l: "今日总量", v: "142", c: "+18%" }].map(s => <div key={s.l} className="rounded-xl border border-border p-4"><div className="text-xs text-muted-foreground">{s.l}</div><div className="text-2xl font-bold mt-1">{s.v}</div><div className="text-xs text-muted-foreground mt-1">{s.c}</div></div>)}</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border p-4"><h3 className="font-medium mb-3">最近通话</h3>{[{ n: "张先生", t: "3:42", r: "咨询", s: "已完成" }, { n: "李女士", t: "5:18", r: "售后", s: "转接中" }, { n: "王总", t: "1:56", r: "投诉", s: "待回访" }].map((c, i) => <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 text-sm"><span className="font-medium">{c.n}</span><span className="text-muted-foreground">{c.r}</span><span className="text-muted-foreground">{c.t}</span><span className={`text-xs px-1.5 py-0.5 rounded ${c.s === "已完成" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>{c.s}</span></div>)}</div>
        <div className="rounded-xl border border-border p-4"><h3 className="font-medium mb-3">AI转写</h3><div className="space-y-2 text-sm"><div className="p-2 rounded bg-muted text-xs"><span className="text-primary font-medium">客户: </span>我想咨询一下你们的产品方案</div><div className="p-2 rounded bg-primary/10 text-xs"><span className="text-primary font-medium">AI建议: </span>推荐专业版方案，月付¥199起</div><div className="p-2 rounded bg-muted text-xs"><span className="text-primary font-medium">客户: </span>可以详细介绍一下吗？</div></div></div>
      </div>
    </div>
  )
}
