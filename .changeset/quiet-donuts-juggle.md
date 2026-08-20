---
"@yyc3/cli": minor
---

**v1.3.0 — 20 套完整业务样板（T01-T20）注册进 CLI**

- 新增蓝图实体层 `templates/blueprints/`（T01-T20 + _shared，860K，随包分发，离线可用）
- `create-yyc3-app <name> --blueprint <T02|admin-dashboard>`：完整业务样板生成（复制蓝图 → package.json 定制 → components.json → 主题注入 → 依赖安装），支持 `--no-install`
- `yyc3 init -t <blueprint> -n <project>` 与空目录下 `yyc3 init <blueprint> [name]` 同样路由到样板管线；交互式 init 模板列表前置 20 套样板
- 新增 `yyc3 list` 聚合命令（`--templates/--blueprints/--themes/--json`），`search` 的 `list` 别名让位
- `yyc3 samples <name>` 详情展示蓝图编号/端口与生成命令
- 生成项目统一升级 `@yyc3/ui` 至 `^3.0.0`，自动写入 `components.json`（shadcn 协议）与 `yyc3.config.json`
- 新增 `scripts/verify-blueprints.mjs`：20 套全量冒烟 + P0 五套（T02/T03/T08/T09/T14）深度构建验证
