const plans = [
  {
    name: "社区版",
    price: "免费",
    desc: "个人开发者和小型项目",
    features: ["20套样板模板", "56+ UI组件", "社区支持", "MIT开源协议"],
    cta: "立即使用",
    highlight: false,
  },
  {
    name: "专业版",
    price: "¥199",
    period: "/月",
    desc: "团队协作和企业项目",
    features: ["社区版全部功能", "八位AI家人", "MCP协议集成", "优先技术支持", "自定义主题系统"],
    cta: "开始试用",
    highlight: true,
  },
  {
    name: "企业版",
    price: "定制",
    desc: "大型组织和定制需求",
    features: ["专业版全部功能", "私有部署", "DPO模型定制", "SLA保障", "专属客户经理"],
    cta: "联系我们",
    highlight: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold">定价方案</h2>
          <p className="text-muted-foreground mt-3">灵活的方案，适合不同规模</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 ${
                plan.highlight
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full inline-block mb-3">
                  推荐
                </div>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{plan.desc}</p>
              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary shrink-0">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border hover:bg-accent"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
