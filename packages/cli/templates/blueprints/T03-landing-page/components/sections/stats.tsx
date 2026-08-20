const stats = [
  { value: "357+", label: "项目积累" },
  { value: "2.9M+", label: "代码行数" },
  { value: "56+", label: "UI组件" },
  { value: "10", label: "NPM包" },
  { value: "1,906", label: "测试用例" },
  { value: "20", label: "样板模板" },
]

export function StatsSection() {
  return (
    <section id="stats" className="py-20 bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold">用数据说话</h2>
          <p className="text-muted-foreground mt-3">每一个数字都是真实项目沉淀</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
