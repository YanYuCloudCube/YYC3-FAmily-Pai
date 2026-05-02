declare module 'postcss-selector-parser' {
  namespace parser {
    type Node = any
    type ClassName = any
    type Selector = any
    type Root = any
    type Attribute = any
    type Combinator = any
    type Comment = any
    type Id = any
    type Nesting = any
    type Pseudo = any
    type String = any
    type Tag = any
    type Universal = any
    function parser(options?: { subset?: boolean }): any
  }
  export = parser
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
