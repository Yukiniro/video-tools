'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface TimeInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
  description?: string
  min?: number
  max?: number
  step?: number
  className?: string
  isInfinitySupported?: boolean
}

export function TimeInput({
  label,
  value,
  onChange,
  placeholder = '0',
  description,
  min = 0,
  max,
  step = 0.1,
  className,
  isInfinitySupported = false,
}: TimeInputProps) {
  const formatTime = (seconds: number): string => {
    if (isInfinitySupported && seconds === Infinity) {
      return ''
    }
    return seconds.toString()
  }

  const handleChange = (inputValue: string) => {
    if (isInfinitySupported && inputValue === '') {
      onChange(Infinity)
      return
    }

    const time = Number.parseFloat(inputValue) || 0
    let validatedTime = Math.max(min, time)

    if (max !== undefined) {
      validatedTime = Math.min(max, validatedTime)
    }

    onChange(validatedTime)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium">{label}</Label>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={formatTime(value)}
        onChange={e => handleChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm"
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
