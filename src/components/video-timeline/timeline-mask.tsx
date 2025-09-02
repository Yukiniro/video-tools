'use client'

interface TimelineMaskProps {
  startPercentage: number
  endPercentage: number
}

/**
 * 时间轴遮罩组件
 * @param {object} props - 组件属性
 * @param {number} props.startPercentage - 开始位置百分比
 * @param {number} props.endPercentage - 结束位置百分比
 */
export function TimelineMask({ startPercentage, endPercentage }: TimelineMaskProps) {
  return (
    <>
      {/* 左侧遮罩 */}
      <div
        className="absolute top-0 bottom-0 bg-black/30 pointer-events-none"
        style={{
          left: '0%',
          width: `${startPercentage}%`,
        }}
      />

      {/* 右侧遮罩 */}
      <div
        className="absolute top-0 bottom-0 bg-black/30 pointer-events-none"
        style={{
          left: `${endPercentage}%`,
          width: `${100 - endPercentage}%`,
        }}
      />

      {/* 选中区域背景 */}
      <div
        className="absolute top-0 bottom-0 bg-transparent"
        style={{
          left: `${startPercentage}%`,
          width: `${endPercentage - startPercentage}%`,
        }}
      />
    </>
  )
}
