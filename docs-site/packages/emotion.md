# @yyc3/emotion

> 情感引擎 — 多模态融合 / 音乐桥接 / 事件总线

## 概览

`@yyc3/emotion` 是 AI Family 的情感引擎，提供多模态情感融合、音乐情绪桥接和情感事件总线，让 AI 家人能够感知和表达情感。

## 安装

```bash
pnpm add @yyc3/emotion
```

## 核心模块

| 模块 | 说明 |
|------|------|
| **EmotionEngine** | 情感引擎核心，情感状态管理 |
| **MusicBridge** | 音乐情绪桥接，通过音乐感知情感 |
| **EmotionEventBus** | 情感事件总线，跨组件情感传播 |
| **EmotionFusion** | 多模态情感融合算法 |

## 快速开始

```typescript
import { EmotionEngine } from '@yyc3/emotion';

const engine = new EmotionEngine();
engine.on('emotion:change', (state) => {
  console.log('情感状态变化:', state);
});

await engine.analyze({ text: '今天心情不错', modality: 'text' });
```

## 测试覆盖

| 指标 | 值 |
|------|-----|
| TypeCheck | ✅ 0 errors |

## 相关链接

- [npm](https://www.npmjs.com/package/@yyc3/emotion)
- [GitHub](https://github.com/YanYuCloudCube/Family-PAI/tree/main/packages/emotion)
