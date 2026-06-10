/**
 * file index.ts
 * description @yyc3/motion 统一动效系统模块入口
 * module @yyc3/motion
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-04-27
 * updated 2026-05-19
 * status active
 * tags [motion],[animation],[css],[waapi],[framer-motion]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief @yyc3/motion 统一动效系统模块入口
 */
export { getFadeInStyle, prefersReducedMotion, type Direction, type FadeInStyleOptions } from './css/fade-in';
export { createRipple, type RippleOptions } from './css/ripple';
export { animateNumber } from './css/animate-number';
export { cssKeyframes, injectKeyframes } from './css/keyframes';

export { AnimationEngine, getAnimationEngine, type SequenceStep } from './waapi/engine';
export { PRESETS, type PresetName, type PresetDefinition } from './waapi/presets';
export { easings } from './waapi/index';

export { useAnimation } from './hooks/use-animation';
export { useScrollReveal } from './hooks/use-scroll-reveal';

export { FadeIn, type FadeInProps } from './components/fade-in';
export { LazyWrap, type LazyWrapProps } from './components/lazy-wrap';
