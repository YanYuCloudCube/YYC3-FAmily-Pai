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

export type QuickActionType =
  | 'copy' | 'copy-markdown' | 'copy-html' | 'format'
  | 'refactor' | 'optimize'
  | 'explain' | 'comment' | 'find-issues' | 'test-generate' | 'document-generate'
  | 'translate' | 'rewrite' | 'expand' | 'correct'
  | 'summarize' | 'convert'

export interface ActionContext {
  text: string
  language?: string
  filePath?: string
}

export interface PromptResult {
  systemPrompt: string
  userPrompt: string
  actionType: QuickActionType
}

export function escapeHTML(text: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (c) => entities[c])
}

export function formatCodeLocal(code: string): string {
  return code.split('\n').map((line) => line.trimEnd()).join('\n')
}

export function wrapAsMarkdown(code: string, language = 'text'): string {
  return `\`\`\`${language}\n${code}\n\`\`\``
}

export function wrapAsHTML(code: string, language = 'text'): string {
  return `<pre><code class="language-${language}">${escapeHTML(code)}</code></pre>`
}

const PROMPT_BUILDERS: Record<string, (ctx: ActionContext, params?: Record<string, string>) => PromptResult> = {
  refactor(ctx) {
    const lang = ctx.language || 'text'
    return {
      systemPrompt: 'You are an expert code refactoring specialist.',
      userPrompt: `Language: ${lang}\n\nOriginal Code:\n\`\`\`${lang}\n${ctx.text}\n\`\`\`\n\nRefactoring Goals:\n- Improve readability\n- Reduce duplication\n- Apply design patterns\n- Enhance maintainability\n\nOnly output the refactored code, no explanations.`,
      actionType: 'refactor',
    }
  },
  optimize(ctx) {
    const lang = ctx.language || 'text'
    return {
      systemPrompt: 'You are an expert code optimizer.',
      userPrompt: `Language: ${lang}\n\nOriginal Code:\n\`\`\`${lang}\n${ctx.text}\n\`\`\`\n\nOptimization Goals:\n- Improve performance\n- Reduce memory usage\n- Optimize algorithms\n\nProvide optimized code with brief explanation.`,
      actionType: 'optimize',
    }
  },
  explain(ctx) {
    const lang = ctx.language || 'text'
    return {
      systemPrompt: 'You are an expert code educator.',
      userPrompt: `Language: ${lang}\n\nCode:\n\`\`\`${lang}\n${ctx.text}\n\`\`\`\n\nPlease explain this code:\n- Overall purpose and functionality\n- Key components and their roles\n- How the code works\n- Important patterns used\n\nFormat as Markdown.`,
      actionType: 'explain',
    }
  },
  comment(ctx) {
    const lang = ctx.language || 'text'
    return {
      systemPrompt: 'You are an expert code commenter.',
      userPrompt: `Language: ${lang}\n\nCode:\n\`\`\`${lang}\n${ctx.text}\n\`\`\`\n\nAdd comprehensive comments including:\n- Function/class descriptions\n- Parameter and return value explanations\n- Complex logic explanations\n\nOnly output the commented code.`,
      actionType: 'comment',
    }
  },
  'find-issues'(ctx) {
    const lang = ctx.language || 'text'
    return {
      systemPrompt: 'You are an expert code reviewer.',
      userPrompt: `Language: ${lang}\n\nCode:\n\`\`\`${lang}\n${ctx.text}\n\`\`\`\n\nIdentify issues:\n- Bugs and errors\n- Security vulnerabilities\n- Performance problems\n- Code smells\n\nFor each, provide type, severity, location, description, and fix.\nFormat as Markdown.`,
      actionType: 'find-issues',
    }
  },
  'test-generate'(ctx) {
    const lang = ctx.language || 'text'
    return {
      systemPrompt: 'You are an expert test engineer.',
      userPrompt: `Language: ${lang}\n\nCode to Test:\n\`\`\`${lang}\n${ctx.text}\n\`\`\`\n\nGenerate comprehensive test cases:\n- Unit tests\n- Edge cases\n- Error handling tests\n\nUse Vitest framework. Only output test code.`,
      actionType: 'test-generate',
    }
  },
  'document-generate'(ctx) {
    const lang = ctx.language || 'text'
    return {
      systemPrompt: 'You are an expert technical writer.',
      userPrompt: `Language: ${lang}\n\nCode to Document:\n\`\`\`${lang}\n${ctx.text}\n\`\`\`\n\nGenerate documentation:\n- Function/class description\n- Parameters and return values\n- Usage examples\n- Edge cases and limitations\n\nFormat as Markdown.`,
      actionType: 'document-generate',
    }
  },
  translate(ctx, params) {
    const targetLang = params?.targetLang || 'en'
    return {
      systemPrompt: 'You are an expert translator.',
      userPrompt: `Original Text:\n${ctx.text}\n\nTranslate to ${targetLang}. Maintain tone and meaning.\nOnly output the translated text.`,
      actionType: 'translate',
    }
  },
  rewrite(ctx) {
    return {
      systemPrompt: 'You are an expert writer.',
      userPrompt: `Original Text:\n${ctx.text}\n\nRewrite for clarity, conciseness, and impact.\nOnly output the rewritten text.`,
      actionType: 'rewrite',
    }
  },
  expand(ctx) {
    return {
      systemPrompt: 'You are an expert writer.',
      userPrompt: `Original Text:\n${ctx.text}\n\nExpand with relevant details, examples, and explanations.\nOnly output the expanded text.`,
      actionType: 'expand',
    }
  },
  correct(ctx) {
    return {
      systemPrompt: 'You are an expert editor.',
      userPrompt: `Original Text:\n${ctx.text}\n\nCorrect grammar, spelling, and punctuation errors.\nMaintain original meaning and style. Only output corrected text.`,
      actionType: 'correct',
    }
  },
  summarize(ctx) {
    return {
      systemPrompt: 'You are an expert document summarizer.',
      userPrompt: `Original Text:\n${ctx.text}\n\nCreate a summary:\n- Main points\n- Key insights\n- Important details\n- Conclusions\n\nFormat as Markdown.`,
      actionType: 'summarize',
    }
  },
  convert(ctx, params) {
    const toFormat = params?.toFormat || 'markdown'
    return {
      systemPrompt: 'You are an expert document converter.',
      userPrompt: `Original Text:\n${ctx.text}\n\nConvert to ${toFormat} format.\nMaintain all content and structure. Only output converted text.`,
      actionType: 'convert',
    }
  },
}

export function buildPrompt(
  actionType: QuickActionType,
  ctx: ActionContext,
  params?: Record<string, string>
): PromptResult {
  const builder = PROMPT_BUILDERS[actionType]
  if (!builder) throw new Error(`Unknown action type: ${actionType}`)
  return builder(ctx, params)
}

export function getAvailableActions(): QuickActionType[] {
  return Object.keys(PROMPT_BUILDERS) as QuickActionType[]
}

export function executeLocalAction(
  actionType: 'copy' | 'copy-markdown' | 'copy-html' | 'format',
  ctx: ActionContext
): string {
  switch (actionType) {
    case 'copy':
      return ctx.text
    case 'copy-markdown':
      return wrapAsMarkdown(ctx.text, ctx.language)
    case 'copy-html':
      return wrapAsHTML(ctx.text, ctx.language)
    case 'format':
      return formatCodeLocal(ctx.text)
    default:
      throw new Error(`Unknown local action: ${actionType}`)
  }
}
