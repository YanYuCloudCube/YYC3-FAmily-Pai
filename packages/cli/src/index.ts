#!/usr/bin/env node
import { Command } from "commander"
import { add } from "./commands/add"
import { apply } from "./commands/apply"
import { build } from "./commands/build"
import { diff } from "./commands/diff"
import { docs } from "./commands/docs"
import { info } from "./commands/info"
import { init } from "./commands/init"
import { list } from "./commands/list"
import { mcp } from "./commands/mcp"
import { migrate } from "./commands/migrate"
import { registry } from "./commands/registry"
import { samples } from "./commands/samples"
import { search } from "./commands/search"
import { themes } from "./commands/themes"
import { view } from "./commands/view"
import { getSplashScreen } from "./utils/splash"

import packageJson from "../package.json"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  const program = new Command()
    .name("yyc3")
    .description("YYC³ UI 智能编程库 — 言启象限 | 语枢未来")
    .version(
      packageJson.version || "1.0.0",
      "-v, --version",
      "display the version number"
    )
    .action(() => {
      // 无子命令时显示情感启动画面 + 帮助信息
      console.log(getSplashScreen())
      program.help()
    })

  program
    .addCommand(init)
    .addCommand(apply)
    .addCommand(add)
    .addCommand(diff)
    .addCommand(docs)
    .addCommand(view)
    .addCommand(search)
    .addCommand(migrate)
    .addCommand(info)
    .addCommand(list)
    .addCommand(build)
    .addCommand(mcp)
    .addCommand(registry)
    .addCommand(samples)
    .addCommand(themes)

  return program
}

export const program = await main()

export * from "./registry/api"
