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
export type { Agent, AgentManager } from './agents.js';
export { YYC3Auth } from './auth.js';
export type { AuthProvider, AuthType } from './auth.js';
export { YYC3AIHub } from './hub.js';
export type { MCPManager, MCPServer } from './mcp.js';
export type { Skill, SkillManager } from './skills.js';

export { YYC3_ERROR_DOMAINS, YYC3_ERROR_DOMAINS_EN } from './errors/codes.js';
export {
  YYC3Error,
  YYC3ErrorCode, getLocale, setLocale
} from './errors/index.js';
export {
  FAMILY_PERSONAS, FamilyCompass,
  createFamilyCompass, getAllPersonas, getNextDutyMember, getPersona, getPersonaByHour
} from './family-compass/index.js';
export { ValidationError } from './schemas/index.js';

export { createFamilyWorkSystem } from './work/index.js';
export type { FamilyWorkSystem } from './work/index.js';

export type {
  AgentDefinition, AgentExecutionResult, ExecutionContext, HubConfig, MCPServerConfig, SkillDefinition, TaskContext,
  TaskResult
} from './types.js';

export type * from './family-compass/types.js';
export type * from './work/types.js';

export { StreamManager, collectStream } from './streaming/index.js';
export type { StreamChunk, StreamChunkType, StreamingOptions } from './streaming/index.js';

export {
  MiddlewareChain, createCacheMiddleware, createLoggingMiddleware, createRateLimitMiddleware, createRetryMiddleware
} from './middleware/index.js';
export type { AgentMiddleware, MiddlewareContext } from './middleware/index.js';

export { SemanticRouter } from './router/semantic-router.js';
export type { SemanticRoute } from './router/semantic-router.js';

export {
  inferTaskDependencies, inferTasksFromCode,
  inferTasksFromConversation,
  inferTasksFromDescription, inferTasksFromText
} from './router/task-inference.js';
export type { InferredTask, TaskInferenceResult, TaskPriority, TaskType } from './router/task-inference.js';

export {
  buildPrompt, escapeHTML, executeLocalAction, formatCodeLocal, getAvailableActions, wrapAsHTML, wrapAsMarkdown
} from './router/quick-actions.js';
export type { ActionContext, PromptResult, QuickActionType } from './router/quick-actions.js';

export {
  ReminderEngine, checkDueReminders, createBlockingReminder, createDeadlineReminder,
  createDependencyReminder, createProgressReminder, createReminder,
  createReminderId, markTriggered
} from './router/reminder.js';
export type { Reminder, ReminderTask, ReminderType } from './router/reminder.js';

export {
  exportTasksAsJSON,
  exportTasksAsMarkdown, formatTaskAsCodeComment, formatTaskAsMarkdown, formatTaskAsText, getHighestPriority
} from './router/task-formatter.js';
export type { FormatTask, TaskPriority as FormatterTaskPriority, TaskStatus } from './router/task-formatter.js';
