import { SectionHeader } from '@/components/section-header'
import { ToolCard } from '@/components/tool-card'

interface Tool {
  key: string
  href: string
  comingSoon: boolean
}

interface ToolsSectionProps {
  badge: string
  title: string
  description: string
  tools: Tool[]
  locale: string
}

export function ToolsSection({ badge, title, description, tools, locale }: ToolsSectionProps) {
  return (
    <section className="relative py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 mx-auto">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            badge={badge}
            title={title}
            description={description}
            className="mb-16"
          />

          {/* Tools Grid with Stagger Animation */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, index) => (
              <div
                key={tool.key}
                className="group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                }}
              >
                <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                  <ToolCard
                    toolKey={tool.key}
                    href={tool.href}
                    locale={locale}
                    comingSoon={tool.comingSoon}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
