/**
 * file: CyberpunkWidget.stories.tsx
 * description: CyberpunkWidget 组件的 Storybook 文档
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-30
 * updated: 2026-03-30
 * status: active
 * tags: [storybook],[effects],[widget]
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CyberpunkWidget, type CyberpunkWidgetProps, type WidgetTabConfig } from './CyberpunkWidget';

const meta: Meta<CyberpunkWidgetProps> = {
  title: 'Effects/Cyberpunk/CyberpunkWidget',
  component: CyberpunkWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
赛博朋克风格悬浮窗口组件。

## 特性
- 支持拖拽移动和边缘缩放
- 支持最小化、最大化、还原操作
- 支持多标签页切换
- 赛博朋克风格视觉效果
- 支持自定义内容渲染

## 使用场景
- AI 助手窗口
- 工具面板
- 通知中心
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: '窗口标题',
    },
    subtitle: {
      control: 'text',
      description: '窗口副标题',
    },
    themeColor: {
      control: 'color',
      description: '主题颜色',
    },
    showQuickActions: {
      control: 'boolean',
      description: '是否显示快速操作栏',
    },
  },
};

export default meta;
type Story = StoryObj<CyberpunkWidgetProps>;

const defaultTabs: WidgetTabConfig[] = [
  {
    id: 'chat',
    label: '聊天',
    icon: '💬',
    color: '#00f0ff',
    content: (
      <div style={{ padding: '20px', color: '#fff' }}>
        <h3 style={{ color: '#00f0ff', marginBottom: '12px' }}>AI 助手</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
          这是一个聊天面板示例。您可以在这里与 AI 进行对话。
        </p>
      </div>
    ),
  },
  {
    id: 'tools',
    label: '工具',
    icon: '🔧',
    color: '#00ffcc',
    content: (
      <div style={{ padding: '20px', color: '#fff' }}>
        <h3 style={{ color: '#00ffcc', marginBottom: '12px' }}>工具列表</h3>
        <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>📊 数据分析</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>🔄 工作流编排</li>
          <li style={{ padding: '8px 0' }}>🤖 AI 模型管理</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'settings',
    label: '设置',
    icon: '⚙️',
    color: '#00d4ff',
    content: (
      <div style={{ padding: '20px', color: '#fff' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '12px' }}>系统设置</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
          配置您的系统参数和偏好设置。
        </p>
      </div>
    ),
  },
];

const defaultQuickActions = [
  { label: '新建', icon: '➕', color: '#00f0ff' },
  { label: '历史', icon: '📜', color: '#00d4ff' },
  { label: '帮助', icon: '❓', color: '#00ffcc' },
];

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
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    tabs: defaultTabs,
    defaultActiveTab: 'chat',
    title: 'YYC³',
    subtitle: '智能助手',
    showQuickActions: true,
    quickActions: defaultQuickActions,
  },
};

export const SingleTab: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    tabs: [
      {
        id: 'notification',
        label: '通知',
        icon: '🔔',
        color: '#00f0ff',
        content: (
          <div style={{ padding: '20px', color: '#fff' }}>
            <h3 style={{ color: '#00f0ff', marginBottom: '12px' }}>通知中心</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              暂无新通知
            </p>
          </div>
        ),
      },
    ],
    title: '通知中心',
    subtitle: '',
    showQuickActions: false,
  },
};

export const CustomTheme: Story = {
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
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    tabs: defaultTabs,
    defaultActiveTab: 'chat',
    title: 'AI',
    subtitle: 'Purple Theme',
    themeColor: '#cc00ff',
    showQuickActions: true,
    quickActions: [
      { label: '新建', icon: '➕', color: '#cc00ff' },
      { label: '设置', icon: '⚙️', color: '#9900ff' },
    ],
  },
};

export const SmallSize: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    tabs: defaultTabs.slice(0, 2),
    defaultActiveTab: 'chat',
    title: '迷你助手',
    subtitle: '',
    defaultWidth: 320,
    defaultHeight: 400,
    minWidth: 280,
    minHeight: 300,
    showQuickActions: false,
  },
};
