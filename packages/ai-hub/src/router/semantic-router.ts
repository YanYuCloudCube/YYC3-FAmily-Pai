/**
 * file semantic-router.ts
 * description 轻量级语义路由器 — 基于 TF-IDF 余弦相似度
 * module @yyc3/ai-hub
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-19
 * updated 2026-05-19
 * status active
 * tags [router],[semantic]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief 轻量级语义路由器
 */

import { AgentRouter, AgentRouteRule } from '../agent-router.js'

export interface SemanticRoute {
  agent: string
  examples: string[]
  threshold: number
}

interface ScoredAgent {
  agent: string
  score: number
}

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[\s,.;:!?(){}[\]"'/\\]+/).filter(t => t.length > 1)
}

function computeTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>()
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1)
  }
  for (const [key, val] of tf) {
    tf.set(key, val / tokens.length)
  }
  return tf
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  const allKeys = new Set([...a.keys(), ...b.keys()])
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (const key of allKeys) {
    const va = a.get(key) || 0
    const vb = b.get(key) || 0
    dotProduct += va * vb
    normA += va * va
    normB += vb * vb
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export class SemanticRouter extends AgentRouter {
  private semanticRoutes: SemanticRoute[] = []
  private routeVectors: Map<string, Map<string, number>> = new Map()

  addSemanticRoute(route: SemanticRoute): void {
    this.semanticRoutes.push(route)
    for (const example of route.examples) {
      const key = `${route.agent}:${example}`
      this.routeVectors.set(key, computeTF(tokenize(example)))
    }
  }

  async route(task: string): Promise<string[]> {
    const taskVector = computeTF(tokenize(task))

    const scored: ScoredAgent[] = []

    for (const route of this.semanticRoutes) {
      let maxSimilarity = 0
      for (const example of route.examples) {
        const key = `${route.agent}:${example}`
        const exampleVector = this.routeVectors.get(key)
        if (exampleVector) {
          const similarity = cosineSimilarity(taskVector, exampleVector)
          maxSimilarity = Math.max(maxSimilarity, similarity)
        }
      }
      if (maxSimilarity >= route.threshold) {
        scored.push({ agent: route.agent, score: maxSimilarity })
      }
    }

    const keywordResults = AgentRouter.route(task)

    for (const agent of keywordResults) {
      if (!scored.find(s => s.agent === agent)) {
        scored.push({ agent, score: 0.5 })
      }
    }

    scored.sort((a, b) => b.score - a.score)

    return scored.slice(0, 3).map(s => s.agent)
  }

  getSemanticRoutes(): SemanticRoute[] {
    return [...this.semanticRoutes]
  }

  clearSemanticRoutes(): void {
    this.semanticRoutes = []
    this.routeVectors.clear()
  }
}
