# @yyc3/ui

> React UI 组件库 — 60+ 组件 / shadcn/ui / Family 组件 / 主题系统

## 概览

`@yyc3/ui` 是基于 React 和 shadcn/ui 的 UI 组件库，提供 60+ 个高质量组件，包括 AI Family 专属组件（FamilyPanel、Avatar、StatusCard）和完整的主题系统。

## 安装

```bash
pnpm add @yyc3/ui react react-dom
```

## 核心组件

| 类别 | 组件 |
|------|------|
| **Family 组件** | FamilyPanel · Avatar · StatusCard · DutyRoster |
| **布局** | Layout · Sidebar · Header · Footer |
| **表单** | Input · Select · Checkbox · Radio · Switch |
| **数据展示** | Table · Card · Badge · Tag · Statistic |
| **反馈** | Modal · Toast · Progress · Skeleton |
| **导航** | Tabs · Breadcrumb · Pagination · Steps |

## 快速开始

```tsx
import { FamilyPanel, Avatar } from '@yyc3/ui';

function App() {
  return (
    <FamilyPanel>
      <Avatar name="Master" role="meta-oracle" status="active" />
    </FamilyPanel>
  );
}
```

## 测试覆盖

| 指标 | 值 |
|------|-----|
| 测试文件 | 2 |
| 测试用例 | 25 passed |
| TypeCheck | ✅ 0 errors |

## 相关链接

- [npm](https://www.npmjs.com/package/@yyc3/ui)
- [GitHub](https://github.com/YanYuCloudCube/Family-PAI/tree/main/packages/ui)
- [CHANGELOG](https://github.com/YanYuCloudCube/Family-PAI/blob/main/packages/ui/CHANGELOG.md)
