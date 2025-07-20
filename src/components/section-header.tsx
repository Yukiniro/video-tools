import { Badge } from '@/components/ui/badge'

interface SectionHeaderProps {
  badge: string
  title: string
  description: string
  badgeColor?: 'primary' | 'secondary' | 'accent'
  className?: string
}

export function SectionHeader({
  badge,
  title,
  description,
  badgeColor = 'primary',
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <Badge dotColor={badgeColor} className="mb-4 bg-background/80">
        {badge}
      </Badge>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  )
}
