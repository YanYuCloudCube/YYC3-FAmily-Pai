/**
 * file typing-indicator.tsx
 * description TypingIndicator · 终端风格打字指示器（AI 生成响应的视觉反馈）
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-03-26
 * updated: 2026-10-07
 * status: active
 * tags: [component],[chat],[ui]
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized/primitives/feedback；
 *        移除源文件未使用的 Terminal 图标导入
 */

export function TypingIndicator() {
  return (
    <div className="mb-8 flex max-w-2xl flex-col gap-1 px-2 font-mono md:px-0">
      {/* Header Line */}
      <div className="mb-1 flex select-none items-center gap-2 opacity-50">
        <span className="text-xs font-bold text-green-500">system@ai</span>
        <span className="text-gray-600">:</span>
        <span className="text-blue-300">~</span>
        <span className="text-gray-600">$</span>
        <span className="ml-2 animate-pulse text-xs uppercase tracking-widest text-green-500/50">
          PROCESSING...
        </span>
      </div>

      {/* Content Area */}
      <div className="border-l-2 border-green-500/30 pl-4 text-green-500/70">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest">
            GENERATING_RESPONSE
          </span>
          <div className="flex gap-1">
            <div className="h-3 w-1.5 animate-[pulse_0.5s_ease-in-out_infinite] bg-green-500" />
            <div className="h-3 w-1.5 animate-[pulse_0.5s_ease-in-out_infinite_0.1s] bg-green-500/50" />
            <div className="h-3 w-1.5 animate-[pulse_0.5s_ease-in-out_infinite_0.2s] bg-green-500/20" />
          </div>
        </div>
        <div className="mt-2 font-mono text-[10px] text-green-500/30">
          {`> analyzing_input_vector`}
          <br />
          {`> processing_neural_weights`}
        </div>
      </div>
    </div>
  );
}
