'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
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

interface HighlightStyle {
  width: number
  left: number
  opacity: number
}

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  className,
  labelClassName,
}: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyle>({
    width: 0,
    left: 0,
    opacity: 0,
  })

  const selectedIndex = options.findIndex(opt => opt.value === value)

  // 更新高亮位置和大小
  const updateHighlightPosition = useCallback(() => {
    if (!containerRef.current || selectedIndex === -1) {
      setHighlightStyle(prev => ({ ...prev, opacity: 0 }))
      return
    }

    // 通过 DOM 查询找到对应的按钮
    const buttons = containerRef.current.querySelectorAll('button')
    const selectedButton = buttons[selectedIndex]

    if (!selectedButton)
      return

    const containerRect = containerRef.current.getBoundingClientRect()
    const buttonRect = selectedButton.getBoundingClientRect()

    // 计算相对位置，考虑容器的padding（p-1 = 4px）
    const containerPadding = 4
    const relativeLeft = buttonRect.left - containerRect.left - containerPadding
    const buttonWidth = buttonRect.width

    setHighlightStyle({
      width: buttonWidth,
      left: relativeLeft,
      opacity: 1,
    })
  }, [selectedIndex])

  // 当选中项或选项改变时更新高亮位置
  useEffect(() => {
    // 使用 requestAnimationFrame 确保 DOM 更新完成后再计算位置
    const updatePosition = () => {
      requestAnimationFrame(updateHighlightPosition)
    }

    updatePosition()

    // 监听窗口大小变化
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('resize', updatePosition)
    }
  }, [selectedIndex, options, updateHighlightPosition])

  // 初始化时更新位置
  useEffect(() => {
    const timer = setTimeout(updateHighlightPosition, 0)
    return () => clearTimeout(timer)
  }, [updateHighlightPosition])

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <Label className={cn('text-sm font-medium', labelClassName)}>
          {label}
        </Label>
      )}
      <div className="relative">
        {/* 灰色底色区域 */}
        <div
          ref={containerRef}
          className="bg-muted rounded-lg p-1 relative"
        >
          {/* 自适应高亮背景 */}
          <div
            className="absolute top-1 bottom-1 bg-background rounded-md transition-all duration-200 ease-out shadow-sm"
            style={{
              width: `${highlightStyle.width}px`,
              transform: `translateX(${highlightStyle.left}px)`,
              opacity: highlightStyle.opacity,
            }}
          />
          {/* 选项按钮 */}
          <div className="flex gap-2 relative z-10">
            {options.map(option => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => onChange(option.value)}
                className={`py-2 px-3 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  value === option.value
                    ? 'text-foreground hover:bg-transparent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{
                  minWidth: 'fit-content',
                }}
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
