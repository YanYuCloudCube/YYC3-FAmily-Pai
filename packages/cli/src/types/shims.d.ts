declare module 'postcss-selector-parser' {
  const parser: { (options?: { subset?: boolean }): any; attribute: any; className: any; combinator: any; comment: any; id: any; nesting: any; pseudo: any; root: any; selector: any; string: any; tag: any; universal: any }
  export default parser
}

declare module 'stringify-object' {
  export default function stringifyObject(obj: any, options?: { indent?: string; singleQuotes?: boolean; filter?: (key: string, value: any) => boolean; transform?: (key: string, value: any) => string }): string
}

declare module 'type-fest' {
  export type PackageJson = Record<string, any>
}

declare module '@babel/core' {
  export function transformSync(code: string, options?: any): { code: string | null; map: any; ast: any } | null
  export function transformAsync(code: string, options?: any): Promise<{ code: string | null; map: any; ast: any } | null>
  export function transformFromAstSync(ast: any, code?: string, options?: any): { code: string | null; map: any; ast: any } | null
}

declare module 'tailwindcss' {
  export type Config = Record<string, any>
}
