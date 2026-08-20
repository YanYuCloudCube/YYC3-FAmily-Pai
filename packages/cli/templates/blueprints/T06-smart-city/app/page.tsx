export default function SmartCityPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[{ l: "城市人口", v: "1,284万", c: "+2.3%", i: "👥" }, { l: "公共服务点", v: "3,847", c: "+12", i: "🏢" }, { l: "交通指数", v: "良好", c: "拥堵率12%", i: "🚦" }, { l: "空气质量", v: "优 AQI 35", c: "-5", i: "🌿" }].map(s => (
          <div key={s.l} className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-white/50">{s.l}</span><span className="text-lg">{s.i}</span></div>
            <div className="text-xl font-bold">{s.v}</div>
            <div className="text-xs text-green-400 mt-1">{s.c}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl bg-white/5 border border-white/10 p-5 h-64">
          <h3 className="text-sm font-medium mb-3 text-white/70">城市服务分类</h3>
          <div className="grid grid-cols-4 gap-3">
            {[{ n: "医疗健康", i: "🏥", c: 12 }, { n: "教育培训", i: "🎓", c: 8 }, { n: "交通出行", i: "🚌", c: 15 }, { n: "生活缴费", i: "💡", c: 6 }, { n: "户籍办理", i: "📋", c: 4 }, { n: "就业创业", i: "💼", c: 9 }, { n: "住房服务", i: "🏠", c: 7 }, { n: "文化旅游", i: "🎭", c: 11 }].map(s => (
              <div key={s.n} className="rounded-lg bg-white/5 p-3 text-center hover:bg-white/10 cursor-pointer transition-colors">
                <div className="text-2xl mb-1">{s.i}</div>
                <div className="text-xs">{s.n}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.c}项服务</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-5 h-64">
          <h3 className="text-sm font-medium mb-3 text-white/70">AI城市助手</h3>
          <div className="space-y-2 text-sm">
            {["查询最近的三甲医院", "公积金提取办理流程", "明日限行尾号查询", "子女入学报名入口"].map((q, i) => (
              <div key={i} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer text-white/60 transition-colors">{q}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
