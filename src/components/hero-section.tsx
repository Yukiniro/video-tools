import Link from 'next/link'
import { StatsItem } from '@/components/stats-item'
import { Badge } from '@/components/ui/badge'

interface HeroSectionProps {
  badge: string
  title: string
  subtitle: string
  getStarted: string
  features: {
    localProcessing: string
    dataPrivacy: string
    fastEfficient: string
    completelyFree: string
  }
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
  getStarted,
  features,
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
          <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>
          
          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full border border-green-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium">{features.localProcessing}</span>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-500/20">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
               <span className="text-sm font-medium">{features.dataPrivacy}</span>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/20">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
               <span className="text-sm font-medium">{features.fastEfficient}</span>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full border border-orange-500/20">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
               </svg>
               <span className="text-sm font-medium">{features.completelyFree}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/video-to-gif" className="group relative">
              <button type="button" className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/25">
                {getStarted}
              </button>
            </Link>
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
