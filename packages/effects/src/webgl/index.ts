/**
 * file index.ts
 * description webgl 子模块汇总导出（WebGL Shader 集合 + Web Audio 工具）
 * module @yyc3/effects/webgl
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created: 2026-10-07
 * updated: 2026-10-07
 * status: active
 * tags: [webgl],[exports]
 */

export {
  flowingWavesShader,
  etherShader,
  shootingStarsShader,
  wavyLinesShader,
  vertexShader,
  shaders,
} from './shaders';
export type { ShaderDefinition } from './shaders';

export { initAudioContext, playCompletionSound } from './sounds';
export type { SoundType } from './sounds';
