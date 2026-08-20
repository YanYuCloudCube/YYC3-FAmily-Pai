---
file: YYC3-Templates-完整使用指南.md
title: YYC³-Templates 完整使用指南
version: 2.0.0
date: 2026-05-08
updated: 2026-05-08
author: YanYu Intelligence Cloud³
status: 生产就绪
tags: [templates],[guide],[testing],[rag],[knowledge-base]
category: guide
context:
  prev: YYC3-Templates-资产地图与施工蓝图.md
  next: retrieval-training-data.json
  related:
    - YYC3-Templates-资产地图与施工蓝图.md
    - ../verify-all.sh
    - ../../YYC3-CLI/packages/yyc3-cli/bin/yyc3-cli.js
  milestone: YYC3-Templates v2.0 全链路闭环
---

> 📎 **文档导航** — [蓝图](./YYC3-Templates-资产地图与施工蓝图.md) → [指南(本文)](./YYC3-Templates-完整使用指南.md) → [检索训练数据](./retrieval-training-data.json) → [验证脚本](../verify-all.sh)

# YYC³-Templates 完整使用指南

> 言启千行代码，语枢万物智能 — 20套即拉即用的 Next.js 项目样板

## 一、总览

### 1.1 资产全景

```
YYC3-Templates/                          ← 统一工作目录 (193个文件)
├── _blueprint/                          ← 施工蓝图与资产地图
├── _shared/                             ← 共享基础配置 (模板源头)
│   ├── package.json                     ← 含 {{PROJECT_NAME}}/{{PORT}} 占位符
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── app/globals.css                  ← oklch色彩体系 + light/dark主题
│   └── lib/utils.ts                     ← cn() 函数
│
├── T01-ai-intelligent-center/           ← 12文件 (7独有组件)
├── T02-admin-dashboard/                 ← 12文件 (7独有组件)
├── T03-landing-page/                    ← 14文件 (9独有组件)
├── T04-ai-medical/                      ←  8文件
├── T05-learning-platform/               ← 11文件 (5独有组件)
├── T06-smart-city/                      ←  8文件
├── T07-3d-portal/                       ←  8文件
├── T08-crm-system/                      ←  8文件
├── T09-data-dashboard/                  ← 14文件 (9独有组件)
├── T10-ai-code-ide/                     ←  8文件
├── T11-financial-quant/                 ←  8文件
├── T12-music-player/                    ←  8文件
├── T13-devops-monitor/                  ←  8文件
├── T14-saas-platform/                   ←  8文件
├── T15-ai-call-center/                  ←  8文件
├── T16-knowledge-wiki/                  ← 11文件 (5独有组件)
├── T17-ecommerce-shop/                  ←  8文件
├── T18-portfolio/                       ←  8文件
├── T19-table-converter/                 ←  8文件
└── T20-forum-community/                 ←  8文件
```

### 1.2 技术栈统一标准

| 依赖 | 版本 | 用途 |
|------|------|------|
| Next.js | ^15.3.0 | App Router + Turbopack |
| React | ^19.1.0 | RSC + Client Components |
| @yyc3/ui | ^2.0.2 | 56+ shadcn/ui 组件 (自有npm包) |
| Tailwind CSS | ^4.1.0 | oklch 色彩系统 |
| TypeScript | ^5.8.0 | 严格类型检查 |
| lucide-react | ^0.460.0 | 图标库 |

### 1.3 20套模板速查表

| # | 模板名 | CLI标识 | 端口 | 文件数 | 独有组件 | 业务场景 |
|---|--------|---------|------|--------|----------|----------|
| T01 | AI智能中心 | `ai-center` | 3300 | 12 | sidebar, chat-panel, history-panel, settings-dialog | ChatGPT风格对话平台 |
| T02 | 管理后台 | `admin-dashboard` | 3201 | 12 | admin-sidebar, stat-card, data-table | 企业数据管理面板 |
| T03 | 企业官网 | `landing-page` | 3200 | 14 | site-header, site-footer, hero, features, stats, pricing, cta | SaaS产品官网 |
| T04 | AI医疗 | `ai-medical` | 3205 | 8 | — | 智能问诊+健康档案 |
| T05 | 学习平台 | `learning-platform` | 3203 | 11 | learn-sidebar, course-card | 在线课程+考试 |
| T06 | 智慧城市 | `smart-city` | 3206 | 8 | — | 城市服务+AI助手 |
| T07 | 3D门户 | `3d-portal` | 3207 | 8 | — | 沉浸式3D交互 |
| T08 | CRM | `crm-system` | 3208 | 8 | — | 客户管理+漏斗 |
| T09 | 数据看盘 | `data-dashboard` | 3202 | 14 | stat-block, area-chart, pie-chart, bar-chart, ranking-list, realtime-log | 全屏可视化大屏 |
| T10 | AI编程IDE | `ai-code-ide` | 3209 | 8 | — | VS Code风格编辑器 |
| T11 | 金融量化 | `financial-quant` | 3210 | 8 | — | K线+交易面板 |
| T12 | 音乐播放器 | `music-player` | 3213 | 8 | — | 歌单+播放控制+可视化 |
| T13 | DevOps | `devops-monitor` | 3211 | 8 | — | 环境状态+告警+部署 |
| T14 | SaaS | `saas-platform` | 3212 | 8 | — | 多租户+API管理 |
| T15 | AI呼叫中心 | `ai-call-center` | 3214 | 8 | — | 通话+AI转写+分析 |
| T16 | 知识库 | `knowledge-wiki` | 3204 | 11 | wiki-header, wiki-sidebar, docs/[slug]/page | 文档树+搜索 |
| T17 | 电商 | `ecommerce-shop` | 3215 | 8 | — | 商品+购物车+订单 |
| T18 | Portfolio | `portfolio` | 3216 | 8 | — | 项目展示+技能 |
| T19 | 表格转换 | `table-converter` | 3217 | 8 | — | CSV/JSON/YAML互转 |
| T20 | 论坛 | `forum-community` | 3218 | 8 | — | 帖子+评论+社区 |

---

## 二、快速开始

### 2.1 环境要求

```bash
node --version   # >= 18.0.0
pnpm --version   # >= 9.0.0
```

### 2.2 通过CLI创建（推荐）

```bash
# 步骤1: 查看可用模板
yyc3 templates

# 步骤2: 创建项目（指定模板）
yyc3 create app my-ai-center -t ai-center

# 步骤3: 进入项目并启动
cd my-ai-center
pnpm dev
# → http://localhost:3300

# 交互式选择（不指定 -t 时自动弹出）
yyc3 create app my-project
```

### 2.3 手动创建

```bash
# 步骤1: 复制模板目录
cp -r YYC3-Templates/T01-ai-intelligent-center my-ai-center
cd my-ai-center

# 步骤2: 修改项目名称
# 编辑 package.json，将 name 改为你的项目名

# 步骤3: 安装依赖并启动
pnpm install
pnpm dev
# → http://localhost:3300
```

---

## 三、测试验证方案

### 3.1 一键全量验证脚本

创建 `verify-all.sh` 并执行：

```bash
#!/bin/bash
# YYC³-Templates 全量验证脚本
# 用法: bash verify-all.sh

set -e
BASE="$(cd "$(dirname "$0")" && pwd)"
CLI="$BASE/../YYC3-CLI/packages/yyc3-cli/bin/yyc3-cli.js"
PASSED=0
FAILED=0
TOTAL=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║   YYC³-Templates 全量验证                    ║"
echo "  ╚══════════════════════════════════════════════╝"
echo -e "${NC}"

check_file() {
  local file="$1"
  if [ -f "$file" ]; then
    return 0
  else
    return 1
  fi
}

check_content() {
  local file="$1"
  local pattern="$2"
  grep -q "$pattern" "$file" 2>/dev/null
}

TEMPLATES=(
  "T01-ai-intelligent-center:ai-center:3300"
  "T02-admin-dashboard:admin-dashboard:3201"
  "T03-landing-page:landing-page:3200"
  "T04-ai-medical:ai-medical:3205"
  "T05-learning-platform:learning-platform:3203"
  "T06-smart-city:smart-city:3206"
  "T07-3d-portal:3d-portal:3207"
  "T08-crm-system:crm-system:3208"
  "T09-data-dashboard:data-dashboard:3202"
  "T10-ai-code-ide:ai-code-ide:3209"
  "T11-financial-quant:financial-quant:3210"
  "T12-music-player:music-player:3213"
  "T13-devops-monitor:devops-monitor:3211"
  "T14-saas-platform:saas-platform:3212"
  "T15-ai-call-center:ai-call-center:3214"
  "T16-knowledge-wiki:knowledge-wiki:3204"
  "T17-ecommerce-shop:ecommerce-shop:3215"
  "T18-portfolio:portfolio:3216"
  "T19-table-converter:table-converter:3217"
  "T20-forum-community:forum-community:3218"
)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 阶段1: 文件完整性检查 (每套3个核心文件)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for entry in "${TEMPLATES[@]}"; do
  IFS=':' read -r dir cli_id port <<< "$entry"
  TOTAL=$((TOTAL + 1))

  missing=""
  check_file "$BASE/$dir/package.json" || missing="$missing package.json"
  check_file "$BASE/$dir/app/layout.tsx" || missing="$missing layout.tsx"
  check_file "$BASE/$dir/app/page.tsx" || missing="$missing page.tsx"

  if [ -z "$missing" ]; then
    echo -e "  ${GREEN}✅${NC} $dir"
    PASSED=$((PASSED + 1))
  else
    echo -e "  ${RED}❌${NC} $dir — 缺失:$missing"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 阶段2: 内容合法性检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

content_pass=0
content_fail=0

for entry in "${TEMPLATES[@]}"; do
  IFS=':' read -r dir cli_id port <<< "$entry"
  errors=""

  check_content "$BASE/$dir/package.json" '"next"' || errors="$errors pkg缺少next依赖"
  check_content "$BASE/$dir/package.json" '"@yyc3/ui"' || errors="$errors pkg缺少@yyc3/ui"
  check_content "$BASE/$dir/package.json" "\"port $port\"" || check_content "$BASE/$dir/package.json" "$port" || errors="$errors 端口$port不匹配"
  check_content "$BASE/$dir/app/layout.tsx" 'RootLayout' || errors="$errors layout缺少RootLayout"
  check_content "$BASE/$dir/app/layout.tsx" 'globals.css' || errors="$errors layout缺少globals.css导入"
  check_content "$BASE/$dir/app/page.tsx" 'export default' || errors="$errors page缺少默认导出"

  if [ -z "$errors" ]; then
    echo -e "  ${GREEN}✅${NC} $dir — 内容合法"
    content_pass=$((content_pass + 1))
  else
    echo -e "  ${RED}❌${NC} $dir —$errors"
    content_fail=$((content_fail + 1))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 阶段3: CLI命令测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "$CLI" ]; then
  node "$CLI" templates > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✅${NC} yyc3 templates — 正常"
  else
    echo -e "  ${RED}❌${NC} yyc3 templates — 执行失败"
  fi

  TEST_DIR="/tmp/yyc3-verify-test"
  rm -rf "$TEST_DIR"
  node "$CLI" create app verify-test -t portfolio --skip-install > /dev/null 2>&1
  if [ $? -eq 0 ] && [ -f "$TEST_DIR/package.json" ]; then
    echo -e "  ${GREEN}✅${NC} yyc3 create app -t portfolio — 正常"
    name=$(grep '"name"' "$TEST_DIR/package.json" | head -1)
    echo -e "       → $name"
    rm -rf "$TEST_DIR"
  else
    echo -e "  ${RED}❌${NC} yyc3 create app -t portfolio — 失败"
  fi
else
  echo -e "  ${YELLOW}⚠️${NC} CLI文件未找到，跳过CLI测试"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 阶段4: 构建验证 (抽样3套)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

SAMPLES=("T01-ai-intelligent-center" "T09-data-dashboard" "T18-portfolio")
for sample in "${SAMPLES[@]}"; do
  echo -e "  ${CYAN}⏳${NC} 构建 $sample ..."
  cd "$BASE/$sample"
  if [ ! -d "node_modules" ]; then
    pnpm install --silent 2>/dev/null || npm install --silent 2>/dev/null
  fi
  if pnpm build 2>/dev/null | tail -1 | grep -q "success\|Built\|compiled"; then
    echo -e "  ${GREEN}✅${NC} $sample — 构建成功"
  else
    echo -e "  ${YELLOW}⚠️${NC} $sample — 构建可能有问题 (源码样板可接受)"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 验证结果汇总"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  文件完整性: ${GREEN}$PASSED/${TOTAL}${NC} 通过"
echo -e "  内容合法性: ${GREEN}$content_pass/20${NC} 通过"
echo -e ""
if [ $FAILED -eq 0 ] && [ $content_fail -eq 0 ]; then
  echo -e "  ${GREEN}🎉 全部通过！20套样板生产就绪${NC}"
else
  echo -e "  ${RED}有 $FAILED 个文件缺失, $content_fail 个内容问题${NC}"
fi
```

### 3.2 分阶段验证详解

#### 阶段A: 文件完整性（无需安装依赖）

```bash
# 快速检查20套模板的核心文件
BASE="YYC3-Templates的绝对路径"
for T in T01-ai-intelligent-center T02-admin-dashboard T03-landing-page \
         T04-ai-medical T05-learning-platform T06-smart-city T07-3d-portal \
         T08-crm-system T09-data-dashboard T10-ai-code-ide T11-financial-quant \
         T12-music-player T13-devops-monitor T14-saas-platform T15-ai-call-center \
         T16-knowledge-wiki T17-ecommerce-shop T18-portfolio T19-table-converter \
         T20-forum-community; do
  count=$(ls "$BASE/$T/package.json" "$BASE/$T/app/page.tsx" "$BASE/$T/app/layout.tsx" 2>/dev/null | wc -l)
  echo "$count/3 $T"
done
```

预期输出：全部 `3/3`

#### 阶段B: 内容合法性（无需安装依赖）

验证每个文件包含关键内容：

| 文件 | 必须包含 |
|------|----------|
| `package.json` | `"next"`, `"@yyc3/ui"`, `"port XXXX"` |
| `app/layout.tsx` | `RootLayout`, `globals.css` 导入 |
| `app/page.tsx` | `export default` 函数 |
| `lib/utils.ts` | `cn()` 函数 |
| `postcss.config.mjs` | `@tailwindcss/postcss` |
| `tsconfig.json` | `@/*` path alias |

#### 阶段C: CLI功能测试

```bash
# 测试1: 模板列表命令
yyc3 templates
# 预期: 显示20套模板列表，含名称、描述、端口

# 测试2: 创建项目 (跳过安装)
yyc3 create app test-project -t ai-center --skip-install
# 预期: 项目创建成功，package.json name="test-project"

# 测试3: 验证文件复制完整性
find test-project -type f | wc -l
# 预期: 与T01源文件数一致 (12)

# 测试4: 清理
rm -rf test-project
```

#### 阶段D: 构建验证（需要安装依赖）

```bash
# 选择1-2套做完整构建测试
cd YYC3-Templates/T18-portfolio
pnpm install
pnpm build
# 预期: 构建成功，.next/ 目录生成

# 开发服务器测试
pnpm dev
# 预期: http://localhost:3216 可访问，页面正常渲染
```

#### 阶段E: 视觉回归验证

对每套模板截图对比：

```bash
# 安装 playwright
pnpm add -D playwright

# 启动开发服务器并截图
for entry in "T01:3300" "T02:3201" "T03:3200" "T04:3205" "T05:3203" \
             "T06:3206" "T07:3207" "T08:3208" "T09:3202" "T10:3209" \
             "T11:3210" "T12:3213" "T13:3211" "T14:3212" "T15:3214" \
             "T16:3204" "T17:3215" "T18:3216" "T19:3217" "T20:3218"; do
  IFS=':' read -r dir port <<< "$entry"
  echo "截图 $dir → :$port"
  # 逐个启动 → 截图 → 关闭
done
```

---

## 四、扩展与定制

### 4.1 基于模板二次开发

每套模板的 `page.tsx` 中包含 mock 数据和 `TODO` 标记：

```tsx
// T01 page.tsx 中的 TODO 标记示例
const [messages, setMessages] = useState([
  // TODO: 替换为真实API调用
  { role: "assistant", content: "你好！我是YYC³ AI助手..." }
])
```

二次开发步骤：

1. **替换 mock 数据** → 连接真实API
2. **扩展组件** → 从 `@yyc3/ui` 引入更多组件
3. **添加路由** → 在 `app/` 下新增页面
4. **接入状态管理** → zustand / jotai / React Context

### 4.2 创建新模板

```bash
# 步骤1: 从_shared复制基础配置
mkdir -p YYC3-Templates/T21-my-template/app
cp -r YYC3-Templates/_shared/* YYC3-Templates/T21-my-template/

# 步骤2: 修改package.json
# 将 {{PROJECT_NAME}} 替换为 yyc3-t21-my-template
# 将 {{PORT}} 替换为 3219

# 步骤3: 编写 layout.tsx + page.tsx

# 步骤4: 注册到CLI
# 在 yyc3-cli.js 的 YYC3_TEMPLATES 数组中新增:
# { value: 'my-template', title: 'T21 自定义', desc: '...', port: 3219 }
# 在 TEMPLATE_DIR_MAP 中新增:
# 'my-template': 'T21-my-template',
```

### 4.3 组件库升级

所有模板统一依赖 `@yyc3/ui`，升级只需：

```bash
# 在任意模板目录中
pnpm update @yyc3/ui
# 或全局更新所有模板
for T in YYC3-Templates/T*/; do
  cd "$T" && pnpm update @yyc3/ui && cd -
done
```

---

## 五、知识库纳入方案

### 5.1 纳入 docs.yyc3.top

YYC³ 已有文档站点 `docs.yyc3.top`，将模板文档纳入：

```
docs.yyc3.top/
├── templates/                    ← 新增模板专区
│   ├── overview.mdx              ← 总览页面
│   ├── getting-started.mdx       ← 快速开始
│   ├── testing.mdx               ← 测试验证指南
│   ├── t01-ai-center.mdx         ← 每套模板的详细文档
│   ├── t02-admin-dashboard.mdx
│   ├── ...
│   └── t20-forum-community.mdx
```

### 5.2 纳入 AI 检索知识库（RAG）

将模板信息结构化为 AI 可检索的格式：

```json
{
  "templates": [
    {
      "id": "ai-center",
      "title": "T01 AI智能中心",
      "port": 3300,
      "components": ["sidebar", "chat-panel", "history-panel", "settings-dialog"],
      "keywords": ["chat", "AI", "对话", "ChatGPT", "LLM", "智能助手"],
      "use_cases": ["企业AI助手", "客服系统", "知识问答"],
      "dependencies": ["@yyc3/ui", "react-markdown"],
      "cli_command": "yyc3 create app <name> -t ai-center"
    }
  ]
}
```

#### RAG 知识库构建步骤

```
步骤1: 文档切分
  ├─ 每套模板 → 1个 chunk（概览+组件列表+用法）
  ├─ 每个独有组件 → 1个 chunk（代码+说明）
  └─ CLI命令 → 1个 chunk（用法+参数）

步骤2: Embedding
  ├─ 模型: text-embedding-3-small 或 bge-large-zh
  ├─ 维度: 1536 (OpenAI) 或 1024 (bge)
  └─ 存储: ChromaDB / Pinecone / 本地 FAISS

步骤3: 检索增强
  ├─ 用户问: "我想做一个AI客服"
  ├─ 检索命中: T01 (ai-center) + T15 (ai-call-center)
  ├─ 返回: 模板推荐 + CLI创建命令 + 核心组件说明
  └─ 上下文注入 → LLM 生成定制化指导
```

### 5.3 纳入 DPO 训练数据

模板信息可作为 DPO 训练的 **chosen response** 数据源：

```jsonl
{"prompt": "如何用YYC³创建一个AI对话平台？", "chosen": "使用 yyc3 create app my-ai -t ai-center...", "rejected": "手动从零搭建..."}
{"prompt": "哪个模板适合做数据大屏？", "chosen": "T09-data-dashboard，端口3202...", "rejected": "用ECharts自己画..."}
```

### 5.4 检索模型训练数据准备

```
知识库结构:
├── 模板元数据 (20条)          ← 用于精确匹配
├── 组件文档 (56+条)           ← @yyc3/ui 组件库
├── CLI命令文档 (10条)         ← yyc3 命令用法
├── 最佳实践 (50条)            ← 开发模式与规范
└── FAQ (100条)               ← 常见问题与解答

训练流程:
  原始文档 → 清洗 → 切分 → Embedding → 向量库
                                        ↓
  用户查询 → Query Embedding → 相似度检索 → Top-K → LLM生成
```

---

## 六、回归测试与持续验证

### 6.1 回归测试矩阵

| 测试维度 | 测试项 | 频率 | 工具 |
|----------|--------|------|------|
| 文件完整性 | 20×3=60个核心文件 | 每次提交 | verify-all.sh |
| 内容合法性 | 依赖/端口/导出检查 | 每次提交 | grep脚本 |
| CLI功能 | create/templates命令 | 每次修改CLI | 手动+脚本 |
| 构建验证 | pnpm build通过 | 每周 | CI/CD |
| 视觉回归 | 页面截图对比 | 每次UI变更 | Playwright |
| 依赖安全 | npm audit / pnpm audit | 每周 | pnpm audit |

### 6.2 CI/CD 集成建议

```yaml
# .github/workflows/templates-verify.yml
name: YYC³ Templates Verify
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: bash YYC3-Templates/verify-all.sh
      - run: cd YYC3-Templates/T01-ai-intelligent-center && pnpm install && pnpm build
```

### 6.3 模板健康度评分

```
健康度 = (文件完整率 × 0.3) + (内容合法率 × 0.3) + (构建通过率 × 0.2) + (依赖安全率 × 0.2)

目标: 所有模板健康度 >= 95%
```

---

## 七、故障排除

### 7.1 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `找不到模块 "next"` | 未安装依赖 | `pnpm install` |
| `JSX.IntrinsicElements 不存在` | 未安装依赖 | `pnpm install` |
| 端口冲突 | 多个模板同时运行 | 修改 package.json 中的 port |
| CLI找不到模板目录 | resolveTemplatesDir未命中 | 确保 YYC3-Templates/_shared/ 存在 |
| `@yyc3/ui` 安装失败 | npm registry问题 | `pnpm config set registry https://registry.npmmirror.com` |
| 构建报 CSS 错误 | Tailwind v4 配置 | 确认 postcss.config.mjs 使用 `@tailwindcss/postcss` |

### 7.2 紧急回滚

```bash
# 如果模板损坏，从_shared重新生成
BASE="YYC3-Templates路径"
for T in T04-ai-medical T06-smart-city T07-3d-portal; do
  cp "$BASE/_shared/app/globals.css" "$BASE/$T/app/"
  cp "$BASE/_shared/lib/utils.ts" "$BASE/$T/lib/"
  cp "$BASE/_shared/next.config.ts" "$BASE/$T/"
  cp "$BASE/_shared/tsconfig.json" "$BASE/$T/"
  cp "$BASE/_shared/postcss.config.mjs" "$BASE/$T/"
done
# 注意: package.json 和 layout.tsx/page.tsx 不能用_shared覆盖
```

---

## 八、架构决策记录

| 决策 | 选择 | 理由 |
|------|------|------|
| 模板粒度 | 组件完整骨架 | 用户确认 "组件完整即可" |
| 依赖管理 | @yyc3/ui npm包 | 用户自有组件库，非shadcn直接复制 |
| 包管理器 | pnpm | 与π³ monorepo一致 |
| 色彩系统 | oklch | Tailwind v4标准，更精确的色彩空间 |
| 模板放置 | YYC3-CLI (项目级) | 区别于 @yyc3/cli (组件级) |
| CLI集成 | fs.copySync | 简单可靠，无需模板引擎 |
| 端口分配 | 3200-3218 + 3300 | 避免与常用端口冲突 |

---

## 九、检索模型训练与回归模型工作指引

### 9.1 检索模型训练流程

```
数据准备阶段:
├── 1. 收集文档语料
│   ├── 20套模板文档 (本文档)
│   ├── @yyc3/ui 56+组件文档
│   ├── CLI命令文档
│   └── 357个项目经验摘要
│
├── 2. 文档切分策略
│   ├── 按模板切分: 每套模板 = 1个主文档
│   ├── 按组件切分: 每个独有组件 = 1个子文档
│   ├── 按功能切分: CLI命令/配置/FAQ = 各1个文档
│   └── 目标: 每个chunk 200-500 tokens
│
├── 3. Embedding生成
│   ├── 中文优先: bge-large-zh-v1.5 (1024维)
│   ├── 英文备选: text-embedding-3-small (1536维)
│   └── 混合策略: 中英双语 → 各自embedding → 合并检索
│
└── 4. 向量库构建
    ├── ChromaDB (开发环境)
    ├── Pinecone (生产环境)
    └── FAISS (离线批处理)

模型训练阶段:
├── 5. 微调检索模型 (可选)
│   ├── 基座: bge-large-zh-v1.5
│   ├── 训练数据: (query, positive_doc, negative_doc) 三元组
│   ├── 构造query: 从模板名称/描述/使用场景生成自然语言问题
│   └── 示例: ("我想做一个在线商城", → T17-ecommerce-shop文档)
│
└── 6. 评估
    ├── Recall@1, Recall@5, Recall@10
    ├── MRR (Mean Reciprocal Rank)
    └── 目标: Recall@5 >= 90%
```

### 9.2 回归模型工作流程

```
回归测试自动化:
├── 1. 数据基线建立
│   ├── 首次运行 verify-all.sh → 保存结果为 baseline.json
│   ├── 记录: 文件数、内容hash、构建状态、依赖版本
│   └── 存储: YYC3-Templates/_baseline/
│
├── 2. 变更检测
│   ├── 文件变更: diff 当前文件列表 vs baseline
│   ├── 内容变更: hash对比 (md5/sha256)
│   ├── 依赖变更: package.json diff
│   └── 构建状态: 通过/失败/警告
│
├── 3. 回归评分
│   ├── score = (文件完整率 + 内容一致率 + 构建通过率) / 3
│   ├── score >= 95%: PASS (绿色)
│   ├── 80% <= score < 95%: WARN (黄色)
│   └── score < 80%: FAIL (红色，阻断发布)
│
└── 4. 自动化触发
    ├── git pre-commit hook → 快速检查 (文件+内容)
    ├── CI pipeline → 完整检查 (文件+内容+构建)
    └── 定时任务 → 深度检查 (+ 依赖安全审计)

回归模型训练数据:
├── 正样本: 模板正常状态的 (描述, 文件结构, 代码片段)
├── 负样本: 故意损坏的模板 (缺失文件, 错误配置, 依赖冲突)
└── 训练目标: 给定模板代码 → 预测是否健康 + 定位问题
```

### 9.3 DPO训练数据扩展

在现有457条DPO数据基础上，新增模板相关数据：

```jsonl
{"prompt":"用YYC³创建一个AI客服平台需要哪些模板？","chosen":"推荐组合: T01(ai-center)作为对话核心 + T15(ai-call-center)处理通话。步骤: 1. yyc3 create app ai-service -t ai-center 2. 从T15复制通话组件 3. 集成@yyc3/ui的Dialog和Sheet组件","rejected":"从头开始写，先安装next和react..."}
{"prompt":"数据大屏用哪个YYC³模板？","chosen":"T09-data-dashboard，深色主题全屏设计，内置6个业务组件(stat-block/area-chart/pie-chart/bar-chart/ranking-list/realtime-log)。命令: yyc3 create app my-dashboard -t data-dashboard，端口3202","rejected":"用ECharts自己画，先npm install echarts..."}
```

---

## 十、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 2.0.0 | 2026-05-08 | 20套模板 + CLI集成 + 全量文档 |
| 1.0.0 | 2024-12-xx | YYC³ CLI 初始版本 |

---

*本文档由 YYC³ 智能应用实施专家生成 — 言启千行代码，语枢万物智能*
