/**
 * file samples.ts
 * description yyc3 samples 命令 — 列出/查看 20 套样板项目
 * module @yyc3/cli/commands
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.2.0
 * created 2026-06-20
 * status active
 *
 * brief 支持 `yyc3 samples`、`yyc3 samples <name>`、`yyc3 samples --category <cat>`
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
  SAMPLES,
  findSample,
  filterSamplesByCategory,
  listCategories,
  type SampleCategory,
} from "../templates/samples"
import { findBlueprint } from "../templates/blueprints"

const samplesOptionsSchema = z.object({
  category: z.string().optional(),
  json: z.boolean().default(false),
  list: z.boolean().default(false),
})

export const samples = new Command()
  .name("samples")
  .description("list and inspect 20 builtin YYC³ sample projects")
  .argument("[name]", "sample name to inspect (e.g. admin-dashboard)")
  .option("-c, --category <category>", "filter samples by category (e.g. ai, dashboard, saas)")
  .option("--json", "output as JSON", false)
  .option("--list", "list all sample names only", false)
  .action(async (name: string | undefined, opts) => {
    try {
      const options = samplesOptionsSchema.parse({
        category: opts.category,
        json: opts.json,
        list: opts.list,
      })

      // 1. 显示单个样板详情
      if (name) {
        const sample = findSample(name)
        if (!sample) {
          logger.error(
            `Sample ${highlighter.info(name)} not found. Use ${highlighter.info(
              "yyc3 samples --list"
            )} to view all samples.`
          )
          logger.break()
          process.exit(1)
        }

        if (options.json) {
          console.log(JSON.stringify(sample, null, 2))
          return
        }

        printSampleDetail(sample)
        return
      }

      // 2. 仅列出名称
      if (options.list && !options.category) {
        if (options.json) {
          console.log(JSON.stringify(SAMPLES.map((s) => s.name), null, 2))
          return
        }
        for (const s of SAMPLES) {
          logger.log(`  ${highlighter.info(s.name.padEnd(24))} ${s.label}`)
        }
        logger.break()
        logger.log(`  Total: ${SAMPLES.length} samples`)
        return
      }

      // 3. 按分类筛选
      let list = SAMPLES
      if (options.category) {
        if (!listCategories().includes(options.category as SampleCategory)) {
          logger.error(
            `Invalid category: ${highlighter.info(
              options.category
            )}. Available: ${listCategories().join(", ")}`
          )
          logger.break()
          process.exit(1)
        }
        list = filterSamplesByCategory(options.category as SampleCategory)
      }

      if (options.json) {
        console.log(JSON.stringify(list, null, 2))
        return
      }

      // 4. 表格化输出
      printSamplesTable(list, options.category)
    } catch (error) {
      handleError(error)
    }
  })

function printSamplesTable(list: typeof SAMPLES, category?: string) {
  const title = category
    ? `YYC³ Samples — ${category} (${list.length})`
    : `YYC³ Samples — All ${list.length} templates`

  logger.break()
  logger.log(highlighter.info(title))
  logger.break()

  // 表头
  logger.log(
    `  ${"NAME".padEnd(24)} ${"LABEL".padEnd(14)} ${"FRAMEWORK".padEnd(10)} ${"CATEGORIES".padEnd(28)} COMPONENTS`
  )
  logger.log(
    `  ${"-".repeat(24)} ${"-".repeat(14)} ${"-".repeat(10)} ${"-".repeat(28)} ${"-".repeat(16)}`
  )

  for (const s of list) {
    const cats = s.categories.slice(0, 3).join(", ")
    const components = s.components.slice(0, 2).join(", ") + (s.components.length > 2 ? "…" : "")
    logger.log(
      `  ${highlighter.info(s.name.padEnd(24))} ${s.label.padEnd(14)} ${s.framework.padEnd(10)} ${cats.padEnd(28)} ${components}`
    )
  }

  logger.break()
  logger.log(`  Use ${highlighter.info("yyc3 samples <name>")} to inspect details.`)
  logger.log(`  Use ${highlighter.info("yyc3 init <name> [project-name]")} to create a project.`)
  logger.break()
}

function printSampleDetail(sample: (typeof SAMPLES)[number]) {
  const blueprint = findBlueprint(sample.name)

  logger.break()
  logger.log(highlighter.info(`Sample: ${sample.name}`))
  logger.break()

  printEntries({
    name: sample.name,
    ...(blueprint
      ? { blueprint: `${blueprint.id} (${blueprint.dir})`, port: String(blueprint.port) }
      : {}),
    label: sample.label,
    description: sample.description,
    framework: sample.framework,
    style: sample.style,
    source: sample.source,
  })

  logger.break()
  logger.log(highlighter.info("Categories"))
  logger.log(`  ${sample.categories.join(", ")}`)

  logger.break()
  logger.log(highlighter.info("Components"))
  for (const c of sample.components) {
    logger.log(`  - ${c}`)
  }

  logger.break()
  logger.log(highlighter.info("Themes"))
  for (const t of sample.themes) {
    logger.log(`  - ${t}`)
  }

  logger.break()
  logger.log(highlighter.info("Files"))
  for (const f of sample.files) {
    logger.log(`  - ${f}`)
  }

  logger.break()
  logger.log(`  Create project: ${highlighter.info(`yyc3 init ${sample.name} my-project`)}`)
  logger.log(
    `  Or:            ${highlighter.info(`create-yyc3-app my-project --blueprint ${sample.name}`)}`
  )
  logger.break()
}

function printEntries(entries: Record<string, string>) {
  const maxKeyLength = Math.max(...Object.keys(entries).map((k) => k.length))
  for (const [key, value] of Object.entries(entries)) {
    logger.log(`  ${key.padEnd(maxKeyLength + 2)}${value}`)
  }
}
