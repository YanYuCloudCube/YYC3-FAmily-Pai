/**
 * file prompt-registry.ts
 * description MCP 提示词技能注册中心 — 从知识库批量注册 AI 技能工具
 * module @yyc3/mcp-servers
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.0.0
 * created 2026-05-20
 * updated 2026-05-20
 * status active
 * tags [mcp],[prompts],[skills],[registry]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 */

export interface PromptSkill {
  name: string
  description: string
  category: PromptCategory
}

export type PromptCategory =
  | 'frontend'
  | 'backend'
  | 'data'
  | 'devops'
  | 'ai'
  | 'design'
  | 'testing'
  | 'productivity'

const SKILLS: PromptSkill[] = [
  { name: 'pdf', description: 'PDF processing — read, extract, merge, split, OCR, watermark, encrypt', category: 'productivity' },
  { name: 'xlsx', description: 'Spreadsheet processing — read, edit, create .xlsx/.csv/.tsv files', category: 'productivity' },
  { name: 'docx', description: 'Word document processing — read, create, edit .docx files', category: 'productivity' },
  { name: 'pptx', description: 'PowerPoint presentation processing — create, edit slides', category: 'productivity' },
  { name: 'browser', description: 'Browser automation via Chrome DevTools Protocol (CDP)', category: 'testing' },
  { name: 'github', description: 'GitHub CLI — issues, PRs, CI runs, API queries via gh', category: 'devops' },
  { name: 'sql-queries', description: 'SQL queries across Snowflake, BigQuery, Databricks, PostgreSQL', category: 'data' },
  { name: 'deep-research', description: 'Complete research workflow — codebase analysis, external research, wiki generation', category: 'ai' },
  { name: 'tailwind-design-system', description: 'Scalable design systems with Tailwind CSS, design tokens, component libraries', category: 'design' },
  { name: 'nextjs-app-router-patterns', description: 'Next.js 14+ App Router — Server Components, streaming, parallel routes', category: 'frontend' },
  { name: 'react-modernization', description: 'React upgrade — class to hooks, concurrent features, latest versions', category: 'frontend' },
  { name: 'react-state-management', description: 'React state management patterns — Zustand, Jotai, Context optimization', category: 'frontend' },
  { name: 'typescript-advanced-types', description: 'Advanced TypeScript — generics, conditional types, mapped types, type inference', category: 'frontend' },
  { name: 'modern-javascript-patterns', description: 'Modern JS — ES2024 features, async patterns, modules, iterators', category: 'frontend' },
  { name: 'nodejs-backend-patterns', description: 'Node.js backend — Express, Fastify, middleware, error handling, streaming', category: 'backend' },
  { name: 'python-testing-patterns', description: 'Python testing — pytest, fixtures, mocking, parametrize, coverage', category: 'testing' },
  { name: 'javascript-testing-patterns', description: 'JavaScript testing — Vitest, Jest, testing-library, E2E with Playwright', category: 'testing' },
  { name: 'test-driven-development', description: 'TDD workflow — red-green-refactor cycle before implementation', category: 'testing' },
  { name: 'api-design-principles', description: 'REST/GraphQL API design — versioning, pagination, error handling, HATEOAS', category: 'backend' },
  { name: 'architecture-patterns', description: 'Software architecture — CQRS, Event Sourcing, Hexagonal, Microservices', category: 'backend' },
  { name: 'microservices-patterns', description: 'Microservices — service mesh, saga, circuit breaker, observability', category: 'backend' },
  { name: 'database-migration', description: 'Database migration — schema evolution, rollback, zero-downtime migration', category: 'data' },
  { name: 'data-visualization', description: 'Data visualization — D3.js, Chart.js, Recharts, interactive dashboards', category: 'data' },
  { name: 'rag-implementation', description: 'RAG — retrieval augmented generation, vector search, chunking, embedding', category: 'ai' },
  { name: 'prompt-engineering-patterns', description: 'Prompt engineering — chain-of-thought, few-shot, system prompts, meta-prompting', category: 'ai' },
  { name: 'llm-evaluation', description: 'LLM evaluation — benchmarks, metrics, automated testing, human evaluation', category: 'ai' },
  { name: 'github-actions-templates', description: 'GitHub Actions — CI/CD templates, reusable workflows, matrix builds', category: 'devops' },
  { name: 'deployment-pipeline-design', description: 'Deployment pipelines — blue-green, canary, feature flags, rollback', category: 'devops' },
  { name: 'dependency-upgrade', description: 'Dependency upgrade — automated updates, breaking change detection, testing', category: 'devops' },
  { name: 'ui-ux-pro-max', description: 'UI/UX best practices — accessibility, responsive design, design systems, motion', category: 'design' },
  { name: 'systematic-debugging', description: 'Systematic debugging — root cause analysis, performance profiling, logging', category: 'productivity' },
  { name: 'context-driven-development', description: 'Context-driven development — AI-assisted coding with proper context management', category: 'ai' },
  { name: 'feature-spec', description: 'Feature specification — requirements, acceptance criteria, technical design docs', category: 'productivity' },
  { name: 'interactive-dashboard-builder', description: 'Interactive dashboards — real-time data, charts, filters, drill-down', category: 'data' },
  { name: 'Playwright-Browser-Automation', description: 'Playwright E2E testing — cross-browser, auto-wait, trace viewer', category: 'testing' },
  { name: 'design-to-code-workflows', description: 'Design to code — Figma to React, component generation, design tokens', category: 'design' },
  { name: 'wcag-audit-patterns', description: 'WCAG accessibility audit — ARIA, screen readers, keyboard navigation', category: 'testing' },
  { name: 'weixin-minigame-helper', description: 'WeChat mini-game development — Canvas, WX API, performance optimization', category: 'frontend' },
  { name: 'xiaohongshu', description: 'Xiaohongshu content creation — copywriting, image optimization, analytics', category: 'productivity' },
  { name: 'video-frames', description: 'Video frame extraction — FFmpeg, frame analysis, thumbnail generation', category: 'productivity' },
    { name: 'Agent Development', description: 'This skill should be used when the user asks to', category: 'productivity' },
    { name: 'agent-browser', description: 'Automates browser interactions for web testing, form filling, screenshots, and data extraction. Use when the user needs to navigate websites, interact', category: 'ai' },
    { name: 'agentmail', description: 'Email inbox for AI agents. Check messages, send emails, and communicate via your own @agentmail.to address.', category: 'productivity' },
    { name: 'airflow-dag-patterns', description: 'Build production Apache Airflow DAGs with best practices for operators, sensors, testing, and deployment. Use when creating data pipelines, orchestrat', category: 'data' },
    { name: 'angular-migration', description: 'Migrate from AngularJS to Angular using hybrid mode, incremental component rewriting, and dependency injection updates. Use when upgrading AngularJS a', category: 'frontend' },
    { name: 'apple-notes', description: 'Manage Apple Notes via the `memo` CLI on macOS (create, view, edit, delete, search, move, and export notes). Use when a user asks CodeBuddy Code to ad', category: 'productivity' },
    { name: 'apple-reminders', description: 'Manage Apple Reminders via the `remindctl` CLI on macOS (list, add, edit, complete, delete). Supports lists, date filters, and JSON/plain output.', category: 'productivity' },
    { name: 'async-python-patterns', description: 'Master Python asyncio, concurrent programming, and async/await patterns for high-performance applications. Use when building async APIs, concurrent sy', category: 'backend' },
    { name: 'blogwatcher', description: 'Monitor blogs and RSS/Atom feeds for updates using the blogwatcher CLI.', category: 'productivity' },
    { name: 'brainstorming', description: 'You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent', category: 'productivity' },
    { name: 'Browser Automation', description: 'This skill should be used when the user needs to interact with web pages, browse websites, take screenshots, fill forms, click elements, extract web c', category: 'productivity' },
    { name: 'codex', description: 'Execute Codex CLI for code analysis, refactoring, and automated code changes. Use when you need to delegate complex code tasks to Codex AI with file r', category: 'ai' },
    { name: 'Command Development', description: 'This skill should be used when the user asks to', category: 'productivity' },
    { name: 'competitive-analysis', description: 'Analyze competitors with feature comparison matrices, positioning analysis, and strategic implications. Use when researching a competitor, comparing p', category: 'productivity' },
    { name: 'cqrs-implementation', description: 'Implement Command Query Responsibility Segregation for scalable architectures. Use when separating read and write models, optimizing query performance', category: 'backend' },
    { name: 'data-exploration', description: 'Profile and explore datasets to understand their shape, quality, and patterns before analysis. Use when encountering a new dataset, assessing data qua', category: 'data' },
    { name: 'data-quality-frameworks', description: 'Implement data quality validation with Great Expectations, dbt tests, and data contracts. Use when building data quality pipelines, implementing valid', category: 'data' },
    { name: 'data-validation', description: 'QA an analysis before sharing with stakeholders — methodology checks, accuracy verification, and bias detection. Use when reviewing an analysis for er', category: 'data' },
    { name: 'dbt-transformation-patterns', description: 'Master dbt (data build tool) for analytics engineering with model organization, testing, documentation, and incremental strategies. Use when building ', category: 'data' },
    { name: 'dispatching-parallel-agents', description: 'Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies', category: 'ai' },
    { name: 'embedding-strategies', description: 'Select and optimize embedding models for semantic search and RAG applications. Use when choosing embedding models, implementing chunking strategies, o', category: 'ai' },
    { name: 'event-store-design', description: 'Design and implement event stores for event-sourced systems. Use when building event sourcing infrastructure, choosing event store technologies, or im', category: 'backend' },
    { name: 'executing-marketing-campaigns', description: 'Plans, creates, and optimizes marketing campaigns including content strategy, social media, email, and analytics. Helps develop go-to-market strategie', category: 'productivity' },
    { name: 'executing-plans', description: 'Use when you have a written implementation plan to execute in a separate session with review checkpoints', category: 'productivity' },
    { name: 'find-skills', description: 'Helps users discover and install agent skills when they ask questions like', category: 'ai' },
    { name: 'finishing-a-development-branch', description: 'Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by prese', category: 'devops' },
    { name: 'gemini', description: 'Execute Gemini CLI for AI-powered code analysis and generation. Use when you need to leverage Google\'s Gemini models for complex reasoning tasks.', category: 'ai' },
    { name: 'gifgrep', description: 'Search GIF providers with CLI/TUI, download results, and extract stills/sheets.', category: 'productivity' },
    { name: 'gitlab-ci-patterns', description: 'Build GitLab CI/CD pipelines with multi-stage workflows, caching, and distributed runners for scalable automation. Use when implementing GitLab CI/CD,', category: 'devops' },
    { name: 'go-concurrency-patterns', description: 'Master Go concurrency with goroutines, channels, sync primitives, and context. Use when building concurrent Go applications, implementing worker pools', category: 'backend' },
    { name: 'gog', description: 'Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, and Docs.', category: 'productivity' },
    { name: 'Hook Development', description: 'This skill should be used when the user asks to', category: 'productivity' },
    { name: 'hybrid-search-implementation', description: 'Combine vector and keyword search for improved retrieval. Use when implementing RAG systems, building search engines, or when neither approach alone p', category: 'ai' },
    { name: 'internal-comms', description: 'A set of resources to help me write all kinds of internal communications, using the formats that my company likes to use. Claude should use this skill', category: 'productivity' },
    { name: 'langchain-architecture', description: 'Design LLM applications using the LangChain framework with agents, memory, and tool integration patterns. Use when building LangChain applications, im', category: 'ai' },
    { name: 'lucide-icons', description: 'Search, download, and customize Lucide icons (1000+ beautiful SVG icons). Supports SVG and TypeScript React component generation with full customizati', category: 'design' },
    { name: 'MCP Integration', description: 'This skill should be used when the user asks to', category: 'productivity' },
    { name: 'memory-safety-patterns', description: 'Implement memory-safe programming with RAII, ownership, smart pointers, and resource management across Rust, C++, and C. Use when writing safe systems', category: 'backend' },
    { name: 'metrics-tracking', description: 'Define, track, and analyze product metrics with frameworks for goal setting and dashboard design. Use when setting up OKRs, building metrics dashboard', category: 'data' },
    { name: 'modern-web-app', description: 'Tools for building modern React webapps with TypeScript, Tailwind CSS and shadcn/ui. Best suited for applications with complex UI components and state', category: 'frontend' },
    { name: 'omo', description: 'Use this skill when you see `/omo`. Multi-agent orchestration for', category: 'productivity' },
    { name: 'playwright-cli', description: 'Automates browser interactions for web testing, form filling, screenshots, and data extraction. Use when the user needs to navigate websites, interact', category: 'testing' },
    { name: 'Plugin Settings', description: 'This skill should be used when the user asks about', category: 'productivity' },
    { name: 'Plugin Structure', description: 'This skill should be used when the user asks to', category: 'productivity' },
    { name: 'plugin-discovery', description: 'This skill should be used when the user asks to', category: 'ai' },
    { name: 'product-management-workflows', description: 'Complete product management workflows including feature specs, roadmap management, stakeholder updates, user research synthesis, competitive analysis,', category: 'productivity' },
    { name: 'product-requirements', description: 'Interactive Product Owner skill for requirements gathering, analysis, and PRD generation. Triggers when users request product requirements, feature sp', category: 'productivity' },
    { name: 'projection-patterns', description: 'Build read models and projections from event streams. Use when implementing CQRS read sides, building materialized views, or optimizing query performa', category: 'data' },
    { name: 'prototype-prompt-generator', description: 'This skill should be used when users need to generate detailed, structured prompts for creating UI/UX prototypes. Trigger when users request help with', category: 'ai' },
    { name: 'python-packaging', description: 'Create distributable Python packages with proper project structure, setup.py/pyproject.toml, and publishing to PyPI. Use when packaging Python librari', category: 'backend' },
    { name: 'python-performance-optimization', description: 'Profile and optimize Python code using cProfile, memory profilers, and performance best practices. Use when debugging slow Python code, optimizing bot', category: 'backend' },
    { name: 'react-native-architecture', description: 'Build production React Native apps with Expo, navigation, native modules, offline sync, and cross-platform patterns. Use when developing mobile apps, ', category: 'frontend' },
    { name: 'receiving-code-review', description: 'Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable - requires ', category: 'devops' },
    { name: 'requesting-code-review', description: 'Use when completing tasks, implementing major features, or before merging to verify work meets requirements', category: 'devops' },
    { name: 'requirements-code', description: 'Direct implementation agent that converts technical specifications into working code with minimal architectural overhead', category: 'productivity' },
    { name: 'requirements-generate', description: 'Transform user requirements into code-friendly technical specifications optimized for automatic code generation', category: 'productivity' },
    { name: 'requirements-review', description: 'Pragmatic code review agent focused on functionality, integration quality, and maintainability rather than architectural perfection', category: 'productivity' },
    { name: 'requirements-testing', description: 'Practical testing agent focused on functional validation and integration testing rather than exhaustive test coverage', category: 'productivity' },
    { name: 'roadmap-management', description: 'Plan and prioritize product roadmaps using frameworks like RICE, MoSCoW, and ICE. Use when creating a roadmap, reprioritizing features, mapping depend', category: 'productivity' },
    { name: 'rust-async-patterns', description: 'Master Rust async programming with Tokio, async traits, error handling, and concurrent patterns. Use when building async Rust applications, implementi', category: 'backend' },
    { name: 'saga-orchestration', description: 'Implement saga patterns for distributed transactions and cross-aggregate workflows. Use when coordinating multi-step business processes, handling comp', category: 'backend' },
    { name: 'screen-reader-testing', description: 'Test web applications with screen readers including VoiceOver, NVDA, and JAWS. Use when validating screen reader compatibility, debugging accessibilit', category: 'testing' },
    { name: 'secrets-management', description: 'Implement secure secrets management for CI/CD pipelines using Vault, AWS Secrets Manager, or native platform solutions. Use when handling sensitive cr', category: 'devops' },
    { name: 'similarity-search-patterns', description: 'Implement efficient similarity search with vector databases. Use when building semantic search, implementing nearest neighbor queries, or optimizing r', category: 'ai' },
    { name: 'Skill Development', description: 'This skill should be used when the user wants to', category: 'productivity' },
    { name: 'skill-creator', description: 'Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude', category: 'ai' },
    { name: 'skill-install', description: 'Install CodeBuddy skills from GitHub repositories with automated security scanning. Triggers when users want to install skills from a GitHub URL, need', category: 'ai' },
    { name: 'skill-vetter', description: 'Security-first skill vetting for AI agents. Use before installing any skill from community, GitHub, or other sources. Checks for red flags, permission', category: 'ai' },
    { name: 'songsee', description: 'Generate spectrograms and feature-panel visualizations from audio with the songsee CLI.', category: 'productivity' },
    { name: 'spark-optimization', description: 'Optimize Apache Spark jobs with partitioning, caching, shuffle optimization, and memory tuning. Use when improving Spark performance, debugging slow j', category: 'data' },
    { name: 'stakeholder-comms', description: 'Draft stakeholder updates tailored to audience — executives, engineering, customers, or cross-functional partners. Use when writing weekly status upda', category: 'productivity' },
    { name: 'statistical-analysis', description: 'Apply statistical methods including descriptive stats, trend analysis, outlier detection, and hypothesis testing. Use when analyzing distributions, te', category: 'data' },
    { name: 'subagent-driven-development', description: 'Use when executing implementation plans with independent tasks in the current session', category: 'ai' },
    { name: 'summarize', description: 'Summarize URLs or files with the summarize CLI (web, PDFs, images, audio, YouTube).', category: 'productivity' },
    { name: 'temporal-python-testing', description: 'Test Temporal workflows with pytest, time-skipping, and mocking strategies. Covers unit testing, integration testing, replay testing, and local develo', category: 'testing' },
    { name: 'test-cases', description: 'This skill should be used when generating comprehensive test cases from PRD documents or user requirements. Triggers when users request test case gene', category: 'testing' },
    { name: 'things-mac', description: 'Manage Things 3 via the `things` CLI on macOS (add/update projects+todos via URL scheme; read/search/list from the local Things database). Use when a ', category: 'productivity' },
    { name: 'tmux', description: 'Remote-control tmux sessions for interactive CLIs by sending keystrokes and scraping pane output.', category: 'devops' },
    { name: 'track-management', description: 'Use this skill when creating, managing, or working with Conductor tracks - the logical work units for features, bugs, and refactors. Applies to spec.m', category: 'productivity' },
    { name: 'trello', description: 'Manage Trello boards, lists, and cards via the Trello REST API.', category: 'productivity' },
    { name: 'user-research-synthesis', description: 'Synthesize qualitative and quantitative user research into structured insights and opportunity areas. Use when analyzing interview notes, survey respo', category: 'productivity' },
    { name: 'using-git-worktrees', description: 'Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees w', category: 'devops' },
    { name: 'using-superpowers', description: 'Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying ', category: 'ai' },
    { name: 'uv-package-manager', description: 'Master the uv package manager for fast Python dependency management, virtual environments, and modern Python project workflows. Use when setting up Py', category: 'backend' },
    { name: 'vector-index-tuning', description: 'Optimize vector index performance for latency, recall, and memory. Use when tuning HNSW parameters, selecting quantization strategies, or scaling vect', category: 'ai' },
    { name: 'verification-before-completion', description: 'Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming', category: 'devops' },
    { name: 'wacli', description: 'Send WhatsApp messages to other people or search/sync WhatsApp history via the wacli CLI (not for normal user chats).', category: 'productivity' },
    { name: 'web-artifacts-builder', description: 'Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui', category: 'frontend' },
    { name: 'workflow-orchestration-patterns', description: 'Design durable workflows with Temporal for distributed systems. Covers workflow vs activity separation, saga patterns, state management, and determini', category: 'backend' },
    { name: 'workflow-patterns', description: 'Use this skill when implementing tasks according to Conductor\'s TDD workflow, handling phase checkpoints, managing git commits for tasks, or understan', category: 'ai' },
    { name: 'Writing Hookify Rules', description: 'This skill should be used when the user asks to', category: 'productivity' },
    { name: 'writing-plans', description: 'Use when you have a spec or requirements for a multi-step task, before touching code', category: 'productivity' },
    { name: 'writing-skills', description: 'Use when creating new skills, editing existing skills, or verifying skills work before deployment', category: 'ai' },
    { name: 'xurl', description: 'A Twitter research and content intelligence skill focused on attracting WordPress and Shopify clients. Use to analyze Twitter profiles, threads, and c', category: 'productivity' },
]

export function getAllSkills(): PromptSkill[] {
  return [...SKILLS]
}

export function getSkillsByCategory(category: PromptCategory): PromptSkill[] {
  return SKILLS.filter((s) => s.category === category)
}

export function getSkillByName(name: string): PromptSkill | undefined {
  return SKILLS.find((s) => s.name === name)
}

export function getSkillCategories(): PromptCategory[] {
  const categories = new Set<PromptCategory>(SKILLS.map((s) => s.category))
  return [...categories]
}

export function searchSkills(query: string): PromptSkill[] {
  const q = query.toLowerCase()
  return SKILLS.filter(
    (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
  )
}

export function getSkillsCount(): number {
  return SKILLS.length
}

export function getCategoryCount(): Record<PromptCategory, number> {
  const counts = {} as Record<PromptCategory, number>
  for (const skill of SKILLS) {
    counts[skill.category] = (counts[skill.category] || 0) + 1
  }
  return counts
}
