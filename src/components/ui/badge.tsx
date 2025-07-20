import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  dotColor?: 'primary' | 'secondary' | 'accent'
  animate?: boolean
}

export function Badge({
  children,
  className,
  dotColor = 'primary',
  animate = false,
}: BadgeProps) {
  const dotColorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
  }

  return (
    <div className={cn(
      'inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium bg-background/50 backdrop-blur-sm',
      className,
    )}
    >
      <span className={cn(
        'w-2 h-2 rounded-full mr-2',
        dotColorClasses[dotColor],
        animate && 'animate-pulse',
      )}
      />
      <span className="text-foreground">{children}</span>
    </div>
  )
}
