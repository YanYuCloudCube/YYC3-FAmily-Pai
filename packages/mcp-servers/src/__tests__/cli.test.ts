import { describe, it, expect, vi } from 'vitest'
import { parseCLIMode } from '../cli/index.js'

describe('CLI', () => {
  describe('parseCLIMode', () => {
    it('默认模式应为 stdio', () => {
      const opts = parseCLIMode([])
      expect(opts.mode).toBe('stdio')
    })

    it('--http 应切换到 http 模式', () => {
      const opts = parseCLIMode(['--http'])
      expect(opts.mode).toBe('http')
    })

    it('应解析 --port', () => {
      const opts = parseCLIMode(['--http', '--port', '8080'])
      expect(opts.port).toBe(8080)
    })

    it('应解析 --host', () => {
      const opts = parseCLIMode(['--http', '--host', 'localhost'])
      expect(opts.host).toBe('localhost')
    })

    it('应解析 --api-key', () => {
      const opts = parseCLIMode(['--http', '--api-key', 'secret123'])
      expect(opts.apiKey).toBe('secret123')
    })

    it('应解析 --no-cors', () => {
      const opts = parseCLIMode(['--http', '--no-cors'])
      expect(opts.cors).toBe(false)
    })

    it('默认 cors 应为 true', () => {
      const opts = parseCLIMode(['--http'])
      expect(opts.cors).toBe(true)
    })

    it('无效 port 应使用默认 3000', () => {
      const opts = parseCLIMode(['--http', '--port', 'abc'])
      expect(opts.port).toBe(3000)
    })
  })
})
