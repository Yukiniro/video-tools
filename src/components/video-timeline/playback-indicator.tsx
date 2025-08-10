'use client'

interface PlaybackIndicatorProps {
  percentage: number
}

/**
 * 当前播放位置指示器组件
 * @param percentage 播放位置百分比
 */
export function PlaybackIndicator({ percentage }: PlaybackIndicatorProps) {
  return (
    <div
      className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-400 to-red-600 dark:from-red-300 dark:to-red-500 z-10 pointer-events-none shadow-sm"
      style={{ left: `${percentage}%` }}
    >
      {/* 播放位置顶部指示器 */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full shadow-md border-2 border-white dark:border-slate-800" />
    </div>
  )
}
