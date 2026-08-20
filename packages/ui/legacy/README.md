# @yyc3/ui legacy 组件归档

> 归档日期：2026-08-19 | 状态：**未发布的死代码，非包产物一部分**

## 为什么归档

这 31 个 v2 期顶层组件（AdvancedSearch、DataTable、MonacoEditor、Navbar、VirtualList 等）在 v3 架构下：

1. **未被任何入口导出** — `src/components/index.ts` 仅导出 `button/card/input/modal/layout + business/*`，tsup 不打包本目录
2. **零生产引用** — 全源码扫描无任何内部引用（仅相互引用，如 AdvancedSearch → DateRangePicker）
3. **依赖图不完整，从未能整体编译** — 引用了 6 个不存在于 src 的目标：
   `@/components/ui/enhanced-card`、`@/components/ui/enhanced-button`、`@/components/ui/loading`、`@/components/ui/language-switcher`、`@/lib/error-handler`、`@/contexts/locale-context`
4. **多数仍用 `@/` 别名** — 违反入库标准第 1 条（路径解耦）

它们的功能位已由 `src/components/business/*`（40 个入库组件，全测试覆盖）承接。

> 因此本目录为**冷归档**（cold storage）：无冒烟测试、不参与构建/覆盖率/lint。
> 这不是损失——这些文件在归档前同样不在任何构建产物中。

## 如何复活

若需重新启用某组件：

1. 移回 `src/components/`（或 business 分类目录）
2. 修复 `@/` 别名 → 相对路径；补齐/替换上列 6 个缺失依赖（如 enhanced-card → card）
3. 补 Vitest 测试（渲染 + 交互，参照 `src/components/business/**/*.interaction.test.tsx` 范式）
4. 在 `src/components/index.ts` 或对应子路径入口导出
5. 移除 `vitest.config.ts` 中 `legacy/**` 的覆盖率排除项

## 清单（31 件）

AdvancedSearch, BentoGrid, BrandBadge, BrandButton, BrandCard, BrandLogo, ConfirmDialog, DataCard, DataImportExport, DataTable, DatePicker, DateRangePicker, EducationBackground, EmojiPopover, ErrorBoundary, Footer, LanguageSwitcher, Loading, LoadingSpinner, Logo3d, MarkdownPreview, MedicalButton, MedicalCard, MonacoEditor, Navbar, NotificationToast, ResponsiveLayout, SkeletonLoader, Tree, VirtualList, VirtualScroll
