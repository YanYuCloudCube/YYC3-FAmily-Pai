/**
 * file scaffold-blueprint.test.ts
 * description 样板脚手架管线测试 — 复制定制 / components.json / 主题注入
 * module @yyc3/cli/templates
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-08-19
 * status active
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

import { afterEach, describe, expect, it } from "vitest"
import fs from "fs-extra"
import os from "os"
import path from "path"
import {
  buildComponentsJson,
  buildReadme,
  customizePackageJson,
  injectThemeIntoGlobalsCss,
  replacePort,
  scaffoldBlueprint,
} from "./scaffold-blueprint"
import { BLUEPRINTS, findBlueprint } from "./blueprints"
import { findTheme } from "../themes/registry"

let tmpDir: string

afterEach(async () => {
  if (tmpDir) {
    await fs.remove(tmpDir)
    tmpDir = ""
  }
})

async function makeTmp(): Promise<string> {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "yyc3-scaffold-"))
  return tmpDir
}

describe("replacePort", () => {
  it("替换 --port 形式", () => {
    expect(replacePort("next dev --turbopack --port 3201", 3300)).toBe(
      "next dev --turbopack --port 3300"
    )
  })

  it("替换 -p 形式", () => {
    expect(replacePort("next start -p 3201", 4000)).toBe("next start -p 4000")
  })

  it("无端口时追加", () => {
    expect(replacePort("next dev", 3200)).toBe("next dev --port 3200")
  })
})

describe("buildComponentsJson", () => {
  it("生成 shadcn 协议配置且别名对齐蓝图", () => {
    const config = buildComponentsJson()
    expect(config.style).toBe("new-york")
    expect(config.rsc).toBe(true)
    expect(config.tsx).toBe(true)
    expect(config).toHaveProperty("$schema")
    const tailwind = config.tailwind as Record<string, unknown>
    expect(tailwind.css).toBe("app/globals.css")
    expect(tailwind.cssVariables).toBe(true)
    const aliases = config.aliases as Record<string, string>
    expect(aliases.components).toBe("@/components")
    expect(aliases.utils).toBe("@/lib/utils")
  })
})

describe("customizePackageJson", () => {
  it("改写项目名 / 端口 / @yyc3 依赖版本", async () => {
    const dir = await makeTmp()
    await fs.writeJson(path.join(dir, "package.json"), {
      name: "yyc3-admin-dashboard",
      private: true,
      scripts: {
        dev: "next dev --turbopack --port 3201",
        start: "next start --port 3201",
        build: "next build",
      },
      dependencies: {
        "@yyc3/ui": "^2.0.2",
        next: "^15.3.0",
        react: "^19.1.0",
      },
    })

    await customizePackageJson(dir, "my-project", 4300)

    const pkg = await fs.readJson(path.join(dir, "package.json"))
    expect(pkg.name).toBe("my-project")
    expect(pkg.scripts.dev).toContain("--port 4300")
    expect(pkg.scripts.start).toContain("--port 4300")
    expect(pkg.scripts.build).toBe("next build")
    expect(pkg.dependencies["@yyc3/ui"]).toBe("^3.0.0")
    expect(pkg.dependencies.next).toBe("^15.3.0")
    expect(pkg.private).toBe(true)
  })
})

describe("injectThemeIntoGlobalsCss", () => {
  const css = `@import "tailwindcss";

:root {
  --primary: oklch(0.45 0.18 264);
  --background: oklch(1 0 0);
  --accent: oklch(0.97 0.002 285.823);
  --radius: 0.625rem;
}

.dark {
  --primary: oklch(0.7 0.15 260);
  --background: oklch(0.145 0.017 285.823);
}
`

  it("替换 :root 与 .dark 的关键变量", () => {
    const theme = {
      name: "test",
      label: "测试",
      description: "",
      layer: "visual",
      categories: [],
      primaryColor: "#00f0ff",
      backgroundColor: "#0a0a0f",
      accentColor: "#ff00ff",
      radius: "lg",
    }
    const result = injectThemeIntoGlobalsCss(css, theme as never)

    expect(result).toContain(":root")
    expect(result).toMatch(/--primary:\s*#00f0ff/)
    expect(result).toMatch(/--background:\s*#0a0a0f/)
    expect(result).toMatch(/--accent:\s*#ff00ff/)
    expect(result).toMatch(/--ring:\s*#00f0ff/)
    // .dark 只覆盖 primary/ring，保留原生暗色背景
    expect(result).toMatch(/\.dark[\s\S]*?--primary:\s*#00f0ff/)
    expect(result).toMatch(/\.dark[\s\S]*?--background:\s*oklch\(0\.145 0\.017 285\.823\)/)
    // 未涉及的变量保持不变
    expect(result).toContain("--radius: 0.625rem")
  })

  it("主题 cssVars 追加到 :root", () => {
    const theme = {
      name: "cyberpunk",
      label: "赛博朋克",
      description: "",
      layer: "visual",
      categories: [],
      primaryColor: "#00f0ff",
      backgroundColor: "#0a0a0f",
      cssVars: { "--cyber-glow": "0 0 20px rgba(0, 240, 255, 0.3)" },
      radius: "default",
    }
    const result = injectThemeIntoGlobalsCss(css, theme as never)
    expect(result).toContain("--cyber-glow: 0 0 20px rgba(0, 240, 255, 0.3)")
  })

  it("用真实注册表主题注入不破坏结构", () => {
    const theme = findTheme("cyberpunk")
    expect(theme).toBeDefined()
    const result = injectThemeIntoGlobalsCss(css, theme!)
    expect(result).toContain(":root")
    expect(result).toContain(".dark")
    expect(result.match(/:root\s*\{/g)?.length).toBe(1)
  })
})

describe("buildReadme", () => {
  it("包含样板信息与快速开始", () => {
    const blueprint = findBlueprint("admin-dashboard")!
    const readme = buildReadme(blueprint, "my-project", 3201)
    expect(readme).toContain("# my-project")
    expect(readme).toContain("T02")
    expect(readme).toContain("pnpm dev")
    expect(readme).toContain("3201")
  })
})

describe("scaffoldBlueprint 集成（T02 冒烟）", () => {
  it("完整生成项目骨架（跳过安装）", async () => {
    const dir = await makeTmp()
    const targetDir = path.join(dir, "my-admin")
    const blueprint = BLUEPRINTS.find((b) => b.id === "T02")!

    const phases: string[] = []
    const result = await scaffoldBlueprint({
      blueprint,
      targetDir,
      install: false,
      onPhase: (phase) => phases.push(phase),
    })

    // 管线阶段完整
    expect(phases).toEqual(["copy", "customize", "config"])

    // 目录树复制完整
    expect(fs.existsSync(path.join(targetDir, "app", "layout.tsx"))).toBe(true)
    expect(fs.existsSync(path.join(targetDir, "package.json"))).toBe(true)
    expect(fs.existsSync(path.join(targetDir, "tsconfig.json"))).toBe(true)

    // package.json 定制
    const pkg = await fs.readJson(path.join(targetDir, "package.json"))
    expect(pkg.name).toBe("my-admin")
    expect(pkg.dependencies["@yyc3/ui"]).toBe("^3.0.0")

    // components.json + yyc3.config.json + README
    const componentsJson = await fs.readJson(
      path.join(targetDir, "components.json")
    )
    expect(componentsJson.aliases).toBeDefined()
    const yyc3Config = await fs.readJson(
      path.join(targetDir, "yyc3.config.json")
    )
    expect(yyc3Config.blueprint).toBe("admin-dashboard")
    expect(yyc3Config.blueprintId).toBe("T02")
    expect(yyc3Config.port).toBe(3201)
    const readme = await fs.readFile(path.join(targetDir, "README.md"), "utf8")
    expect(readme).toContain("my-admin")

    // 返回值
    expect(result.projectName).toBe("my-admin")
    expect(result.port).toBe(3201)
    expect(result.installed).toBe(false)
    expect(result.theme).toBeUndefined()
  })

  it("带主题注入生成（真实主题）", async () => {
    const dir = await makeTmp()
    const targetDir = path.join(dir, "themed-app")
    const blueprint = BLUEPRINTS.find((b) => b.id === "T02")!

    const result = await scaffoldBlueprint({
      blueprint,
      targetDir,
      theme: "cyberpunk",
      install: false,
    })

    expect(result.theme?.name).toBe("cyberpunk")
    const css = await fs.readFile(
      path.join(targetDir, "app", "globals.css"),
      "utf8"
    )
    expect(css).toContain(result.theme!.primaryColor)
    const yyc3Config = await fs.readJson(
      path.join(targetDir, "yyc3.config.json")
    )
    expect(yyc3Config.theme).toBe("cyberpunk")
  })

  it("目标目录已存在时报错", async () => {
    const dir = await makeTmp()
    const blueprint = BLUEPRINTS[0]
    await expect(
      scaffoldBlueprint({
        blueprint,
        targetDir: dir,
        install: false,
      })
    ).rejects.toThrow(/已存在/)
  })

  it("非法项目名报错", async () => {
    const dir = await makeTmp()
    const blueprint = BLUEPRINTS[0]
    await expect(
      scaffoldBlueprint({
        blueprint,
        targetDir: path.join(dir, "valid-dir"),
        projectName: "Invalid Name!",
        install: false,
      })
    ).rejects.toThrow(/项目名不合规/)
  })
})
