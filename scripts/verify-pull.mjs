import fs from 'fs'
import path from 'path'

const pkgs = ['core','ai-hub','emotion','i18n-core','ui','plugins','mcp-servers','motion','cli']
const base = '/tmp/yyc3-audit/node_modules/@yyc3'

console.log('=== 精确版本 + exports + 依赖验证 ===\n')

for (const pkg of pkgs) {
  const dir = path.join(base, pkg)
  if (!fs.existsSync(dir)) { console.log(`  ❌ @yyc3/${pkg} NOT INSTALLED`); continue }

  const j = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
  const ws = Object.entries(j.dependencies || {}).filter(([, v]) => v.includes('workspace:'))
  const distFiles = fs.readdirSync(path.join(dir, 'dist')).filter(f => f.endsWith('.js'))
  const dtsFiles = fs.readdirSync(path.join(dir, 'dist')).filter(f => f.endsWith('.d.ts'))

  console.log(`  ✅ @yyc3/${pkg.padEnd(12)} v${j.version}  main: ${(j.main || '-').padEnd(20)} dist: ${distFiles.length} JS + ${dtsFiles.length} .d.ts  deps: ${ws.length ? '❌ ' + ws.map(([k,v]) => k+':'+v).join(' ') : 'clean'}`)
}

console.log('\n=== 依赖链验证 ===')
for (const pkg of ['ai-hub', 'ui', 'plugins']) {
  const nestedCore = path.join(base, pkg, 'node_modules/@yyc3/core/package.json')
  if (fs.existsSync(nestedCore)) {
    const cv = JSON.parse(fs.readFileSync(nestedCore, 'utf8')).version
    console.log(`  ✅ @yyc3/${pkg} → @yyc3/core@${cv} (nested)`)
  } else {
    const rootCore = path.join(base, 'core/package.json')
    if (fs.existsSync(rootCore)) {
      const cv = JSON.parse(fs.readFileSync(rootCore, 'utf8')).version
      console.log(`  ✅ @yyc3/${pkg} → @yyc3/core@${cv} (hoisted)`)
    } else {
      console.log(`  ❌ @yyc3/${pkg} → core NOT FOUND`)
    }
  }
}

console.log('\n=== CLI bin 验证 ===')
const cliDir = path.join(base, 'cli')
if (fs.existsSync(cliDir)) {
  const cli = JSON.parse(fs.readFileSync(path.join(cliDir, 'package.json'), 'utf8'))
  const bins = Object.keys(cli.bin || {})
  for (const b of bins) {
    const binPath = path.join(cliDir, cli.bin[b])
    console.log(`  ${b}: ${fs.existsSync(binPath) ? '✅ exists' : '❌ MISSING'} → ${cli.bin[b]}`)
  }
}
