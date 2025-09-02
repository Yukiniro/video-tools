interface StatsItemProps {
  value: string
  label: string
}

export function StatsItem({ value, label }: StatsItemProps) {
  return (
    <div className="text-center">
      <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary">{value}</div>
      <div className="text-xs sm:text-sm text-muted-foreground leading-tight">{label}</div>
    </div>
  )
}
