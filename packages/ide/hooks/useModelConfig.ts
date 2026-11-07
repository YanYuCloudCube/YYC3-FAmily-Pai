/**
 * @file hooks/useModelConfig.ts
 * @description AI 模型设置状态与回调容器（自 ModelSettings.tsx 主组件抽出；状态跨 Tab 保留，行为与原单文件等价）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-11-07
 * @updated 2026-11-07
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings,models,hook,state
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useModelRegistry } from "../components/ModelRegistry";
import { Bot } from "lucide-react";
import {
  PROVIDERS,
  SIMULATED_OLLAMA_MODELS,
  type DiagnosticResult,
  type OllamaDetectedModel,
  STORAGE_KEYS,
} from "../components/model-settings/types";
import { loadJSON, saveJSON } from "../constants/storage-keys";
import type { ModelDef, ProviderDef } from "../constants/providers";

export type ModelSettingsContext = ReturnType<typeof useModelConfig>;

/**
 * 状态与回调容器：主组件与各 Tab 面板共享的模型配置状态。
 */
export function useModelConfig() {
  const {
    showModelSettingsV2,
    setShowModelSettingsV2,
    models: aiModels,
    addModel: addAIModelRaw,
    removeModel: removeAIModel,
    updateModel: updateAIModel,
    setActiveModelId: activateAIModel,
    activeModelId,
    addCustomModel,
  } = useModelRegistry();
  // 保留原主组件渲染日志
  console.log('[ModelSettings] Component render, showModelSettingsV2:', showModelSettingsV2);
  // Wrapper: ModelSettings.md uses addAIModel({ name, provider, endpoint, apiKey, isActive })
  // but ModelRegistry addModel expects a full AIModel object.
  // We use addCustomModel for the simplified API.
  const addAIModel = useCallback(
    (opts: {
      name: string;
      provider: string;
      endpoint: string;
      apiKey?: string;
      isActive?: boolean;
      isDetected?: boolean;
    }) => {
      addCustomModel(opts.name, opts.provider, opts.endpoint, opts.apiKey);
    },
    [addCustomModel],
  );

  const closeModelSettings = useCallback(
    () => setShowModelSettingsV2(false),
    [setShowModelSettingsV2],
  );
  const modelSettingsOpen = showModelSettingsV2;
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProvider, setExpandedProvider] = useState<string | null>(
    "zhipu",
  );

  // Provider API keys & URLs (persisted)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() =>
    loadJSON(STORAGE_KEYS.providerKeys, {}),
  );
  const [customUrls, setCustomUrls] = useState<Record<string, string>>(() =>
    loadJSON(STORAGE_KEYS.providerUrls, {}),
  );

  // Custom providers (user-added)
  const [customProviders, setCustomProviders] = useState<ProviderDef[]>(() =>
    loadJSON(STORAGE_KEYS.customProviders, []),
  );
  const [addingProvider, setAddingProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: "",
    baseURL: "",
    apiKeyUrl: "",
  });

  // Diagnostics
  const [diagnostics, setDiagnostics] = useState<
    Record<string, DiagnosticResult>
  >({});

  // Pending activation
  const pendingActivationRef = useRef<string | null>(null);
  const [selectionToast, setSelectionToast] = useState<string | null>(null);

  // Ollama
  const [ollamaHost, setOllamaHost] = useState("http://localhost:11434");
  const [ollamaScanning, setOllamaScanning] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<OllamaDetectedModel[]>([]);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  // Auto-activate newly added model if pending
  useEffect(() => {
    const pendingName = pendingActivationRef.current;
    if (!pendingName) return;
    const found = aiModels.find((m) => m.name === pendingName && !m.isActive);
    if (found) {
      pendingActivationRef.current = null;
      activateAIModel(found.id);
    }
  }, [aiModels, activateAIModel]);

  // Persist keys & urls
  useEffect(() => {
    saveJSON(STORAGE_KEYS.providerKeys, apiKeys);
  }, [apiKeys]);
  useEffect(() => {
    saveJSON(STORAGE_KEYS.providerUrls, customUrls);
  }, [customUrls]);
  useEffect(() => {
    saveJSON(STORAGE_KEYS.customProviders, customProviders);
  }, [customProviders]);

  // Sync API keys from provider config -> matching store models
  useEffect(() => {
    for (const provider of [...PROVIDERS, ...customProviders]) {
      const key = apiKeys[provider.id];
      if (!key) continue;
      const url = customUrls[provider.id] || provider.baseURL;
      for (const storeModel of aiModels) {
        if (storeModel.endpoint === url && storeModel.apiKey !== key) {
          const isMatch = provider.models.some(
            (m) => m.id === storeModel.name || m.name === storeModel.name,
          );
          if (isMatch) {
            updateAIModel(storeModel.id, { apiKey: key });
          }
        }
      }
    }
  }, [apiKeys, customUrls, customProviders, aiModels, updateAIModel]);

  // All providers = built-in + custom
  const allProviders = useMemo(
    () => [...PROVIDERS, ...customProviders],
    [customProviders],
  );
  // Filtered providers
  const filteredProviders = useMemo(() => {
    if (!searchQuery) return allProviders;
    const q = searchQuery.toLowerCase();
    return allProviders.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.models.some((m) => m.name.toLowerCase().includes(q)),
    );
  }, [allProviders, searchQuery]);

  // Provider-scoped model mutations
  const handleProviderAddModel = useCallback(
    (providerId: string, model: ModelDef) => {
      setCustomProviders((prev) =>
        prev.map((p) =>
          p.id === providerId ? { ...p, models: [...p.models, model] } : p,
        ),
      );
    },
    [],
  );

  const handleProviderRemoveModel = useCallback(
    (providerId: string, modelId: string) => {
      setCustomProviders((prev) =>
        prev.map((p) =>
          p.id === providerId
            ? { ...p, models: p.models.filter((m) => m.id !== modelId) }
            : p,
        ),
      );
    },
    [],
  );

  // Real diagnostic test — actual HTTP connectivity check
  const handleTestConnection = useCallback(
    (providerId: string, modelId: string) => {
      const provider = allProviders.find((p) => p.id === providerId);
      if (!provider) return;
      const model = provider.models.find((m) => m.id === modelId);
      if (!model) return;
      const diagKey = `${providerId  }:${  modelId}`;
      const providerApiKey = apiKeys[providerId] || "";
      const url = customUrls[providerId] || provider.baseURL;

      // Pre-flight checks
      if (providerId !== "ollama" && !providerApiKey) {
        setDiagnostics((prev) => ({
          ...prev,
          [diagKey]: {
            providerId,
            modelName: model.name,
            status: "error",
            message: "未配置 API Key，无法验证连接。请先填入 API Key。",
            timestamp: Date.now(),
          },
        }));
        return;
      }
      if (!url) {
        setDiagnostics((prev) => ({
          ...prev,
          [diagKey]: {
            providerId,
            modelName: model.name,
            status: "error",
            message: "未配置 API 端点 URL",
            timestamp: Date.now(),
          },
        }));
        return;
      }

      setDiagnostics((prev) => ({
        ...prev,
        [diagKey]: {
          providerId,
          modelName: model.name,
          status: "testing",
          message: "正在发送测试请求...",
          timestamp: Date.now(),
        },
      }));

      const start = performance.now();
      const controller = new AbortController();
      const timeoutMs = 20000;
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const setResult = (
        result: Omit<
          DiagnosticResult,
          "providerId" | "modelName" | "timestamp"
        >,
      ) => {
        setDiagnostics((prev) => ({
          ...prev,
          [diagKey]: {
            providerId,
            modelName: model.name,
            timestamp: Date.now(),
            ...result,
          },
        }));
      };

      (async () => {
        try {
          let resp: Response;
          if (providerId === "ollama") {
            const ollamaBase = url.replace(/\/+$/, "");
            const chatUrl = ollamaBase.includes("/api/chat")
              ? ollamaBase
              : `${ollamaBase.replace(/\/api\/.*$/, "")  }/api/chat`;
            resp = await fetch(chatUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                model: model.id,
                messages: [
                  {
                    role: "user",
                    content: "Hi, respond with exactly: YANYUCLOUD_OK",
                  },
                ],
                stream: false,
              }),
              signal: controller.signal,
            });
          } else if (providerId === "claude") {
            resp = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": providerApiKey,
                "anthropic-version": "2023-06-01",
                "anthropic-dangerous-direct-browser-access": "true",
              },
              body: JSON.stringify({
                model: model.id,
                max_tokens: 20,
                messages: [
                  {
                    role: "user",
                    content: "Hi, respond with exactly: YANYUCLOUD_OK",
                  },
                ],
              }),
              signal: controller.signal,
            });
          } else {
            resp = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${  providerApiKey}`,
              },
              body: JSON.stringify({
                model: model.id,
                messages: [
                  {
                    role: "user",
                    content: "Hi, respond with exactly: YANYUCLOUD_OK",
                  },
                ],
                stream: false,
                max_tokens: 20,
                temperature: 0,
              }),
              signal: controller.signal,
            });
          }

          clearTimeout(timer);
          const latency = Math.round(performance.now() - start);

          if (!resp.ok) {
            const errText = await resp.text().catch(() => "");
            let detail = "";
            try {
              const j = JSON.parse(errText);
              detail = j.error?.message || j.message || errText.slice(0, 200);
            } catch {
              detail = errText.slice(0, 200);
            }
            const s = resp.status;
            const statusMsg =
              s === 401
                ? "API Key 无效或已过期 (401)"
                : s === 403
                  ? "权限不足 (403)"
                  : s === 404
                    ? providerId === "ollama"
                      ? `Ollama 模型未找到。请先 ollama pull ${  model.id}`
                      : "端点不存在 (404)"
                    : s === 429
                      ? "请求频率超限 (429)"
                      : `HTTP ${  s}`;
            setResult({
              status: "error",
              message: statusMsg + (detail ? `。${  detail}` : ""),
              latency,
            });
            return;
          }

          const data = await resp.json().catch(() => null);
          let reply = "";
          if (providerId === "ollama") reply = data?.message?.content || "";
          else if (providerId === "claude")
            reply = data?.content?.[0]?.text || "";
          else
            reply = data?.choices?.[0]?.message?.content || data?.result || "";

          setResult({
            status: "success",
            message: "连接成功，API 响应正常",
            latency,
            modelResponse: reply.slice(0, 100),
          });
        } catch (err: any) {
          clearTimeout(timer);
          const latency = Math.round(performance.now() - start);
          if (err.name === "AbortError") {
            setResult({
              status: "error",
              message:
                `连接超时 (${  timeoutMs / 1000  }s)。请检查端点是否可达。`,
              latency,
            });
            return;
          }
          const msg = err.message || "";
          const networkMsg =
            msg.includes("Failed to fetch") ||
            msg.includes("NetworkError") ||
            msg.includes("fetch")
              ? "网络连接失败。可能原因：① 服务未启动 ② CORS 跨域限制 ③ 防火墙拦截。"
              : `测试异常: ${  msg.slice(0, 200)}`;
          setResult({ status: "error", message: networkMsg, latency });
        }
      })();
    },
    [allProviders, apiKeys, customUrls],
  );

  // Select model — add to store if needed + activate
  const handleSelectModel = useCallback(
    (providerId: string, modelId: string) => {
      const provider = allProviders.find((p) => p.id === providerId);
      if (!provider) return;
      const model = provider.models.find((m) => m.id === modelId);
      if (!model) return;
      const url = customUrls[providerId] || provider.baseURL;
      const key = apiKeys[providerId] || "";
      const providerType =
        providerId === "openai"
          ? "openai"
          : providerId === "ollama"
            ? "ollama"
            : "custom";

      const storeModelName = model.id;

      const existing = aiModels.find(
        (m) =>
          (m.name === storeModelName || m.name === model.name) &&
          m.endpoint === url,
      );

      if (existing) {
        updateAIModel(existing.id, { apiKey: key, name: storeModelName });
        activateAIModel(existing.id);
      } else {
        pendingActivationRef.current = storeModelName;
        addAIModel({
          name: storeModelName,
          provider: providerType,
          endpoint: url,
          apiKey: key,
          isActive: false,
        });
      }
      setSelectionToast(model.name);
      setTimeout(() => setSelectionToast(null), 2500);
    },
    [
      allProviders,
      customUrls,
      apiKeys,
      aiModels,
      activateAIModel,
      addAIModel,
      updateAIModel,
    ],
  );

  // Compute the "active model key" (providerId:modelId) from the current activeModelId in store
  const activeModelKey = useMemo(() => {
    if (!activeModelId) return null;
    const activeModel = aiModels.find((m) => m.id === activeModelId);
    if (!activeModel) return null;

    for (const provider of allProviders) {
      const url = customUrls[provider.id] || provider.baseURL;
      for (const model of provider.models) {
        if (
          (activeModel.name === model.id || activeModel.name === model.name) &&
          activeModel.endpoint === url
        ) {
          return `${provider.id  }:${  model.id}`;
        }
      }
    }
    // Fuzzy matching on name or id (ignoring endpoint)
    for (const provider of allProviders) {
      for (const model of provider.models) {
        const n = activeModel.name.toLowerCase();
        if (n === model.name.toLowerCase() || n === model.id.toLowerCase()) {
          return `${provider.id  }:${  model.id}`;
        }
      }
    }
    return null;
  }, [activeModelId, aiModels, allProviders, customUrls]);

  // Add custom provider
  const handleAddProvider = useCallback(() => {
    if (!newProvider.name || !newProvider.baseURL) return;
    const id = `custom-${  Date.now()}`;
    const provider: ProviderDef = {
      id,
      name: newProvider.name,
      shortName: newProvider.name.slice(0, 4),
      icon: Bot,
      color: "text-pink-400",
      colorBg: "bg-pink-500/10",
      colorBorder: "border-pink-500/20",
      description: "自定义 OpenAI 兼容服务",
      baseURL: newProvider.baseURL,
      apiKeyUrl: newProvider.apiKeyUrl,
      apiKeyPlaceholder: "sk-...",
      openaiCompatible: true,
      docsUrl: "",
      models: [],
    };
    setCustomProviders((prev) => [...prev, provider]);
    setNewProvider({ name: "", baseURL: "", apiKeyUrl: "" });
    setAddingProvider(false);
    setExpandedProvider(id);
  }, [newProvider]);

  const handleRemoveProvider = useCallback((id: string) => {
    setCustomProviders((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Ollama scan
  const handleScanOllama = useCallback(() => {
    setOllamaScanning(true);
    setOllamaModels([]);
    setOllamaConnected(false);
    const url = `${ollamaHost.replace(/\/+$/, "")  }/api/tags`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${  r.status}`);
        return r.json();
      })
      .then((data) => {
        const models: OllamaDetectedModel[] = (data.models || []).map(
          (m: any) => ({
            name: m.name || m.model,
            size: m.size ? `${(m.size / 1e9).toFixed(1)  } GB` : "N/A",
            status: "online" as const,
            quantization:
              m.details?.quantization_level || m.details?.family || "N/A",
          }),
        );
        setOllamaModels(models);
        setOllamaConnected(true);
        setOllamaScanning(false);
      })
      .catch(() => {
        // Fallback to simulated data
        let idx = 0;
        const interval = setInterval(() => {
          if (idx < SIMULATED_OLLAMA_MODELS.length) {
            const m = SIMULATED_OLLAMA_MODELS[idx];
            if (m) setOllamaModels((prev) => [...prev, m]);
            idx++;
          } else {
            clearInterval(interval);
            setOllamaScanning(false);
            setOllamaConnected(false);
          }
        }, 350);
      });
  }, [ollamaHost]);

  const handleImportOllama = useCallback(
    (model: OllamaDetectedModel) => {
      addAIModel({
        name: model.name,
        provider: "ollama",
        endpoint: `${ollamaHost.replace(/\/+$/, "")  }/api/chat`,
        apiKey: "",
        isActive: false,
        isDetected: true,
      });
    },
    [addAIModel, ollamaHost],
  );

  return {
    modelSettingsOpen: showModelSettingsV2,
    closeModelSettings,
    selectionToast,
    searchQuery,
    setSearchQuery,
    allProviders,
    filteredProviders,
    apiKeys,
    setApiKeys,
    customUrls,
    setCustomUrls,
    customProviders,
    diagnostics,
    activeModelKey,
    activeModelId,
    aiModels,
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
    ollamaHost,
    setOllamaHost,
    ollamaScanning,
    ollamaModels,
    ollamaConnected,
    handleScanOllama,
    handleImportOllama,
  };
}
