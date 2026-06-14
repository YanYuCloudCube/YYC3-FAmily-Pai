import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const SOURCE = fs.readFileSync(path.resolve(__dirname, '../create-app.ts'), 'utf-8')

describe('create-app source validation', () => {
  it('contains expected themes', () => {
    expect(SOURCE).toContain('yyc3-brand')
    expect(SOURCE).toContain('cyberpunk')
    expect(SOURCE).toContain('futuristic')
    expect(SOURCE).toContain('aurora')
    expect(SOURCE).toContain('hacker')
    expect(SOURCE).toContain('dark-minimal')
  })

  it('contains expected scenes', () => {
    expect(SOURCE).toContain('ai-chat')
    expect(SOURCE).toContain('admin-dashboard')
    expect(SOURCE).toContain('ecommerce')
    expect(SOURCE).toContain('ai-platform')
    expect(SOURCE).toContain('financial')
    expect(SOURCE).toContain('smart-city')
  })

  it('has generateGlobalsCss function', () => {
    expect(SOURCE).toContain('function generateGlobalsCss')
  })

  it('has createProject function', () => {
    expect(SOURCE).toContain('async function createProject')
  })

  it('has THEMES array', () => {
    expect(SOURCE).toContain('const THEMES')
  })

  it('has SCENES array', () => {
    expect(SOURCE).toContain('const SCENES')
  })
})
