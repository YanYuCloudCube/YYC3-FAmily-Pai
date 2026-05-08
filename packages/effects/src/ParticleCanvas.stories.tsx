/**
 * file: ParticleCanvas.stories.tsx
 * description: ParticleCanvas 组件的 Storybook 文档
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-30
 * updated: 2026-03-30
 * status: active
 * tags: [storybook],[effects],[canvas]
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ParticleCanvas, type ParticleCanvasProps } from './ParticleCanvas';

const meta: Meta<ParticleCanvasProps> = {
  title: 'Effects/Cyberpunk/ParticleCanvas',
  component: ParticleCanvas,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Canvas粒子网络背景组件，支持霓虹连线效果和鼠标交互。

## 特性
- 基于 Canvas 的高性能粒子动画系统
- 支持粒子间霓虹连线效果
- 支持鼠标交互吸引力
- 可配置粒子数量、颜色、强度等参数
- 支持主题配置独立控制
        `,
      },
    },
  },
  argTypes: {
    config: {
      control: 'object',
      description: '粒子画布配置选项',
    },
    enableMouseInteraction: {
      control: 'boolean',
      description: '是否启用鼠标交互',
    },
    autoResize: {
      control: 'boolean',
      description: '是否自动适应父容器大小',
    },
  },
};

export default meta;
type Story = StoryObj<ParticleCanvasProps>;

export const Default: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f3460 100%)',
          position: 'relative',
        }}
      >
        <Story />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#00f0ff',
            fontSize: '2rem',
            textShadow: '0 0 20px #00f0ff',
          }}
        >
          YYC³ 粒子背景
        </div>
      </div>
    ),
  ],
  args: {
    config: {
      enabled: true,
      neonIntensity: 80,
      opacity: 0.6,
    },
  },
};

export const HighIntensity: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: '#0a0a0a',
          position: 'relative',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    config: {
      enabled: true,
      neonIntensity: 100,
      opacity: 0.8,
      maxParticles: 80,
    },
  },
};

export const CustomColors: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #1a0033 0%, #330066 100%)',
          position: 'relative',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    config: {
      enabled: true,
      colors: ['#ff00ff', '#cc00ff', '#9900ff', '#ff00cc', '#ff0099'],
      neonIntensity: 70,
    },
  },
};

export const Minimal: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: '#0a0a0a',
          position: 'relative',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    config: {
      enabled: true,
      neonIntensity: 40,
      maxParticles: 30,
      opacity: 0.4,
    },
  },
};

export const NoMouseInteraction: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: '#0a0a0a',
          position: 'relative',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    config: {
      enabled: true,
      neonIntensity: 60,
    },
    enableMouseInteraction: false,
  },
};
