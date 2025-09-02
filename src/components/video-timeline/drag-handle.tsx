'use client'

interface DragHandleProps {
  percentage: number
  onMouseDown: (e: React.MouseEvent) => void
}

/**
 * 拖拽手柄组件
 * @param percentage 位置百分比
 * @param onMouseDown 鼠标按下事件处理函数
 */
export function DragHandle({ percentage, onMouseDown }: DragHandleProps) {
  return (
    <div
      className="absolute top-0 bottom-0 w-3 bg-blue-500 cursor-ew-resize z-20 shadow-lg rounded-xs group"
      style={{
        left: `${percentage}%`,
        transform: 'translateX(-50%)',
      }}
      onMouseDown={onMouseDown}
    >
      {/* 拖动条中间指示线 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/80 dark:bg-slate-200/80 rounded-full" />
    </div>
  )
}
