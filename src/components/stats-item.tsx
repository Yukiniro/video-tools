interface StatsItemProps {
  value: string
  label: string
}

export function StatsItem({ value, label }: StatsItemProps) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
