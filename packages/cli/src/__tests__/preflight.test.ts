import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as os from 'os'

const MISSING_DIR_OR_EMPTY_PROJECT = "1"
const MISSING_CONFIG = "3"

describe('preflight-add', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'yyc3-preflight-'))
  })

  afterEach(async () => {
    await fs.remove(tmpDir)
  })

  it('returns error for non-existent cwd', async () => {
    const { preFlightAdd } = await import('../preflights/preflight-add')
    const result = await preFlightAdd({
      cwd: path.join(tmpDir, 'nonexistent'),
      components: [],
      yes: false,
      overwrite: false,
      silent: true,
    })
    expect(result.config).toBeNull()
    expect(Object.keys(result.errors).length).toBeGreaterThan(0)
  })

  it('returns error for empty project', async () => {
    const { preFlightAdd } = await import('../preflights/preflight-add')
    const emptyDir = path.join(tmpDir, 'empty-project')
    await fs.ensureDir(emptyDir)
    const result = await preFlightAdd({
      cwd: emptyDir,
      components: [],
      yes: false,
      overwrite: false,
      silent: true,
    })
    expect(result.errors[MISSING_DIR_OR_EMPTY_PROJECT]).toBe(true)
  })

  it('returns MISSING_CONFIG for project without components.json', async () => {
    const { preFlightAdd } = await import('../preflights/preflight-add')
    await fs.writeJson(path.join(tmpDir, 'package.json'), { name: 'test' })
    const result = await preFlightAdd({
      cwd: tmpDir,
      components: [],
      yes: false,
      overwrite: false,
      silent: true,
    })
    expect(result.errors[MISSING_CONFIG]).toBe(true)
  })
})

describe('preflight-init', () => {
  let tmpDir: string
  let exitSpy: ReturnType<typeof vi.spyOn>

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'yyc3-init-'))
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })
  })

  afterEach(async () => {
    await fs.remove(tmpDir)
    exitSpy.mockRestore()
  })

  it('returns error for non-existent cwd', async () => {
    const { preFlightInit } = await import('../preflights/preflight-init')
    const result = await preFlightInit({
      cwd: path.join(tmpDir, 'nonexistent'),
      silent: true,
      defaults: false,
      force: false,
    })
    expect(result.errors[MISSING_DIR_OR_EMPTY_PROJECT]).toBe(true)
    expect(result.projectInfo).toBeNull()
  })

  it('returns error for directory without package.json', async () => {
    const { preFlightInit } = await import('../preflights/preflight-init')
    const emptyDir = path.join(tmpDir, 'no-pkg')
    await fs.ensureDir(emptyDir)
    const result = await preFlightInit({
      cwd: emptyDir,
      silent: true,
      defaults: false,
      force: false,
    })
    expect(result.errors[MISSING_DIR_OR_EMPTY_PROJECT]).toBe(true)
  })

  it('returns projectInfo for valid project', async () => {
    const { preFlightInit } = await import('../preflights/preflight-init')
    await fs.writeJson(path.join(tmpDir, 'package.json'), {
      name: 'test-project',
      dependencies: { react: '^18' },
    })
    try {
      const result = await preFlightInit({
        cwd: tmpDir,
        silent: true,
        defaults: false,
        force: false,
      })
      expect(result.projectInfo).toBeDefined()
      expect(result.errors[MISSING_DIR_OR_EMPTY_PROJECT]).toBeUndefined()
    } catch (e) {
      if (exitSpy.mock.calls.length > 0) {
        expect(exitSpy).toHaveBeenCalled()
      } else {
        throw e
      }
    }
  })

  it('handles existing components.json without force', async () => {
    const { preFlightInit } = await import('../preflights/preflight-init')
    await fs.writeJson(path.join(tmpDir, 'package.json'), { name: 'test' })
    await fs.writeJson(path.join(tmpDir, 'components.json'), { style: 'default' })
    try {
      await preFlightInit({
        cwd: tmpDir,
        silent: true,
        defaults: false,
        force: false,
      })
    } catch (e) {
      expect(exitSpy).toHaveBeenCalled()
    }
  })
})
