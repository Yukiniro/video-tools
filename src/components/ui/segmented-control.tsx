'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface SegmentedControlProps {
  label?: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  className?: string
  labelClassName?: string
}

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  className,
  labelClassName,
}: SegmentedControlProps) {
  const selectedIndex = options.findIndex(opt => opt.value === value)

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <Label className={cn('text-sm font-medium', labelClassName)}>
          {label}
        </Label>
      )}
      <div className="relative">
        {/* 灰色底色区域 */}
        <div className="bg-muted rounded-lg p-1 relative">
          {/* 移动高亮背景 */}
          <div
            className="absolute top-1 bottom-1 bg-background rounded-md transition-all duration-200 ease-out shadow-sm"
            style={{
              width: `calc(${100 / options.length}% - 0.25rem)`,
              left: `calc(${(selectedIndex * 100) / options.length}% + 0.125rem)`,
            }}
          />
          {/* 选项按钮 */}
          <div className="flex relative z-10">
            {options.map(option => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => onChange(option.value)}
                className={`flex-1 py-2 px-3 text-sm font-medium transition-all duration-200 ${
                  value === option.value
                    ? 'text-foreground hover:bg-transparent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
