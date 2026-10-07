/**
 * @file webgl.test.ts
 * @description webgl 子模块测试（Shader 集合与音频工具的契约验证；jsdom 无真实
 *              WebGL/AudioContext，故以内容契约与 API 形态验证为主）
 * @author YYC³ Team
 */

import { describe, it, expect } from 'vitest';
import {
  flowingWavesShader,
  etherShader,
  shootingStarsShader,
  wavyLinesShader,
  vertexShader,
  shaders,
  initAudioContext,
  playCompletionSound,
} from '../index';

describe('shader 集合', () => {
  const fragmentShaders = [
    ['flowingWaves', flowingWavesShader],
    ['ether', etherShader],
    ['shootingStars', shootingStarsShader],
    ['wavyLines', wavyLinesShader],
  ] as const;

  it.each(fragmentShaders)('%s 应为非空 GLSL 源码', (_name, src) => {
    expect(src.length).toBeGreaterThan(100);
    expect(src).toContain('precision mediump float;');
    expect(src).toContain('void main()');
    expect(src).toContain('gl_FragColor');
  });

  it.each(fragmentShaders)('%s 应实现统一 uniform 契约', (_name, src) => {
    expect(src).toContain('uniform vec2 iResolution');
    expect(src).toContain('uniform float iTime');
    expect(src).toContain('uniform vec2 iMouse');
    expect(src).toContain('uniform bool hasActiveReminders');
    expect(src).toContain('uniform bool hasUpcomingReminders');
    expect(src).toContain('uniform bool disableCenterDimming');
  });

  it('vertexShader 应传递纹理坐标', () => {
    expect(vertexShader).toContain('attribute vec4 aVertexPosition');
    expect(vertexShader).toContain('varying vec2 vTextureCoord');
    expect(vertexShader).toContain('gl_Position');
  });

  it('shaders 目录应包含 4 组定义且引用对应源码', () => {
    expect(shaders).toHaveLength(4);
    expect(shaders.map(s => s.name)).toEqual([
      'Flowing Waves',
      'Ether',
      'Shooting Stars',
      'Wavy Lines',
    ]);
    for (const s of shaders) {
      expect(s.fragmentShader.length).toBeGreaterThan(100);
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(s.id).toBeGreaterThan(0);
    }
    // 目录中的第 1 项应即 flowingWaves 源
    expect(shaders[0].fragmentShader).toBe(flowingWavesShader);
  });
});

describe('audio 工具', () => {
  it('应导出 initAudioContext / playCompletionSound 函数', () => {
    expect(typeof initAudioContext).toBe('function');
    expect(typeof playCompletionSound).toBe('function');
  });

  it('未初始化时 playCompletionSound 应静默不抛错', () => {
    expect(() => playCompletionSound()).not.toThrow();
  });
});
