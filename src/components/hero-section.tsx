import { StatsItem } from '@/components/stats-item'
import { Badge } from '@/components/ui/badge'

interface HeroSectionProps {
  badge: string
  title: string
  subtitle: string
  description: string
  getStarted: string
  watchDemo: string
  stats: {
    videosProcessed: string
    successRate: string
    avgProcessing: string
  }
}

export function HeroSection({
  badge,
  title,
  subtitle,
  description,
  getStarted,
  watchDemo,
  stats,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse delay-500" />

      <div className="container relative px-4 py-24 md:py-40 mx-auto">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <Badge animate className="mb-8">
            {badge}
          </Badge>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-6">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-3xl mx-auto mb-12">
            {subtitle}
            <span className="block mt-2 text-lg opacity-80">{description}</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button type="button" className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/25">
              <span className="relative z-10">{getStarted}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button type="button" className="px-8 py-4 border border-border rounded-full font-semibold text-lg transition-all hover:scale-105 hover:bg-accent/10 backdrop-blur-sm">
              {watchDemo}
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <StatsItem value="10K+" label={stats.videosProcessed} />
            <StatsItem value="99.9%" label={stats.successRate} />
            <StatsItem value="5s" label={stats.avgProcessing} />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
