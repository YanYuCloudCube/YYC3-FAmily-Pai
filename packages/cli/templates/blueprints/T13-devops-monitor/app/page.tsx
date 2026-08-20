export default function DevOpsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">状态总览</h1>
      <div className="grid grid-cols-5 gap-3">{[{n:"生产环境",s:"运行中",c:"bg-green-500"},{n:"预发布",s:"运行中",c:"bg-green-500"},{n:"测试环境",s:"维护中",c:"bg-yellow-500"},{n:"N1推理",s:"运行中",c:"bg-green-500"},{n:"N2训练",s:"GPU 45%",c:"bg-blue-500"}].map(s=><div key={s.n} className="rounded-xl border border-border p-4"><div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${s.c}`} /><span className="text-sm font-medium">{s.n}</span></div><div className="text-xs text-muted-foreground mt-1">{s.s}</div></div>)}</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border p-4"><h3 className="font-medium mb-3">最近告警</h3><div className="space-y-2">{[{t:"API响应超时",l:"warn",time:"5分钟前"},{t:"GPU温度>80°C",l:"error",time:"30分钟前"},{t:"磁盘使用率>85%",l:"warn",time:"1小时前"}].map((a,i)=><div key={i} className="flex items-center gap-2 text-sm py-1"><span className={`w-1.5 h-1.5 rounded-full ${a.l==="error"?"bg-red-500":"bg-yellow-500"}`} /><span className="flex-1">{a.t}</span><span className="text-xs text-muted-foreground">{a.time}</span></div>)}</div></div>
        <div className="rounded-xl border border-border p-4"><h3 className="font-medium mb-3">部署记录</h3><div className="space-y-2">{[{v:"v2.1.4",s:"成功",time:"2小时前"},{v:"v2.1.3",s:"成功",time:"昨天"},{v:"v2.1.2",s:"回滚",time:"3天前"}].map((d,i)=><div key={i} className="flex items-center gap-2 text-sm py-1"><span className={`px-1.5 py-0.5 rounded text-xs ${d.s==="成功"?"bg-green-50 text-green-600":"bg-red-50 text-red-600"}`}>{d.s}</span><span>{d.v}</span><span className="flex-1 text-right text-xs text-muted-foreground">{d.time}</span></div>)}</div></div>
      </div>
    </div>
  )
}
