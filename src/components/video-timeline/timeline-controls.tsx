'use client'

interface TimelineControlsProps {
  startPercentage: number
  endPercentage: number
  onStartMouseDown: (e: React.MouseEvent) => void
  onEndMouseDown: (e: React.MouseEvent) => void
  onRangeMouseDown: (e: React.MouseEvent) => void
}

/**
 * 时间轴控制器组件 - 包含范围移动控制器和拖拽手柄
 * @param startPercentage 开始位置百分比
 * @param endPercentage 结束位置百分比
 * @param onStartMouseDown 开始手柄鼠标按下事件
 * @param onEndMouseDown 结束手柄鼠标按下事件
 * @param onRangeMouseDown 范围移动鼠标按下事件
 */
export function TimelineControls({
  startPercentage,
  endPercentage,
  onStartMouseDown,
  onEndMouseDown,
  onRangeMouseDown,
}: TimelineControlsProps) {
  const rangeWidth = endPercentage - startPercentage

  return (
    <div
      className="absolute h-full flex items-stretch pointer-events-none border border-solid border-blue-500"
      style={{
        left: `${startPercentage}%`,
        width: `${rangeWidth}%`,
      }}
    >
      {/* 范围移动控制器 - 顶部居中 */}
      <div
        className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-300 dark:hover:to-blue-400 cursor-move z-30 shadow-lg hover:shadow-xl rounded-t-sm pointer-events-auto w-[32px] h-[12px]"
        onMouseDown={onRangeMouseDown}
        title="拖拽移动选中区域"
      >
        {/* 条形控制器中间的抓手指示线 */}
        <div className="flex items-center justify-center gap-0.5">
          <div className="w-0.5 h-2 bg-white/80 dark:bg-slate-200/80 rounded-full" />
          <div className="w-0.5 h-2 bg-white/80 dark:bg-slate-200/80 rounded-full" />
          <div className="w-0.5 h-2 bg-white/80 dark:bg-slate-200/80 rounded-full" />
        </div>
      </div>

      {/* 开始时间拖拽手柄 - 左侧 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 cursor-ew-resize hover:from-blue-600 hover:to-blue-800 dark:hover:from-blue-300 dark:hover:to-blue-500 z-20 group pointer-events-auto transform -translate-x-1/2"
        onMouseDown={onStartMouseDown}
        title="拖拽调整开始时间"
      >
        {/* 拖动条中间指示线 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/80 dark:bg-slate-200/80 rounded-full" />
      </div>

      {/* 结束时间拖拽手柄 - 右侧 */}
      <div
        className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-b from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 cursor-ew-resize hover:from-blue-600 hover:to-blue-800 dark:hover:from-blue-300 dark:hover:to-blue-500 z-20 group pointer-events-auto transform translate-x-1/2"
        onMouseDown={onEndMouseDown}
        title="拖拽调整结束时间"
      >
        {/* 拖动条中间指示线 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/80 dark:bg-slate-200/80 rounded-full" />
      </div>
    </div>
  )
}
