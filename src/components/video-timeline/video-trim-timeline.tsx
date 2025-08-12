'use client'

import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  formatTime,
  PlaybackIndicator,
  PlayControlButton,
  TimelineControls,
  TimelineMask,
} from '.'
import { TimelineThumbnail } from './timeline-thumbnail'

interface VideoTrimTimelineProps {
  file: File
  isPlaying: boolean
  currentTime: number
  duration: number
  startTime: number
  endTime: number
  title?: string
  togglePlay: () => void
  onCurrentTimeChange: (time: number) => void
  onStartTimeChange: (time: number) => void
  onEndTimeChange: (time: number) => void
  onRangeMove: (startTime: number, endTime: number) => void
}

export function VideoTrimTimeline(props: VideoTrimTimelineProps) {
  const {
    file,
    isPlaying,
    currentTime,
    duration,
    startTime,
    endTime,
    title = '时间轴裁剪',
    togglePlay,
    onCurrentTimeChange,
    onStartTimeChange,
    onEndTimeChange,
    onRangeMove,
  } = props

  const timelineRef = useRef<HTMLDivElement>(null)
  const [_, setDragType] = useState<'none' | 'handle' | 'seek'>('none')

  /**
   * 处理时间轴鼠标按下事件，支持点击和拖动更新当前时间
   * @param e 鼠标事件
   */
  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    if (!timelineRef.current || duration === 0)
      return

    setDragType('seek')

    e.preventDefault()
    e.stopPropagation()

    const updateCurrentTime = (clientX: number) => {
      if (!timelineRef.current)
        return

      const rect = timelineRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const percentage = Math.max(0, Math.min(1, x / rect.width))
      const time = percentage * duration

      onCurrentTimeChange(time)
    }

    // 初始点击时更新时间
    updateCurrentTime(e.clientX)

    // 处理拖动
    const handleMouseMove = (e: MouseEvent) => {
      updateCurrentTime(e.clientX)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      setDragType('none')
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // 处理拖动开始
  const handleChangeStart = (_type: 'start' | 'end' | 'range') => {
    // 可以在这里添加拖动开始的逻辑，比如显示提示信息等
    setDragType('handle')
  }

  // 处理拖动过程中的变化
  const handleChange = (type: 'start' | 'end' | 'range', percentage: number, _deltaPercentage?: number) => {
    if (duration === 0)
      return

    if (type === 'start') {
      const time = (percentage / 100) * duration
      const newStartTime = Math.max(0, Math.min(time, endTime - 1))
      onStartTimeChange(newStartTime)
    }
    else if (type === 'end') {
      const time = (percentage / 100) * duration
      const newEndTime = Math.max(startTime + 1, Math.min(time, duration))
      onEndTimeChange(newEndTime)
    }
    else if (type === 'range') {
      const rangeDuration = endTime - startTime
      const newStartTime = (percentage / 100) * duration
      const newEndTime = newStartTime + rangeDuration
      onRangeMove(newStartTime, newEndTime)
    }
  }

  // 处理拖动结束
  const handleChangeEnd = (_type: 'start' | 'end' | 'range') => {
    // 可以在这里添加拖动结束的逻辑，比如隐藏提示信息等
    setDragType('none')
  }

  if (duration === 0) {
    return null
  }

  const startPercentage = (startTime / duration) * 100
  const endPercentage = (endTime / duration) * 100
  const currentPercentage = (currentTime / duration) * 100
  const selectedDuration = endTime - startTime

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          <PlayControlButton isPlaying={isPlaying} togglePlay={togglePlay} />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              选中时长:
              {formatTime(selectedDuration)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* 时间轴 */}
        <div className="space-y-3">
          <div
            ref={timelineRef}
            className="relative h-16 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl cursor-pointer shadow-inner border border-slate-200 dark:border-slate-600"
            onMouseDown={handleTimelineMouseDown}
          >
            {/* 背景轨道 */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700" />

            {/* 视频缩略图 */}
            <TimelineThumbnail file={file} />

            {/* 时间轴遮罩 */}
            <TimelineMask
              startPercentage={startPercentage}
              endPercentage={endPercentage}
            />

            {/* 当前播放位置指示器 */}
            <PlaybackIndicator percentage={currentPercentage} />

            {/* 时间轴控制器 - 包含范围移动控制器和拖拽手柄 */}
            <TimelineControls
              startPercentage={startPercentage}
              endPercentage={endPercentage}
              timelineRef={timelineRef}
              onChangeStart={handleChangeStart}
              onChange={handleChange}
              onChangeEnd={handleChangeEnd}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
