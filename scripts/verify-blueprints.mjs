#!/usr/bin/env node
/**
 * file verify-blueprints.mjs
 * description 样板体系端到端验证 — 20 套全量冒烟 + P0 五套深度构建
 * module scripts
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-08-19
 * status active
 *
 * brief 前置：pnpm --filter @yyc3/cli build
 *   node scripts/verify-blueprints.mjs              # 20 套冒烟（真实 CLI 生成，不安装）
 *   node scripts/verify-blueprints.mjs --deep       # 追加 5 套 P0 样板 pnpm install + next build
 *   node scripts/verify-blueprints.mjs --deep --only T02,T09   # 只深度验证指定样板
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "..")
const CLI_DIST = path.join(REPO_ROOT, "packages", "cli", "dist")

const P0_BLUEPRINTS = ["T02", "T03", "T08", "T09", "T14"]

const args = process.argv.slice(2)
const deep = args.includes("--deep")
const onlyIndex = args.indexOf("--only")
const onlyArg = onlyIndex >= 0 ? args[onlyIndex + 1] : undefined
const deepTargets = onlyArg ? onlyArg.split(",").map((s) => s.trim()) : P0_BLUEPRINTS

const GREEN = "\x1b[0;32m"
const RED = "\x1b[0;31m"
const CYAN = "\x1b[0;36m"
const NC = "\x1b[0m"

let passed = 0
let failed = 0
const failures = []

function log(msg) { console.log(msg) }
function ok(msg) { console.log(`${GREEN}  ✓${NC} ${msg}`) }
function bad(msg) { console.log(`${RED}  ✗ ${msg}${NC}`) }

function run(cmd, args, opts = {}) {
  // pnpm install 输出量大，需放大缓冲（默认 1MB 会溢出误报失败）
  return execFileSync(cmd, args, {
    encoding: 'utf8',
    stdio: 'pipe',
    maxBuffer: 64 * 1024 * 1024,
    ...opts,
  })
}

// ---------------------------------------------------------------------------
// 前置检查
// ---------------------------------------------------------------------------
if (!fs.existsSync(path.join(CLI_DIST, "create-app.js"))) {
  log(`${RED}CLI 未构建，请先执行: pnpm --filter @yyc3/cli build${NC}`)
  process.exit(1)
}

log("")
log(`${CYAN}╔══════════════════════════════════════════════════╗`)
log(`║   YYC³ 样板验证 (blueprints verify)              ║`)
log(`╚══════════════════════════════════════════════════╝${NC}`)
log("")

// ---------------------------------------------------------------------------
// 从真实 CLI 获取样板清单
// ---------------------------------------------------------------------------
const listJson = JSON.parse(
  run("node", [path.join(CLI_DIST, "bin.js"), "list", "--blueprints", "--json"])
)
const blueprints = listJson.blueprints ?? []

if (blueprints.length !== 20) {
  bad(`样板清单应为 20 套，实际 ${blueprints.length}`)
  process.exit(1)
}
ok(`CLI list 返回 ${blueprints.length} 套样板`)

const missingEntities = blueprints.filter((b) => !b.available)
if (missingEntities.length > 0) {
  for (const b of missingEntities) bad(`${b.id} ${b.name} 实体缺失`)
  failed += missingEntities.length
} else {
  ok("20 套蓝图实体目录全部就位")
}

// ---------------------------------------------------------------------------
// 冒烟：全部 20 套真实生成（--no-install）
// ---------------------------------------------------------------------------
log("")
log(`${CYAN}[1/2] 冒烟测试 — 20 套样板生成${NC}`)

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "yyc3-verify-"))

for (const bp of blueprints) {
  const projectName = `smoke-${bp.name}`
  const targetDir = path.join(tmpRoot, projectName)
  try {
    run("node", [
      path.join(CLI_DIST, "create-app.js"),
      projectName,
      "--blueprint",
      bp.id,
      "--no-install",
    ], { cwd: tmpRoot })

    // 断言生成结构
    const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, "package.json"), "utf8"))
    assert(pkg.name === projectName, `package.json.name 应为 ${projectName}`)
    assert(pkg.dependencies?.["@yyc3/ui"] === "^3.0.0", "@yyc3/ui 应为 ^3.0.0")
    assert(fs.existsSync(path.join(targetDir, "components.json")), "components.json 缺失")
    assert(fs.existsSync(path.join(targetDir, "app", "layout.tsx")), "app/layout.tsx 缺失")
    assert(fs.existsSync(path.join(targetDir, "README.md")), "README.md 缺失")
    const yyc3 = JSON.parse(fs.readFileSync(path.join(targetDir, "yyc3.config.json"), "utf8"))
    assert(yyc3.blueprintId === bp.id, "yyc3.config.json.blueprintId 不一致")

    ok(`${bp.id} ${bp.name.padEnd(24)} 生成成功 (端口 ${bp.port})`)
    passed++
  } catch (error) {
    bad(`${bp.id} ${bp.name} 生成失败: ${error.message.split("\n")[0]}`)
    failures.push(`${bp.id} ${bp.name}: ${error.message.split("\n")[0]}`)
    failed++
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

// ---------------------------------------------------------------------------
// 深度：P0 五套 install + next build
// ---------------------------------------------------------------------------
if (deep) {
  log("")
  log(`${CYAN}[2/2] 深度验证 — ${deepTargets.join(", ")} 安装并构建${NC}`)

  for (const id of deepTargets) {
    const bp = blueprints.find((b) => b.id === id || b.name === id)
    if (!bp) {
      bad(`未知样板: ${id}`)
      failed++
      continue
    }

    const projectName = `deep-${bp.name}`
    const targetDir = path.join(tmpRoot, projectName)
    try {
      run("node", [
        path.join(CLI_DIST, "create-app.js"),
        projectName,
        "--blueprint",
        bp.id,
        "--no-install",
      ], { cwd: tmpRoot, stdio: "pipe", timeout: 10 * 60 * 1000 })

      // @yyc3/ui ^3.0.0 尚未发布 → 深度验证临时映射到本地发布候选（file: 协议）
      const pkgJsonPath = path.join(targetDir, "package.json")
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"))
      pkg.dependencies["@yyc3/ui"] = `file:${path.join(REPO_ROOT, "packages", "ui")}`
      fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2))

      run("pnpm", ["install", "--no-frozen-lockfile"], {
        cwd: targetDir,
        stdio: 'pipe',
        timeout: 20 * 60 * 1000,
      })

      run("pnpm", ["build"], {
        cwd: targetDir,
        stdio: "pipe",
        timeout: 10 * 60 * 1000,
      })

      ok(`${bp.id} ${bp.name.padEnd(24)} next build 通过`)
      passed++
    } catch (error) {
      const firstLines = (error.stdout || error.message || "")
        .toString()
        .split("\n")
        .filter((l) => l.trim())
        .slice(-5)
        .join(" | ")
      bad(`${bp.id} ${bp.name} 深度验证失败: ${firstLines}`)
      failures.push(`${bp.id} ${bp.name}: ${firstLines}`)
      failed++
    }
  }
}

// ---------------------------------------------------------------------------
// 汇总
// ---------------------------------------------------------------------------
log("")
if (failed > 0) {
  log(`${RED}验证未通过: ${passed} 通过 / ${failed} 失败${NC}`)
  for (const f of failures) log(`  - ${f}`)
  process.exit(1)
} else {
  log(`${GREEN}验证通过: ${passed} 项全部成功${NC}${deep ? "" : "（未执行 --deep 深度构建）"}`)
}

// 清理
try { fs.rmSync(tmpRoot, { recursive: true, force: true }) } catch {}
