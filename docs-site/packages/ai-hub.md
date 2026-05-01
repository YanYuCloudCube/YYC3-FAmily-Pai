# @yyc3/ai-hub

> AI 集成中心 — 八位家人 / Family Compass / 错误码体系 / 工作流

## 概览

`@yyc3/ai-hub` 是 AI Family 的集成中心，定义了八位拟人化 AI 家人的角色和能力，提供 Family Compass 值班调度、结构化错误码体系和任务工作流引擎。

## 安装

```bash
pnpm add @yyc3/ai-hub
```

## 核心模块

| 模块 | 说明 |
|------|------|
| **YYC3AIHub** | AI Hub 主入口，统一调度八位家人 |
| **FamilyCompass** | 值班调度系统，按时段自动轮换 |
| **YYC3Error** | 结构化错误体系，中英双语错误码 |
| **ErrorCode** | 分类错误码 (AUTH_1xxx / HUB_2xxx / MCP_3xxx ...) |
| **Personas** | 八位 AI 家人定义与能力矩阵 |

## 快速开始

```typescript
import { YYC3AIHub, getPersonaByHour } from '@yyc3/ai-hub';

const hub = new YYC3AIHub({ apiKey: process.env.OPENAI_API_KEY });
await hub.initialize();

const result = await hub.execute('帮我审查这段代码的安全性');

const onDuty = getPersonaByHour(new Date().getHours());
console.log(`当前值班: ${onDuty.name} (${onDuty.alias})`);
```

## 八位 AI 家人

| 角色 | 代号 | 职责 | 值班时段 |
|------|------|------|----------|
| 🎯 Master | 千行 | 总指挥 / 战略决策 | 全天候 |
| 🧭 Navigator | 引路 | 导航 / 路径规划 | 08:00-14:00 |
| 💡 Thinker | 万物 | 分析 / 推理 | 10:00-16:00 |
| ⚡ Bolero | 伯乐 | 推荐 / 匹配 | 09:00-15:00 |
| 🔬 Prophet | 先知 | 预测 / 趋势 | 14:00-20:00 |
| 🛡️ Sentinel | 守护 | 安全审计 | 16:00-22:00 |
| 🎨 Creative | 灵韵 | 创新 / 设计 | 18:00-00:00 |
| 📚 TianShu | 天枢 | 知识管理 | 00:00-06:00 |

## 错误码体系

```
AUTH_1xxx  — 认证相关错误
HUB_2xxx   — Hub 调度错误
MCP_3xxx   — MCP 协议错误
SKILL_4xxx — 技能系统错误
AGENT_5xxx — 智能体错误
```

## 测试覆盖

| 指标 | 值 |
|------|-----|
| 测试文件 | 8 |
| 测试用例 | 148 passed |
| TypeCheck | ✅ 0 errors |

## 相关链接

- [npm](https://www.npmjs.com/package/@yyc3/ai-hub)
- [GitHub](https://github.com/YanYuCloudCube/Family-PAI/tree/main/packages/ai-hub)
- [CHANGELOG](https://github.com/YanYuCloudCube/Family-PAI/blob/main/packages/ai-hub/CHANGELOG.md)
