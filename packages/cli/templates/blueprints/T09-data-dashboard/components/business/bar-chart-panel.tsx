"use client"

export function BarChartPanel() {
  const data = [
    { day: "周一", value: 420 },
    { day: "周二", value: 380 },
    { day: "周三", value: 510 },
    { day: "周四", value: 470 },
    { day: "周五", value: 590 },
    { day: "周六", value: 320 },
    { day: "周日", value: 280 },
  ]
  const maxVal = Math.max(...data.map(d => d.value))

  return (
    <div className="flex items-end gap-3 h-32">
      {data.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs text-white/50">{d.value}K</span>
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-primary/60 to-primary/30"
            style={{ height: `${(d.value / maxVal) * 100}%` }}
          />
          <span className="text-xs text-white/40">{d.day}</span>
        </div>
      ))}
    </div>
  )
}
