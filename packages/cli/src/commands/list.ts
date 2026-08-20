/**
 * file list.ts
 * description yyc3 list 命令 — 列出框架模板 / 业务样板 (T01-T20) / 主题
 * module @yyc3/cli/commands
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-08-19
 * status active
 *
 * brief 支持 `yyc3 list`（总览）、`--templates`、`--blueprints`、`--themes`、`--json`
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

import { Command } from "commander"
import { handleError } from "../utils/handle-error"
import { highlighter } from "../utils/highlighter"
import { logger } from "../utils/logger"
import { z } from "zod"
import { templates, BLUEPRINTS, blueprintDirExists } from "../templates/index"
import { findSample } from "../templates/samples"
import { ALL_THEMES } from "../themes/registry"

const listOptionsSchema = z.object({
  templates: z.boolean().default(false),
  blueprints: z.boolean().default(false),
  themes: z.boolean().default(false),
  json: z.boolean().default(false),
})

export const list = new Command()
  .name("list")
  .description("list available templates, blueprints (T01-T20) and themes")
  .option("-t, --templates", "list framework templates", false)
  .option("-b, --blueprints", "list business blueprints (T01-T20)", false)
  .option("--themes", "list themes", false)
  .option("--json", "output as JSON", false)
  .action(async (opts) => {
    try {
      const options = listOptionsSchema.parse(opts)

      // 无任何过滤时展示全部
      const showAll =
        !options.templates && !options.blueprints && !options.themes

      if (options.json) {
        const payload: Record<string, unknown> = {}
        if (options.templates || showAll) {
          payload.frameworkTemplates = Object.keys(templates)
        }
        if (options.blueprints || showAll) {
          payload.blueprints = BLUEPRINTS.map((b) => {
            const sample = findSample(b.name)
            return {
              id: b.id,
              name: b.name,
              label: sample?.label ?? b.name,
              description: sample?.description ?? "",
              port: b.port,
              categories: sample?.categories ?? [],
              components: sample?.components ?? [],
              themes: sample?.themes ?? [],
              available: blueprintDirExists(b),
            }
          })
        }
        if (options.themes || showAll) {
          payload.themes = ALL_THEMES.map((t) => ({
            name: t.name,
            label: t.label,
            layer: t.layer,
            categories: t.categories,
          }))
        }
        logger.log(JSON.stringify(payload, null, 2))
        return
      }

      if (options.templates || showAll) {
        logger.break()
        logger.log(highlighter.info("框架模板 (framework templates)"))
        for (const key of Object.keys(templates)) {
          logger.log(`  ${key.padEnd(14)} ${templates[key as keyof typeof templates].title}`)
        }
      }

      if (options.blueprints || showAll) {
        logger.break()
        logger.log(
          highlighter.info(`业务样板 (blueprints T01-T20) — ${BLUEPRINTS.length} 套`)
        )
        for (const b of BLUEPRINTS) {
          const sample = findSample(b.name)
          const label = sample?.label ?? b.name
          const available = blueprintDirExists(b)
          const mark = available ? "✓" : "✗ (实体缺失)"
          logger.log(
            `  ${b.id} ${highlighter.info(b.name.padEnd(24))} ${label} · 端口 ${b.port} · ${mark}`
          )
        }
        logger.break()
        logger.log(
          `  用法: yyc3 init -t <name> -n <project>  或  create-yyc3-app <project> --blueprint <name>`
        )
      }

      if (options.themes || showAll) {
        logger.break()
        logger.log(highlighter.info(`主题 (themes) — ${ALL_THEMES.length} 套`))
        const byLayer = new Map<string, string[]>()
        for (const theme of ALL_THEMES) {
          const group = byLayer.get(theme.layer) ?? []
          group.push(theme.name)
          byLayer.set(theme.layer, group)
        }
        for (const [layer, names] of byLayer) {
          logger.log(`  ${layer.padEnd(10)} ${names.join(", ")}`)
        }
      }

      logger.break()
    } catch (error) {
      handleError(error)
    }
  })
