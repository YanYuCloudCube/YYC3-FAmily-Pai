/**
 * file index.ts
 * description @yyc3/ai-hub streaming 模块入口
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
 * brief streaming 模块入口
 */

export { StreamManager, createStreamGenerator, collectStream } from './stream-manager.js'
export type { StreamChunk, StreamChunkType, StreamingOptions } from './stream-types.js'
