'use client'

interface DragHandleProps {
  percentage: number
  onMouseDown: (e: React.MouseEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
}

/**
 * 拖拽手柄组件
 * @param percentage 位置百分比
 * @param onMouseDown 鼠标按下事件处理函数
 * @param onTouchStart 触摸开始事件处理函数
 */
export function DragHandle({ percentage, onMouseDown, onTouchStart }: DragHandleProps) {
  return (
    <div
      className="absolute top-0 bottom-0 w-6 bg-blue-500 cursor-ew-resize z-20 shadow-lg rounded-xs group touch-manipulation select-none"
      style={{
        left: `${percentage}%`,
        transform: 'translateX(-50%)',
        touchAction: 'none',
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* 拖动条中间指示线 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-white/80 dark:bg-slate-200/80 rounded-full" />
    </div>
  )
}
