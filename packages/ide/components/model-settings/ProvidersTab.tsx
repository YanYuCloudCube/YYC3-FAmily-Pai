/**
 * @file model-settings/ProvidersTab.tsx
 * @description 服务商管理 Tab 面板（纯展示，状态来自 useModelConfig）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-11-07
 * @updated 2026-11-07
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings,models,providers,ui
 */

import { Plus, CheckCircle2, Lightbulb } from "lucide-react";
import { ProviderCard } from "./ProviderCard";
import type { DiagnosticResult } from "./types";
import type { ModelSettingsContext } from "../../hooks/useModelConfig";
import { PROVIDERS } from "./types";

export function ProvidersTab({ m }: { m: ModelSettingsContext }) {
  const {
    allProviders,
    setApiKeys,
    setCustomUrls,
    filteredProviders,
    aiModels,
    activeModelId,
    activeModelKey,
    apiKeys,
    customUrls,
    diagnostics,
    expandedProvider,
    setExpandedProvider,
    addingProvider,
    setAddingProvider,
    newProvider,
    setNewProvider,
    handleAddProvider,
    handleProviderAddModel,
    handleProviderRemoveModel,
    handleRemoveProvider,
    handleTestConnection,
    handleSelectModel,
  } = m;

  return (
                <div className="space-y-3">
              {/* Active model indicator */}
              {activeModelId &&
                (() => {
                  const activeModel = aiModels.find(
                    (m) => m.id === activeModelId,
                  );
                  const matchedProvider = activeModelKey
                    ? allProviders.find((p) =>
                        activeModelKey.startsWith(`${p.id  }:`),
                      )
                    : null;
                  return (
                    <div
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-indigo-500/[0.06] border border-indigo-500/15 mb-1"
                      style={{
                        boxShadow: "0 0 16px -4px rgba(99,102,241,0.1)",
                      }}
                    >
                      {matchedProvider ? (
                        <div
                          className={`w-6 h-6 rounded-lg ${matchedProvider.colorBg} border ${matchedProvider.colorBorder} flex items-center justify-center`}
                        >
                          <matchedProvider.icon
                            className={`w-3 h-3 ${matchedProvider.color}`}
                          />
                        </div>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-indigo-300">
                            {activeModel?.name || "未知"}
                          </span>
                          {matchedProvider && (
                            <span className="text-[9px] text-white/20">
                              {matchedProvider.name}
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-white/15 font-mono truncate">
                          {activeModel?.endpoint}
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400/70 border border-indigo-500/15 shrink-0">
                        当前使用中
                      </span>
                    </div>
                  );
                })()}

              {/* Provider cards */}
              {filteredProviders.map((provider) => {
                const providerDiags: Record<string, DiagnosticResult> = {};
                provider.models.forEach((m) => {
                  const d = diagnostics[`${provider.id  }:${  m.id}`];
                  if (d) providerDiags[m.id] = d;
                });

                return (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    apiKey={apiKeys[provider.id] || ""}
                    customUrl={customUrls[provider.id] || ""}
                    onApiKeyChange={(key) =>
                      setApiKeys((prev) => ({ ...prev, [provider.id]: key }))
                    }
                    onUrlChange={(url) =>
                      setCustomUrls((prev) => ({ ...prev, [provider.id]: url }))
                    }
                    onAddModel={(model) =>
                      handleProviderAddModel(provider.id, model)
                    }
                    onRemoveModel={(modelId) =>
                      handleProviderRemoveModel(provider.id, modelId)
                    }
                    onTestConnection={(modelId) =>
                      handleTestConnection(provider.id, modelId)
                    }
                    onSelectModel={(modelId) =>
                      handleSelectModel(provider.id, modelId)
                    }
                    activeModelKey={activeModelKey}
                    diagnostics={providerDiags}
                    expanded={expandedProvider === provider.id}
                    onToggle={() =>
                      setExpandedProvider((prev) =>
                        prev === provider.id ? null : provider.id,
                      )
                    }
                    isCustom={!PROVIDERS.find((p) => p.id === provider.id)}
                    onRemoveProvider={
                      !PROVIDERS.find((p) => p.id === provider.id)
                        ? () => handleRemoveProvider(provider.id)
                        : undefined
                    }
                  />
                );
              })}

              {/* Add custom provider */}
              {addingProvider ? (
                <div className="rounded-xl border border-dashed border-pink-500/20 bg-pink-500/[0.03] p-4 space-y-3">
                  <div className="text-[11px] text-pink-400/70 mb-1">
                    添加自定义服务商 (OpenAI 兼容)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-white/30 uppercase tracking-wider mb-1 block">
                        服务商名称
                      </label>
                      <input
                        value={newProvider.name}
                        onChange={(e) =>
                          setNewProvider((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        placeholder="如 Groq / Mistral / 零一万物"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-white/70 placeholder:text-white/10 focus:outline-none focus:border-pink-500/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/30 uppercase tracking-wider mb-1 block">
                        API Key 获取链接
                      </label>
                      <input
                        value={newProvider.apiKeyUrl}
                        onChange={(e) =>
                          setNewProvider((p) => ({
                            ...p,
                            apiKeyUrl: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-white/70 placeholder:text-white/10 focus:outline-none focus:border-pink-500/40 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/30 uppercase tracking-wider mb-1 block">
                      Base URL
                    </label>
                    <input
                      value={newProvider.baseURL}
                      onChange={(e) =>
                        setNewProvider((p) => ({
                          ...p,
                          baseURL: e.target.value,
                        }))
                      }
                      placeholder="https://api.example.com/v1/chat/completions"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-white/70 placeholder:text-white/10 focus:outline-none focus:border-pink-500/40 font-mono"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleAddProvider}
                      disabled={!newProvider.name || !newProvider.baseURL}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-pink-500/15 text-pink-400 text-[11px] hover:bg-pink-500/25 transition-all disabled:opacity-30 border border-pink-500/20"
                    >
                      <Plus className="w-3 h-3" /> 添加服务商
                    </button>
                    <button
                      onClick={() => setAddingProvider(false)}
                      className="px-4 py-2 rounded-lg text-white/30 text-[11px] hover:bg-white/[0.04] transition-all"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingProvider(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/[0.08] text-white/25 hover:text-white/50 hover:border-white/[0.15] transition-all text-[12px]"
                >
                  <Plus className="w-4 h-4" /> 增加模型服务商
                </button>
              )}

              {/* Tip */}
              <div className="px-4 py-2.5 rounded-xl bg-indigo-500/[0.03] border border-indigo-500/10 flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-400/50 shrink-0 mt-0.5" />
                <div className="text-[10px] text-white/25">
                  <strong className="text-indigo-400/40">提示：</strong>阿里云
                  DashScope 完全兼容 OpenAI API 协议，只需修改 baseURL
                  即可集成到 LangChain、Vercel AI SDK 等框架。所有标记"OpenAI
                  兼容"的服务商均支持统一的{" "}
                  <code className="text-cyan-400/40 bg-white/[0.03] px-1 py-0.5 rounded">
                    openai
                  </code>{" "}
                  库调用。
                </div>
              </div>
            </div>
  );
}
