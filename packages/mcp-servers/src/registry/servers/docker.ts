import type { MCPServerDefinition, MCPTool } from '../../types/index.js'

const DOCKER_TOOLS: MCPTool[] = [
  {
    name: "docker_list_containers",
    description: "列出 Docker 容器",
    inputSchema: {
      type: "object",
      properties: {
        all: { type: "string", description: "是否包括停止的容器" },
        filter: { type: "string", description: "过滤条件" },
      },
      required: [],
    },
  },
  {
    name: "docker_run_container",
    description: "运行 Docker 容器",
    inputSchema: {
      type: "object",
      properties: {
        image: { type: "string", description: "镜像名称" },
        name: { type: "string", description: "容器名称" },
        ports: { type: "string", description: "端口映射" },
      },
      required: ["image"],
    },
  },
  {
    name: "docker_build_image",
    description: "构建 Docker 镜像",
    inputSchema: {
      type: "object",
      properties: {
        dockerfile: { type: "string", description: "Dockerfile 路径" },
        tag: { type: "string", description: "镜像标签" },
      },
      required: ["dockerfile"],
    },
  },
]

export const DOCKER_DEF: MCPServerDefinition = {
  id: "docker",
  name: "Docker",
  description: "Docker 容器管理 — 列表、运行、构建、日志查看",
  version: "1.0.0",
  tools: DOCKER_TOOLS,
  configTemplate: {
    name: "docker",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-docker"],
    enabled: true,
    priority: 4,
  },
  category: "container",
}
