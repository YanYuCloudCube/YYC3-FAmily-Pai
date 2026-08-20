import { astro } from "./astro"
import { laravel } from "./laravel"
import { next } from "./next"
import { reactRouter } from "./react-router"
import { start } from "./start"
import { vite } from "./vite"

export { createTemplate, resolveTemplate } from "./create-template"
export type { TemplateInitOptions, TemplateOptions } from "./create-template"
export {
  BLUEPRINTS,
  BLUEPRINT_DEP_OVERRIDES,
  BLUEPRINT_UI_VERSION,
  blueprintDefaultTheme,
  blueprintDirExists,
  findBlueprint,
  resolveBlueprintsRoot,
} from "./blueprints"
export type { BlueprintMeta } from "./blueprints"
export {
  scaffoldBlueprint,
  buildComponentsJson,
  buildReadme,
  customizePackageJson,
  injectTheme,
  injectThemeIntoGlobalsCss,
  replacePort,
} from "./scaffold-blueprint"
export type {
  ScaffoldBlueprintOptions,
  ScaffoldBlueprintResult,
  ScaffoldPhase,
} from "./scaffold-blueprint"

export const templates = {
  next,
  vite,
  start,
  "react-router": reactRouter,
  astro,
  laravel,
}

// Resolve a template key from a detected framework name.
export function getTemplateForFramework(frameworkName?: string) {
  if (!frameworkName) {
    return undefined
  }

  for (const [key, template] of Object.entries(templates)) {
    if (template.frameworks.includes(frameworkName)) {
      return key
    }
  }

  return undefined
}
