import { beforeEach, describe, expect, it } from 'vitest'
import {
  decrypt,
  encrypt,
  generateRandomBytes,
  maskApiKey,
  maskEmail,
  secureListKeys,
  secureRemove,
  secureRetrieve,
  secureStore,
} from '../services/CryptoService'

describe('CryptoService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('generateRandomBytes', () => {
    it('generates bytes of correct length', () => {
      const bytes = generateRandomBytes(16)
      expect(bytes).toBeInstanceOf(Uint8Array)
      expect(bytes.length).toBe(16)
    })

    it('generates different bytes each time', () => {
      const a = generateRandomBytes(32)
      const b = generateRandomBytes(32)
      expect(a).not.toEqual(b)
    })
  })

  describe('encrypt + decrypt', () => {
    it('encrypts and decrypts text correctly', async () => {
      const plaintext = 'Hello, YYC³!'
      const password = 'test-password-123'
      const encrypted = await encrypt(plaintext, password)
      expect(encrypted.iv).toBeTruthy()
      expect(encrypted.salt).toBeTruthy()
      expect(encrypted.ciphertext).toBeTruthy()
      expect(encrypted.version).toBe(1)

      const decrypted = await decrypt(encrypted, password)
      expect(decrypted).toBe(plaintext)
    })

    it('fails to decrypt with wrong password', async () => {
      const encrypted = await encrypt('secret', 'correct-password')
      await expect(decrypt(encrypted, 'wrong-password')).rejects.toThrow()
    })

    it('produces different ciphertext for same plaintext', async () => {
      const password = 'same-password'
      const a = await encrypt('same text', password)
      const b = await encrypt('same text', password)
      expect(a.ciphertext).not.toBe(b.ciphertext)
      expect(a.iv).not.toBe(b.iv)
    })

    it('handles unicode text', async () => {
      const plaintext = '你好世界 🌍 مرحبا'
      const encrypted = await encrypt(plaintext, 'unicode-pwd')
      const decrypted = await decrypt(encrypted, 'unicode-pwd')
      expect(decrypted).toBe(plaintext)
    })

    it('handles empty string', async () => {
      const encrypted = await encrypt('', 'pwd')
      const decrypted = await decrypt(encrypted, 'pwd')
      expect(decrypted).toBe('')
    })
  })

  describe('secure storage', () => {
    it('stores and retrieves encrypted data', async () => {
      await secureStore('api-key', 'sk-proj-abc123', 'master-password')
      const result = await secureRetrieve('api-key', 'master-password')
      expect(result).toBe('sk-proj-abc123')
    })

    it('returns null for missing key', async () => {
      const result = await secureRetrieve('missing', 'pwd')
      expect(result).toBeNull()
    })

    it('removes stored data', async () => {
      await secureStore('test-key', 'value', 'pwd')
      secureRemove('test-key')
      const result = await secureRetrieve('test-key', 'pwd')
      expect(result).toBeNull()
    })

    it('lists stored keys', async () => {
      await secureStore('key-a', 'val-a', 'pwd')
      await secureStore('key-b', 'val-b', 'pwd')
      const keys = secureListKeys()
      expect(keys).toContain('key-a')
      expect(keys).toContain('key-b')
    })

    it('returns null on wrong password', async () => {
      await secureStore('test', 'secret', 'correct')
      const result = await secureRetrieve('test', 'wrong')
      expect(result).toBeNull()
    })
  })

  describe('data masking', () => {
    it('masks API key', () => {
      expect(maskApiKey('sk-proj-abcdefghijklmnopqrstuvwxyz')).toBe('sk-pr***xyz')
    })

    it('masks short key as ***', () => {
      expect(maskApiKey('abc')).toBe('***')
    })

    it('masks empty string', () => {
      expect(maskApiKey('')).toBe('')
    })

    it('masks email', () => {
      expect(maskEmail('admin@example.com')).toBe('ad***@example.com')
    })

    it('masks email without @', () => {
      expect(maskEmail('invalid')).toBe('***')
    })

    it('masks single char email', () => {
      expect(maskEmail('a@test.com')).toBe('a***@test.com')
    })
  })
})
