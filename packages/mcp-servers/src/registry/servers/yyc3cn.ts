import type { MCPServerDefinition, MCPTool } from '../../types/index.js'

const YYC3CN_TOOLS: MCPTool[] = [
  {
    name: "yyc3cn_code_review",
    description: "YYC³ 中文代码审查",
    inputSchema: {
      type: "object",
      properties: {
        codePath: { type: "string", description: "代码文件路径" },
        language: { type: "string", description: "编程语言", enum: ["typescript", "python", "java", "swift", "kotlin", "javascript"] },
        focus: { type: "string", description: "审查重点", enum: ["ai_integration", "performance", "security", "chinese_nlp", "mobile_optimization"] },
      },
      required: ["codePath"],
    },
  },
  {
    name: "yyc3cn_ai_prompt_optimizer",
    description: "YYC³ AI 提示词优化器",
    inputSchema: {
      type: "object",
      properties: {
        promptText: { type: "string", description: "原始提示词" },
        context: { type: "string", description: "使用场景" },
        goal: { type: "string", description: "优化目标", enum: ["accuracy", "response_speed", "user_experience", "chinese_understanding", "domain_specific"] },
      },
      required: ["promptText"],
    },
  },
]

export const YYC3CN_DEF: MCPServerDefinition = {
  id: "yyc3cn-assistant",
  name: "YYC³ CN Assistant",
  description: "YYC³ 中文 AI 助手 — 代码审查、提示词优化、组件生成",
  version: "1.0.0",
  tools: YYC3CN_TOOLS,
  configTemplate: {
    name: "yyc3cn-assistant",
    command: "npx",
    args: ["-y", "@yyc3/mcp-server-cn-assistant"],
    enabled: true,
    priority: 7,
  },
  category: "ai",
}
