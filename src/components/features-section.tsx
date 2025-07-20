import { FeatureCard } from '@/components/feature-card'
import { SectionHeader } from '@/components/section-header'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  colorVariant: 'primary' | 'secondary' | 'accent'
}

interface FeaturesSectionProps {
  badge: string
  title: string
  description: string
  features: Feature[]
}

export function FeaturesSection({ badge, title, description, features }: FeaturesSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container relative px-4 py-24 mx-auto">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            badge={badge}
            title={title}
            description={description}
            badgeColor="secondary"
            className="mb-20"
          />

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {features.map(feature => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                colorVariant={feature.colorVariant}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
