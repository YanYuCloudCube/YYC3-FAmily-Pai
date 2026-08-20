export function CTASection() {
  return (
    <section id="contact" className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold">准备好了吗？</h2>
        <p className="mt-3 text-primary-foreground/80 text-lg">
          从今天开始，用YYC³构建你的智能应用
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 rounded-xl text-sm font-medium hover:bg-white/90 transition-colors"
          >
            npx @yyc3/cli init
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 border border-primary-foreground/30 px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
          >
            查看GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
