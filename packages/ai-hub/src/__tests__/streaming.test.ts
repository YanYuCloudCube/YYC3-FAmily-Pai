import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StreamManager, collectStream, createStreamGenerator } from '../streaming/index'
import type { StreamChunk } from '../streaming/index'

describe('StreamManager', () => {
  let manager: StreamManager

  beforeEach(() => {
    manager = new StreamManager()
  })

  it('emits text chunks to listeners', () => {
    const listener = vi.fn()
    manager.onChunk(listener)
    manager.emitText('hello')
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'text', content: 'hello' })
    )
  })

  it('emits thinking chunks', () => {
    const listener = vi.fn()
    manager.onChunk(listener)
    manager.emitThinking('reasoning...', 'agent-1')
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'thinking', content: 'reasoning...', agentId: 'agent-1' })
    )
  })

  it('emits tool_call chunks', () => {
    const listener = vi.fn()
    manager.onChunk(listener)
    manager.emitToolCall('search("query")', 'agent-2')
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'tool_call', content: 'search("query")', agentId: 'agent-2' })
    )
  })

  it('emits done chunks', () => {
    const listener = vi.fn()
    manager.onChunk(listener)
    manager.emitDone()
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'done', content: '' })
    )
  })

  it('emits error chunks', () => {
    const listener = vi.fn()
    manager.onChunk(listener)
    manager.emitError('something failed')
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', content: 'something failed' })
    )
  })

  it('supports multiple listeners', () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    manager.onChunk(listener1)
    manager.onChunk(listener2)
    manager.emitText('broadcast')
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)
  })

  it('unsubscribe removes listener', () => {
    const listener = vi.fn()
    const unsub = manager.onChunk(listener)
    manager.emitText('first')
    unsub()
    manager.emitText('second')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('does not emit after abort', () => {
    const listener = vi.fn()
    manager.onChunk(listener)
    manager.abort()
    manager.emitText('should not emit')
    expect(listener).not.toHaveBeenCalled()
    expect(manager.isAborted()).toBe(true)
  })

  it('reset clears abort state and listeners', () => {
    const listener = vi.fn()
    manager.onChunk(listener)
    manager.abort()
    manager.reset()
    expect(manager.isAborted()).toBe(false)
    manager.emitText('after reset')
    expect(listener).not.toHaveBeenCalled()
  })

  it('chunks have timestamps', () => {
    const listener = vi.fn()
    manager.onChunk(listener)
    const before = Date.now()
    manager.emitText('timed')
    const after = Date.now()
    const chunk = listener.mock.calls[0][0] as StreamChunk
    expect(chunk.timestamp).toBeGreaterThanOrEqual(before)
    expect(chunk.timestamp).toBeLessThanOrEqual(after)
  })

  it('createChunk factory creates valid chunk', () => {
    const chunk = StreamManager.createChunk('text', 'hello', 'agent-1')
    expect(chunk.type).toBe('text')
    expect(chunk.content).toBe('hello')
    expect(chunk.agentId).toBe('agent-1')
    expect(typeof chunk.timestamp).toBe('number')
  })
})

describe('collectStream', () => {
  it('collects only text chunks into a string', () => {
    const chunks: StreamChunk[] = [
      { type: 'text', content: 'Hello ', timestamp: 0 },
      { type: 'thinking', content: 'ignored', timestamp: 0 },
      { type: 'text', content: 'World', timestamp: 0 },
      { type: 'done', content: '', timestamp: 0 },
    ]
    expect(collectStream(chunks)).toBe('Hello World')
  })

  it('returns empty string for no text chunks', () => {
    const chunks: StreamChunk[] = [
      { type: 'thinking', content: 'hmm', timestamp: 0 },
      { type: 'done', content: '', timestamp: 0 },
    ]
    expect(collectStream(chunks)).toBe('')
  })

  it('returns empty string for empty array', () => {
    expect(collectStream([])).toBe('')
  })
})

describe('createStreamGenerator', () => {
  it('yields done for null source', async () => {
    const chunks: StreamChunk[] = []
    for await (const chunk of createStreamGenerator(null)) {
      chunks.push(chunk)
    }
    expect(chunks).toHaveLength(1)
    expect(chunks[0].type).toBe('done')
  })

  it('yields text chunks from readable stream', async () => {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('chunk1'))
        controller.enqueue(encoder.encode('chunk2'))
        controller.close()
      },
    })

    const chunks: StreamChunk[] = []
    for await (const chunk of createStreamGenerator(stream)) {
      chunks.push(chunk)
    }

    expect(chunks).toHaveLength(3)
    expect(chunks[0]).toEqual(expect.objectContaining({ type: 'text', content: 'chunk1' }))
    expect(chunks[1]).toEqual(expect.objectContaining({ type: 'text', content: 'chunk2' }))
    expect(chunks[2]).toEqual(expect.objectContaining({ type: 'done' }))
  })
})
