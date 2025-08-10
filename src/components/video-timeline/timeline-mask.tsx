'use client'

interface TimelineMaskProps {
  startPercentage: number
  endPercentage: number
}

/**
 * 时间轴遮罩组件
 * @param startPercentage 开始位置百分比
 * @param endPercentage 结束位置百分比
 */
export function TimelineMask({ startPercentage, endPercentage }: TimelineMaskProps) {
  return (
    <>
      {/* 左侧遮罩 */}
      <div
        className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-800/30 to-amber-700/40 dark:from-amber-900/40 dark:to-amber-800/50 pointer-events-none backdrop-blur-[1px]"
        style={{
          left: '0%',
          width: `${startPercentage}%`,
        }}
      />

      {/* 右侧遮罩 */}
      <div
        className="absolute top-0 bottom-0 bg-gradient-to-l from-amber-800/30 to-amber-700/40 dark:from-amber-900/40 dark:to-amber-800/50 pointer-events-none backdrop-blur-[1px]"
        style={{
          left: `${endPercentage}%`,
          width: `${100 - endPercentage}%`,
        }}
      />

      {/* 选中区域背景 */}
      <div
        className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border-l-2 border-r-2 border-blue-500 dark:border-blue-400 shadow-sm"
        style={{
          left: `${startPercentage}%`,
          width: `${endPercentage - startPercentage}%`,
        }}
      />
    </>
  )
}
