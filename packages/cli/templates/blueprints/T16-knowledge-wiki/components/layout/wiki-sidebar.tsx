"use client"

import { useState } from "react"

interface TreeNode {
  title: string
  slug: string
  children?: TreeNode[]
}

const docTree: TreeNode[] = [
  {
    title: "快速开始",
    slug: "getting-started",
    children: [
      { title: "安装指南", slug: "installation" },
      { title: "项目结构", slug: "project-structure" },
      { title: "配置说明", slug: "configuration" },
    ],
  },
  {
    title: "核心概念",
    slug: "core-concepts",
    children: [
      { title: "五维驱动", slug: "five-dimensions" },
      { title: "五高架构", slug: "five-highs" },
      { title: "五标体系", slug: "five-standards" },
      { title: "五化转型", slug: "five-transformations" },
    ],
  },
  {
    title: "组件库",
    slug: "components",
    children: [
      { title: "@yyc3/ui", slug: "ui-package" },
      { title: "@yyc3/core", slug: "core-package" },
      { title: "@yyc3/ai-hub", slug: "ai-hub-package" },
      { title: "@yyc3/cli", slug: "cli-package" },
    ],
  },
  {
    title: "样板模板",
    slug: "templates",
    children: [
      { title: "AI智能中心", slug: "t01" },
      { title: "管理后台", slug: "t02" },
      { title: "企业官网", slug: "t03" },
      { title: "数据看盘", slug: "t09" },
    ],
  },
  {
    title: "部署运维",
    slug: "deployment",
    children: [
      { title: "Docker部署", slug: "docker" },
      { title: "CI/CD流水线", slug: "cicd" },
      { title: "监控告警", slug: "monitoring" },
    ],
  },
]

export function WikiSidebar() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["getting-started", "core-concepts"]))

  const toggle = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  return (
    <aside className="w-64 border-r border-border overflow-y-auto p-3 shrink-0">
      <div className="space-y-1">
        {docTree.map((node) => (
          <div key={node.slug}>
            <button
              onClick={() => node.children && toggle(node.slug)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium hover:bg-accent transition-colors"
            >
              {node.children && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform ${expanded.has(node.slug) ? "rotate-90" : ""}`}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
              {!node.children && <span className="w-3" />}
              {node.title}
            </button>
            {node.children && expanded.has(node.slug) && (
              <div className="ml-4 space-y-0.5 mt-0.5">
                {node.children.map((child) => (
                  <a
                    key={child.slug}
                    href={`/docs/${child.slug}`}
                    className="block px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    {child.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
