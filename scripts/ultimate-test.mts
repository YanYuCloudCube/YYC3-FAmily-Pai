#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const ROOT = '/Volumes/Max/YanYuCloudCube/YanYuCloud/YYC3-设计工具-组件插件/YYC3-π³'
const REPORT_DIR = join(ROOT, 'docs', 'YYC3-pi3-audit-20260519')

const PACKAGES = [
  '@yyc3/core',
  '@yyc3/ai-hub',
  '@yyc3/cli',
  '@yyc3/effects',
  '@yyc3/emotion',
  '@yyc3/i18n-core',
  '@yyc3/mcp-servers',
  '@yyc3/motion',
  '@yyc3/plugins',
  '@yyc3/ui',
]

interface PackageResult {
  name: string
  build: { status: 'pass' | 'fail'; duration: number; error?: string }
  typecheck: { status: 'pass' | 'fail'; duration: number; error?: string }
  test: { status: 'pass' | 'fail'; files: number; tests: number; duration: number; error?: string }
  sizeKB?: number
}

function run(cmd: string, cwd: string): { stdout: string; stderr: string; exitCode: number; duration: number } {
  const start = Date.now()
  try {
    const stdout = execSync(cmd, { cwd, encoding: 'utf-8', timeout: 120000, stdio: ['pipe', 'pipe', 'pipe'] })
    return { stdout, stderr: '', exitCode: 0, duration: Date.now() - start }
  } catch (e: any) {
    return { stdout: e.stdout || '', stderr: e.stderr || '', exitCode: e.status || 1, duration: Date.now() - start }
  }
}

function extractTests(output: string): { files: number; tests: number } {
  const fileMatch = output.match(/Test Files\s+(\d+) passed/)
  const testMatch = output.match(/Tests\s+(\d+) passed/)
  return { files: fileMatch ? parseInt(fileMatch[1]) : 0, tests: testMatch ? parseInt(testMatch[1]) : 0 }
}

function getSizeKB(pkgDir: string): number | undefined {
  try {
    const stats = execSync(`ls -la dist/index.js 2>/dev/null | awk '{print $5}'`, { cwd: pkgDir, encoding: 'utf-8' })
    const bytes = parseInt(stats.trim())
    return bytes > 0 ? Math.round(bytes / 1024 * 10) / 10 : undefined
  } catch { return undefined }
}

console.log('🚀 YYC³ FAmily π³ 生产终极测试\n')
console.log('═'.repeat(60))

const results: PackageResult[] = []

for (const pkg of PACKAGES) {
  const shortName = pkg.replace('@yyc3/', '')
  const pkgDir = join(ROOT, 'packages', shortName)
  console.log(`\n📦 ${pkg}`)

  if (!existsSync(pkgDir)) {
    console.log(`   ⚠️  跳过: 目录不存在`)
    continue
  }

  const result: PackageResult = {
    name: pkg,
    build: { status: 'fail', duration: 0 },
    typecheck: { status: 'fail', duration: 0 },
    test: { status: 'fail', files: 0, tests: 0, duration: 0 },
  }

  console.log('   🔨 Build...')
  const build = run('npx tsup', pkgDir)
  result.build = { status: build.exitCode === 0 ? 'pass' : 'fail', duration: build.duration, error: build.exitCode !== 0 ? build.stderr.slice(-200) : undefined }
  console.log(`   ${build.exitCode === 0 ? '✅' : '❌'} Build (${build.duration}ms)`)

  console.log('   🔍 Typecheck...')
  const tc = run('npx tsc --noEmit', pkgDir)
  result.typecheck = { status: tc.exitCode === 0 ? 'pass' : 'fail', duration: tc.duration, error: tc.exitCode !== 0 ? tc.stderr.slice(-200) : undefined }
  console.log(`   ${tc.exitCode === 0 ? '✅' : '❌'} Typecheck (${tc.duration}ms)`)

  console.log('   🧪 Test...')
  const test = run('npx vitest run', pkgDir)
  const testInfo = extractTests(test.stdout + test.stderr)
  result.test = {
    status: test.exitCode === 0 ? 'pass' : 'fail',
    files: testInfo.files,
    tests: testInfo.tests,
    duration: test.duration,
    error: test.exitCode !== 0 ? (test.stderr || test.stdout).slice(-300) : undefined,
  }
  console.log(`   ${test.exitCode === 0 ? '✅' : '❌'} Test: ${testInfo.tests} tests in ${testInfo.files} files (${test.duration}ms)`)

  result.sizeKB = getSizeKB(pkgDir)

  results.push(result)
}

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true })

const totalTests = results.reduce((s, r) => s + r.test.tests, 0)
const totalFiles = results.reduce((s, r) => s + r.test.files, 0)
const allPass = results.every(r => r.build.status === 'pass' && r.typecheck.status === 'pass' && r.test.status === 'pass')

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>YYC³ FAmily π³ 生产终极测试报告</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f172a;color:#e2e8f0;padding:24px}
.header{text-align:center;margin-bottom:32px}
.header h1{font-size:28px;background:linear-gradient(135deg,#60a5fa,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.header .subtitle{color:#94a3b8;font-size:14px}
.badge{display:inline-block;padding:4px 12px;border-radius:9999px;font-size:13px;font-weight:600;margin:0 4px}
.badge-pass{background:#065f46;color:#6ee7b7}
.badge-fail{background:#7f1d1d;color:#fca5a5}
.summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:32px}
.card{background:#1e293b;border-radius:12px;padding:20px;text-align:center;border:1px solid #334155}
.card .value{font-size:32px;font-weight:700;margin-bottom:4px}
.card .label{color:#94a3b8;font-size:13px}
.card .value.green{color:#34d399}
.card .value.blue{color:#60a5fa}
.card .value.purple{color:#a78bfa}
.card .value.amber{color:#fbbf24}
.card .value.red{color:#f87171}
table{width:100%;border-collapse:separate;border-spacing:0;background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155;margin-bottom:32px}
th{background:#0f172a;padding:12px 16px;text-align:left;font-size:13px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px}
td{padding:12px 16px;border-top:1px solid #334155;font-size:14px}
tr:hover td{background:#1e293b80}
.pkg-name{font-weight:600;color:#60a5fa}
.status-icon{font-size:16px}
.bar{height:6px;border-radius:3px;background:#334155;overflow:hidden;margin-top:4px}
.bar-fill{height:100%;border-radius:3px}
.bar-fill.green{background:linear-gradient(90deg,#059669,#34d399)}
.bar-fill.red{background:linear-gradient(90deg,#dc2626,#f87171)}
.dim{color:#64748b;font-size:12px}
.error-box{background:#1c1917;border:1px solid #7f1d1d;border-radius:8px;padding:12px;margin-top:8px;font-family:monospace;font-size:12px;color:#fca5a5;max-height:100px;overflow:auto}
.footer{text-align:center;color:#475569;font-size:12px;margin-top:24px;padding-top:24px;border-top:1px solid #334155}
.chart-container{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:32px}
.chart-card{background:#1e293b;border-radius:12px;padding:20px;border:1px solid #334155}
.chart-card h3{font-size:14px;color:#94a3b8;margin-bottom:16px}
.ring-chart{display:flex;align-items:center;gap:16px}
.ring{width:80px;height:80px;border-radius:50%;position:relative;display:flex;align-items:center;justify-content:center}
.ring-value{font-size:20px;font-weight:700}
.ring-label{font-size:12px;color:#94a3b8}
.list-chart .item{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.list-chart .item .dot{width:8px;height:8px;border-radius:50%}
.list-chart .item .name{flex:1;font-size:13px}
.list-chart .item .count{font-weight:600;font-size:13px}
</style>
</head>
<body>

<div class="header">
  <h1>🧪 YYC³ FAmily π³ 生产终极测试报告</h1>
  <div class="subtitle">
    ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })} &nbsp;|&nbsp; Node ${process.version} &nbsp;|&nbsp; ${results.length} Packages
    &nbsp;&nbsp;
    <span class="badge ${allPass ? 'badge-pass' : 'badge-fail'}">${allPass ? '✅ ALL PASS' : '⚠️ HAS FAILURES'}</span>
  </div>
</div>

<div class="summary">
  <div class="card">
    <div class="value green">${totalTests}</div>
    <div class="label">总测试数</div>
  </div>
  <div class="card">
    <div class="value blue">${totalFiles}</div>
    <div class="label">测试文件</div>
  </div>
  <div class="card">
    <div class="value purple">${results.filter(r => r.build.status === 'pass').length}/${results.length}</div>
    <div class="label">构建通过</div>
  </div>
  <div class="card">
    <div class="value amber">${results.filter(r => r.typecheck.status === 'pass').length}/${results.length}</div>
    <div class="label">类型检查通过</div>
  </div>
  <div class="card">
    <div class="value ${allPass ? 'green' : 'red'}">${results.filter(r => r.test.status === 'pass').length}/${results.length}</div>
    <div class="label">测试通过</div>
  </div>
</div>

<div class="chart-container">
  <div class="chart-card">
    <h3>📊 测试分布</h3>
    <div class="list-chart">
      ${results.map(r => `<div class="item"><div class="dot" style="background:${r.test.status === 'pass' ? '#34d399' : '#f87171'}"></div><div class="name">${r.name.replace('@yyc3/', '')}</div><div class="count" style="color:${r.test.status === 'pass' ? '#34d399' : '#f87171'}">${r.test.tests}</div></div>`).join('\n      ')}
    </div>
  </div>
  <div class="chart-card">
    <h3>📦 包体积 (KB)</h3>
    <div class="list-chart">
      ${results.filter(r => r.sizeKB).map(r => `<div class="item"><div class="dot" style="background:#60a5fa"></div><div class="name">${r.name.replace('@yyc3/', '')}</div><div class="count" style="color:#60a5fa">${r.sizeKB} KB</div></div>`).join('\n      ')}
    </div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>包名</th>
      <th>构建</th>
      <th>类型检查</th>
      <th>测试</th>
      <th>测试数</th>
      <th>耗时</th>
      <th>体积</th>
    </tr>
  </thead>
  <tbody>
    ${results.map(r => `
    <tr>
      <td class="pkg-name">${r.name.replace('@yyc3/', '')}</td>
      <td><span class="status-icon">${r.build.status === 'pass' ? '✅' : '❌'}</span><br><span class="dim">${r.build.duration}ms</span></td>
      <td><span class="status-icon">${r.typecheck.status === 'pass' ? '✅' : '❌'}</span><br><span class="dim">${r.typecheck.duration}ms</span></td>
      <td><span class="status-icon">${r.test.status === 'pass' ? '✅' : '❌'}</span><br><span class="dim">${r.test.files} files</span></td>
      <td><strong>${r.test.tests}</strong><br><div class="bar" style="width:80px"><div class="bar-fill ${r.test.status === 'pass' ? 'green' : 'red'}" style="width:${Math.min(100, r.test.tests / 3)}%"></div></div></td>
      <td><span class="dim">${r.test.duration}ms</span></td>
      <td>${r.sizeKB ? r.sizeKB + ' KB' : '<span class="dim">-</span>'}</td>
    </tr>${r.test.error ? `<tr><td colspan="7"><div class="error-box">${r.test.error.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div></td></tr>` : ''}`).join('')}
  </tbody>
</table>

<div class="footer">
  YYC³ FAmily π³ &nbsp;|&nbsp; 五维驱动·五高五标五化 &nbsp;|&nbsp; ${new Date().getFullYear()} YanYuCloudCube Team
  <br>言启千行代码，语枢万物智能
</div>

</body>
</html>`

const reportPath = join(REPORT_DIR, 'ultimate-test-report.html')
writeFileSync(reportPath, html)

const jsonPath = join(REPORT_DIR, 'ultimate-test-results.json')
writeFileSync(jsonPath, JSON.stringify({ timestamp: new Date().toISOString(), allPass, totalTests, totalFiles, packages: results }, null, 2))

console.log('\n' + '═'.repeat(60))
console.log(`\n${allPass ? '🎉' : '⚠️'} 终极测试完成: ${totalTests} tests, ${results.filter(r => r.test.status === 'pass').length}/${results.length} packages passed`)
console.log(`📄 HTML 报告: ${reportPath}`)
console.log(`📊 JSON 数据: ${jsonPath}`)
