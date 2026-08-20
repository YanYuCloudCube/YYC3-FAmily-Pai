import { CourseCard } from "@/components/business/course-card"

const courses = [
  { id: "1", title: "Next.js 15 全栈开发", desc: "从零构建AI驱动的全栈应用", lessons: 24, hours: 18, level: "中级", progress: 75, tags: ["Next.js", "React", "AI"] },
  { id: "2", title: "shadcn/ui 组件实战", desc: "56+组件的最佳实践与深度定制", lessons: 32, hours: 24, level: "初级", progress: 45, tags: ["UI", "Tailwind", "Radix"] },
  { id: "3", title: "DPO模型训练入门", desc: "从数据清洗到LoRA微调完整流程", lessons: 16, hours: 12, level: "高级", progress: 20, tags: ["AI", "PyTorch", "DPO"] },
  { id: "4", title: "企业级架构设计", desc: "五高架构·五标体系·五化转型方法论", lessons: 20, hours: 15, level: "高级", progress: 0, tags: ["架构", "DevOps"] },
  { id: "5", title: "TypeScript高级类型", desc: "泛型·条件类型·模板字面量类型精讲", lessons: 18, hours: 14, level: "中级", progress: 90, tags: ["TypeScript"] },
  { id: "6", title: "pnpm Monorepo管理", desc: "workspace依赖管理与发布流程", lessons: 12, hours: 8, level: "初级", progress: 60, tags: ["pnpm", "Monorepo"] },
]

export default function CoursesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">课程中心</h1>
          <p className="text-sm text-muted-foreground mt-1">共 {courses.length} 门课程</p>
        </div>
        <div className="flex gap-2">
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option>全部级别</option>
            <option>初级</option>
            <option>中级</option>
            <option>高级</option>
          </select>
          <input
            type="search"
            placeholder="搜索课程..."
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  )
}
