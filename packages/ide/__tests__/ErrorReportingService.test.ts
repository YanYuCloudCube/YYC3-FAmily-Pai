import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockSend = vi.fn().mockResolvedValue({ success: true })
const mockTransport = { name: 'mock', send: mockSend }

class TestErrorReportingService {
  private config: Record<string, unknown>
  private breadcrumbs: Array<{ type: string; category: string; message: string; timestamp: number }> = []
  private pendingEvents: Array<{ id: string; message: string; severity: string; category: string; fingerprint: string; reported: boolean }> = []
  private recentFingerprints = new Map<string, number>()
  private localEvents: Array<{ id: string; message: string }> = []

  constructor(config: Record<string, unknown>) {
    this.config = { sampleRate: 1, maxBreadcrumbs: 50, deduplication: true, deduplicationWindow: 60000, ...config }
  }

  addBreadcrumb(crumb: { type: string; category: string; message: string }) {
    this.breadcrumbs.push({ ...crumb, timestamp: Date.now() })
    if (this.breadcrumbs.length > (this.config.maxBreadcrumbs as number)) {
      this.breadcrumbs = this.breadcrumbs.slice(-(this.config.maxBreadcrumbs as number))
    }
  }

  captureError(
    error: unknown,
    options: { category?: string; severity?: string } = {},
  ): string | null {
    if (Math.random() > (this.config.sampleRate as number)) return null

    let errorMessage: string
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else {
      errorMessage = JSON.stringify(error)
    }

    const fingerprint = errorMessage
    if (this.config.deduplication) {
      const lastSeen = this.recentFingerprints.get(fingerprint)
      if (lastSeen && Date.now() - lastSeen < (this.config.deduplicationWindow as number)) {
        return null
      }
      this.recentFingerprints.set(fingerprint, Date.now())
    }

    const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const event = {
      id,
      message: errorMessage,
      severity: options.severity || 'error',
      category: options.category || 'unknown',
      fingerprint,
      reported: false,
    }
    this.pendingEvents.push(event)
    this.localEvents.push({ id, message: errorMessage })
    return id
  }

  getBreadcrumbs() { return this.breadcrumbs }
  getPendingEvents() { return this.pendingEvents }
  getLocalEvents() { return this.localEvents }
  clearLocalEvents() { this.localEvents = [] }
}

describe('ErrorReportingService', () => {
  let service: TestErrorReportingService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new TestErrorReportingService({})
  })

  describe('captureError', () => {
    it('captures Error objects', () => {
      const id = service.captureError(new Error('test error'))
      expect(id).toBeTruthy()
      const events = service.getPendingEvents()
      expect(events).toHaveLength(1)
      expect(events[0].message).toBe('test error')
    })

    it('captures string errors', () => {
      const id = service.captureError('string error')
      expect(id).toBeTruthy()
      expect(service.getPendingEvents()[0].message).toBe('string error')
    })

    it('captures object errors', () => {
      const id = service.captureError({ code: 500, msg: 'server error' })
      expect(id).toBeTruthy()
      expect(service.getPendingEvents()[0].message).toContain('server error')
    })

    it('uses default severity as error', () => {
      service.captureError(new Error('test'))
      expect(service.getPendingEvents()[0].severity).toBe('error')
    })

    it('accepts custom severity and category', () => {
      service.captureError(new Error('fatal!'), { severity: 'fatal', category: 'network' })
      const event = service.getPendingEvents()[0]
      expect(event.severity).toBe('fatal')
      expect(event.category).toBe('network')
    })

    it('deduplicates identical errors within window', () => {
      const id1 = service.captureError(new Error('same error'))
      const id2 = service.captureError(new Error('same error'))
      expect(id1).toBeTruthy()
      expect(id2).toBeNull()
    })

    it('allows same error after dedup window', () => {
      const svc = new TestErrorReportingService({ deduplicationWindow: 0 })
      const id1 = svc.captureError(new Error('same error'))
      const id2 = svc.captureError(new Error('same error'))
      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
    })
  })

  describe('breadcrumbs', () => {
    it('adds breadcrumbs', () => {
      service.addBreadcrumb({ type: 'click', category: 'ui', message: 'clicked button' })
      expect(service.getBreadcrumbs()).toHaveLength(1)
      expect(service.getBreadcrumbs()[0].message).toBe('clicked button')
    })

    it('trims breadcrumbs to maxBreadcrumbs', () => {
      const svc = new TestErrorReportingService({ maxBreadcrumbs: 3 })
      svc.addBreadcrumb({ type: 'click', category: 'ui', message: 'a' })
      svc.addBreadcrumb({ type: 'click', category: 'ui', message: 'b' })
      svc.addBreadcrumb({ type: 'click', category: 'ui', message: 'c' })
      svc.addBreadcrumb({ type: 'click', category: 'ui', message: 'd' })
      const crumbs = svc.getBreadcrumbs()
      expect(crumbs).toHaveLength(3)
      expect(crumbs[0].message).toBe('b')
    })
  })

  describe('local storage', () => {
    it('stores events locally', () => {
      service.captureError(new Error('local test'))
      expect(service.getLocalEvents()).toHaveLength(1)
    })

    it('clears local events', () => {
      service.captureError(new Error('to clear'))
      service.clearLocalEvents()
      expect(service.getLocalEvents()).toHaveLength(0)
    })
  })
})
