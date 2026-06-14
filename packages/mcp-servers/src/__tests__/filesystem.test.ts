import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { FilesystemServer } from '../implementations/filesystem.js'
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const TEST_DIR = join(tmpdir(), 'mcp-fs-test-' + process.pid)

describe('FilesystemServer', () => {
  let server: FilesystemServer

  beforeEach(() => {
    if (!existsSync(TEST_DIR)) mkdirSync(TEST_DIR, { recursive: true })
    server = new FilesystemServer({ rootDirs: [TEST_DIR] })
  })

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true })
  })

  it('应该创建实例', () => {
    expect(server).toBeDefined()
  })

  it('应该返回工具列表', () => {
    const tools = server.getTools()
    expect(tools).toHaveLength(4)
    expect(tools.map((t) => t.name)).toContain('read_file')
    expect(tools.map((t) => t.name)).toContain('write_file')
    expect(tools.map((t) => t.name)).toContain('list_directory')
    expect(tools.map((t) => t.name)).toContain('search_files')
  })

  it('应该返回资源列表', () => {
    const resources = server.getResources()
    expect(resources).toHaveLength(1)
    expect(resources[0].uri).toBe(`fs://${TEST_DIR}`)
  })

  it('应该读取资源', async () => {
    const testFile = join(TEST_DIR, 'resource.txt')
    writeFileSync(testFile, 'hello resource')
    const content = await server.readResource(`fs://${testFile}`)
    expect(content.text).toBe('hello resource')
  })

  it('read_file 应返回文件内容', async () => {
    const testFile = join(TEST_DIR, 'read.txt')
    writeFileSync(testFile, 'hello world')
    const result = await server.callTool('read_file', { path: testFile })
    expect(result.isError).toBeFalsy()
    expect(result.content[0].text).toBe('hello world')
  })

  it('read_file 无 path 应返回错误', async () => {
    const result = await server.callTool('read_file', {})
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain('path is required')
  })

  it('write_file 应写入文件', async () => {
    const testFile = join(TEST_DIR, 'write.txt')
    const result = await server.callTool('write_file', { path: testFile, content: 'written content' })
    expect(result.isError).toBeFalsy()
    expect(result.content[0].text).toContain('Written')
    expect(readFileSync(testFile, 'utf-8')).toBe('written content')
  })

  it('write_file 带 createDirs 应创建父目录', async () => {
    const testFile = join(TEST_DIR, 'sub', 'dir', 'nested.txt')
    const result = await server.callTool('write_file', { path: testFile, content: 'nested', createDirs: 'true' })
    expect(result.isError).toBeFalsy()
    expect(readFileSync(testFile, 'utf-8')).toBe('nested')
  })

  it('write_file 无 content 应返回错误', async () => {
    const result = await server.callTool('write_file', { path: join(TEST_DIR, 'x.txt') })
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain('content is required')
  })

  it('list_directory 应列出目录内容', async () => {
    writeFileSync(join(TEST_DIR, 'a.txt'), 'a')
    writeFileSync(join(TEST_DIR, 'b.txt'), 'b')
    const result = await server.callTool('list_directory', { dirPath: TEST_DIR })
    expect(result.isError).toBeFalsy()
    expect(result.content[0].text).toContain('a.txt')
    expect(result.content[0].text).toContain('b.txt')
  })

  it('list_directory 无 dirPath 应返回错误', async () => {
    const result = await server.callTool('list_directory', {})
    expect(result.isError).toBe(true)
  })

  it('search_files 应搜索文件', async () => {
    writeFileSync(join(TEST_DIR, 'findme.txt'), 'found')
    writeFileSync(join(TEST_DIR, 'other.txt'), 'other')
    const result = await server.callTool('search_files', { rootDir: TEST_DIR, query: 'findme' })
    expect(result.isError).toBeFalsy()
    expect(result.content[0].text).toContain('findme.txt')
  })

  it('search_files 无 query 应返回错误', async () => {
    const result = await server.callTool('search_files', { rootDir: TEST_DIR })
    expect(result.isError).toBe(true)
  })

  it('未知工具应返回错误', async () => {
    const result = await server.callTool('unknown', {})
    expect(result.isError).toBe(true)
  })
})
