import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import type { Server } from "node:http"

interface RegistryItem {
  name: string
  type: string
  files?: Array<{
    path: string
    content?: string
    type: string
  }>
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  tailwind?: Record<string, unknown>
  cssVars?: Record<string, Record<string, string>>
  fonts?: unknown
  envVars?: Record<string, string>
}

interface RegistryServerOptions {
  port: number
  basePath?: string
}

interface RegistryServer {
  start: () => Promise<void>
  stop: () => Promise<void>
  url: (name: string) => string
}

export async function createRegistryServer(
  items: RegistryItem[],
  options: RegistryServerOptions
): Promise<RegistryServer> {
  const { port, basePath = "/r" } = options
  const itemMap = new Map(items.map((item) => [item.name, item]))

  const handlers = [
    http.get(`http://localhost:${port}${basePath}/:name.json`, ({ params }) => {
      const name = params.name as string
      const item = itemMap.get(name)
      if (!item) {
        return new HttpResponse(null, { status: 404 })
      }
      return HttpResponse.json(item)
    }),
  ]

  const server = setupServer(...handlers)

  return {
    start: async () => {
      server.listen({ onUnhandledRequest: "bypass" })
    },
    stop: async () => {
      server.close()
    },
    url: (name: string) =>
      `http://localhost:${port}${basePath}/${name}.json`,
  }
}
