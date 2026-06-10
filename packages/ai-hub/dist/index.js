import { logger } from './chunk-MSXOCKNB.js';
export { FamilyCompass, createFamilyCompass } from './chunk-3BQL7E3D.js';
export { FAMILY_PERSONAS, getAllPersonas, getNextDutyMember, getPersona, getPersonaByHour } from './chunk-PM4NNPOB.js';
export { createFamilyWorkSystem } from './chunk-KN57KAAZ.js';
import OpenAI from 'openai';
import { UnifiedAuthManager } from '@yyc3/core/auth';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import { spawn } from 'child_process';

/**
 * @preserve YYC³ AI Family Hub
 * @version 1.4.2
 * @license MIT
 * @copyright YYC³ AI Team
 * @see https://github.com/yyc3/YYC3-CloudPivot-Intelli-Matrix
 */


// src/errors/codes.ts
var YYC3ErrorCode = /* @__PURE__ */ ((YYC3ErrorCode2) => {
  YYC3ErrorCode2["AUTH_NO_PROVIDER"] = "AUTH_1001";
  YYC3ErrorCode2["AUTH_OPENAI_KEY_MISSING"] = "AUTH_1002";
  YYC3ErrorCode2["AUTH_ANTHROPIC_KEY_MISSING"] = "AUTH_1003";
  YYC3ErrorCode2["AUTH_NOT_INITIALIZED"] = "AUTH_1004";
  YYC3ErrorCode2["AUTH_INIT_FAILED"] = "AUTH_1005";
  YYC3ErrorCode2["AGENT_NOT_FOUND"] = "AGENT_2001";
  YYC3ErrorCode2["AGENT_INVALID_DEFINITION"] = "AGENT_2002";
  YYC3ErrorCode2["AGENT_EXECUTION_FAILED"] = "AGENT_2003";
  YYC3ErrorCode2["AGENT_LOAD_FAILED"] = "AGENT_2004";
  YYC3ErrorCode2["AGENT_TIMEOUT"] = "AGENT_2005";
  YYC3ErrorCode2["SKILL_NOT_FOUND"] = "SKILL_3001";
  YYC3ErrorCode2["SKILL_INVALID_DEFINITION"] = "SKILL_3002";
  YYC3ErrorCode2["SKILL_APPLY_FAILED"] = "SKILL_3003";
  YYC3ErrorCode2["SKILL_LOAD_FAILED"] = "SKILL_3004";
  YYC3ErrorCode2["SKILL_NO_MATCH"] = "SKILL_3005";
  YYC3ErrorCode2["MCP_SERVER_NOT_FOUND"] = "MCP_4001";
  YYC3ErrorCode2["MCP_INVALID_CONFIG"] = "MCP_4002";
  YYC3ErrorCode2["MCP_START_FAILED"] = "MCP_4003";
  YYC3ErrorCode2["MCP_STOP_FAILED"] = "MCP_4004";
  YYC3ErrorCode2["MCP_LOAD_FAILED"] = "MCP_4005";
  YYC3ErrorCode2["HUB_NOT_INITIALIZED"] = "HUB_5001";
  YYC3ErrorCode2["HUB_EXECUTE_FAILED"] = "HUB_5002";
  YYC3ErrorCode2["HUB_INVALID_CONFIG"] = "HUB_5003";
  YYC3ErrorCode2["HUB_TASK_CONTEXT_INVALID"] = "HUB_5004";
  YYC3ErrorCode2["SCHEMA_VALIDATION_FAILED"] = "SCHEMA_6001";
  YYC3ErrorCode2["SCHEMA_PARSE_ERROR"] = "SCHEMA_6002";
  YYC3ErrorCode2["FAMILY_MEMBER_NOT_FOUND"] = "FAMILY_7001";
  YYC3ErrorCode2["FAMILY_PROFILE_NOT_FOUND"] = "FAMILY_7002";
  return YYC3ErrorCode2;
})(YYC3ErrorCode || {});
var YYC3_ERROR_DOMAINS = {
  AUTH: "\u8BA4\u8BC1\u6A21\u5757",
  AGENT: "\u667A\u80FD\u4F53\u6A21\u5757",
  SKILL: "\u6280\u80FD\u6A21\u5757",
  MCP: "MCP\u670D\u52A1\u6A21\u5757",
  HUB: "\u4E2D\u67A2\u6A21\u5757",
  SCHEMA: "Schema\u9A8C\u8BC1",
  FAMILY: "\u5BB6\u5EAD\u6A21\u5757"
};
var YYC3_ERROR_DOMAINS_EN = {
  AUTH: "Authentication",
  AGENT: "Agent",
  SKILL: "Skill",
  MCP: "MCP Server",
  HUB: "Hub Core",
  SCHEMA: "Schema Validation",
  FAMILY: "Family"
};

// src/errors/messages.ts
var ERROR_MESSAGES = {
  ["AUTH_1001" /* AUTH_NO_PROVIDER */]: {
    zh: "\u672A\u68C0\u6D4B\u5230\u53EF\u7528\u7684AI\u63D0\u4F9B\u5546\u3002\u8BF7\u8BBE\u7F6E OPENAI_API_KEY\u3001ANTHROPIC_API_KEY \u6216\u542F\u52A8 Ollama \u670D\u52A1\u3002",
    en: "No AI provider detected. Please set OPENAI_API_KEY, ANTHROPIC_API_KEY or start Ollama service."
  },
  ["AUTH_1002" /* AUTH_OPENAI_KEY_MISSING */]: {
    zh: "\u672A\u627E\u5230 OpenAI API Key\u3002\u8BF7\u8BBE\u7F6E OPENAI_API_KEY \u73AF\u5883\u53D8\u91CF\u3002",
    en: "OpenAI API Key not found. Please set OPENAI_API_KEY environment variable."
  },
  ["AUTH_1003" /* AUTH_ANTHROPIC_KEY_MISSING */]: {
    zh: "\u672A\u627E\u5230 Anthropic API Key\u3002\u8BF7\u8BBE\u7F6E ANTHROPIC_API_KEY \u73AF\u5883\u53D8\u91CF\u3002",
    en: "Anthropic API Key not found. Please set ANTHROPIC_API_KEY environment variable."
  },
  ["AUTH_1004" /* AUTH_NOT_INITIALIZED */]: {
    zh: "\u8BA4\u8BC1\u672A\u521D\u59CB\u5316\u3002\u8BF7\u5148\u8C03\u7528 initialize()\u3002",
    en: "Authentication not initialized. Please call initialize() first."
  },
  ["AUTH_1005" /* AUTH_INIT_FAILED */]: {
    zh: "\u8BA4\u8BC1\u521D\u59CB\u5316\u5931\u8D25\u3002",
    en: "Authentication initialization failed."
  },
  ["AGENT_2001" /* AGENT_NOT_FOUND */]: {
    zh: "Agent \u672A\u627E\u5230: {id}",
    en: "Agent not found: {id}"
  },
  ["AGENT_2002" /* AGENT_INVALID_DEFINITION */]: {
    zh: "Agent \u5B9A\u4E49\u65E0\u6548: {reason}",
    en: "Invalid agent definition: {reason}"
  },
  ["AGENT_2003" /* AGENT_EXECUTION_FAILED */]: {
    zh: "Agent \u6267\u884C\u5931\u8D25: {id} - {reason}",
    en: "Agent execution failed: {id} - {reason}"
  },
  ["AGENT_2004" /* AGENT_LOAD_FAILED */]: {
    zh: "Agent \u52A0\u8F7D\u5931\u8D25: {path}",
    en: "Agent load failed: {path}"
  },
  ["AGENT_2005" /* AGENT_TIMEOUT */]: {
    zh: "Agent \u6267\u884C\u8D85\u65F6: {id}",
    en: "Agent execution timeout: {id}"
  },
  ["SKILL_3001" /* SKILL_NOT_FOUND */]: {
    zh: "Skill \u672A\u627E\u5230: {id}",
    en: "Skill not found: {id}"
  },
  ["SKILL_3002" /* SKILL_INVALID_DEFINITION */]: {
    zh: "Skill \u5B9A\u4E49\u65E0\u6548: {reason}",
    en: "Invalid skill definition: {reason}"
  },
  ["SKILL_3003" /* SKILL_APPLY_FAILED */]: {
    zh: "Skill \u5E94\u7528\u5931\u8D25: {id}",
    en: "Skill apply failed: {id}"
  },
  ["SKILL_3004" /* SKILL_LOAD_FAILED */]: {
    zh: "Skill \u52A0\u8F7D\u5931\u8D25: {path}",
    en: "Skill load failed: {path}"
  },
  ["SKILL_3005" /* SKILL_NO_MATCH */]: {
    zh: "\u6CA1\u6709\u5339\u914D\u7684 Skill \u53EF\u7528\u4E8E\u5F53\u524D\u8F93\u5165\u3002",
    en: "No matching skill for current input."
  },
  ["MCP_4001" /* MCP_SERVER_NOT_FOUND */]: {
    zh: "MCP Server \u672A\u627E\u5230: {id}",
    en: "MCP Server not found: {id}"
  },
  ["MCP_4002" /* MCP_INVALID_CONFIG */]: {
    zh: "MCP \u914D\u7F6E\u65E0\u6548: {reason}",
    en: "Invalid MCP configuration: {reason}"
  },
  ["MCP_4003" /* MCP_START_FAILED */]: {
    zh: "MCP Server \u542F\u52A8\u5931\u8D25: {id} - {reason}",
    en: "MCP Server start failed: {id} - {reason}"
  },
  ["MCP_4004" /* MCP_STOP_FAILED */]: {
    zh: "MCP Server \u505C\u6B62\u5931\u8D25: {id}",
    en: "MCP Server stop failed: {id}"
  },
  ["MCP_4005" /* MCP_LOAD_FAILED */]: {
    zh: "MCP \u52A0\u8F7D\u5931\u8D25: {path}",
    en: "MCP load failed: {path}"
  },
  ["HUB_5001" /* HUB_NOT_INITIALIZED */]: {
    zh: "Hub \u672A\u521D\u59CB\u5316\u3002\u8BF7\u5148\u8C03\u7528 initialize()\u3002",
    en: "Hub not initialized. Please call initialize() first."
  },
  ["HUB_5002" /* HUB_EXECUTE_FAILED */]: {
    zh: "\u4EFB\u52A1\u6267\u884C\u5931\u8D25: {reason}",
    en: "Task execution failed: {reason}"
  },
  ["HUB_5003" /* HUB_INVALID_CONFIG */]: {
    zh: "Hub \u914D\u7F6E\u65E0\u6548: {reason}",
    en: "Invalid Hub configuration: {reason}"
  },
  ["HUB_5004" /* HUB_TASK_CONTEXT_INVALID */]: {
    zh: "\u4EFB\u52A1\u4E0A\u4E0B\u6587\u65E0\u6548: {reason}",
    en: "Invalid task context: {reason}"
  },
  ["SCHEMA_6001" /* SCHEMA_VALIDATION_FAILED */]: {
    zh: "Schema \u9A8C\u8BC1\u5931\u8D25: {fieldCount} \u4E2A\u5B57\u6BB5\u5F02\u5E38",
    en: "Schema validation failed: {fieldCount} field(s) invalid"
  },
  ["SCHEMA_6002" /* SCHEMA_PARSE_ERROR */]: {
    zh: "Schema \u89E3\u6790\u9519\u8BEF: {reason}",
    en: "Schema parse error: {reason}"
  },
  ["FAMILY_7001" /* FAMILY_MEMBER_NOT_FOUND */]: {
    zh: "\u5BB6\u5EAD\u6210\u5458\u4E0D\u5B58\u5728: {memberId}",
    en: "Family member not found: {memberId}"
  },
  ["FAMILY_7002" /* FAMILY_PROFILE_NOT_FOUND */]: {
    zh: "\u7528\u6237\u6863\u6848\u4E0D\u5B58\u5728: {userId}",
    en: "User profile not found: {userId}"
  }
};

// src/errors/index.ts
var currentLocale = "zh";
function setLocale(locale) {
  currentLocale = locale;
}
function getLocale() {
  return currentLocale;
}
var YYC3Error = class _YYC3Error extends Error {
  code;
  context;
  domain;
  cause;
  constructor(code, context = {}, cause) {
    const template = ERROR_MESSAGES[code];
    const msg = template ? renderMessage(template[currentLocale], context) : String(code);
    super(msg);
    this.name = "YYC3Error";
    this.code = code;
    this.context = context;
    this.domain = code.split("_")[0];
    this.cause = cause;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _YYC3Error);
    }
  }
  get messageZh() {
    return renderMessage(ERROR_MESSAGES[this.code]?.zh || "", this.context);
  }
  get messageEn() {
    return renderMessage(ERROR_MESSAGES[this.code]?.en || "", this.context);
  }
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      domain: this.domain,
      message: this.message,
      messageZh: this.messageZh,
      messageEn: this.messageEn,
      context: this.context
    };
  }
  static isYYC3Error(error) {
    return error instanceof _YYC3Error;
  }
  static fromError(error, fallbackCode) {
    if (error instanceof _YYC3Error) return error;
    const code = fallbackCode ?? "HUB_5002" /* HUB_EXECUTE_FAILED */;
    const cause = error instanceof Error ? error : new Error(String(error));
    return new _YYC3Error(code, { originalMessage: cause.message }, cause);
  }
};
function renderMessage(template, context) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const val = context[key];
    return val !== void 0 ? String(val) : `{${key}}`;
  });
}

// src/auth.ts
var YYC3Auth = class {
  config;
  provider = null;
  constructor(config = {}) {
    this.config = config;
  }
  async initialize() {
    const authType = this.config.authType || "auto";
    logger.info(`Initializing authentication with type: ${authType}`);
    if (authType === "auto") {
      this.provider = await this.autoDetect();
    } else if (authType === "openai") {
      this.provider = await this.initOpenAI();
    } else if (authType === "anthropic") {
      this.provider = await this.initAnthropic();
    } else {
      this.provider = await this.initOllama();
    }
    logger.info(`Authentication initialized successfully: ${this.provider?.type}`);
    return this.provider;
  }
  maskApiKey(apiKey) {
    if (!apiKey || apiKey.length < 8) return "***";
    return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
  }
  getOpenAIKey() {
    const apiKey = this.config.apiKey || process.env.OPENAI_API_KEY;
    if (apiKey) {
      logger.debug(`Using OpenAI API Key: ${this.maskApiKey(apiKey)}`);
    }
    return apiKey;
  }
  getAnthropicKey() {
    const apiKey = this.config.anthropicApiKey || process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      logger.debug(`Using Anthropic API Key: ${this.maskApiKey(apiKey)}`);
    }
    return apiKey;
  }
  async autoDetect() {
    if (process.env.OPENAI_API_KEY || this.config.apiKey) {
      return this.initOpenAI();
    }
    if (process.env.ANTHROPIC_API_KEY || this.config.anthropicApiKey) {
      return this.initAnthropic();
    }
    try {
      const response = await fetch("http://localhost:11434/api/tags");
      if (response.ok) {
        return this.initOllama();
      }
    } catch {
    }
    throw new YYC3Error("AUTH_1001" /* AUTH_NO_PROVIDER */);
  }
  async initOpenAI() {
    const apiKey = this.getOpenAIKey();
    if (!apiKey) {
      throw new YYC3Error("AUTH_1002" /* AUTH_OPENAI_KEY_MISSING */);
    }
    const client = new OpenAI({ apiKey });
    return {
      type: "openai",
      client,
      modelMapping: {
        opus: this.config.modelMapping?.opus || "o1",
        sonnet: this.config.modelMapping?.sonnet || "gpt-4o",
        haiku: this.config.modelMapping?.haiku || "gpt-4o-mini"
      }
    };
  }
  async initAnthropic() {
    const apiKey = this.getAnthropicKey();
    if (!apiKey) {
      throw new YYC3Error("AUTH_1003" /* AUTH_ANTHROPIC_KEY_MISSING */);
    }
    return {
      type: "anthropic",
      client: null,
      modelMapping: {
        opus: this.config.modelMapping?.opus || "claude-opus-4-20250514",
        sonnet: this.config.modelMapping?.sonnet || "claude-sonnet-4-20250514",
        haiku: this.config.modelMapping?.haiku || "claude-3-5-haiku-20241022"
      }
    };
  }
  async initOllama() {
    const host = this.config.ollamaHost || "http://localhost:11434";
    return {
      type: "ollama",
      client: null,
      host,
      modelMapping: {
        opus: this.config.modelMapping?.opus || "llama3.1:70b",
        sonnet: this.config.modelMapping?.sonnet || "llama3.1:8b",
        haiku: this.config.modelMapping?.haiku || "llama3.2:3b"
      }
    };
  }
  getProvider() {
    if (!this.provider) {
      throw new YYC3Error("AUTH_1004" /* AUTH_NOT_INITIALIZED */);
    }
    return this.provider;
  }
  getModel(tier) {
    return this.getProvider().modelMapping[tier];
  }
};

// src/agent-router.ts
var DEFAULT_RULES = [
  { agent: "security-scanning", keywords: ["security", "vulnerability", "audit", "\u5B89\u5168", "\u6F0F\u6D1E"], priority: 90 },
  { agent: "kubernetes-operations", keywords: ["k8s", "kubernetes", "deploy", "container", "docker", "helm"], priority: 85 },
  { agent: "llm-application-dev", keywords: ["llm", "rag", "prompt", "agent", "ai", "\u6A21\u578B", "embedding"], priority: 80 },
  { agent: "backend-development", keywords: ["api", "server", "database", "microservice", "backend", "rest", "graphql"], priority: 75 },
  { agent: "python-development", keywords: ["python", "data", "ml", "machine learning", "pytorch", "pandas"], priority: 70 },
  { agent: "javascript-typescript", keywords: ["javascript", "typescript", "node", "react", "vue", "next", "nuxt"], priority: 70 },
  { agent: "rust-development", keywords: ["rust", "cargo", "wasm", "\u7CFB\u7EDF\u7F16\u7A0B"], priority: 65 },
  { agent: "go-development", keywords: ["golang", "go", "\u5E76\u53D1", "goroutine"], priority: 65 },
  { agent: "mobile-development", keywords: ["mobile", "ios", "android", "flutter", "react native", "swift", "kotlin"], priority: 60 },
  { agent: "devops", keywords: ["devops", "ci", "cd", "pipeline", "jenkins", "github actions"], priority: 55 },
  { agent: "testing", keywords: ["test", "\u6D4B\u8BD5", "unit", "integration", "e2e", "vitest", "jest"], priority: 50 },
  { agent: "documentation", keywords: ["doc", "\u6587\u6863", "readme", "api doc", "typedoc"], priority: 45 }
];
var AgentRouter = class {
  static rules = [...DEFAULT_RULES];
  static customRules = [];
  static addRule(rule) {
    this.customRules.push(rule);
  }
  static clearCustomRules() {
    this.customRules = [];
  }
  static route(task) {
    const lowerTask = task.toLowerCase();
    const allRules = [...this.customRules, ...this.rules];
    const scored = [];
    for (const rule of allRules) {
      let score = 0;
      for (const keyword of rule.keywords) {
        if (lowerTask.includes(keyword.toLowerCase())) {
          score += keyword.length;
        }
      }
      if (rule.patterns) {
        for (const pattern of rule.patterns) {
          if (pattern.test(task)) {
            score += 10;
          }
        }
      }
      if (score > 0) {
        scored.push({ agent: rule.agent, score: score * (rule.priority / 100) });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    if (scored.length === 0) {
      return ["general"];
    }
    return scored.slice(0, 3).map((s) => s.agent);
  }
};
var AgentImpl = class {
  constructor(definition, auth) {
    this.definition = definition;
    this.auth = auth;
    this.id = definition.id;
  }
  definition;
  auth;
  id;
  async execute(task, context) {
    const startTime = Date.now();
    const provider = this.auth.getProvider();
    const model = this.auth.getModel(this.definition.model);
    try {
      let output = "";
      if (provider.type === "openai" && provider.client) {
        const response = await provider.client.chat.completions.create({
          model,
          messages: [
            { role: "system", content: this.definition.systemPrompt },
            { role: "user", content: task }
          ]
        });
        output = response.choices[0]?.message?.content || "";
      }
      if (provider.type === "ollama" && provider.host) {
        const response = await fetch(`${provider.host}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: this.definition.systemPrompt },
              { role: "user", content: task }
            ],
            stream: false
          })
        });
        const data = await response.json();
        output = data.message?.content || "";
      }
      if (provider.type === "anthropic") {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY || "",
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify({
            model,
            max_tokens: 4096,
            system: this.definition.systemPrompt,
            messages: [{ role: "user", content: task }]
          })
        });
        const data = await response.json();
        output = data.content?.[0]?.text || "";
      }
      return {
        success: true,
        output,
        duration: Date.now() - startTime,
        tokensUsed: output.length
      };
    } catch (error) {
      return {
        success: false,
        output: "",
        duration: Date.now() - startTime,
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }
};
var AgentManager = class {
  agents = /* @__PURE__ */ new Map();
  auth;
  constructor(auth) {
    this.auth = auth;
  }
  async load(paths) {
    for (const p of paths) {
      await this.loadFromPath(p);
    }
  }
  async loadFromPath(p) {
    if (!fs.existsSync(p)) {
      console.warn(`Agent\u8DEF\u5F84\u4E0D\u5B58\u5728: ${p}`);
      return;
    }
    const stats = fs.statSync(p);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(p);
      for (const file of files) {
        if (file.endsWith(".json")) {
          const content = fs.readFileSync(path.join(p, file), "utf-8");
          const definitions = JSON.parse(content);
          definitions.forEach((def) => {
            this.agents.set(def.id, new AgentImpl(def, this.auth));
          });
        }
      }
    }
  }
  register(definition) {
    this.agents.set(definition.id, new AgentImpl(definition, this.auth));
  }
  get(id) {
    return this.agents.get(id);
  }
  list() {
    return Array.from(this.agents.keys());
  }
  getByCategory(category) {
    return Array.from(this.agents.values()).filter((a) => a.definition.category === category || a.definition.id.startsWith(category));
  }
  count() {
    return this.agents.size;
  }
};
var MCPServerMetadataSchema = z.object({
  displayName: z.string().max(128).optional(),
  category: z.string().max(64).optional(),
  description: z.string().max(512).optional(),
  vendor: z.string().max(64).optional(),
  repository: z.string().url().optional()
}).optional();
var MCPServerConfigSchema = z.object({
  command: z.string().min(1, "command \u4E0D\u80FD\u4E3A\u7A7A"),
  args: z.array(z.string()).max(32).optional(),
  env: z.record(z.string(), z.string()).optional(),
  metadata: MCPServerMetadataSchema
}).strict();

// src/schemas/index.ts
var ValidationError = class extends Error {
  code = "SCHEMA_6001";
  issues;
  constructor(issues) {
    super(`YYC\xB3 Schema \u9A8C\u8BC1\u5931\u8D25 (${issues.length} \u4E2A\u9519\u8BEF)`);
    this.name = "ValidationError";
    this.issues = issues;
  }
};
function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues.map((i) => ({
        path: i.path.map((p) => String(p)).join("."),
        message: i.message
      }))
    );
  }
  return result.data;
}
var MCPServerImpl = class {
  constructor(id, config) {
    this.id = id;
    this.config = config;
  }
  id;
  config;
  process;
  status = "stopped";
  async start() {
    this.process = spawn(this.config.command, this.config.args || [], {
      env: { ...process.env, ...this.config.env },
      stdio: ["pipe", "pipe", "pipe"]
    });
    return new Promise((resolve, reject) => {
      this.process.on("spawn", () => {
        this.status = "running";
        resolve();
      });
      this.process.on("error", (err) => {
        this.status = "error";
        reject(new YYC3Error("MCP_4003" /* MCP_START_FAILED */, { id: this.id, reason: err.message }, err));
      });
    });
  }
  async stop() {
    if (this.process) {
      this.process.kill();
      this.process = void 0;
      this.status = "stopped";
    }
  }
};
var MCPManager = class {
  servers = /* @__PURE__ */ new Map();
  async load(paths) {
    for (const p of paths) {
      await this.loadFromPath(p);
    }
  }
  async loadFromPath(p) {
    if (!fs.existsSync(p)) {
      logger.warn(`MCP\u914D\u7F6E\u8DEF\u5F84\u4E0D\u5B58\u5728: ${p}`);
      return;
    }
    const content = fs.readFileSync(p, "utf-8");
    const config = JSON.parse(content);
    if (config.mcpServers) {
      for (const [id, serverConfig] of Object.entries(config.mcpServers)) {
        const cfg = serverConfig;
        if (cfg.command && !id.startsWith("$") && id !== "_comment") {
          this.servers.set(id, new MCPServerImpl(id, cfg));
        }
      }
    }
  }
  register(id, config) {
    const validated = validate(MCPServerConfigSchema, config);
    this.servers.set(id, new MCPServerImpl(id, validated));
  }
  get(id) {
    return this.servers.get(id);
  }
  list() {
    return Array.from(this.servers.keys());
  }
  async startServer(id) {
    const server = this.servers.get(id);
    if (server) {
      await server.start();
    }
  }
  async stopServer(id) {
    const server = this.servers.get(id);
    if (server) {
      await server.stop();
    }
  }
  async startAll() {
    await Promise.all(
      Array.from(this.servers.values()).map((s) => s.start())
    );
  }
  async stopAll() {
    await Promise.all(
      Array.from(this.servers.values()).map((s) => s.stop())
    );
  }
  count() {
    return this.servers.size;
  }
  getByCategory(category) {
    return Array.from(this.servers.values()).filter((s) => s.config.metadata?.category === category);
  }
};
var SkillImpl = class {
  constructor(definition) {
    this.definition = definition;
    this.id = definition.id;
  }
  definition;
  id;
  async apply(context) {
    return `${this.definition.prompt}

## Context
${context}`;
  }
  matches(input) {
    if (typeof this.definition.trigger === "string") {
      return input.includes(this.definition.trigger);
    }
    return this.definition.trigger.test(input);
  }
};
var SkillManager = class {
  skills = /* @__PURE__ */ new Map();
  async load(paths) {
    for (const p of paths) {
      await this.loadFromPath(p);
    }
  }
  async loadFromPath(p) {
    if (!fs.existsSync(p)) {
      console.warn(`Skill\u8DEF\u5F84\u4E0D\u5B58\u5728: ${p}`);
      return;
    }
    const stats = fs.statSync(p);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(p, { recursive: true });
      for (const file of files) {
        if (file.endsWith(".md") && file.includes("SKILL")) {
          const content = fs.readFileSync(path.join(p, file), "utf-8");
          const skill = this.parseSkillMarkdown(content);
          if (skill) {
            this.skills.set(skill.id, new SkillImpl(skill));
          }
        }
      }
    }
  }
  parseSkillMarkdown(content) {
    const idMatch = content.match(/##\s+(.+)/);
    const descMatch = content.match(/\*\*描述\*\*[：:]\s*(.+)/);
    const triggerMatch = content.match(/\*\*触发\*\*[：:]\s*(.+)/);
    if (!idMatch) return null;
    return {
      id: idMatch[1].toLowerCase().replace(/\s+/g, "-"),
      name: idMatch[1],
      description: descMatch?.[1] || "",
      trigger: triggerMatch?.[1] || "",
      prompt: content
    };
  }
  register(definition) {
    this.skills.set(definition.id, new SkillImpl(definition));
  }
  get(id) {
    return this.skills.get(id);
  }
  list() {
    return Array.from(this.skills.keys());
  }
  findMatching(input) {
    return Array.from(this.skills.values()).filter((skill) => skill.matches(input));
  }
  count() {
    return this.skills.size;
  }
};

// src/hub.ts
var YYC3AIHub = class {
  constructor(config = {}) {
    this.config = config;
    this.coreAuth = new UnifiedAuthManager({
      preferLocal: false,
      autoDetect: true,
      openai: config.apiKey ? { apiKey: config.apiKey } : void 0,
      anthropic: config.anthropicApiKey ? { apiKey: config.anthropicApiKey } : void 0
    });
    this.auth = new YYC3Auth(config);
    this.agents = new AgentManager(this.auth);
    this.skills = new SkillManager();
    this.mcp = new MCPManager();
  }
  config;
  coreAuth;
  auth;
  agents;
  skills;
  mcp;
  initialized = false;
  async initialize() {
    logger.init("YYC\xB3 AI Hub \u521D\u59CB\u5316\u4E2D...");
    logger.step(1, "\u8BA4\u8BC1\u521D\u59CB\u5316 (core UnifiedAuthManager)");
    const providers = await this.coreAuth.autoDetect();
    logger.stat("Core Providers", String(providers.length));
    logger.step(2, "\u8BA4\u8BC1\u521D\u59CB\u5316 (hub auth)");
    await this.auth.initialize();
    logger.step(3, "\u52A0\u8F7DAgents");
    await this.agents.load([
      "./agents"
    ]);
    logger.step(4, "\u52A0\u8F7DSkills");
    await this.skills.load([
      "./skills"
    ]);
    logger.step(5, "\u52A0\u8F7DMCP\u670D\u52A1\u5668");
    await this.mcp.load([
      "./config/mcp-servers.json",
      "./config/vscode-mcp.json"
    ]);
    this.initialized = true;
    logger.done("YYC\xB3 AI Hub \u521D\u59CB\u5316\u5B8C\u6210");
    logger.stat("Agents", String(this.agents.count()));
    logger.stat("Skills", String(this.skills.count()));
    logger.stat("MCP Servers", String(this.mcp.count()));
  }
  async execute(task, options = { task }) {
    if (!this.initialized) {
      await this.initialize();
    }
    const startTime = Date.now();
    try {
      const context = await this.analyzeContext(task);
      const plan = await this.createPlan(context);
      const output = await this.executePlan(plan, options);
      return {
        success: true,
        output,
        metrics: {
          tokensUsed: 0,
          duration: Date.now() - startTime,
          agentCalls: plan.steps.length
        }
      };
    } catch (error) {
      const yyc3Error = YYC3Error.fromError(error, "HUB_5002" /* HUB_EXECUTE_FAILED */);
      return {
        success: false,
        output: "",
        errors: [yyc3Error.message],
        metrics: {
          tokensUsed: 0,
          duration: Date.now() - startTime,
          agentCalls: 0
        }
      };
    }
  }
  async analyzeContext(task) {
    const matchingSkills = this.skills.findMatching(task);
    return {
      task,
      matchingSkills: matchingSkills.map((s) => s.id),
      suggestedAgents: this.suggestAgents(task)
    };
  }
  suggestAgents(task) {
    return AgentRouter.route(task);
  }
  async createPlan(context) {
    return {
      steps: [
        { type: "analyze", context },
        { type: "execute", agent: context.suggestedAgents[0] || "general" },
        { type: "validate", skills: context.matchingSkills }
      ]
    };
  }
  async executePlan(plan, options) {
    const results = [];
    for (const step of plan.steps) {
      if (step.type === "execute" && step.agent) {
        const agent = this.agents.get(step.agent);
        if (agent) {
          const result = await agent.execute(options.task, options);
          results.push(result.output);
        }
      }
      if (step.type === "validate" && step.skills?.length) {
        const skillIds = step.skills;
        for (const skillId of skillIds) {
          const skill = this.skills.get(skillId);
          if (skill) {
            const result = await skill.apply(options.task);
            results.push(`[Skill: ${skillId}] ${result}`);
          }
        }
      }
    }
    return results.join("\n\n");
  }
  getAgents() {
    return this.agents.list();
  }
  getSkills() {
    return this.skills.list();
  }
  getMCPServers() {
    return this.mcp.list();
  }
  getAgentManager() {
    return this.agents;
  }
  getSkillManager() {
    return this.skills;
  }
  getMCPManager() {
    return this.mcp;
  }
  getAuth() {
    return this.auth;
  }
};

// src/streaming/stream-manager.ts
var StreamManager = class {
  listeners = [];
  aborted = false;
  onChunk(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  emit(chunk) {
    if (this.aborted) return;
    for (const listener of this.listeners) {
      listener(chunk);
    }
  }
  emitText(content, agentId) {
    this.emit({
      type: "text",
      content,
      agentId,
      timestamp: Date.now()
    });
  }
  emitThinking(content, agentId) {
    this.emit({
      type: "thinking",
      content,
      agentId,
      timestamp: Date.now()
    });
  }
  emitToolCall(content, agentId) {
    this.emit({
      type: "tool_call",
      content,
      agentId,
      timestamp: Date.now()
    });
  }
  emitDone() {
    this.emit({
      type: "done",
      content: "",
      timestamp: Date.now()
    });
  }
  emitError(error) {
    this.emit({
      type: "error",
      content: error,
      timestamp: Date.now()
    });
  }
  abort() {
    this.aborted = true;
  }
  isAborted() {
    return this.aborted;
  }
  reset() {
    this.aborted = false;
    this.listeners = [];
  }
  static createChunk(type, content, agentId) {
    return { type, content, agentId, timestamp: Date.now() };
  }
};
function collectStream(chunks) {
  return chunks.filter((c) => c.type === "text").map((c) => c.content).join("");
}

// src/middleware/middleware.ts
var MiddlewareChain = class {
  middlewares = [];
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }
  remove(name) {
    this.middlewares = this.middlewares.filter((m) => m.name !== name);
    return this;
  }
  list() {
    return this.middlewares.map((m) => m.name);
  }
  async executeBefore(ctx) {
    let current = ctx;
    for (const mw of this.middlewares) {
      if (mw.before) {
        current = await mw.before(current);
      }
    }
    return current;
  }
  async executeAfter(ctx, result) {
    let current = result;
    for (const mw of this.middlewares) {
      if (mw.after) {
        current = await mw.after(ctx, current);
      }
    }
    return current;
  }
  async executeOnError(ctx, error) {
    let current = error;
    for (const mw of this.middlewares) {
      if (mw.onError) {
        current = await mw.onError(ctx, current);
      }
    }
    return current;
  }
  has(name) {
    return this.middlewares.some((m) => m.name === name);
  }
  clear() {
    this.middlewares = [];
  }
};
function createLoggingMiddleware() {
  return {
    name: "logging",
    async before(ctx) {
      ctx.metadata.startTime = Date.now();
      return ctx;
    },
    async after(ctx, result) {
      const duration = Date.now() - (ctx.metadata.startTime || 0);
      return { ...result, duration };
    }
  };
}
function createRetryMiddleware(maxRetries = 3) {
  return {
    name: "retry",
    async onError(ctx, error) {
      const attempts = (ctx.metadata.retryAttempts || 0) + 1;
      ctx.metadata.retryAttempts = attempts;
      if (attempts < maxRetries) {
        const wrapped = new Error(`Retry ${attempts}/${maxRetries}: ${error.message}`);
        wrapped.cause = error;
        return wrapped;
      }
      return error;
    }
  };
}
function createCacheMiddleware(ttl = 6e4) {
  const cache = /* @__PURE__ */ new Map();
  return {
    name: "cache",
    async before(ctx) {
      const key = `${ctx.agentId}:${ctx.task}`;
      const cached = cache.get(key);
      if (cached && Date.now() < cached.expires) {
        ctx.metadata.cachedResult = cached.result;
      }
      return ctx;
    },
    async after(ctx, result) {
      const key = `${ctx.agentId}:${ctx.task}`;
      cache.set(key, { result, expires: Date.now() + ttl });
      return result;
    }
  };
}
function createRateLimitMiddleware(maxRps = 10) {
  let timestamps = [];
  return {
    name: "rate-limit",
    async before(ctx) {
      const now = Date.now();
      timestamps = timestamps.filter((t) => now - t < 1e3);
      if (timestamps.length >= maxRps) {
        throw new Error(`Rate limit exceeded: ${maxRps} requests per second`);
      }
      timestamps.push(now);
      return ctx;
    }
  };
}

// src/router/semantic-router.ts
function tokenize(text) {
  return text.toLowerCase().split(/[\s,.;:!?(){}[\]"'/\\]+/).filter((t) => t.length > 1);
}
function computeTF(tokens) {
  const tf = /* @__PURE__ */ new Map();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  for (const [key, val] of tf) {
    tf.set(key, val / tokens.length);
  }
  return tf;
}
function cosineSimilarity(a, b) {
  const allKeys = /* @__PURE__ */ new Set([...a.keys(), ...b.keys()]);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (const key of allKeys) {
    const va = a.get(key) || 0;
    const vb = b.get(key) || 0;
    dotProduct += va * vb;
    normA += va * va;
    normB += vb * vb;
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
var SemanticRouter = class extends AgentRouter {
  semanticRoutes = [];
  routeVectors = /* @__PURE__ */ new Map();
  addSemanticRoute(route) {
    this.semanticRoutes.push(route);
    for (const example of route.examples) {
      const key = `${route.agent}:${example}`;
      this.routeVectors.set(key, computeTF(tokenize(example)));
    }
  }
  async route(task) {
    const taskVector = computeTF(tokenize(task));
    const scored = [];
    for (const route of this.semanticRoutes) {
      let maxSimilarity = 0;
      for (const example of route.examples) {
        const key = `${route.agent}:${example}`;
        const exampleVector = this.routeVectors.get(key);
        if (exampleVector) {
          const similarity = cosineSimilarity(taskVector, exampleVector);
          maxSimilarity = Math.max(maxSimilarity, similarity);
        }
      }
      if (maxSimilarity >= route.threshold) {
        scored.push({ agent: route.agent, score: maxSimilarity });
      }
    }
    const keywordResults = AgentRouter.route(task);
    for (const agent of keywordResults) {
      if (!scored.find((s) => s.agent === agent)) {
        scored.push({ agent, score: 0.5 });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((s) => s.agent);
  }
  getSemanticRoutes() {
    return [...this.semanticRoutes];
  }
  clearSemanticRoutes() {
    this.semanticRoutes = [];
    this.routeVectors.clear();
  }
};

// src/router/task-inference.ts
var KEYWORD_PATTERNS = [
  { pattern: /TODO:?\s*(.+)/gi, type: "feature", priority: "medium" },
  { pattern: /FIXME:?\s*(.+)/gi, type: "bug", priority: "high" },
  { pattern: /BUG:?\s*(.+)/gi, type: "bug", priority: "high" },
  { pattern: /HACK:?\s*(.+)/gi, type: "refactor", priority: "medium" },
  { pattern: /OPTIMIZE:?\s*(.+)/gi, type: "refactor", priority: "low" },
  { pattern: /NOTE:?\s*(.+)/gi, type: "documentation", priority: "low" },
  { pattern: /需要实现(.+)/g, type: "feature", priority: "medium" },
  { pattern: /修复(.+)问题/g, type: "bug", priority: "high" },
  { pattern: /重构(.+)/g, type: "refactor", priority: "medium" },
  { pattern: /添加(.+)功能/g, type: "feature", priority: "medium" },
  { pattern: /完善(.+)/g, type: "feature", priority: "low" },
  { pattern: /优化(.+)/g, type: "refactor", priority: "low" },
  { pattern: /测试(.+)/g, type: "test", priority: "medium" },
  { pattern: /编写(.+)文档/g, type: "documentation", priority: "low" }
];
function inferTasksFromText(text) {
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  for (const { pattern, type, priority } of KEYWORD_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const title = match[1]?.trim();
      if (!title || title.length < 3 || seen.has(title.toLowerCase())) continue;
      seen.add(title.toLowerCase());
      results.push({
        task: {
          title,
          description: `Auto-extracted: "${match[0].trim()}"`,
          priority,
          type
        },
        confidence: 0.7,
        reasoning: `Keyword pattern: ${pattern.source}`,
        context: text.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50)
      });
    }
  }
  return results;
}
function inferTasksFromCode(code, language) {
  return inferTasksFromText(code).map((inf) => ({
    ...inf,
    task: {
      ...inf.task,
      description: `From ${language} code comment: ${inf.task.description}`
    },
    confidence: 0.85
  }));
}
function inferTasksFromConversation(messages) {
  const fullText = messages.map((m) => m.content).join("\n\n");
  return inferTasksFromText(fullText).map((inf) => ({
    ...inf,
    task: {
      ...inf.task,
      description: `From AI conversation: ${inf.task.description}`
    }
  }));
}
function inferTasksFromDescription(description) {
  const lines = description.split(/[\n;；。]/).map((l) => l.trim()).filter((l) => l.length > 3);
  if (lines.length <= 1) {
    return [{
      task: {
        title: description.slice(0, 80),
        description,
        priority: "medium",
        type: "feature"
      },
      confidence: 0.75,
      reasoning: "User direct description",
      context: description
    }];
  }
  return lines.map((line, i) => ({
    task: {
      title: line.slice(0, 80),
      description: line,
      priority: "medium",
      type: "feature"
    },
    confidence: 0.65,
    reasoning: `User description item ${i + 1}`,
    context: line
  }));
}
function inferTaskDependencies(tasks) {
  const deps = /* @__PURE__ */ new Map();
  for (let i = 0; i < tasks.length; i++) {
    const taskDeps = [];
    const titleLower = (tasks[i].title + " " + (tasks[i].description || "")).toLowerCase();
    for (let j = 0; j < tasks.length; j++) {
      if (i === j) continue;
      const otherWords = tasks[j].title.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      const matchCount = otherWords.filter((w) => titleLower.includes(w)).length;
      if (matchCount >= 2) {
        taskDeps.push(tasks[j].id);
      }
    }
    if (taskDeps.length > 0) deps.set(tasks[i].id, taskDeps);
  }
  return deps;
}

// src/router/quick-actions.ts
function escapeHTML(text) {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return text.replace(/[&<>"']/g, (c) => entities[c]);
}
function formatCodeLocal(code) {
  return code.split("\n").map((line) => line.trimEnd()).join("\n");
}
function wrapAsMarkdown(code, language = "text") {
  return `\`\`\`${language}
${code}
\`\`\``;
}
function wrapAsHTML(code, language = "text") {
  return `<pre><code class="language-${language}">${escapeHTML(code)}</code></pre>`;
}
var PROMPT_BUILDERS = {
  refactor(ctx) {
    const lang = ctx.language || "text";
    return {
      systemPrompt: "You are an expert code refactoring specialist.",
      userPrompt: `Language: ${lang}

Original Code:
\`\`\`${lang}
${ctx.text}
\`\`\`

Refactoring Goals:
- Improve readability
- Reduce duplication
- Apply design patterns
- Enhance maintainability

Only output the refactored code, no explanations.`,
      actionType: "refactor"
    };
  },
  optimize(ctx) {
    const lang = ctx.language || "text";
    return {
      systemPrompt: "You are an expert code optimizer.",
      userPrompt: `Language: ${lang}

Original Code:
\`\`\`${lang}
${ctx.text}
\`\`\`

Optimization Goals:
- Improve performance
- Reduce memory usage
- Optimize algorithms

Provide optimized code with brief explanation.`,
      actionType: "optimize"
    };
  },
  explain(ctx) {
    const lang = ctx.language || "text";
    return {
      systemPrompt: "You are an expert code educator.",
      userPrompt: `Language: ${lang}

Code:
\`\`\`${lang}
${ctx.text}
\`\`\`

Please explain this code:
- Overall purpose and functionality
- Key components and their roles
- How the code works
- Important patterns used

Format as Markdown.`,
      actionType: "explain"
    };
  },
  comment(ctx) {
    const lang = ctx.language || "text";
    return {
      systemPrompt: "You are an expert code commenter.",
      userPrompt: `Language: ${lang}

Code:
\`\`\`${lang}
${ctx.text}
\`\`\`

Add comprehensive comments including:
- Function/class descriptions
- Parameter and return value explanations
- Complex logic explanations

Only output the commented code.`,
      actionType: "comment"
    };
  },
  "find-issues"(ctx) {
    const lang = ctx.language || "text";
    return {
      systemPrompt: "You are an expert code reviewer.",
      userPrompt: `Language: ${lang}

Code:
\`\`\`${lang}
${ctx.text}
\`\`\`

Identify issues:
- Bugs and errors
- Security vulnerabilities
- Performance problems
- Code smells

For each, provide type, severity, location, description, and fix.
Format as Markdown.`,
      actionType: "find-issues"
    };
  },
  "test-generate"(ctx) {
    const lang = ctx.language || "text";
    return {
      systemPrompt: "You are an expert test engineer.",
      userPrompt: `Language: ${lang}

Code to Test:
\`\`\`${lang}
${ctx.text}
\`\`\`

Generate comprehensive test cases:
- Unit tests
- Edge cases
- Error handling tests

Use Vitest framework. Only output test code.`,
      actionType: "test-generate"
    };
  },
  "document-generate"(ctx) {
    const lang = ctx.language || "text";
    return {
      systemPrompt: "You are an expert technical writer.",
      userPrompt: `Language: ${lang}

Code to Document:
\`\`\`${lang}
${ctx.text}
\`\`\`

Generate documentation:
- Function/class description
- Parameters and return values
- Usage examples
- Edge cases and limitations

Format as Markdown.`,
      actionType: "document-generate"
    };
  },
  translate(ctx, params) {
    const targetLang = params?.targetLang || "en";
    return {
      systemPrompt: "You are an expert translator.",
      userPrompt: `Original Text:
${ctx.text}

Translate to ${targetLang}. Maintain tone and meaning.
Only output the translated text.`,
      actionType: "translate"
    };
  },
  rewrite(ctx) {
    return {
      systemPrompt: "You are an expert writer.",
      userPrompt: `Original Text:
${ctx.text}

Rewrite for clarity, conciseness, and impact.
Only output the rewritten text.`,
      actionType: "rewrite"
    };
  },
  expand(ctx) {
    return {
      systemPrompt: "You are an expert writer.",
      userPrompt: `Original Text:
${ctx.text}

Expand with relevant details, examples, and explanations.
Only output the expanded text.`,
      actionType: "expand"
    };
  },
  correct(ctx) {
    return {
      systemPrompt: "You are an expert editor.",
      userPrompt: `Original Text:
${ctx.text}

Correct grammar, spelling, and punctuation errors.
Maintain original meaning and style. Only output corrected text.`,
      actionType: "correct"
    };
  },
  summarize(ctx) {
    return {
      systemPrompt: "You are an expert document summarizer.",
      userPrompt: `Original Text:
${ctx.text}

Create a summary:
- Main points
- Key insights
- Important details
- Conclusions

Format as Markdown.`,
      actionType: "summarize"
    };
  },
  convert(ctx, params) {
    const toFormat = params?.toFormat || "markdown";
    return {
      systemPrompt: "You are an expert document converter.",
      userPrompt: `Original Text:
${ctx.text}

Convert to ${toFormat} format.
Maintain all content and structure. Only output converted text.`,
      actionType: "convert"
    };
  }
};
function buildPrompt(actionType, ctx, params) {
  const builder = PROMPT_BUILDERS[actionType];
  if (!builder) throw new Error(`Unknown action type: ${actionType}`);
  return builder(ctx, params);
}
function getAvailableActions() {
  return Object.keys(PROMPT_BUILDERS);
}
function executeLocalAction(actionType, ctx) {
  switch (actionType) {
    case "copy":
      return ctx.text;
    case "copy-markdown":
      return wrapAsMarkdown(ctx.text, ctx.language);
    case "copy-html":
      return wrapAsHTML(ctx.text, ctx.language);
    case "format":
      return formatCodeLocal(ctx.text);
    default:
      throw new Error(`Unknown local action: ${actionType}`);
  }
}

// src/router/reminder.ts
var idCounter = 0;
function createReminderId() {
  return `reminder-${Date.now()}-${++idCounter}`;
}
function createReminder(taskId, type, message, remindAt) {
  return { id: createReminderId(), taskId, type, message, remindAt, triggered: false };
}
function createDeadlineReminder(taskId, dueDate, leadMs = 24 * 60 * 60 * 1e3) {
  const remindAt = dueDate - leadMs;
  if (remindAt <= Date.now()) return null;
  return createReminder(taskId, "deadline", "Task due within 24 hours", remindAt);
}
function createDependencyReminder(taskId, depTask) {
  if (depTask.status === "done") return null;
  return createReminder(
    taskId,
    "dependency",
    `Dependency "${depTask.title}" completed, ready to start`,
    Date.now()
  );
}
function createBlockingReminder(taskId, blockingTask) {
  return createReminder(
    taskId,
    "blocking",
    `Blocked by "${blockingTask.title}"`,
    Date.now()
  );
}
function createProgressReminder(taskId, progress) {
  return createReminder(
    taskId,
    "progress",
    `Task progress reached ${progress}%`,
    Date.now()
  );
}
function checkDueReminders(reminders, now = Date.now()) {
  return reminders.filter((r) => !r.triggered && r.remindAt <= now);
}
function markTriggered(reminders, ids) {
  const idSet = new Set(ids);
  return reminders.map((r) => idSet.has(r.id) ? { ...r, triggered: true } : r);
}
var ReminderEngine = class {
  reminders = [];
  add(reminder) {
    this.reminders.push(reminder);
  }
  checkDue(now = Date.now()) {
    return checkDueReminders(this.reminders, now);
  }
  markTriggered(ids) {
    this.reminders = markTriggered(this.reminders, ids);
  }
  getAll() {
    return [...this.reminders];
  }
  clear() {
    this.reminders = [];
  }
};

// src/router/task-formatter.ts
var PRIORITY_LABELS = {
  critical: "P0",
  high: "P1",
  medium: "P2",
  low: "P3"
};
var STATUS_LABELS = {
  todo: "\u5F85\u529E",
  "in-progress": "\u8FDB\u884C\u4E2D",
  review: "\u5BA1\u6838\u4E2D",
  done: "\u5DF2\u5B8C\u6210",
  blocked: "\u963B\u585E"
};
function formatTaskAsText(task) {
  let text = `# ${task.title}

`;
  if (task.description) text += `## \u63CF\u8FF0
${task.description}

`;
  text += `## \u72B6\u6001
${task.status}

`;
  text += `## \u4F18\u5148\u7EA7
${task.priority}

`;
  if (task.type) text += `## \u7C7B\u578B
${task.type}

`;
  if (task.dueDate) text += `## \u622A\u6B62\u65E5\u671F
${new Date(task.dueDate).toLocaleString("zh-CN")}

`;
  if (task.estimatedHours) text += `## \u9884\u4F30\u65F6\u95F4
${task.estimatedHours} \u5C0F\u65F6

`;
  if (task.tags && task.tags.length > 0) text += `## \u6807\u7B7E
${task.tags.join(", ")}

`;
  if (task.subtasks && task.subtasks.length > 0) {
    text += `## \u5B50\u4EFB\u52A1
`;
    task.subtasks.forEach((st, i) => {
      text += `${i + 1}. ${st.isCompleted ? "\u2713" : "\u25CB"} ${st.title}
`;
    });
    text += "\n";
  }
  return text;
}
function formatTaskAsMarkdown(task) {
  let md = `- [${task.status === "done" ? "x" : " "}] ${task.title}
`;
  if (task.description) md += `  - ${task.description}
`;
  if (task.dueDate) md += `  - ${new Date(task.dueDate).toLocaleDateString("zh-CN")}
`;
  md += `  - ${PRIORITY_LABELS[task.priority]} ${task.priority}
`;
  return md;
}
function formatTaskAsCodeComment(task, lang = "typescript") {
  const styles = {
    javascript: ["// TODO: ", ""],
    typescript: ["// TODO: ", ""],
    python: ["# TODO: ", ""],
    html: ["<!-- TODO: ", " -->"],
    css: ["/* TODO: ", " */"]
  };
  const [start, end] = styles[lang] || styles.typescript;
  let comment = `${start}${task.title}`;
  if (task.description) comment += ` - ${task.description}`;
  comment += ` [${task.priority}]${end}`;
  return comment;
}
function getHighestPriority(priorities) {
  const order = ["critical", "high", "medium", "low"];
  for (const p of order) {
    if (priorities.includes(p)) return p;
  }
  return "medium";
}
function exportTasksAsJSON(tasks) {
  return JSON.stringify(tasks, null, 2);
}
function exportTasksAsMarkdown(tasks, now = /* @__PURE__ */ new Date()) {
  let md = `# \u4EFB\u52A1\u5217\u8868

> \u5BFC\u51FA\u65F6\u95F4: ${now.toLocaleString("zh-CN")}

`;
  const grouped = /* @__PURE__ */ new Map();
  for (const t of tasks) {
    const key = t.status;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(t);
  }
  for (const [status, list] of grouped) {
    md += `## ${STATUS_LABELS[status] || status} (${list.length})

`;
    for (const t of list) md += formatTaskAsMarkdown(t) + "\n";
    md += "\n";
  }
  return md;
}

export { MiddlewareChain, ReminderEngine, SemanticRouter, StreamManager, ValidationError, YYC3AIHub, YYC3Auth, YYC3Error, YYC3ErrorCode, YYC3_ERROR_DOMAINS, YYC3_ERROR_DOMAINS_EN, buildPrompt, checkDueReminders, collectStream, createBlockingReminder, createCacheMiddleware, createDeadlineReminder, createDependencyReminder, createLoggingMiddleware, createProgressReminder, createRateLimitMiddleware, createReminder, createReminderId, createRetryMiddleware, escapeHTML, executeLocalAction, exportTasksAsJSON, exportTasksAsMarkdown, formatCodeLocal, formatTaskAsCodeComment, formatTaskAsMarkdown, formatTaskAsText, getAvailableActions, getHighestPriority, getLocale, inferTaskDependencies, inferTasksFromCode, inferTasksFromConversation, inferTasksFromDescription, inferTasksFromText, markTriggered, setLocale, wrapAsHTML, wrapAsMarkdown };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map