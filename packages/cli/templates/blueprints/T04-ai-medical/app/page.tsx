"use client"

import { useState } from "react"

const symptoms = ["头痛", "发热", "咳嗽", "胸闷", "腹痛", "乏力", "失眠", "关节痛"]

export default function MedicalPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [step, setStep] = useState(0)

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold">AI智能问诊</h1>
        <p className="text-sm text-muted-foreground mt-2">选择您的症状，AI将为您生成初步诊断建议</p>
      </div>

      <div className="rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold">请选择您目前的症状</h2>
        <div className="flex flex-wrap gap-2">
          {symptoms.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedSymptoms.includes(s)
                  ? "bg-red-500 text-white"
                  : "border border-border hover:border-red-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {selectedSymptoms.length > 0 && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">已选择 {selectedSymptoms.length} 个症状：{selectedSymptoms.join("、")}</p>
            <button className="px-6 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
              开始AI分析
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-3">健康指标</h3>
          <div className="space-y-3">
            {[
              { label: "体温", value: "36.5°C", status: "正常" },
              { label: "血压", value: "120/80", status: "正常" },
              { label: "心率", value: "72bpm", status: "正常" },
              { label: "血氧", value: "98%", status: "正常" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.value}</span>
                  <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-3">就诊记录</h3>
          <div className="space-y-3">
            {[
              { date: "2026-05-01", dept: "内科", desc: "常规体检", doctor: "李医生" },
              { date: "2026-04-15", dept: "骨科", desc: "腰椎检查", doctor: "王医生" },
              { date: "2026-03-20", dept: "眼科", desc: "视力复查", doctor: "张医生" },
            ].map((r, i) => (
              <div key={i} className="py-2 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{r.dept}</span>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.desc} · {r.doctor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
