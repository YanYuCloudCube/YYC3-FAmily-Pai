import { DataTable } from "@/components/business/data-table"
import { StatCard } from "@/components/business/stat-card"

const stats = [
  { title: "总用户数", value: "12,847", change: "+12.5%", trend: "up" as const },
  { title: "活跃用户", value: "3,421", change: "+8.2%", trend: "up" as const },
  { title: "API调用量", value: "284.5K", change: "+23.1%", trend: "up" as const },
  { title: "系统健康", value: "99.97%", change: "+0.02%", trend: "up" as const },
]

const recentUsers = [
  { name: "张三", email: "zhangsan@example.com", role: "管理员", status: "活跃", lastLogin: "2分钟前" },
  { name: "李四", email: "lisi@example.com", role: "编辑", status: "活跃", lastLogin: "15分钟前" },
  { name: "王五", email: "wangwu@example.com", role: "查看者", status: "离线", lastLogin: "2小时前" },
  { name: "赵六", email: "zhaoliu@example.com", role: "编辑", status: "活跃", lastLogin: "30分钟前" },
  { name: "孙七", email: "sunqi@example.com", role: "管理员", status: "活跃", lastLogin: "1小时前" },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">仪表盘</h1>
          <p className="text-sm text-muted-foreground mt-1">系统运营概览</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          最后更新: {new Date().toLocaleString("zh-CN")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-border p-5">
            <h2 className="text-base font-semibold mb-4">最近用户</h2>
            <DataTable users={recentUsers} />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border p-5">
            <h2 className="text-base font-semibold mb-4">系统活动</h2>
            <div className="space-y-3">
              {[
                { action: "用户登录", detail: "张三 从北京登录", time: "2分钟前" },
                { action: "数据更新", detail: "CRM模块批量导入完成", time: "15分钟前" },
                { action: "系统告警", detail: "API响应时间 > 200ms", time: "30分钟前" },
                { action: "部署完成", detail: "v2.1.4 已上线生产环境", time: "1小时前" },
                { action: "安全审计", detail: "权限变更审核通过", time: "2小时前" },
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{event.action}</div>
                    <div className="text-xs text-muted-foreground">{event.detail}</div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{event.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
