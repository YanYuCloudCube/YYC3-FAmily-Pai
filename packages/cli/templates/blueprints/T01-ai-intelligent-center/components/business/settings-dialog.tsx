"use client"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-background border border-border rounded-2xl shadow-lg w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">设置</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 hover:bg-accent rounded-lg transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium">模型选择</label>
            <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option>Qwen3.6-27B + YYC³ DPO LoRA</option>
              <option>Qwen3.6-27B (基座)</option>
              <option>Qwen3.6-35B-A3B (MoE)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">温度 (Temperature)</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              defaultValue="0.7"
              className="mt-1.5 w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>精确 (0)</span>
              <span>创意 (2)</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">最大上下文长度</label>
            <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option>2048 tokens</option>
              <option>4096 tokens</option>
              <option>8192 tokens</option>
              <option>16384 tokens</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">流式输出</label>
            <button className="w-11 h-6 rounded-full bg-primary relative transition-colors">
              <span className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">暗色主题</label>
            <button className="w-11 h-6 rounded-full bg-primary relative transition-colors">
              <span className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            YYC³ AI Intelligent Center · 言启象限 · 语枢未来
          </p>
        </div>
      </div>
    </div>
  )
}
