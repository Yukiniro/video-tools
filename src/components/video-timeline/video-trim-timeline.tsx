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
  const isDraggingRef = useRef<'start' | 'end' | 'range' | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // 处理时间轴点击
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current || duration === 0 || isDragging)
      return

    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const time = percentage * duration

    onCurrentTimeChange(time)
  }

  // 处理拖拽开始
  const handleDragStart = (type: 'start' | 'end' | 'range', initialOffset = 0) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDraggingRef.current = type
    setIsDragging(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current || !isDraggingRef.current || duration === 0)
        return

      const rect = timelineRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(1, x / rect.width))
      const time = percentage * duration

      if (isDraggingRef.current === 'start') {
        const newStartTime = Math.max(0, Math.min(time, endTime - 1))
        onStartTimeChange(newStartTime)
      }
      else if (isDraggingRef.current === 'end') {
        const newEndTime = Math.max(startTime + 1, Math.min(time, duration))
        onEndTimeChange(newEndTime)
      }
      else if (isDraggingRef.current === 'range') {
        const rangeDuration = endTime - startTime
        const newStartTime = Math.max(0, Math.min(time - initialOffset, duration - rangeDuration))
        const newEndTime = newStartTime + rangeDuration
        onRangeMove(newStartTime, newEndTime)
      }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = null
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // 处理范围拖拽开始
  const handleRangeDragStart = (e: React.MouseEvent) => {
    if (!timelineRef.current || duration === 0)
      return

    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const clickTime = percentage * duration
    const offset = clickTime - startTime

    handleDragStart('range', offset)(e)
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
            onClick={handleTimelineClick}
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
              onStartMouseDown={handleDragStart('start')}
              onEndMouseDown={handleDragStart('end')}
              onRangeMouseDown={handleRangeDragStart}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
