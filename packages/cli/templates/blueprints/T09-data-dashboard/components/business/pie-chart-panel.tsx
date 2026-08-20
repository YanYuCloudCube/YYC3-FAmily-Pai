"use client"

const pieData = [
  { label: "AI智能中心", value: 35, color: "oklch(0.6 0.2 264)" },
  { label: "管理后台", value: 25, color: "oklch(0.6 0.118 184.704)" },
  { label: "数据看盘", value: 20, color: "oklch(0.769 0.188 70.08)" },
  { label: "知识库", value: 12, color: "oklch(0.645 0.246 16.439)" },
  { label: "其他", value: 8, color: "oklch(0.556 0.017 285.823)" },
]

export function PieChartPanel() {
  const total = pieData.reduce((s, d) => s + d.value, 0)
  let cumulative = 0

  return (
    <div className="flex items-center gap-4 h-40">
      <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-40 h-40 shrink-0">
        {pieData.map((d) => {
          const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
          cumulative += d.value
          const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
          const largeArc = d.value / total > 0.5 ? 1 : 0
          const x1 = Math.cos(startAngle)
          const y1 = Math.sin(startAngle)
          const x2 = Math.cos(endAngle)
          const y2 = Math.sin(endAngle)
          return (
            <path
              key={d.label}
              d={`M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={d.color}
              opacity={0.8}
            />
          )
        })}
        <circle cx="0" cy="0" r="0.5" fill="#0a0e1a" />
      </svg>
      <div className="flex-1 space-y-2">
        {pieData.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="flex-1 text-white/60">{d.label}</span>
            <span className="text-white/80 font-medium">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
