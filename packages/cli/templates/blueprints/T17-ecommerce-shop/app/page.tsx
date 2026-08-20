export default function ShopPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold">全部商品</h1><p className="text-sm text-muted-foreground mt-1">共 8 件商品</p></div>
      <div className="grid grid-cols-4 gap-4">{[{ n: "YYC³ Pro", p: "¥199", d: "专业版·年度订阅", i: "💎" }, { n: "AI组件库", p: "¥99", d: "56+组件·永久使用", i: "📦" }, { n: "CLI工具", p: "免费", d: "命令行·项目脚手架", i: "🔧" }, { n: "DPO训练数据", p: "¥49", d: "457条精选·深度清洗", i: "🧠" }, { n: "20套样板", p: "¥299", d: "即拉即用·全业务覆盖", i: "🏗️" }, { n: "技术支持", p: "¥599/m", d: "专属工程师·7×12", i: "🛡️" }, { n: "AI家人年卡", p: "¥1,299", d: "八位家人·全年服务", i: "👨‍👩‍👧‍👦" }, { n: "企业定制", p: "面议", d: "私有部署·DPO定制", i: "🏢" }].map(p => <div key={p.n} className="rounded-xl border border-border p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"><div className="text-3xl mb-2">{p.i}</div><h3 className="font-semibold">{p.n}</h3><p className="text-xs text-muted-foreground mt-1">{p.d}</p><div className="mt-3 flex items-center justify-between"><span className="text-lg font-bold text-primary">{p.p}</span><button className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs">加入购物车</button></div></div>)}</div>
    </div>
  )
}
