/**
 * file samples.test.ts
 * description 样板注册模块单元测试
 */

import { describe, it, expect } from "vitest"
import {
  SAMPLES,
  findSample,
  filterSamplesByCategory,
  listSampleNames,
  listCategories,
  type SampleConfig,
} from "../templates/samples"

describe("samples registry", () => {
  it("should register exactly 20 samples", () => {
    expect(SAMPLES.length).toBe(20)
  })

  it("every sample has a unique name", () => {
    const names = SAMPLES.map((s) => s.name)
    const unique = new Set(names)
    expect(unique.size).toBe(names.length)
  })

  it("every sample has a non-empty label and description", () => {
    for (const s of SAMPLES) {
      expect(s.label.length).toBeGreaterThan(0)
      expect(s.description.length).toBeGreaterThan(0)
    }
  })

  it("every sample has at least one category and one component", () => {
    for (const s of SAMPLES) {
      expect(s.categories.length).toBeGreaterThan(0)
      expect(s.components.length).toBeGreaterThan(0)
    }
  })

  it("every sample has at least one theme", () => {
    for (const s of SAMPLES) {
      expect(s.themes.length).toBeGreaterThan(0)
    }
  })

  it("every sample has a files array with package.json", () => {
    for (const s of SAMPLES) {
      expect(s.files).toContain("package.json")
    }
  })

  it("every sample framework is a known value", () => {
    const validFrameworks: SampleConfig["framework"][] = [
      "next",
      "vite",
      "astro",
      "laravel",
      "react-router",
      "start",
    ]
    for (const s of SAMPLES) {
      expect(validFrameworks).toContain(s.framework)
    }
  })

  it("all 20 samples are Next.js framework", () => {
    // 当前 20 套样板全部基于 Next.js
    expect(SAMPLES.every((s) => s.framework === "next")).toBe(true)
  })
})

describe("findSample", () => {
  it("should find existing sample by name", () => {
    const result = findSample("admin-dashboard")
    expect(result).toBeDefined()
    expect(result?.label).toBe("管理仪表盘")
  })

  it("should return undefined for unknown name", () => {
    expect(findSample("non-existent")).toBeUndefined()
  })
})

describe("filterSamplesByCategory", () => {
  it("should filter samples by 'ai' category", () => {
    const aiSamples = filterSamplesByCategory("ai")
    expect(aiSamples.length).toBe(4)
    expect(aiSamples.map((s) => s.name).sort()).toEqual(
      ["ai-call-center", "ai-code-ide", "ai-intelligent-center", "ai-medical"].sort()
    )
  })

  it("should filter samples by 'dashboard' category", () => {
    const dashboards = filterSamplesByCategory("dashboard")
    expect(dashboards.length).toBeGreaterThanOrEqual(4)
  })

  it("should return empty array for unknown category", () => {
    // @ts-expect-error 测试未知分类
    const result = filterSamplesByCategory("unknown-category")
    expect(result.length).toBe(0)
  })
})

describe("listSampleNames", () => {
  it("should return 20 sample names", () => {
    const names = listSampleNames()
    expect(names.length).toBe(20)
  })

  it("should include admin-dashboard", () => {
    expect(listSampleNames()).toContain("admin-dashboard")
  })
})

describe("listCategories", () => {
  it("should return sorted unique categories", () => {
    const cats = listCategories()
    // 去重检查
    const unique = new Set(cats)
    expect(unique.size).toBe(cats.length)
    // 排序检查
    const sorted = [...cats].sort()
    expect(cats).toEqual(sorted)
  })

  it("should include common categories", () => {
    const cats = listCategories()
    expect(cats).toContain("ai")
    expect(cats).toContain("dashboard")
    expect(cats).toContain("enterprise")
  })
})

describe("samples include all 5 major categories", () => {
  it("should have AI category (4 samples)", () => {
    expect(filterSamplesByCategory("ai").length).toBe(4)
  })

  it("should have dashboard category (>=4 samples)", () => {
    expect(filterSamplesByCategory("dashboard").length).toBeGreaterThanOrEqual(4)
  })

  it("should have enterprise category (>=4 samples)", () => {
    expect(filterSamplesByCategory("enterprise").length).toBeGreaterThanOrEqual(4)
  })

  it("should have 3d category", () => {
    expect(filterSamplesByCategory("3d").length).toBeGreaterThanOrEqual(2)
  })

  it("should have education category", () => {
    expect(filterSamplesByCategory("education").length).toBeGreaterThanOrEqual(1)
  })
})
