/**
 * file finance-chart.tsx
 * description finance-chart — 从 UI-MONO 适配入库
 * module @yyc3/ui/business/charts
 * author YanYuCloudCube Team <admin@0379.email>
 * version 3.0.0
 * created 2026-06-20
 * status active
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */
"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart"

const financeData = [
  { category: "销售收入", income: 450000, expense: 0 },
  { category: "运营成本", income: 0, expense: 180000 },
  { category: "人力成本", income: 0, expense: 120000 },
  { category: "营销费用", income: 0, expense: 80000 },
  { category: "其他收入", income: 25000, expense: 0 },
]

export function FinanceChart() {
  return (
    <ChartContainer
      config={{
        income: {
          label: "收入",
          color: "hsl(var(--chart-1))",
        },
        expense: {
          label: "支出",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={financeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="income" fill="var(--color-income)" />
          <Bar dataKey="expense" fill="var(--color-expense)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
