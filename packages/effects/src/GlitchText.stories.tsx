/**
 * file: GlitchText.stories.tsx
 * description: GlitchText 组件的 Storybook 文档
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-30
 * updated: 2026-03-30
 * status: active
 * tags: [storybook],[effects],[text]
 */

import type { Meta, StoryObj } from '@storybook/react';
import { GlitchText, type GlitchTextProps } from './GlitchText';

const meta: Meta<GlitchTextProps> = {
  title: 'Effects/Cyberpunk/GlitchText',
  component: GlitchText,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
赛博朋克风格文字故障效果组件。

## 特性
- 支持随机触发和 hover 加强效果
- 可配置故障强度和触发间隔
- 支持多种 HTML 标签
- 尊重 prefers-reduced-motion 设置

## 使用场景
- 标题和品牌文字
- 警告和提示信息
- 科技感界面元素
        `,
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: '要显示的文字内容',
    },
    color: {
      control: 'color',
      description: '主要霓虹颜色',
    },
    intensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
      description: '故障强度乘数',
    },
    as: {
      control: 'select',
      options: ['span', 'div', 'h1', 'h2', 'h3', 'p'],
      description: '使用的 HTML 标签',
    },
    enabled: {
      control: 'boolean',
      description: '是否启用故障效果',
    },
    inline: {
      control: 'boolean',
      description: '是否显示为行内元素',
    },
  },
};

export default meta;
type Story = StoryObj<GlitchTextProps>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          background: '#0a0a0a',
          padding: '40px',
          borderRadius: '12px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    children: '赛博朋克',
    color: '#00f0ff',
    intensity: 1,
    as: 'span',
    enabled: true,
    inline: true,
  },
};

export const Heading: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          padding: '60px',
          borderRadius: '12px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    children: 'YYC³ 智能系统',
    color: '#00f0ff',
    intensity: 1.2,
    as: 'h1',
    enabled: true,
    inline: false,
    style: { fontSize: '3rem', fontWeight: 'bold' },
  },
};

export const HighIntensity: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          background: '#0a0a0a',
          padding: '40px',
          borderRadius: '12px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    children: '系统警告',
    color: '#ff0066',
    intensity: 2,
    as: 'span',
    enabled: true,
    interval: [1000, 3000],
  },
};

export const Subtle: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          background: '#0a0a0a',
          padding: '40px',
          borderRadius: '12px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    children: '科技未来',
    color: '#00f0ff',
    intensity: 0.5,
    as: 'span',
    enabled: true,
    interval: [5000, 10000],
  },
};

export const DifferentColors: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          background: '#0a0a0a',
          padding: '40px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <GlitchText color="#00f0ff" intensity={1}>
        青色霓虹
      </GlitchText>
      <GlitchText color="#00ffc8" intensity={1}>
        绿色霓虹
      </GlitchText>
      <GlitchText color="#ff00ff" intensity={1}>
        紫色霓虹
      </GlitchText>
      <GlitchText color="#ff6600" intensity={1}>
        橙色霓虹
      </GlitchText>
    </>
  ),
};

export const Disabled: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          background: '#0a0a0a',
          padding: '40px',
          borderRadius: '12px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    children: '静态文字',
    color: '#00f0ff',
    intensity: 1,
    as: 'span',
    enabled: false,
  },
};
