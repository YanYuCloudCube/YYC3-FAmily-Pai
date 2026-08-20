"use client"

export function AreaChartPanel() {
  const data = [30, 45, 35, 60, 48, 72, 55, 80, 65, 90, 78, 95]
  const maxVal = Math.max(...data)
  const width = 100
  const height = 40
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / maxVal) * height}`).join(" ")
  const areaPoints = `0,${height} ${points} ${width},${height}`

  return (
    <div className="h-40">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.6 0.2 264)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.6 0.2 264)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#areaGrad)" />
        <polyline points={points} fill="none" stroke="oklch(0.6 0.2 264)" strokeWidth="0.5" />
      </svg>
      <div className="flex justify-between text-xs text-white/30 mt-1">
        <span>1月</span><span>3月</span><span>6月</span><span>9月</span><span>12月</span>
      </div>
    </div>
  )
}
