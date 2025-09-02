'use client'

import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMobileInteraction } from '@/hooks/use-mobile-interaction'
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
   * 处理时间轴交互事件，支持点击和拖动更新当前时间
   */
  const timelineInteraction = useMobileInteraction({
    onStart: (position) => {
      if (!timelineRef.current || duration === 0)
        return

      setDragType('seek')
      updateCurrentTime(position.x)
    },
    onMove: (position) => {
      updateCurrentTime(position.x)
    },
    onEnd: () => {
      setDragType('none')
    },
  })

  const updateCurrentTime = (clientX: number) => {
    if (!timelineRef.current)
      return

    const rect = timelineRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    const time = percentage * duration

    onCurrentTimeChange(time)
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
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-center justify-between sm:justify-start">
            <span className="text-sm sm:text-base">{title}</span>
            <PlayControlButton isPlaying={isPlaying} togglePlay={togglePlay} />
          </div>
          <div className="flex items-center justify-center sm:justify-end text-xs sm:text-sm text-muted-foreground">
            <span>
              选中时长:
              {' '}
              {formatTime(selectedDuration)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 pt-0">

        {/* 时间轴 */}
        <div className="space-y-2 sm:space-y-3">
          <div
            ref={timelineRef}
            className="relative h-12 sm:h-16 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg sm:rounded-xl cursor-pointer shadow-inner border border-slate-200 dark:border-slate-600 touch-manipulation select-none"
            onMouseDown={timelineInteraction.onMouseDown}
            onTouchStart={timelineInteraction.onTouchStart}
            style={{ touchAction: 'none' }}
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
