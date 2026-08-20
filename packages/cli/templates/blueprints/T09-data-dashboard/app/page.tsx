"use client"

import { AreaChartPanel } from "@/components/business/area-chart-panel"
import { BarChartPanel } from "@/components/business/bar-chart-panel"
import { PieChartPanel } from "@/components/business/pie-chart-panel"
import { RankingList } from "@/components/business/ranking-list"
import { RealtimeLog } from "@/components/business/realtime-log"
import { StatBlock } from "@/components/business/stat-block"

const topStats = [
  { label: "总用户", value: "128,473", change: "+12.5%", icon: "👥" },
  { label: "今日活跃", value: "34,219", change: "+8.2%", icon: "🔥" },
  { label: "API调用", value: "2.84M", change: "+23.1%", icon: "⚡" },
  { label: "系统负载", value: "67.3%", change: "-2.1%", icon: "📊" },
  { label: "响应时间", value: "142ms", change: "-15ms", icon: "⏱" },
  { label: "可用率", value: "99.97%", change: "+0.02%", icon: "✅" },
]

const rankingData = [
  { name: "AI智能中心", value: 45230, percent: 95 },
  { name: "管理后台", value: 38120, percent: 80 },
  { name: "数据看盘", value: 29840, percent: 63 },
  { name: "知识库Wiki", value: 24100, percent: 51 },
  { name: "学习平台", value: 18700, percent: 39 },
  { name: "CRM系统", value: 15340, percent: 32 },
]

const logData: { time: string; level: "info" | "warn" | "error"; msg: string }[] = [
  { time: "14:32:08", level: "info", msg: "用户 zhangsan 登录成功" },
  { time: "14:32:05", level: "warn", msg: "API /v2/models 响应 > 200ms (312ms)" },
  { time: "14:31:58", level: "info", msg: "DPO训练 step 36/109 完成 loss=0.423" },
  { time: "14:31:45", level: "info", msg: "批量导入 245 条 CRM 数据完成" },
  { time: "14:31:30", level: "error", msg: "节点 N2 GPU温度告警 82°C" },
  { time: "14:31:12", level: "info", msg: "部署 v2.1.4 → 生产环境完成" },
  { time: "14:30:55", level: "info", msg: "AI助手对话 #8473 完成 tokens=1.2k" },
  { time: "14:30:40", level: "warn", msg: "缓存命中率降至 78%，建议扩容" },
]

export default function DataDashboard() {
  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <header className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">Y³</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">YYC³ 数据看盘</h1>
            <p className="text-xs text-white/50">实时数据 · 全景监控 · 智能分析</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            系统正常
          </span>
          <span>{new Date().toLocaleString("zh-CN")}</span>
          <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            全屏
          </button>
        </div>
      </header>

      <div className="grid grid-cols-6 gap-4">
        {topStats.map((s) => (
          <StatBlock key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1">
        <div className="col-span-5 rounded-xl bg-white/5 border border-white/10 p-4">
          <h3 className="text-sm font-medium mb-3 text-white/70">用户增长趋势</h3>
          <AreaChartPanel />
        </div>

        <div className="col-span-4 rounded-xl bg-white/5 border border-white/10 p-4">
          <h3 className="text-sm font-medium mb-3 text-white/70">模块调用量分布</h3>
          <PieChartPanel />
        </div>

        <div className="col-span-3 rounded-xl bg-white/5 border border-white/10 p-4">
          <h3 className="text-sm font-medium mb-3 text-white/70">模块访问排行</h3>
          <RankingList data={rankingData} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 rounded-xl bg-white/5 border border-white/10 p-4">
          <h3 className="text-sm font-medium mb-3 text-white/70">API调用量 (近7天)</h3>
          <BarChartPanel />
        </div>

        <div className="col-span-5 rounded-xl bg-white/5 border border-white/10 p-4">
          <h3 className="text-sm font-medium mb-3 text-white/70">实时日志</h3>
          <RealtimeLog logs={logData} />
        </div>
      </div>
    </div>
  )
}
