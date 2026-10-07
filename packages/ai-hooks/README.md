# @yyc3/ai-hooks

> YYC³ AI React Hooks —— AI 能力专用 hooks 包
>
> 源自 YYC3-UI 资产库（yyc3-zero-dep-components/ai），2026-10 独立成包。

## useAI

AI 对话 Hook：

- **SSE 流式响应**：标准 `data: {...}` 分块解析
- **多提供商**：OpenAI / Anthropic / Ollama / Zhipu / Qwen / DeepSeek / Custom
- **配置持久化**：localStorage 保存（版本迁移）
- **失败降级**：网络失败时输出模拟响应（本地优先）
- **超时控制**：默认 2s AbortController

```tsx
import { useAI } from '@yyc3/ai-hooks'

const { chat, isStreaming, config, saveConfig } = useAI()

await chat(
  [{ role: 'user', content: '你好' }],
  (chunk) => console.log('流式:', chunk)
)
```

## 说明

`@yyc3/ui` 的 hooks 子路径对本包再导出（ui 依赖本包），二进制一致、无重复实现。
