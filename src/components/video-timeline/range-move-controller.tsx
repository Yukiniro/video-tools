'use client'

interface RangeMoveControllerProps {
  startPercentage: number
  endPercentage: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

/**
 * 范围移动控制器组件
 * @param {object} props - 组件属性
 * @param {Function} props.onMouseDown - 鼠标按下事件处理函数
 */
export function RangeMoveController({ onMouseDown }: RangeMoveControllerProps) {
  return (
    <div
      className="absolute top-[-12px] left-0 transform -translate-x-1/2 flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-300 dark:hover:to-blue-400 cursor-move z-30 shadow-lg hover:shadow-xl rounded-t-sm"
      style={{
        width: '32px',
        height: '12px',
      }}
      onMouseDown={onMouseDown}
      title="拖拽移动选中区域"
    >
      {/* 条形控制器中间的抓手指示线 */}
      <div className="flex items-center justify-center gap-0.5">
        <div className="w-0.5 h-2 bg-white/80 dark:bg-slate-200/80 rounded-full" />
        <div className="w-0.5 h-2 bg-white/80 dark:bg-slate-200/80 rounded-full" />
        <div className="w-0.5 h-2 bg-white/80 dark:bg-slate-200/80 rounded-full" />
      </div>
    </div>
  )
}
