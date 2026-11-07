/**
 * @file model-settings/OllamaPanel.tsx
 * @description Ollama 本地模型 Tab 面板（纯展示，状态来自 useModelConfig）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-11-07
 * @updated 2026-11-07
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings,ollama,ui
 */

import { Server, RefreshCw, Check, Plus } from "lucide-react";
import type { ModelSettingsContext } from "../../hooks/useModelConfig";

export function OllamaPanel({ m }: { m: ModelSettingsContext }) {
  const {
    ollamaHost,
    setOllamaHost,
    ollamaScanning,
    ollamaModels,
    ollamaConnected,
    handleScanOllama,
    handleImportOllama,
    aiModels,
  } = m;

  return (
                <div className="space-y-4">
              {/* Ollama host config */}
              <div
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-400" />
                  <span className="text-[12px] text-white/70">
                    Ollama 服务端点
                  </span>
                  <div
                    className={`ml-auto flex items-center gap-1.5 text-[10px] ${ollamaConnected ? "text-emerald-400" : "text-white/25"}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${ollamaConnected ? "bg-emerald-400" : "bg-white/15"}`}
                    />
                    {ollamaConnected ? "已连接" : "未连接"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    value={ollamaHost}
                    onChange={(e) => setOllamaHost(e.target.value)}
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white/70 font-mono focus:outline-none focus:border-amber-500/40"
                  />
                  <button
                    onClick={handleScanOllama}
                    disabled={ollamaScanning}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/15 text-amber-400 text-[11px] hover:bg-amber-500/25 transition-all disabled:opacity-50 border border-amber-500/20"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${ollamaScanning ? "animate-spin" : ""}`}
                    />
                    {ollamaScanning ? "扫描中..." : "自动检测"}
                  </button>
                </div>
                <div className="text-[10px] text-white/20">
                  Ollama 服务需在宿主机运行（
                  <code className="text-amber-400/30">ollama serve</code>
                  ）。检测通过 HTTP API 获取本地模型列表，数据完全私有。
                </div>
              </div>

              {/* Detected models */}
              {ollamaModels.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">
                      检测到的模型 ({ollamaModels.length})
                    </div>
                    {!ollamaConnected && (
                      <span className="text-[9px] text-amber-400/40">
                        模拟数据（未连接 Ollama）
                      </span>
                    )}
                  </div>
                  {ollamaModels.map((model) => {
                    const alreadyImported = aiModels.some(
                      (m) => m.name === model.name && m.provider === "ollama",
                    );
                    return (
                      <div
                        key={model.name}
                        className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-amber-500/15 transition-all"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${model.status === "online" ? "bg-emerald-400" : "bg-white/15"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] text-white/70">
                            {model.name}
                          </div>
                          <div className="text-[10px] text-white/25">
                            {model.size} · {model.quantization}
                          </div>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded ${
                            model.status === "online"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-white/[0.04] text-white/20"
                          }`}
                        >
                          {model.status === "online" ? "在线" : "离线"}
                        </span>
                        {alreadyImported ? (
                          <span className="text-[10px] text-white/20 flex items-center gap-1">
                            <Check className="w-3 h-3" /> 已导入
                          </span>
                        ) : (
                          <button
                            onClick={() => handleImportOllama(model)}
                            disabled={model.status === "offline"}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] hover:bg-amber-500/20 transition-all disabled:opacity-30 border border-amber-500/20"
                          >
                            <Plus className="w-3 h-3" /> 导入
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty state */}
              {ollamaModels.length === 0 && !ollamaScanning && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-4">
                    <Server className="w-7 h-7 text-white/10" />
                  </div>
                  <p className="text-[12px] text-white/25 mb-1">
                    尚未检测到 Ollama 模型
                  </p>
                  <p className="text-[10px] text-white/15">
                    点击"自动检测"扫描本地 Ollama 服务
                  </p>
                </div>
              )}

              {ollamaScanning && ollamaModels.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/[0.06] border border-amber-500/15 flex items-center justify-center mb-4 relative">
                    <Server className="w-7 h-7 text-amber-400/40" />
                    <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/30 animate-ping" />
                  </div>
                  <p className="text-[12px] text-amber-400/60 mb-1">
                    正在扫描 Ollama 服务...
                  </p>
                  <p className="text-[10px] text-white/15">
                    {ollamaHost}/api/tags
                  </p>
                </div>
              )}
            </div>
  );
}
