/**
 * file themes.test.ts
 * description 28 主题注册中心与三层架构单元测试
 */

import { describe, it, expect } from "vitest"
import {
  ALL_THEMES,
  THEME_COUNT,
  BASE_PRESETS,
  VISUAL_STYLES,
  BUSINESS_SCENARIOS,
  findTheme,
  filterThemesByLayer,
  filterThemesByCategory,
  listThemeNames,
  listAllCategories,
  getDarkThemes,
  getLightThemes,
  composeTheme,
  validateTheme,
  type ThemeConfig,
} from "../themes/registry"
import {
  generateThemeCssVars,
  generateTailwindConfig,
  generateGlobalsCss,
  generateThemeSwitcherScript,
  generateThemeHook,
} from "../themes/injector"

describe("themes registry — basic counts", () => {
  it("should register exactly 28 themes", () => {
    expect(THEME_COUNT).toBe(28)
    expect(ALL_THEMES.length).toBe(28)
  })

  it("should have 7 base presets", () => {
    expect(BASE_PRESETS.length).toBe(7)
  })

  it("should have 11 visual styles", () => {
    expect(VISUAL_STYLES.length).toBe(11)
  })

  it("should have 10 business scenarios", () => {
    expect(BUSINESS_SCENARIOS.length).toBe(10)
  })

  it("7 + 11 + 10 = 28", () => {
    expect(BASE_PRESETS.length + VISUAL_STYLES.length + BUSINESS_SCENARIOS.length).toBe(28)
  })
})

describe("themes registry — uniqueness", () => {
  it("every theme has a unique name", () => {
    const names = ALL_THEMES.map((t) => t.name)
    const unique = new Set(names)
    expect(unique.size).toBe(names.length)
  })

  it("every theme has a non-empty label and description", () => {
    for (const t of ALL_THEMES) {
      expect(t.label.length).toBeGreaterThan(0)
      expect(t.description.length).toBeGreaterThan(0)
    }
  })

  it("every theme has at least one category", () => {
    for (const t of ALL_THEMES) {
      expect(t.categories.length).toBeGreaterThan(0)
    }
  })

  it("every theme has primaryColor and backgroundColor", () => {
    for (const t of ALL_THEMES) {
      expect(t.primaryColor.length).toBeGreaterThan(0)
      expect(t.backgroundColor.length).toBeGreaterThan(0)
    }
  })
})

describe("themes registry — layer distribution", () => {
  it("every theme has a valid layer", () => {
    const validLayers = ["preset", "visual", "scenario"]
    for (const t of ALL_THEMES) {
      expect(validLayers).toContain(t.layer)
    }
  })

  it("filterThemesByLayer('preset') returns 7", () => {
    expect(filterThemesByLayer("preset").length).toBe(7)
  })

  it("filterThemesByLayer('visual') returns 11", () => {
    expect(filterThemesByLayer("visual").length).toBe(11)
  })

  it("filterThemesByLayer('scenario') returns 10", () => {
    expect(filterThemesByLayer("scenario").length).toBe(10)
  })
})

describe("findTheme", () => {
  it("should find existing theme by name", () => {
    const result = findTheme("cyberpunk")
    expect(result).toBeDefined()
    expect(result?.label).toBe("赛博朋克")
  })

  it("should return undefined for unknown name", () => {
    expect(findTheme("non-existent")).toBeUndefined()
  })

  it("should find all 28 themes by name", () => {
    for (const t of ALL_THEMES) {
      expect(findTheme(t.name)).toBeDefined()
    }
  })
})

describe("filterThemesByCategory", () => {
  it("should filter by 'dark' category", () => {
    const dark = filterThemesByCategory("dark")
    expect(dark.length).toBeGreaterThan(0)
    for (const t of dark) {
      expect(t.categories).toContain("dark")
    }
  })

  it("should filter by 'ai' category", () => {
    const ai = filterThemesByCategory("ai")
    expect(ai.length).toBe(1)
    expect(ai[0].name).toBe("ai-intelligent")
  })

  it("should return empty array for unknown category", () => {
    // @ts-expect-error 测试未知分类
    const result = filterThemesByCategory("unknown-category")
    expect(result.length).toBe(0)
  })
})

describe("listThemeNames", () => {
  it("should return 28 theme names", () => {
    expect(listThemeNames().length).toBe(28)
  })

  it("should include 'cyberpunk' and 'yyc3-brand'", () => {
    const names = listThemeNames()
    expect(names).toContain("cyberpunk")
    expect(names).toContain("yyc3-brand")
    expect(names).toContain("nova")
    expect(names).toContain("ai-intelligent")
  })
})

describe("listAllCategories", () => {
  it("should return sorted unique categories", () => {
    const cats = listAllCategories()
    const unique = new Set(cats)
    expect(unique.size).toBe(cats.length)
    const sorted = [...cats].sort()
    expect(cats).toEqual(sorted)
  })

  it("should include common categories", () => {
    const cats = listAllCategories()
    expect(cats).toContain("ai")
    expect(cats).toContain("dark")
    expect(cats).toContain("minimal")
    expect(cats).toContain("professional")
  })
})

describe("getDarkThemes / getLightThemes", () => {
  it("getDarkThemes returns only darkMode=true themes", () => {
    const dark = getDarkThemes()
    for (const t of dark) {
      expect(t.darkMode).toBe(true)
    }
  })

  it("getLightThemes returns only darkMode=false themes", () => {
    const light = getLightThemes()
    for (const t of light) {
      expect(t.darkMode).toBe(false)
    }
  })

  it("dark + light = total themes", () => {
    // 注意：darkMode undefined 的会被排除在两者之外
    const dark = getDarkThemes().length
    const light = getLightThemes().length
    const total = ALL_THEMES.filter((t) => t.darkMode !== undefined).length
    expect(dark + light).toBe(total)
  })
})

describe("composeTheme — 3-layer composition", () => {
  it("should compose valid 3-layer theme", () => {
    const result = composeTheme("nova", "cyberpunk", "ai-intelligent")
    expect(result.preset?.name).toBe("nova")
    expect(result.visual?.name).toBe("cyberpunk")
    expect(result.scenario?.name).toBe("ai-intelligent")
  })

  it("scenario layer should take priority in composition", () => {
    const result = composeTheme("nova", "cyberpunk", "ai-intelligent")
    // scenario 的 primaryColor 应该优先
    expect(result.composed.primaryColor).toBe(result.scenario?.primaryColor)
  })

  it("should merge CSS vars from all 3 layers", () => {
    const result = composeTheme("nova", "cyberpunk", "cyber-futuristic")
    // cyberpunk 有 cyber-* 变量，cyber-futuristic 可能有 deps
    expect(Object.keys(result.composed.cssVars).length).toBeGreaterThan(0)
  })

  it("should handle unknown theme names gracefully", () => {
    const result = composeTheme("unknown", "cyberpunk", "ai-intelligent")
    expect(result.preset).toBeUndefined()
    // 仍然返回 visual 和 scenario
    expect(result.visual).toBeDefined()
    expect(result.scenario).toBeDefined()
  })
})

describe("validateTheme", () => {
  it("should return no errors for valid theme", () => {
    const valid: ThemeConfig = {
      name: "test",
      label: "Test",
      description: "Test theme",
      layer: "visual",
      categories: ["minimal"],
      primaryColor: "#000000",
      backgroundColor: "#ffffff",
    }
    expect(validateTheme(valid)).toEqual([])
  })

  it("should detect missing name", () => {
    const invalid = {
      name: "",
      label: "Test",
      description: "Test",
      layer: "visual",
      categories: ["minimal"],
      primaryColor: "#000",
      backgroundColor: "#fff",
    }
    const errors = validateTheme(invalid as ThemeConfig)
    expect(errors).toContain("Missing name")
  })

  it("should detect empty categories", () => {
    const invalid = {
      name: "test",
      label: "Test",
      description: "Test",
      layer: "visual",
      categories: [],
      primaryColor: "#000",
      backgroundColor: "#fff",
    }
    const errors = validateTheme(invalid as ThemeConfig)
    expect(errors).toContain("Missing categories")
  })
})

describe("injector — CSS generation", () => {
  const sampleTheme: ThemeConfig = {
    name: "test-theme",
    label: "Test",
    description: "Test theme",
    layer: "visual",
    categories: ["minimal"],
    primaryColor: "#00d4ff",
    backgroundColor: "#0a0a0f",
    accentColor: "#ff00ff",
    radius: "lg",
    darkMode: true,
    cssVars: {
      "--test-glow": "0 0 10px rgba(0, 212, 255, 0.5)",
    },
  }

  it("generateThemeCssVars should produce :root[data-theme] selector", () => {
    const css = generateThemeCssVars(sampleTheme)
    expect(css).toContain(':root[data-theme="test-theme"]')
    expect(css).toContain("--primary: #00d4ff")
    expect(css).toContain("--background: #0a0a0f")
    expect(css).toContain("--accent: #ff00ff")
    expect(css).toContain("--test-glow: 0 0 10px rgba(0, 212, 255, 0.5)")
  })

  it("generateThemeCssVars should include --radius", () => {
    const css = generateThemeCssVars(sampleTheme)
    expect(css).toContain("--radius: 1rem")
  })

  it("generateTailwindConfig should produce themeConfig export", () => {
    const config = generateTailwindConfig(sampleTheme)
    expect(config).toContain("export const themeConfig")
    expect(config).toContain('"primary": "var(--primary)"')
    expect(config).toContain('"background": "var(--background)"')
  })

  it("generateGlobalsCss should produce @layer base", () => {
    const css = generateGlobalsCss(sampleTheme)
    expect(css).toContain("@layer base")
    expect(css).toContain('[data-theme="test-theme"] body')
    expect(css).toContain("background-color: var(--background)")
  })

  it("generateThemeSwitcherScript should produce IIFE", () => {
    const script = generateThemeSwitcherScript()
    expect(script).toContain("(function()")
    expect(script).toContain("YYC3Theme")
    expect(script).toContain("applyTheme")
    expect(script).toContain("localStorage")
  })

  it("generateThemeHook should produce useYYC3Theme hook", () => {
    const hook = generateThemeHook()
    expect(hook).toContain("useYYC3Theme")
    expect(hook).toContain("useState")
    expect(hook).toContain("setTheme")
    expect(hook).toContain("toggleDark")
  })
})

describe("themes registry — scenario samples mapping", () => {
  it("ai-intelligent scenario should map to AI samples", () => {
    const ai = findTheme("ai-intelligent")
    expect(ai?.samples).toEqual(
      expect.arrayContaining([
        "ai-intelligent-center",
        "ai-medical",
        "ai-code-ide",
        "ai-call-center",
      ])
    )
  })

  it("business-management scenario should map to admin samples", () => {
    const biz = findTheme("business-management")
    expect(biz?.samples).toEqual(
      expect.arrayContaining(["admin-dashboard", "crm-system", "saas-platform"])
    )
  })

  it("cyber-futuristic scenario should map to landing/3d samples", () => {
    const cyber = findTheme("cyber-futuristic")
    expect(cyber?.samples).toEqual(
      expect.arrayContaining(["landing-page", "3d-portal", "portfolio", "smart-city"])
    )
  })
})

describe("themes registry — known themes existence", () => {
  const expectedThemes = [
    // Base presets (7)
    "nova", "vega", "maia", "lyra", "mira", "luma", "sera",
    // Visual styles (11)
    "yyc3-brand", "cyberpunk", "futuristic", "aurora", "liquid-glass",
    "medical", "musical", "hacker", "dark-minimal", "professional", "yyc3-dark",
    // Business scenarios (10)
    "ai-intelligent", "business-management", "cli-devops", "cyber-futuristic",
    "dashboard-data", "education-learning", "finance-quantitative",
    "medical-health", "minimal-zero", "aurora-gradient",
  ]

  it("should contain all 28 expected theme names", () => {
    for (const name of expectedThemes) {
      expect(findTheme(name)).toBeDefined()
    }
  })

  it("expected themes count should be 28", () => {
    expect(expectedThemes.length).toBe(28)
  })
})
