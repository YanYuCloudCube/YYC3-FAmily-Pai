export default function ConverterPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div className="text-center"><h1 className="text-2xl font-bold">表格格式转换</h1><p className="text-sm text-muted-foreground mt-1">支持 CSV · Excel · JSON · YAML · XML 互转</p></div>
      <div className="rounded-xl border-2 border-dashed border-border p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"><div className="text-4xl mb-3">📁</div><p className="text-sm text-muted-foreground">拖拽文件到此处 或 点击上传</p><p className="text-xs text-muted-foreground mt-1">支持 .csv .xlsx .json .yaml .xml</p></div>
      <div className="flex items-center gap-4"><select className="rounded-lg border border-input bg-background px-4 py-2 text-sm"><option>CSV</option></select><span className="text-muted-foreground">→</span><select className="rounded-lg border border-input bg-background px-4 py-2 text-sm"><option>JSON</option><option>YAML</option><option>XML</option><option>Excel</option></select><button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">转换</button></div>
      <div className="rounded-xl border border-border p-4"><h3 className="text-sm font-medium mb-2">预览</h3><pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-auto max-h-48 text-muted-foreground">上传文件后显示预览...</pre></div>
    </div>
  )
}
