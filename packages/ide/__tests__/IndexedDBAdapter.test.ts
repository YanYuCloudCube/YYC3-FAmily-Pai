import 'fake-indexeddb/auto'
import { beforeAll, describe, expect, it } from 'vitest'

let adapter: typeof import('../adapters/IndexedDBAdapter')

describe('IndexedDBAdapter', () => {
  beforeAll(async () => {
    adapter = await import('../adapters/IndexedDBAdapter')
  })

  describe('file operations', () => {
    it('saves and loads a file', async () => {
      await adapter.saveFile('proj-1', 'src/App.tsx', 'export default function App() {}')
      const content = await adapter.loadFile('proj-1', 'src/App.tsx')
      expect(content).toBe('export default function App() {}')
    })

    it('returns null for missing file', async () => {
      const content = await adapter.loadFile('proj-1', 'nonexistent.ts')
      expect(content).toBeNull()
    })

    it('saves and loads multiple files', async () => {
      await adapter.saveFiles('proj-2', { 'a.ts': 'content-a', 'b.ts': 'content-b' })
      const files = await adapter.loadAllFiles('proj-2')
      expect(Object.keys(files)).toHaveLength(2)
      expect(files['a.ts']).toBe('content-a')
    })

    it('deletes a file', async () => {
      await adapter.saveFile('proj-3', 'del.ts', 'delete me')
      await adapter.deleteFile('proj-3', 'del.ts')
      expect(await adapter.loadFile('proj-3', 'del.ts')).toBeNull()
    })

    it('deletes all files for a project', async () => {
      await adapter.saveFiles('proj-4', { 'x.ts': 'x', 'y.ts': 'y' })
      await adapter.deleteAllFiles('proj-4')
      expect(await adapter.loadAllFiles('proj-4')).toEqual({})
    })

    it('overwrites existing file', async () => {
      await adapter.saveFile('proj-5', 'app.ts', 'v1')
      await adapter.saveFile('proj-5', 'app.ts', 'v2')
      expect(await adapter.loadFile('proj-5', 'app.ts')).toBe('v2')
    })

    it('isolates files between projects', async () => {
      await adapter.saveFiles('iso-a', { 'shared.ts': 'from-a' })
      await adapter.saveFiles('iso-b', { 'shared.ts': 'from-b' })
      expect(await adapter.loadFile('iso-a', 'shared.ts')).toBe('from-a')
      expect(await adapter.loadFile('iso-b', 'shared.ts')).toBe('from-b')
    })
  })

  describe('project operations', () => {
    it('saves and loads a project', async () => {
      await adapter.saveProject({
        id: 'proj-test',
        name: 'Test Project',
        createdAt: 1000,
        updatedAt: 2000,
        fileCount: 3,
        totalSize: 512,
      })
      const loaded = await adapter.loadProject('proj-test')
      expect(loaded).toBeDefined()
      expect(loaded!.name).toBe('Test Project')
      expect(loaded!.fileCount).toBe(3)
    })

    it('returns null for missing project', async () => {
      expect(await adapter.loadProject('nonexistent')).toBeNull()
    })

    it('lists all projects', async () => {
      await adapter.saveProject({ id: 'list-p1', name: 'P1', createdAt: 1, updatedAt: 1, fileCount: 0, totalSize: 0 })
      await adapter.saveProject({ id: 'list-p2', name: 'P2', createdAt: 2, updatedAt: 2, fileCount: 0, totalSize: 0 })
      const list = await adapter.listProjects()
      const ids = list.map((p) => p.id)
      expect(ids).toContain('list-p1')
      expect(ids).toContain('list-p2')
    })

    it('deletes a project', async () => {
      await adapter.saveProject({ id: 'del-proj', name: 'Del', createdAt: 1, updatedAt: 1, fileCount: 0, totalSize: 0 })
      await adapter.deleteProject('del-proj')
      expect(await adapter.loadProject('del-proj')).toBeNull()
    })
  })

  describe('snapshot operations', () => {
    it('creates and loads a snapshot', async () => {
      const snapId = await adapter.createSnapshot('snap-proj', 'Initial State', {
        'main.ts': 'console.log("hello")',
        'util.ts': 'export const PI = 3.14',
      })
      expect(snapId).toBeTruthy()
      const snap = await adapter.loadSnapshot(snapId)
      expect(snap).toBeDefined()
      expect(snap!.label).toBe('Initial State')
      expect(snap!.files['main.ts']).toBe('console.log("hello")')
      expect(snap!.projectId).toBe('snap-proj')
    })

    it('lists snapshots by project', async () => {
      await adapter.createSnapshot('ls-proj', 'S1', {})
      await adapter.createSnapshot('ls-proj', 'S2', {})
      await adapter.createSnapshot('other-proj', 'S3', {})
      const list = await adapter.listSnapshots('ls-proj')
      expect(list).toHaveLength(2)
      const labels = list.map((s) => s.label)
      expect(labels).toContain('S1')
      expect(labels).toContain('S2')
    })

    it('deletes a snapshot', async () => {
      const snapId = await adapter.createSnapshot('p', 'Del', {})
      await adapter.deleteSnapshot(snapId)
      expect(await adapter.loadSnapshot(snapId)).toBeNull()
    })

    it('returns null for missing snapshot', async () => {
      expect(await adapter.loadSnapshot('nonexistent')).toBeNull()
    })
  })
})
