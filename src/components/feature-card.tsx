interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  colorVariant: 'primary' | 'secondary' | 'accent'
}

export function FeatureCard({ icon, title, description, colorVariant }: FeatureCardProps) {
  const colorClasses = {
    primary: {
      iconBg: 'from-primary/20 to-primary/10',
      iconColor: 'text-primary',
      shadow: 'group-hover:shadow-primary/10',
      gradient: 'from-primary/5',
      titleHover: 'group-hover:text-primary',
    },
    secondary: {
      iconBg: 'from-secondary/20 to-secondary/10',
      iconColor: 'text-secondary',
      shadow: 'group-hover:shadow-secondary/10',
      gradient: 'from-secondary/5',
      titleHover: 'group-hover:text-secondary',
    },
    accent: {
      iconBg: 'from-accent/20 to-accent/10',
      iconColor: 'text-accent',
      shadow: 'group-hover:shadow-accent/10',
      gradient: 'from-accent/5',
      titleHover: 'group-hover:text-accent',
    },
  }

  const colors = colorClasses[colorVariant]

  return (
    <div className="group relative">
      <div className={`relative p-8 rounded-2xl border bg-background/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl ${colors.shadow} group-hover:-translate-y-2`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />

        <div className="relative">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <div className={colors.iconColor}>
              {icon}
            </div>
          </div>

          <h3 className={`text-2xl font-bold mb-4 ${colors.titleHover} transition-colors`}>
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
