const contacts = [
  { name: "张三", company: "言宇科技", email: "zhangsan@yyc3.top", phone: "138****1234", status: "活跃", amount: "¥128,000" },
  { name: "李四", company: "智云数据", email: "lisi@zydata.cn", phone: "139****5678", status: "跟进中", amount: "¥85,000" },
  { name: "王五", company: "未来智能", email: "wangwu@future.ai", phone: "137****9012", status: "活跃", amount: "¥256,000" },
  { name: "赵六", company: "云端方案", email: "zhaoliu@cloud.dev", phone: "136****3456", status: "待跟进", amount: "¥42,000" },
  { name: "孙七", company: "数智创新", email: "sunqi@digi.tech", phone: "135****7890", status: "活跃", amount: "¥198,000" },
]
export default function CRMPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">客户列表</h1><p className="text-sm text-muted-foreground mt-1">共 5 位客户 · 总金额 ¥709,000</p></div><button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">添加客户</button></div>
      <div className="grid grid-cols-4 gap-4">{[{ l: "总客户", v: "5", c: "+2" }, { l: "本月新增", v: "3", c: "+150%" }, { l: "成交金额", v: "¥709K", c: "+45%" }, { l: "转化率", v: "68%", c: "+5%" }].map(s => <div key={s.l} className="rounded-xl border border-border p-4"><div className="text-xs text-muted-foreground">{s.l}</div><div className="text-2xl font-bold mt-1">{s.v}</div><div className="text-xs text-green-600 mt-1">{s.c}</div></div>)}</div>
      <div className="rounded-xl border border-border"><table className="w-full text-sm"><thead><tr className="border-b border-border">{["客户", "公司", "邮箱", "状态", "金额"].map(h => <th key={h} className="text-left py-3 px-4 font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{contacts.map(c => <tr key={c.name} className="border-b border-border/50 hover:bg-muted/50"><td className="py-3 px-4 font-medium">{c.name}</td><td className="py-3 px-4 text-muted-foreground">{c.company}</td><td className="py-3 px-4 text-muted-foreground">{c.email}</td><td className="py-3 px-4"><span className={`px-2 py-0.5 rounded text-xs ${c.status === "活跃" ? "bg-green-50 text-green-600" : c.status === "跟进中" ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"}`}>{c.status}</span></td><td className="py-3 px-4 font-medium">{c.amount}</td></tr>)}</tbody></table></div>
    </div>
  )
}
