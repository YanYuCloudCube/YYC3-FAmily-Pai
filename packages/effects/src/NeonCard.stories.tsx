/**
 * file: NeonCard.stories.tsx
 * description: NeonCard 组件的 Storybook 文档
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-30
 * updated: 2026-03-30
 * status: active
 * tags: [storybook],[effects],[card]
 */

import type { Meta, StoryObj } from '@storybook/react';
import { NeonCard, type NeonCardProps } from './NeonCard';

const meta: Meta<NeonCardProps> = {
  title: 'Effects/Cyberpunk/NeonCard',
  component: NeonCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
赛博朋克风格霓虹发光卡片组件，支持双主题。

## 特性
- 支持霓虹发光边框效果
- 支持赛博朋克和液态玻璃双主题
- 使用 IntersectionObserver 实现性能优化的滚动显示
- 支持 hover 交互效果
- 使用 React.memo 优化性能

## 使用场景
- 仪表板卡片
- 数据展示面板
- 功能模块容器
        `,
      },
    },
  },
  argTypes: {
    color: {
      control: 'color',
      description: '霓虹发光颜色',
    },
    hoverable: {
      control: 'boolean',
      description: '是否启用 hover 效果',
    },
    noReveal: {
      control: 'boolean',
      description: '禁用滚动显示动画',
    },
    themeMode: {
      control: 'select',
      options: ['cyberpunk', 'liquidGlass'],
      description: '主题模式',
    },
  },
};

export default meta;
type Story = StoryObj<NeonCardProps>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          padding: '40px',
          borderRadius: '12px',
          minHeight: '200px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    children: (
      <div style={{ color: '#fff' }}>
        <h3 style={{ marginBottom: '8px', color: '#00f0ff' }}>数据卡片</h3>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
          这是一个霓虹发光卡片，支持赛博朋克和液态玻璃双主题。
        </p>
      </div>
    ),
    color: '#00f0ff',
    hoverable: true,
    noReveal: true,
    themeMode: 'cyberpunk',
  },
};

export const LiquidGlass: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '12px',
          minHeight: '200px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    children: (
      <div style={{ color: '#fff' }}>
        <h3 style={{ marginBottom: '8px', color: '#00ff87' }}>液态玻璃</h3>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
          2025-2026 年度流行的玻璃态设计风格。
        </p>
      </div>
    ),
    color: '#00f0ff',
    hoverable: true,
    noReveal: true,
    themeMode: 'liquidGlass',
  },
};

export const DifferentColors: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          padding: '40px',
          borderRadius: '12px',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <NeonCard color="#00f0ff" noReveal style={{ width: '150px' }}>
        <div style={{ color: '#fff', textAlign: 'center' }}>
          <h4 style={{ color: '#00f0ff' }}>青色</h4>
        </div>
      </NeonCard>
      <NeonCard color="#00ffc8" noReveal style={{ width: '150px' }}>
        <div style={{ color: '#fff', textAlign: 'center' }}>
          <h4 style={{ color: '#00ffc8' }}>绿色</h4>
        </div>
      </NeonCard>
      <NeonCard color="#ff00ff" noReveal style={{ width: '150px' }}>
        <div style={{ color: '#fff', textAlign: 'center' }}>
          <h4 style={{ color: '#ff00ff' }}>紫色</h4>
        </div>
      </NeonCard>
      <NeonCard color="#ff6600" noReveal style={{ width: '150px' }}>
        <div style={{ color: '#fff', textAlign: 'center' }}>
          <h4 style={{ color: '#ff6600' }}>橙色</h4>
        </div>
      </NeonCard>
    </>
  ),
};

export const NonHoverable: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          padding: '40px',
          borderRadius: '12px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    children: (
      <div style={{ color: '#fff' }}>
        <h3 style={{ marginBottom: '8px', color: '#00f0ff' }}>静态卡片</h3>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
          这个卡片没有 hover 效果。
        </p>
      </div>
    ),
    color: '#00f0ff',
    hoverable: false,
    noReveal: true,
  },
};

export const Clickable: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          padding: '40px',
          borderRadius: '12px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    children: (
      <div style={{ color: '#fff' }}>
        <h3 style={{ marginBottom: '8px', color: '#00f0ff' }}>可点击卡片</h3>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
          点击这个卡片触发事件。
        </p>
      </div>
    ),
    color: '#00f0ff',
    hoverable: true,
    noReveal: true,
    onClick: () => alert('卡片被点击了！'),
  },
};
