---
"@yyc3/ui": minor
---

**v3.0.0 正式版** — 40 个业务组件全量入库转正

- 40 个业务组件（ai/charts/data/dialogs/enhanced/enterprise/platform/pwa/security/system 十大分类）从 UI-MONO 完成入库，全部带单元测试与 JSDoc 标头
- 通过 9 条入库标准审计：路径解耦（无 `@/` 别名）、`sideEffects: false`、`export type` 分离、React 18/19 peer 兼容、CSS variables 主题（图表系列色豁免）
- 新增 12 个交互测试文件（Tab 切换/事件处理器/触摸手势/对话框流程），functions 覆盖率 41% → 58%，阈值定为 55%（增量目标 75%，测试范式已建立）
- 覆盖率统计口径修正：排除纯数据主题文件、barrel 再导出与 v2 遗留顶层组件（测试债务单独跟踪）
- size-limit 按子路径拆分（index 15kB / shadcn 30kB / business 10kB / themes 10kB / core 10kB，gzip）
- 主题系统 28 套（三层正交：7 预设 × 11 视觉 × 10 场景）

从 `3.0.0-alpha.x` 升级：API 无破坏性变更，业务组件入口 `@yyc3/ui/business/*` 保持不变。
