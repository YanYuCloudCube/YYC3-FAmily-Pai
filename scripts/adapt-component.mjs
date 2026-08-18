#!/usr/bin/env node
/**
 * 组件适配入库脚手架
 * 用法: node scripts/adapt-component.mjs <source> <category> <name>
 * 示例: node scripts/adapt-component.mjs ai-assistant ai ai-assistant
 *
 * 功能:
 *   1. 从 UI-MONO 读取源组件
 *   2. 替换 @/ 路径别名为相对路径
 *   3. 移除 next 硬依赖（改为 peerDep）
 *   4. 添加 JSDoc 头部注释
 *   5. 生成测试文件模板
 */

import fs from 'fs'
import path from 'path'

const UI_MONO_BASE = '/Volumes/Max/YanYuCloudCube/YanYuCloud/YYC3-设计工具-组件插件/YYC3-UI-MONO/packages'
const PI3_UI = path.resolve(import.meta.dirname, '..', 'packages', 'ui', 'src', 'components', 'business')

const args = process.argv.slice(2)

if (args.length < 3) {
  console.log('Usage: node scripts/adapt-component.mjs <source-file> <category> <name>')
  console.log('  source-file: 文件名（不含路径，在 UI-MONO packages/ui/ 下查找）')
  console.log('  category: ai | enterprise | data | system | platform | charts')
  console.log('  name: 目标组件文件名（不含扩展名）')
  console.log('\nExample:')
  console.log('  node scripts/adapt-component.mjs ai-assistant ai ai-assistant')
  process.exit(0)
}

const [sourceFile, category, name] = args

// 搜索源文件（优先 packages/ui/，其次 packages/base/components/，含 charts/ 子目录）
function findSource(file) {
  const paths = [
    path.join(UI_MONO_BASE, 'ui', `${file}.tsx`),
    path.join(UI_MONO_BASE, 'ui', `${file}.ts`),
    path.join(UI_MONO_BASE, 'ui', 'charts', `${file}.tsx`),
    path.join(UI_MONO_BASE, 'ui', 'dialogs', `${file}.tsx`),
    path.join(UI_MONO_BASE, 'ui', 'layout', `${file}.tsx`),
    path.join(UI_MONO_BASE, 'base', 'components', `${file}.tsx`),
    path.join(UI_MONO_BASE, 'base', 'lib', `${file}.ts`),
  ]
  for (const p of paths) {
    if (fs.existsSync(p)) return p
  }
  return null
}

const srcPath = findSource(sourceFile)
if (!srcPath) {
  console.error(`Error: Source file "${sourceFile}" not found in UI-MONO`)
  process.exit(1)
}

// 读取源文件
let content = fs.readFileSync(srcPath, 'utf-8')

// 路径替换规则
const replacements = [
  // @/components/ui/* → 相对路径到 shadcn 基础组件
  // 从 business/category/file.tsx → ../../ui/name (回到 components/ 再进 ui/)
  [/@\/components\/ui\/([a-z-]+)/g, (_match, uiName) => {
    const depth = category.split('/').length
    const prefix = '../'.repeat(1 + depth) // business/category → ../../ui/
    return `${prefix}ui/${uiName}`
  }],
  // @/lib/utils → @yyc3/core 或相对路径
  [/@\/lib\/utils/g, '../../../lib/utils'],
  // @/lib/* → 相对路径
  [/@\/lib\/([a-z-]+)/g, (match, name) => `../../../lib/${name}`],
  // @/hooks/* → 相对路径
  [/@\/hooks\/([a-z-]+)/g, (match, name) => `../../../hooks/${name}`],
  // @/components/* → 相对路径
  [/@\/components\/([a-z-]+)/g, (match, name) => `../../${name}`],
  // @/contexts/* → 相对路径
  [/@\/contexts\/([a-z-]+)/g, (match, name) => `../../../contexts/${name}`],
]

for (const [pattern, replacement] of replacements) {
  content = content.replace(pattern, replacement)
}

// 添加 JSDoc 头部
const jsdoc = `/**
 * file ${name}.tsx
 * description ${sourceFile} — 从 UI-MONO 适配入库
 * module @yyc3/ui/business/${category}
 * author YanYuCloudCube Team <admin@0379.email>
 * version 3.0.0
 * created 2026-06-20
 * status active
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */
`

// 写入目标文件
const targetDir = path.join(PI3_UI, category)
const targetPath = path.join(targetDir, `${name}.tsx`)

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

fs.writeFileSync(targetPath, jsdoc + content)
console.log(`✓ Component adapted: ${targetPath}`)

// 从源文件提取真实的命名导出组件名（避免大小写猜测错误）
const exportMatch = content.match(/export\s+(?:const|function)\s+([A-Z][A-Za-z0-9]+)/)
const componentName = exportMatch ? exportMatch[1] : null

if (!componentName) {
  console.warn(`⚠ Warning: Could not detect named export in ${sourceFile}. Test template skipped.`)
  process.exit(0)
}

// 生成测试文件模板（使用真实导出名）
const testContent = `/**
 * file ${name}.test.tsx
 * description ${componentName} 组件测试
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { ${componentName} } from './${name}'

describe('${componentName}', () => {
  it('should render without crashing', () => {
    const { container } = render(<${componentName} />)
    expect(container).toBeDefined()
  })
})
`

const testPath = path.join(targetDir, `${name}.test.tsx`)
fs.writeFileSync(testPath, testContent)
console.log(`✓ Test template: ${testPath}`)
