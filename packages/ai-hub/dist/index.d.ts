import OpenAI from 'openai';
import { ChildProcess } from 'child_process';
export { FAMILY_PERSONAS, FamilyCompass, createFamilyCompass, getAllPersonas, getNextDutyMember, getPersona, getPersonaByHour } from './family-compass/index.js';
export { C as CallMessage, a as CompassState, D as DutyRosterEntry, F as FamilyMemberId, b as FamilyPersona, G as GrowthMilestone, M as MemoryEntry, P as PhoneCallSession } from './types-CLG85-BK.js';
export { A as ActivityFeedItem, a as Attachment, C as CollaborationMemberState, b as CollaborationMessage, c as CollaborationMode, d as CollaborationSession, e as Comment, F as FamilyMemberWorkProfile, f as FamilyWorkSystem, T as Task, g as TaskCategory, h as TrustEvent, i as TrustLevel, j as TrustRecord, W as WorkDashboardData, k as WorkLogEntry, l as WorkStatus, m as createFamilyWorkSystem } from './index-BjCed8qU.js';

/**
 * file types.ts
 * description @yyc3/ai-hub 类型定义
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [module]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief @yyc3/ai-hub 类型定义
 */
interface HubConfig {
    authType?: 'openai' | 'ollama' | 'anthropic' | 'auto';
    apiKey?: string;
    ollamaHost?: string;
    anthropicApiKey?: string;
    modelMapping?: {
        opus?: string;
        sonnet?: string;
        haiku?: string;
    };
}
interface TaskContext {
    task: string;
    agent?: string;
    skills?: string[];
    context?: Record<string, any>;
    priority?: 'high' | 'medium' | 'low';
}
interface TaskResult {
    success: boolean;
    output: string;
    artifacts?: string[];
    metrics?: {
        tokensUsed: number;
        duration: number;
        agentCalls: number;
    };
    errors?: string[];
}
interface AgentDefinition {
    id: string;
    name: string;
    description: string;
    model: 'opus' | 'sonnet' | 'haiku';
    systemPrompt: string;
    tools?: string[];
    skills?: string[];
    category?: string;
    priority?: number;
}
interface SkillDefinition {
    id: string;
    name: string;
    description: string;
    trigger: string | RegExp;
    prompt: string;
    examples?: string[];
    category?: string;
}
interface MCPServerConfig {
    command: string;
    args?: string[];
    env?: Record<string, string>;
    metadata?: {
        displayName?: string;
        category?: string;
        description?: string;
        vendor?: string;
        repository?: string;
    };
}
interface ExecutionContext {
    taskId: string;
    userId?: string;
    sessionId?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
interface AgentExecutionResult {
    success: boolean;
    output: string;
    tokensUsed?: number;
    duration?: number;
    errors?: string[];
}

/**
 * file auth.ts
 * description 认证管理模块
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [module],[auth]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 认证管理模块
 */

type AuthType = 'openai' | 'ollama' | 'anthropic' | 'auto';
interface AuthProvider {
    type: 'openai' | 'ollama' | 'anthropic';
    client: OpenAI | null;
    host?: string;
    modelMapping: {
        opus: string;
        sonnet: string;
        haiku: string;
    };
}
declare class YYC3Auth {
    private config;
    private provider;
    constructor(config?: HubConfig);
    initialize(): Promise<AuthProvider>;
    private maskApiKey;
    private getOpenAIKey;
    private getAnthropicKey;
    private autoDetect;
    private initOpenAI;
    private initAnthropic;
    private initOllama;
    getProvider(): AuthProvider;
    getModel(tier: 'opus' | 'sonnet' | 'haiku'): string;
}

/**
 * file agents.ts
 * description Agent 管理实现
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [module]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief Agent 管理实现
 */

interface Agent {
    id: string;
    definition: AgentDefinition;
    execute(task: string, context?: TaskContext): Promise<AgentExecutionResult>;
}
declare class AgentManager {
    private agents;
    private auth;
    constructor(auth: YYC3Auth);
    load(paths: string[]): Promise<void>;
    private loadFromPath;
    register(definition: AgentDefinition): void;
    get(id: string): Agent | undefined;
    list(): string[];
    getByCategory(category: string): Agent[];
    count(): number;
}

/**
 * file mcp.ts
 * description MCP 协议实现
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [module],[mcp]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief MCP 协议实现
 */

interface MCPServer {
    id: string;
    config: MCPServerConfig;
    process?: ChildProcess;
    status: 'stopped' | 'running' | 'error';
    start(): Promise<void>;
    stop(): Promise<void>;
}
declare class MCPManager {
    private servers;
    load(paths: string[]): Promise<void>;
    private loadFromPath;
    register(id: string, config: MCPServerConfig): void;
    get(id: string): MCPServer | undefined;
    list(): string[];
    startServer(id: string): Promise<void>;
    stopServer(id: string): Promise<void>;
    startAll(): Promise<void>;
    stopAll(): Promise<void>;
    count(): number;
    getByCategory(category: string): MCPServer[];
}

/**
 * file skills.ts
 * description 技能系统实现
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [module],[ai]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 技能系统实现
 */

interface Skill {
    id: string;
    definition: SkillDefinition;
    apply(context: string): Promise<string>;
    matches(input: string): boolean;
}
declare class SkillManager {
    private skills;
    load(paths: string[]): Promise<void>;
    private loadFromPath;
    private parseSkillMarkdown;
    register(definition: SkillDefinition): void;
    get(id: string): Skill | undefined;
    list(): string[];
    findMatching(input: string): Skill[];
    count(): number;
}

declare class YYC3AIHub {
    private config;
    private coreAuth;
    private auth;
    private agents;
    private skills;
    private mcp;
    private initialized;
    constructor(config?: HubConfig);
    initialize(): Promise<void>;
    execute(task: string, options?: TaskContext): Promise<TaskResult>;
    private analyzeContext;
    private suggestAgents;
    private createPlan;
    private executePlan;
    getAgents(): string[];
    getSkills(): string[];
    getMCPServers(): string[];
    getAgentManager(): AgentManager;
    getSkillManager(): SkillManager;
    getMCPManager(): MCPManager;
    getAuth(): YYC3Auth;
}

/**
 * file codes.ts
 * description 错误码定义
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [module]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 错误码定义
 */
declare enum YYC3ErrorCode {
    AUTH_NO_PROVIDER = "AUTH_1001",
    AUTH_OPENAI_KEY_MISSING = "AUTH_1002",
    AUTH_ANTHROPIC_KEY_MISSING = "AUTH_1003",
    AUTH_NOT_INITIALIZED = "AUTH_1004",
    AUTH_INIT_FAILED = "AUTH_1005",
    AGENT_NOT_FOUND = "AGENT_2001",
    AGENT_INVALID_DEFINITION = "AGENT_2002",
    AGENT_EXECUTION_FAILED = "AGENT_2003",
    AGENT_LOAD_FAILED = "AGENT_2004",
    AGENT_TIMEOUT = "AGENT_2005",
    SKILL_NOT_FOUND = "SKILL_3001",
    SKILL_INVALID_DEFINITION = "SKILL_3002",
    SKILL_APPLY_FAILED = "SKILL_3003",
    SKILL_LOAD_FAILED = "SKILL_3004",
    SKILL_NO_MATCH = "SKILL_3005",
    MCP_SERVER_NOT_FOUND = "MCP_4001",
    MCP_INVALID_CONFIG = "MCP_4002",
    MCP_START_FAILED = "MCP_4003",
    MCP_STOP_FAILED = "MCP_4004",
    MCP_LOAD_FAILED = "MCP_4005",
    HUB_NOT_INITIALIZED = "HUB_5001",
    HUB_EXECUTE_FAILED = "HUB_5002",
    HUB_INVALID_CONFIG = "HUB_5003",
    HUB_TASK_CONTEXT_INVALID = "HUB_5004",
    SCHEMA_VALIDATION_FAILED = "SCHEMA_6001",
    SCHEMA_PARSE_ERROR = "SCHEMA_6002",
    FAMILY_MEMBER_NOT_FOUND = "FAMILY_7001",
    FAMILY_PROFILE_NOT_FOUND = "FAMILY_7002"
}
declare const YYC3_ERROR_DOMAINS: Record<string, string>;
declare const YYC3_ERROR_DOMAINS_EN: Record<string, string>;

/**
 * file messages.ts
 * description 错误消息定义
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [module]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 错误消息定义
 */

interface YYC3ErrorContext {
    [key: string]: unknown;
}

/**
 * file index.ts
 * description @yyc3/ai-hub 模块入口
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [config]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief @yyc3/ai-hub 模块入口
 */

type Locale = 'zh' | 'en';
declare function setLocale(locale: Locale): void;
declare function getLocale(): Locale;
declare class YYC3Error extends Error {
    readonly code: YYC3ErrorCode;
    readonly context: YYC3ErrorContext;
    readonly domain: string;
    readonly cause?: Error;
    constructor(code: YYC3ErrorCode, context?: YYC3ErrorContext, cause?: Error);
    get messageZh(): string;
    get messageEn(): string;
    toJSON(): {
        name: string;
        code: string;
        domain: string;
        message: string;
        messageZh: string;
        messageEn: string;
        context: YYC3ErrorContext;
    };
    static isYYC3Error(error: unknown): error is YYC3Error;
    static fromError(error: unknown, fallbackCode?: YYC3ErrorCode): YYC3Error;
}

/**
 * file index.ts
 * description @yyc3/ai-hub 模块入口
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [config]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief @yyc3/ai-hub 模块入口
 */

declare class ValidationError extends Error {
    readonly code = "SCHEMA_6001";
    readonly issues: Array<{
        path: string;
        message: string;
    }>;
    constructor(issues: Array<{
        path: string;
        message: string;
    }>);
}

/**
 * file stream-types.ts
 * description 流式输出类型定义
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-19
 * updated 2026-05-19
 * status active
 * tags [streaming],[types]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 流式输出类型定义
 */
type StreamChunkType = 'text' | 'tool_call' | 'thinking' | 'done' | 'error';
interface StreamChunk {
    type: StreamChunkType;
    content: string;
    agentId?: string;
    timestamp: number;
}
interface StreamingOptions {
    onChunk?: (chunk: StreamChunk) => void;
    signal?: AbortSignal;
}

/**
 * file stream-manager.ts
 * description 流式输出管理器
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-19
 * updated 2026-05-19
 * status active
 * tags [streaming]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 流式输出管理器
 */

type ChunkListener = (chunk: StreamChunk) => void;
declare class StreamManager {
    private listeners;
    private aborted;
    onChunk(listener: ChunkListener): () => void;
    emit(chunk: StreamChunk): void;
    emitText(content: string, agentId?: string): void;
    emitThinking(content: string, agentId?: string): void;
    emitToolCall(content: string, agentId?: string): void;
    emitDone(): void;
    emitError(error: string): void;
    abort(): void;
    isAborted(): boolean;
    reset(): void;
    static createChunk(type: StreamChunk['type'], content: string, agentId?: string): StreamChunk;
}
declare function collectStream(chunks: StreamChunk[]): string;

/**
 * file middleware.ts
 * description 中间件类型定义与链式执行器
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-19
 * updated 2026-05-19
 * status active
 * tags [middleware]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 中间件类型定义与链式执行器
 */

interface MiddlewareContext {
    task: string;
    agentId: string;
    context?: TaskContext;
    metadata: Record<string, unknown>;
}
interface AgentMiddleware {
    name: string;
    before?(ctx: MiddlewareContext): Promise<MiddlewareContext>;
    after?(ctx: MiddlewareContext, result: AgentExecutionResult): Promise<AgentExecutionResult>;
    onError?(ctx: MiddlewareContext, error: Error): Promise<Error>;
}
declare class MiddlewareChain {
    private middlewares;
    use(middleware: AgentMiddleware): this;
    remove(name: string): this;
    list(): string[];
    executeBefore(ctx: MiddlewareContext): Promise<MiddlewareContext>;
    executeAfter(ctx: MiddlewareContext, result: AgentExecutionResult): Promise<AgentExecutionResult>;
    executeOnError(ctx: MiddlewareContext, error: Error): Promise<Error>;
    has(name: string): boolean;
    clear(): void;
}
declare function createLoggingMiddleware(): AgentMiddleware;
declare function createRetryMiddleware(maxRetries?: number): AgentMiddleware;
declare function createCacheMiddleware(ttl?: number): AgentMiddleware;
declare function createRateLimitMiddleware(maxRps?: number): AgentMiddleware;

interface AgentRouteRule {
    agent: string;
    keywords: string[];
    patterns?: RegExp[];
    priority: number;
}
declare class AgentRouter {
    private static rules;
    private static customRules;
    static addRule(rule: AgentRouteRule): void;
    static clearCustomRules(): void;
    static route(task: string): string[];
}

/**
 * file semantic-router.ts
 * description 轻量级语义路由器 — 基于 TF-IDF 余弦相似度
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-19
 * updated 2026-05-19
 * status active
 * tags [router],[semantic]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 轻量级语义路由器
 */

interface SemanticRoute {
    agent: string;
    examples: string[];
    threshold: number;
}
declare class SemanticRouter extends AgentRouter {
    private semanticRoutes;
    private routeVectors;
    addSemanticRoute(route: SemanticRoute): void;
    route(task: string): Promise<string[]>;
    getSemanticRoutes(): SemanticRoute[];
    clearSemanticRoutes(): void;
}

/**
 * file task-inference.ts
 * description 任务推理引擎 — 从对话/代码/描述中智能提取任务
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-20
 * updated 2026-05-20
 * status active
 * tags [inference],[task],[nlp]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */
type TaskType = 'feature' | 'bug' | 'refactor' | 'test' | 'documentation' | 'other';
type TaskPriority$1 = 'critical' | 'high' | 'medium' | 'low';
interface InferredTask {
    title: string;
    description: string;
    priority: TaskPriority$1;
    type: TaskType;
}
interface TaskInferenceResult {
    task: InferredTask;
    confidence: number;
    reasoning: string;
    context: string;
}
declare function inferTasksFromText(text: string): TaskInferenceResult[];
declare function inferTasksFromCode(code: string, language: string): TaskInferenceResult[];
declare function inferTasksFromConversation(messages: Array<{
    role: string;
    content: string;
}>): TaskInferenceResult[];
declare function inferTasksFromDescription(description: string): TaskInferenceResult[];
declare function inferTaskDependencies(tasks: Array<{
    id: string;
    title: string;
    description?: string;
}>): Map<string, string[]>;

/**
 * file quick-actions.ts
 * description 智能操作引擎 — 代码/文档/文本 AI 辅助操作的 prompt 生成与调度
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-20
 * updated 2026-05-20
 * status active
 * tags [actions],[ai],[prompt],[code],[text]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */
type QuickActionType = 'copy' | 'copy-markdown' | 'copy-html' | 'format' | 'refactor' | 'optimize' | 'explain' | 'comment' | 'find-issues' | 'test-generate' | 'document-generate' | 'translate' | 'rewrite' | 'expand' | 'correct' | 'summarize' | 'convert';
interface ActionContext {
    text: string;
    language?: string;
    filePath?: string;
}
interface PromptResult {
    systemPrompt: string;
    userPrompt: string;
    actionType: QuickActionType;
}
declare function escapeHTML(text: string): string;
declare function formatCodeLocal(code: string): string;
declare function wrapAsMarkdown(code: string, language?: string): string;
declare function wrapAsHTML(code: string, language?: string): string;
declare function buildPrompt(actionType: QuickActionType, ctx: ActionContext, params?: Record<string, string>): PromptResult;
declare function getAvailableActions(): QuickActionType[];
declare function executeLocalAction(actionType: 'copy' | 'copy-markdown' | 'copy-html' | 'format', ctx: ActionContext): string;

/**
 * file reminder.ts
 * description 提醒调度引擎 — 截止/依赖/阻塞/进度提醒的创建与巡检
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-20
 * updated 2026-05-20
 * status active
 * tags [reminder],[scheduler],[timer]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */
type ReminderType = 'deadline' | 'dependency' | 'blocking' | 'progress';
interface Reminder {
    id: string;
    taskId: string;
    type: ReminderType;
    message: string;
    remindAt: number;
    triggered: boolean;
}
interface ReminderTask {
    id: string;
    title: string;
    status: string;
    dueDate?: number;
}
declare function createReminderId(): string;
declare function createReminder(taskId: string, type: ReminderType, message: string, remindAt: number): Reminder;
declare function createDeadlineReminder(taskId: string, dueDate: number, leadMs?: number): Reminder | null;
declare function createDependencyReminder(taskId: string, depTask: ReminderTask): Reminder | null;
declare function createBlockingReminder(taskId: string, blockingTask: ReminderTask): Reminder;
declare function createProgressReminder(taskId: string, progress: number): Reminder;
declare function checkDueReminders(reminders: Reminder[], now?: number): Reminder[];
declare function markTriggered(reminders: Reminder[], ids: string[]): Reminder[];
declare class ReminderEngine {
    private reminders;
    add(reminder: Reminder): void;
    checkDue(now?: number): Reminder[];
    markTriggered(ids: string[]): void;
    getAll(): Reminder[];
    clear(): void;
}

/**
 * file task-formatter.ts
 * description 任务格式化工具 — 将任务对象格式化为文本/Markdown/代码注释/JSON
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-20
 * updated 2026-05-20
 * status active
 * tags [task],[formatter],[markdown],[export]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */
type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
interface FormatTask {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    type?: string;
    dueDate?: number;
    estimatedHours?: number;
    tags?: string[];
    subtasks?: Array<{
        title: string;
        isCompleted: boolean;
    }>;
}
declare function formatTaskAsText(task: FormatTask): string;
declare function formatTaskAsMarkdown(task: FormatTask): string;
declare function formatTaskAsCodeComment(task: FormatTask, lang?: string): string;
declare function getHighestPriority(priorities: TaskPriority[]): TaskPriority;
declare function exportTasksAsJSON(tasks: FormatTask[]): string;
declare function exportTasksAsMarkdown(tasks: FormatTask[], now?: Date): string;

export { type ActionContext, type Agent, type AgentDefinition, type AgentExecutionResult, AgentManager, type AgentMiddleware, type AuthProvider, type AuthType, type ExecutionContext, type FormatTask, type TaskPriority as FormatterTaskPriority, type HubConfig, type InferredTask, MCPManager, type MCPServer, type MCPServerConfig, MiddlewareChain, type MiddlewareContext, type PromptResult, type QuickActionType, type Reminder, ReminderEngine, type ReminderTask, type ReminderType, type SemanticRoute, SemanticRouter, type Skill, type SkillDefinition, SkillManager, type StreamChunk, type StreamChunkType, StreamManager, type StreamingOptions, type TaskContext, type TaskInferenceResult, type TaskPriority$1 as TaskPriority, type TaskResult, type TaskStatus, type TaskType, ValidationError, YYC3AIHub, YYC3Auth, YYC3Error, YYC3ErrorCode, YYC3_ERROR_DOMAINS, YYC3_ERROR_DOMAINS_EN, buildPrompt, checkDueReminders, collectStream, createBlockingReminder, createCacheMiddleware, createDeadlineReminder, createDependencyReminder, createLoggingMiddleware, createProgressReminder, createRateLimitMiddleware, createReminder, createReminderId, createRetryMiddleware, escapeHTML, executeLocalAction, exportTasksAsJSON, exportTasksAsMarkdown, formatCodeLocal, formatTaskAsCodeComment, formatTaskAsMarkdown, formatTaskAsText, getAvailableActions, getHighestPriority, getLocale, inferTaskDependencies, inferTasksFromCode, inferTasksFromConversation, inferTasksFromDescription, inferTasksFromText, markTriggered, setLocale, wrapAsHTML, wrapAsMarkdown };
