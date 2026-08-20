export default function SaaSPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">工作台</h1><div className="flex items-center gap-2"><select className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm"><option>YYC³ 团队</option></select></div></div>
      <div className="grid grid-cols-3 gap-4">{[{ l: "团队成员", v: "12", c: "+3 本月" }, { l: "API调用量", v: "284K", c: "+23%" }, { l: "本月费用", v: "¥1,280", c: "预算内" }].map(s => <div key={s.l} className="rounded-xl border border-border p-5"><div className="text-sm text-muted-foreground">{s.l}</div><div className="text-2xl font-bold mt-1">{s.v}</div><div className="text-xs text-muted-foreground mt-1">{s.c}</div></div>)}</div>
      <div className="rounded-xl border border-border p-5"><h3 className="font-semibold mb-3">API密钥</h3><div className="space-y-2">{[{ n: "生产密钥", k: "yyc3_prod_****7x2a", s: "活跃" }, { n: "测试密钥", k: "yyc3_test_****9k1b", s: "活跃" }].map(a => <div key={a.k} className="flex items-center justify-between py-2 border-b border-border/50"><div><div className="text-sm font-medium">{a.n}</div><div className="text-xs text-muted-foreground font-mono">{a.k}</div></div><span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">{a.s}</span></div>)}</div></div>
    </div>
  )
}
