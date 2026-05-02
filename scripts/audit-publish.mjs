import fs from 'fs'
import { execSync } from 'child_process'

const pkgs = ['core','ai-hub','emotion','i18n-core','ui','plugins','mcp-servers','motion','cli']

console.log('=== 1. workspace 协议残留 ===')
let ws = 0
for (const p of pkgs) {
  const c = fs.readFileSync(`packages/${p}/package.json`, 'utf8')
  if (c.includes('workspace:')) { console.log(`  ❌ @yyc3/${p} has workspace:`); ws++ }
}
if (!ws) console.log('  ✅ 全部清除')

console.log('\n=== 2. publishConfig ===')
for (const p of pkgs) {
  const j = JSON.parse(fs.readFileSync(`packages/${p}/package.json`, 'utf8'))
  console.log(`  @yyc3/${p}: ${j.publishConfig ? 'access=' + j.publishConfig.access : '❌ MISSING'}`)
}

console.log('\n=== 3. files 字段 ===')
for (const p of pkgs) {
  const j = JSON.parse(fs.readFileSync(`packages/${p}/package.json`, 'utf8'))
  console.log(`  @yyc3/${p}: ${j.files ? j.files.join(', ') : '❌ MISSING'}`)
}

console.log('\n=== 4. 本地 vs npm 版本 ===')
for (const p of pkgs) {
  const j = JSON.parse(fs.readFileSync(`packages/${p}/package.json`, 'utf8'))
  const local = j.version
  let remote = '?'
  try { remote = execSync(`npm view @yyc3/${p} version --registry https://registry.npmjs.org/`, { encoding: 'utf8' }).trim() } catch { remote = 'NOT PUB' }
  const ok = local === remote ? '⚠️ SAME' : (local > remote ? '✅ AHEAD' : '❌ BEHIND')
  console.log(`  @yyc3/${p}: local=${local}  remote=${remote}  ${ok}`)
}
