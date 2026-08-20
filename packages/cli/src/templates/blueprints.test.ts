/**
 * file blueprints.test.ts
 * description 蓝图注册表完整性测试 — 20 套元数据与实体目录对齐
 * module @yyc3/cli/templates
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-08-19
 * status active
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

import { describe, expect, it } from "vitest"
import {
  BLUEPRINTS,
  BLUEPRINT_UI_VERSION,
  blueprintDefaultTheme,
  blueprintDirExists,
  findBlueprint,
} from "./blueprints"
import { findSample, SAMPLES } from "./samples"
import { findTheme } from "../themes/registry"

describe("BLUEPRINTS 注册表", () => {
  it("应包含 20 套蓝图（T01-T20）", () => {
    expect(BLUEPRINTS).toHaveLength(20)
    expect(BLUEPRINTS.map((b) => b.id)).toEqual(
      Array.from({ length: 20 }, (_, i) => `T${String(i + 1).padStart(2, "0")}`)
    )
  })

  it("名称与目录名唯一", () => {
    const names = BLUEPRINTS.map((b) => b.name)
    const dirs = BLUEPRINTS.map((b) => b.dir)
    expect(new Set(names).size).toBe(20)
    expect(new Set(dirs).size).toBe(20)
  })

  it("目录名以编号开头且包含语义名", () => {
    for (const b of BLUEPRINTS) {
      expect(b.dir).toContain(b.id)
      expect(b.dir.toLowerCase()).toContain(b.name)
    }
  })

  it("端口均在团队合规区间 3200-3500 且唯一", () => {
    const ports = BLUEPRINTS.map((b) => b.port)
    expect(new Set(ports).size).toBe(20)
    for (const port of ports) {
      expect(port).toBeGreaterThanOrEqual(3200)
      expect(port).toBeLessThanOrEqual(3500)
    }
  })

  it("每套蓝图都有对应的 samples 展示元数据", () => {
    for (const b of BLUEPRINTS) {
      const sample = findSample(b.name)
      expect(sample, `${b.id} ${b.name} 缺少 samples 元数据`).toBeDefined()
      expect(sample!.label.length).toBeGreaterThan(0)
      expect(sample!.description.length).toBeGreaterThan(0)
      expect(sample!.components.length).toBeGreaterThan(0)
    }
  })

  it("每套蓝图都有对应的实体目录", () => {
    for (const b of BLUEPRINTS) {
      expect(
        blueprintDirExists(b),
        `${b.id} 实体目录缺失: ${b.dir}`
      ).toBe(true)
    }
  })

  it("samples 20 套全部有蓝图实体（一一对应）", () => {
    expect(SAMPLES).toHaveLength(20)
    for (const s of SAMPLES) {
      expect(findBlueprint(s.name), `${s.name} 无蓝图实体`).toBeDefined()
    }
  })
})

describe("findBlueprint", () => {
  it("支持语义名", () => {
    expect(findBlueprint("admin-dashboard")?.id).toBe("T02")
    expect(findBlueprint("forum-community")?.id).toBe("T20")
  })

  it("支持编号（大小写不敏感）", () => {
    expect(findBlueprint("T02")?.name).toBe("admin-dashboard")
    expect(findBlueprint("t09")?.name).toBe("data-dashboard")
  })

  it("支持目录名", () => {
    expect(findBlueprint("T02-admin-dashboard")?.name).toBe("admin-dashboard")
  })

  it("未知输入返回 undefined", () => {
    expect(findBlueprint("not-exist")).toBeUndefined()
    expect(findBlueprint("")).toBeUndefined()
  })
})

describe("blueprintDefaultTheme", () => {
  it("默认主题均存在于主题注册表（28 套）", () => {
    for (const b of BLUEPRINTS) {
      const themeName = blueprintDefaultTheme(b)
      expect(
        findTheme(themeName),
        `${b.name} 默认主题 ${themeName} 不在 themes registry`
      ).toBeDefined()
    }
  })
})

describe("BLUEPRINT_UI_VERSION", () => {
  it("目标版本为 ^3.0.0（对齐 @yyc3/ui v3 发布线）", () => {
    expect(BLUEPRINT_UI_VERSION).toBe("^3.0.0")
  })
})
