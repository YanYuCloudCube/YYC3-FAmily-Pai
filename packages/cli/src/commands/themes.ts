/**
 * file themes.ts
 * description yyc3 themes 命令 — 列出/查看/应用 28 套主题
 * module @yyc3/cli/commands
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-06-20
 * status active
 *
 * brief 支持：
 *   yyc3 themes                    — 表格视图（全部 28 主题）
 *   yyc3 themes --list             — 简洁列表
 *   yyc3 themes <name>             — 主题详情
 *   yyc3 themes --layer <layer>   — 按层筛选（preset/visual/scenario）
 *   yyc3 themes --category <cat>   — 按分类筛选
 *   yyc3 themes --dark             — 仅暗色主题
 *   yyc3 themes --light            — 仅亮色主题
 *   yyc3 themes <name> --css       — 输出 CSS 变量
 *   yyc3 themes <name> --tailwind  — 输出 Tailwind 配置
 *   yyc3 themes <name> --json      — JSON 输出
 *   yyc3 themes --compose <preset>:<visual>:<scenario>  — 三层组合查询
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

import { Command } from "commander"
import { handleError } from "../utils/handle-error"
import { highlighter } from "../utils/highlighter"
import { logger } from "../utils/logger"
import { z } from "zod"
import {
  ALL_THEMES,
  THEME_COUNT,
  findTheme,
  filterThemesByLayer,
  filterThemesByCategory,
  listThemeNames,
  listAllCategories,
  getDarkThemes,
  getLightThemes,
  composeTheme,
  type ThemeLayer,
  type ThemeCategory,
} from "../themes/registry"
import {
  generateThemeCssVars,
  generateTailwindConfig,
  generateGlobalsCss,
} from "../themes/injector"

const themesOptionsSchema = z.object({
  layer: z.string().optional(),
  category: z.string().optional(),
  dark: z.boolean().default(false),
  light: z.boolean().default(false),
  css: z.boolean().default(false),
  tailwind: z.boolean().default(false),
  globals: z.boolean().default(false),
  json: z.boolean().default(false),
  list: z.boolean().default(false),
  compose: z.string().optional(),
})

export const themes = new Command()
  .name("themes")
  .description("list and inspect 28 YYC³ unified themes (3-layer architecture)")
  .argument("[name]", "theme name to inspect (e.g. cyberpunk)")
  .option("-l, --layer <layer>", "filter by layer (preset, visual, scenario)")
  .option("-c, --category <category>", "filter by category (e.g. ai, dark, minimal)")
  .option("--dark", "show only dark themes", false)
  .option("--light", "show only light themes", false)
  .option("--css", "output CSS variables for the theme", false)
  .option("--tailwind", "output Tailwind config snippet", false)
  .option("--globals", "output globals.css snippet", false)
  .option("--json", "output as JSON", false)
  .option("--list", "list all theme names only", false)
  .option("--compose <preset>:<visual>:<scenario>", "compose 3-layer theme")
  .action(async (name: string | undefined, opts) => {
    try {
      const options = themesOptionsSchema.parse({
        layer: opts.layer,
        category: opts.category,
        dark: opts.dark,
        light: opts.light,
        css: opts.css,
        tailwind: opts.tailwind,
        globals: opts.globals,
        json: opts.json,
        list: opts.list,
        compose: opts.compose,
      })

      // 1. 三层组合查询
      if (options.compose) {
        const parts = options.compose.split(":")
        if (parts.length !== 3) {
          logger.error(
            `Invalid --compose format. Use ${highlighter.info(
              "<preset>:<visual>:<scenario>"
            )} (e.g. nova:cyberpunk:ai-intelligent)`
          )
          process.exit(1)
        }
        const [presetName, visualName, scenarioName] = parts
        const result = composeTheme(presetName, visualName, scenarioName)

        if (!result.preset) {
          logger.error(`Preset theme ${highlighter.info(presetName)} not found.`)
          process.exit(1)
        }
        if (!result.visual) {
          logger.error(`Visual theme ${highlighter.info(visualName)} not found.`)
          process.exit(1)
        }
        if (!result.scenario) {
          logger.error(`Scenario theme ${highlighter.info(scenarioName)} not found.`)
          process.exit(1)
        }

        if (options.json) {
          console.log(JSON.stringify(result, null, 2))
          return
        }

        printComposedTheme(result)
        return
      }

      // 2. 显示单个主题详情
      if (name) {
        const theme = findTheme(name)
        if (!theme) {
          logger.error(
            `Theme ${highlighter.info(name)} not found. Use ${highlighter.info(
              "yyc3 themes --list"
            )} to view all themes.`
          )
          process.exit(1)
        }

        // 输出资源
        if (options.css) {
          console.log(generateThemeCssVars(theme))
          return
        }
        if (options.tailwind) {
          console.log(generateTailwindConfig(theme))
          return
        }
        if (options.globals) {
          console.log(generateGlobalsCss(theme))
          return
        }

        if (options.json) {
          console.log(JSON.stringify(theme, null, 2))
          return
        }

        printThemeDetail(theme)
        return
      }

      // 3. 仅列出名称
      if (options.list && !options.layer && !options.category && !options.dark && !options.light) {
        if (options.json) {
          console.log(JSON.stringify(listThemeNames(), null, 2))
          return
        }
        for (const t of ALL_THEMES) {
          logger.log(`  ${highlighter.info(t.name.padEnd(24))} [${t.layer.padEnd(8)}] ${t.label}`)
        }
        logger.break()
        logger.log(`  Total: ${THEME_COUNT} themes`)
        return
      }

      // 4. 筛选并表格输出
      let list = ALL_THEMES

      if (options.layer) {
        const validLayers: ThemeLayer[] = ["preset", "visual", "scenario"]
        if (!validLayers.includes(options.layer as ThemeLayer)) {
          logger.error(
            `Invalid layer: ${highlighter.info(
              options.layer
            )}. Available: ${validLayers.join(", ")}`
          )
          process.exit(1)
        }
        list = filterThemesByLayer(options.layer as ThemeLayer)
      }

      if (options.category) {
        const validCats = listAllCategories()
        if (!validCats.includes(options.category as ThemeCategory)) {
          logger.error(
            `Invalid category: ${highlighter.info(
              options.category
            )}. Available: ${validCats.join(", ")}`
          )
          process.exit(1)
        }
        list = list.filter((t) =>
          t.categories.includes(options.category as ThemeCategory)
        )
      }

      if (options.dark) {
        list = getDarkThemes()
      }
      if (options.light) {
        list = getLightThemes()
      }

      if (options.json) {
        console.log(JSON.stringify(list, null, 2))
        return
      }

      printThemesTable(list, {
        layer: options.layer,
        category: options.category,
        dark: options.dark,
        light: options.light,
      })
    } catch (error) {
      handleError(error)
    }
  })

function printThemesTable(
  list: typeof ALL_THEMES,
  filters: { layer?: string; category?: string; dark: boolean; light: boolean }
) {
  const filterDesc: string[] = []
  if (filters.layer) filterDesc.push(`layer=${filters.layer}`)
  if (filters.category) filterDesc.push(`category=${filters.category}`)
  if (filters.dark) filterDesc.push("dark only")
  if (filters.light) filterDesc.push("light only")

  const title = filterDesc.length > 0
    ? `YYC³ Themes — ${filterDesc.join(", ")} (${list.length})`
    : `YYC³ Themes — All ${THEME_COUNT} themes (3-layer architecture)`

  logger.break()
  logger.log(highlighter.info(title))
  logger.break()

  // 分组输出
  const layers: ThemeLayer[] = ["preset", "visual", "scenario"]
  for (const layer of layers) {
    const layerThemes = list.filter((t) => t.layer === layer)
    if (layerThemes.length === 0) continue

    const layerLabel = layer === "preset" ? "Base Preset Layer (7)" :
                       layer === "visual" ? "Visual Style Layer (11)" :
                       "Business Scenario Layer (10)"

    logger.log(highlighter.info(`  ${layerLabel}:`))
    logger.log(
      `    ${"NAME".padEnd(24)} ${"LABEL".padEnd(14)} ${"PRIMARY".padEnd(14)} ${"DARK".padEnd(5)} CATEGORIES`
    )
    logger.log(
      `    ${"-".repeat(24)} ${"-".repeat(14)} ${"-".repeat(14)} ${"-".repeat(5)} ${"-".repeat(20)}`
    )

    for (const t of layerThemes) {
      const cats = t.categories.slice(0, 3).join(", ")
      const dark = t.darkMode ? "Yes" : "No"
      const primary = t.primaryColor.length > 13
        ? t.primaryColor.slice(0, 11) + "..."
        : t.primaryColor
      logger.log(
        `    ${highlighter.info(t.name.padEnd(24))} ${t.label.padEnd(14)} ${primary.padEnd(14)} ${dark.padEnd(5)} ${cats}`
      )
    }
    logger.break()
  }

  logger.log(`  Use ${highlighter.info("yyc3 themes <name>")} to inspect details.`)
  logger.log(
    `  Use ${highlighter.info(
      "yyc3 themes <name> --css"
    )} to output CSS variables.`
  )
  logger.log(
    `  Use ${highlighter.info(
      "yyc3 themes --compose <preset>:<visual>:<scenario>"
    )} to compose 3-layer theme.`
  )
  logger.break()
}

function printThemeDetail(theme: (typeof ALL_THEMES)[number]) {
  logger.break()
  logger.log(highlighter.info(`Theme: ${theme.name}`))
  logger.break()

  printEntries({
    name: theme.name,
    label: theme.label,
    description: theme.description,
    layer: theme.layer,
    primaryColor: theme.primaryColor,
    backgroundColor: theme.backgroundColor,
    accentColor: theme.accentColor ?? "-",
    font: theme.font ?? "-",
    fontHeading: theme.fontHeading ?? "-",
    iconLibrary: theme.iconLibrary ?? "-",
    baseColor: theme.baseColor ?? "-",
    theme: theme.theme ?? "-",
    radius: theme.radius ?? "-",
    darkMode: theme.darkMode ? "Yes" : "No",
  })

  logger.break()
  logger.log(highlighter.info("Categories"))
  logger.log(`  ${theme.categories.join(", ")}`)

  if (theme.deps && theme.deps.length > 0) {
    logger.break()
    logger.log(highlighter.info("Dependencies"))
    for (const dep of theme.deps) {
      logger.log(`  - ${dep}`)
    }
  }

  if (theme.cssVars && Object.keys(theme.cssVars).length > 0) {
    logger.break()
    logger.log(highlighter.info("CSS Variables"))
    for (const [key, value] of Object.entries(theme.cssVars)) {
      logger.log(`  ${key}: ${value}`)
    }
  }

  if (theme.samples && theme.samples.length > 0) {
    logger.break()
    logger.log(highlighter.info("Related Samples"))
    for (const s of theme.samples) {
      logger.log(`  - ${s}`)
    }
  }

  logger.break()
  logger.log(`  Generate CSS:    ${highlighter.info(`yyc3 themes ${theme.name} --css`)}`)
  logger.log(`  Generate Tailwind: ${highlighter.info(`yyc3 themes ${theme.name} --tailwind`)}`)
  logger.log(`  Generate globals.css: ${highlighter.info(`yyc3 themes ${theme.name} --globals`)}`)
  logger.break()
}

function printComposedTheme(result: ReturnType<typeof composeTheme>) {
  logger.break()
  logger.log(highlighter.info("Composed Theme (3-layer)"))
  logger.break()

  const { preset, visual, scenario, composed } = result

  logger.log(`  Preset:    ${highlighter.info(preset?.name ?? "-")}  (${preset?.label ?? "-"})`)
  logger.log(`  Visual:    ${highlighter.info(visual?.name ?? "-")}  (${visual?.label ?? "-"})`)
  logger.log(`  Scenario:  ${highlighter.info(scenario?.name ?? "-")}  (${scenario?.label ?? "-"})`)
  logger.break()

  logger.log(highlighter.info("Composed Values"))
  printEntries({
    primaryColor: composed.primaryColor,
    backgroundColor: composed.backgroundColor,
    accentColor: composed.accentColor ?? "-",
    font: composed.font ?? "-",
    fontHeading: composed.fontHeading ?? "-",
    iconLibrary: composed.iconLibrary ?? "-",
    radius: composed.radius ?? "-",
    darkMode: composed.darkMode ? "Yes" : "No",
  })

  if (Object.keys(composed.cssVars).length > 0) {
    logger.break()
    logger.log(highlighter.info("Merged CSS Variables"))
    for (const [key, value] of Object.entries(composed.cssVars)) {
      logger.log(`  ${key}: ${value}`)
    }
  }

  logger.break()
  logger.log(
    `  Use ${highlighter.info(
      "yyc3 themes --compose <preset>:<visual>:<scenario> --json"
    )} for JSON output.`
  )
  logger.break()
}

function printEntries(entries: Record<string, string>) {
  const maxKeyLength = Math.max(...Object.keys(entries).map((k) => k.length))
  for (const [key, value] of Object.entries(entries)) {
    logger.log(`  ${key.padEnd(maxKeyLength + 2)}${value}`)
  }
}
