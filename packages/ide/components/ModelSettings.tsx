/**
 * @file components/ModelSettings.tsx
 * @description AI 模型管理设置面板容器壳——状态/回调见 hooks/useModelConfig.ts，Tab 面板见 components/model-settings/*
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-11-07
 * @updated 2026-11-07
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings,models,providers,api-key,connectivity
 */

import { useState } from "react";
import {
  X,
  Sparkles,
  Search,
  Cloud,
  Server,
  Plug,
  Network,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { useThemeTokens } from "../hooks/useThemeTokens";
import { useModelConfig } from "../hooks/useModelConfig";
import { ProvidersTab } from "./model-settings/ProvidersTab";
import { OllamaPanel } from "./model-settings/OllamaPanel";
import { MCPConfigPanel } from "./model-settings/MCPConfigPanel";
import { ProxyConfigPanel } from "./model-settings/ProxyConfigPanel";
import { SmartDiagnosticsPanel } from "./model-settings/SmartDiagnosticsPanel";
import { loadProxyConfig } from "../services/ProxyService";

type TabKey = "providers" | "ollama" | "mcp" | "diagnostics" | "proxy";

export function ModelSettings() {
  const m = useModelConfig();
  const t = useThemeTokens();
  const [activeTab, setActiveTab] = useState<TabKey>("providers");
  const {
    modelSettingsOpen,
    closeModelSettings,
    selectionToast,
    searchQuery,
    setSearchQuery,
    allProviders,
    apiKeys,
    diagnostics,
    handleTestConnection,
    handleSelectModel,
    activeModelKey,
  } = m;

  if (!modelSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className={`absolute inset-0 ${t.overlayBg} backdrop-blur-md`}
        onClick={closeModelSettings}
      />
      <div
        className={`relative w-[1000px] h-[90vh] ${t.modalBg} border ${t.modalBorder} rounded-2xl flex flex-col overflow-hidden`}
        style={{ boxShadow: t.modalShadow, animation: "modalIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div
          className={`flex items-center gap-3 px-5 py-4 border-b ${t.sectionBorder}`}
        >
          <div
            className={`w-9 h-9 rounded-xl ${t.accentBg} border ${t.accentBorder} flex items-center justify-center`}
          >
            <Sparkles className={`w-4 h-4 ${t.accent}`} />
          </div>
          <div className="flex-1">
            <div className={`text-[14px] ${t.textPrimary}`}>
              AI 模型服务管理
            </div>
            <div className={`text-[11px] ${t.textTertiary}`}>
              多服务商 · Ollama 本地 · MCP 工具 · 智能诊断
            </div>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] w-48">
            <Search className="w-3.5 h-3.5 text-white/20" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索服务商 / 模型..."
              className="bg-transparent text-[11px] text-white/60 placeholder:text-white/15 focus:outline-none w-full"
            />
          </div>
          <button
            onClick={closeModelSettings}
            className={`p-2 rounded-lg ${t.textMuted} hover:text-white/60 ${t.hoverBg} transition-all`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className={`flex gap-1 px-5 pt-3 pb-0 border-b ${t.sectionBorder} overflow-x-auto`}
        >
          {[
            { key: "providers" as const, label: "服务商管理", icon: Cloud },
            { key: "ollama" as const, label: "Ollama 本地", icon: Server },
            { key: "mcp" as const, label: "MCP 工具", icon: Plug },
            { key: "proxy" as const, label: "代理配置", icon: Network },
            { key: "diagnostics" as const, label: "智能诊断", icon: Activity },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-[11px] transition-all border-b-2 whitespace-nowrap ${
                activeTab === key
                  ? `${t.activeTabText} border-current ${t.activeBg}`
                  : `${t.textTertiary} border-transparent hover:text-white/50`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5">
          {/* Providers Tab */}

          {activeTab === "providers" && <ProvidersTab m={m} />}

          {activeTab === "ollama" && <OllamaPanel m={m} />}

          {/* MCP Tab */}
          {activeTab === "mcp" && <MCPConfigPanel />}

          {/* Proxy Tab */}
          {activeTab === "proxy" && <ProxyConfigPanel />}

          {/* Diagnostics Tab */}
          {activeTab === "diagnostics" && (
            <SmartDiagnosticsPanel
              providers={allProviders}
              apiKeys={apiKeys}
              diagnostics={diagnostics}
              onRunDiagnostic={handleTestConnection}
              onSelectModel={handleSelectModel}
              activeModelKey={activeModelKey}
            />
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between px-5 py-3 border-t ${t.sectionBorder} ${t.surfaceInset}`}
        >
          <div className="flex items-center gap-3">
            <span className={`text-[10px] ${t.textMuted}`}>
              {allProviders.length} 个服务商 ·{" "}
              {allProviders.reduce((sum, p) => sum + p.models.length, 0)} 个模型
            </span>
            {Object.values(diagnostics as Record<string, { status: string }>).filter((d) => d.status === "success")
              .length > 0 && (
              <span className="text-[10px] text-emerald-400/40">
                {
                  Object.values(diagnostics as Record<string, { status: string }>).filter(
                    (d) => d.status === "success",
                  ).length
                }{" "}
                在线
              </span>
            )}
            {(() => {
              try {
                const cfg = loadProxyConfig();
                if (cfg.enabled)
                  return (
                    <span className="text-[10px] text-indigo-400/40 flex items-center gap-1">
                      <Network className="w-3 h-3" />
                      代理已启用
                    </span>
                  );
              } catch {}
              return null;
            })()}
          </div>
          <button
            onClick={closeModelSettings}
            className={`px-4 py-1.5 rounded-lg ${t.badgeBg} ${t.textTertiary} text-[11px] ${t.hoverBg} transition-all`}
          >
            完成
          </button>
        </div>

        {/* Selection toast */}
        {selectionToast && (
          <div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/25 backdrop-blur-sm"
            style={{
              boxShadow: "0 4px 20px rgba(99,102,241,0.15)",
              animation: "modalIn 0.15s ease-out",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span className="text-[12px] text-indigo-300">
              已切换至 <strong>{selectionToast}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
