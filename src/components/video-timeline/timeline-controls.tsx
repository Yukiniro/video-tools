'use client'

import { useRef } from 'react'
import { useMobileInteraction } from '@/hooks/use-mobile-interaction'
import { DragHandle } from './drag-handle'

type ControllerType = 'start' | 'end' | 'range'

interface TimelineControlsProps {
  /** 开始位置百分比 (0-100) */
  startPercentage: number
  /** 结束位置百分比 (0-100) */
  endPercentage: number
  /** 时间轴容器引用，用于计算拖动位置 */
  timelineRef: React.RefObject<HTMLDivElement | null>
  /** 拖动开始回调 */
  onChangeStart?: (type: ControllerType, percentage?: number) => void
  /** 拖动过程中回调 */
  onChange?: (type: ControllerType, percentage: number, deltaPercentage?: number) => void
  /** 拖动结束回调 */
  onChangeEnd?: (type: ControllerType, percentage?: number) => void
}

/**
 * 时间轴控制器组件 - 包含范围移动控制器和拖拽手柄
 * 内置完整的鼠标拖动逻辑，对外提供高级回调接口
 *
 * @param props
 * @param props.startPercentage 开始位置百分比
 * @param props.endPercentage 结束位置百分比
 * @param props.timelineRef 时间轴容器引用
 * @param props.onChangeStart 开始时间变化回调
 * @param props.onChange 拖动过程中回调
 * @param props.onChangeEnd 结束时间变化回调
 */
export function TimelineControls({
  startPercentage,
  endPercentage,
  timelineRef,
  onChangeStart,
  onChange,
  onChangeEnd,
}: TimelineControlsProps) {
  const isDraggingRef = useRef<'start' | 'end' | 'range' | null>(null)
  const dragOffsetRef = useRef(0)
  const cleanupRef = useRef<(() => void) | null>(null)

  const rangeWidth = endPercentage - startPercentage

  /**
   * 处理拖动开始
   * @param type 拖动类型
   * @param initialOffset 初始偏移量（仅用于范围拖动）
   */
  const handleDragStart = (type: 'start' | 'end' | 'range', initialOffset = 0) => {
    const mobileInteraction = useMobileInteraction({
      onStart: (position) => {
        if (!timelineRef.current)
          return

        isDraggingRef.current = type
        dragOffsetRef.current = initialOffset
        onChangeStart?.(type)
      },
      onMove: (position) => {
        if (!timelineRef.current || !isDraggingRef.current)
          return

        const rect = timelineRef.current.getBoundingClientRect()
        const x = position.x - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))

        if (isDraggingRef.current === 'range') {
          const rangeDuration = endPercentage - startPercentage
          const adjustedPercentage = percentage - dragOffsetRef.current
          const newStartPercentage = Math.max(0, Math.min(adjustedPercentage, 100 - rangeDuration))
          onChange?.(type, newStartPercentage)
        }
        else {
          onChange?.(type, percentage)
        }
      },
      onEnd: (position) => {
        if (!timelineRef.current || !isDraggingRef.current)
          return

        const rect = timelineRef.current.getBoundingClientRect()
        const x = position.x - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))

        if (isDraggingRef.current === 'range') {
          const rangeDuration = endPercentage - startPercentage
          const adjustedPercentage = percentage - dragOffsetRef.current
          const newStartPercentage = Math.max(0, Math.min(adjustedPercentage, 100 - rangeDuration))
          onChangeEnd?.(type, newStartPercentage)
        }
        else {
          onChangeEnd?.(type, percentage)
        }

        isDraggingRef.current = null
        dragOffsetRef.current = 0
      },
    })

    return (e: React.MouseEvent | React.TouchEvent) => {
      // 清理之前的监听器
      if (cleanupRef.current) {
        cleanupRef.current()
      }

      // 设置新的监听器
      cleanupRef.current = mobileInteraction.bindEvents()

      // 触发开始事件
      mobileInteraction.onMouseDown?.(e)
    }
  }

  /**
   * 处理范围拖动开始
   */
  const handleRangeDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!timelineRef.current)
      return

    const rect = timelineRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const x = clientX - rect.left
    const clickPercentage = (x / rect.width) * 100
    const offset = clickPercentage - startPercentage

    handleDragStart('range', offset)(e)
  }

  return (
    <div
      className="absolute h-full flex items-stretch border border-solid border-blue-500"
      style={{
        left: `${startPercentage}%`,
        width: `${rangeWidth}%`,
      }}
    >
      {/* 范围移动控制器 - 顶部居中 */}
      <div
        className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-300 dark:hover:to-blue-400 cursor-ew-resize z-30 shadow-lg hover:shadow-xl rounded-t-sm pointer-events-auto w-[44px] h-[16px] touch-manipulation select-none"
        onMouseDown={e => handleRangeDragStart(e)}
        onTouchStart={e => handleRangeDragStart(e)}
        style={{ touchAction: 'none' }}
      >
        {/* 条形控制器中间的抓手指示线 */}
        <div className="flex items-center justify-center gap-0.5">
          <div className="w-0.5 h-2 bg-white/80 dark:bg-slate-200/80 rounded-full" />
          <div className="w-0.5 h-2 bg-white/80 dark:bg-slate-200/80 rounded-full" />
          <div className="w-0.5 h-2 bg-white/80 dark:bg-slate-200/80 rounded-full" />
        </div>
      </div>

      {/* 开始时间拖拽手柄 - 左侧 */}
      <DragHandle
        percentage={0}
        onMouseDown={handleDragStart('start')}
        onTouchStart={handleDragStart('start')}
      />

      {/* 结束时间拖拽手柄 - 右侧 */}
      <DragHandle
        percentage={100}
        onMouseDown={handleDragStart('end')}
        onTouchStart={handleDragStart('end')}
      />
    </div>
  )
}
