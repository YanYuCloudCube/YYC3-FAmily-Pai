interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
}

export function StatCard({ title, value, change, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border p-5 bg-card">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      <div className={`text-xs mt-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
        {change}
        <span className="text-muted-foreground ml-1">vs 上周</span>
      </div>
    </div>
  )
}
