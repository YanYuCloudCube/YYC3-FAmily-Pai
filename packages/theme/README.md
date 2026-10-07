# @yyc3/theme

> YYC³ ThemeManager —— 多主题运行时管理
>
> 源自 YYC3-UI 资产库（YYC3-UI-MONO-v2/packages/theme），2026-10 移植为独立包。

## 特性

- **多主题注册**：预设 light/dark，支持自定义主题与继承合并（`extends`）
- **深浅模式**：light / dark / auto（自动跟随系统 `prefers-color-scheme`）
- **CSS 变量动态更新**：颜色/字体/间距/圆角/过渡全量映射 `--color-*`、`--font-*` 等
- **主题预览**：临时样式注入，超时自动恢复
- **偏好持久化**：localStorage 保存主题与模式
- **导入导出**：主题 JSON 双向
- **事件通知**：themeRegistered / themeChanged / modeChanged（eventemitter3）

## 使用

```ts
import { ThemeManager } from '@yyc3/theme'

const tm = new ThemeManager({ defaultMode: 'auto' })
tm.setMode('dark')
tm.customizeTheme('light', { id: 'brand', colors: { primary: '#ff0000' } })
tm.applyTheme('brand')

tm.on('themeChanged', ({ newTheme }) => console.log(newTheme.id))
```

## 说明

- 与 `@yyc3/ui/themes`（静态主题文件 + ThemeProvider）互补：本包提供**运行时管理器**
- 在 `@yyc3/ui` 中可通过子路径 `@yyc3/ui/theme-manager` 访问（转依赖再导出）
