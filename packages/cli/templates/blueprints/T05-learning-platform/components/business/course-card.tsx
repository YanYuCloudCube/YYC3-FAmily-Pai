interface CourseCardProps {
  id: string
  title: string
  desc: string
  lessons: number
  hours: number
  level: string
  progress: number
  tags: string[]
}

export function CourseCard({ title, desc, lessons, hours, level, progress, tags }: CourseCardProps) {
  return (
    <div className="rounded-xl border border-border p-5 hover:border-primary/50 hover:shadow-sm transition-all">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
          {level}
        </span>
        <span className="text-xs text-muted-foreground">
          {lessons}节 · {hours}小时
        </span>
      </div>

      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{desc}</p>

      <div className="flex gap-1.5 mb-4">
        {tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs">
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">学习进度</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
