'use client'

import { useAtom } from 'jotai'
import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { videoDurationAtom, videoTrimConfigAtom } from '@/atoms/video-trim'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface VideoTrimTimelineProps {
  file: File
}

export function VideoTrimTimeline({ file }: VideoTrimTimelineProps) {
  const [config, setConfig] = useAtom(videoTrimConfigAtom)
  const [duration, setDuration] = useAtom(videoDurationAtom)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef<'start' | 'end' | null>(null)

  // 加载视频并获取时长
  useEffect(() => {
    if (!file)
      return

    const video = videoRef.current
    if (!video)
      return

    const url = URL.createObjectURL(file)
    video.src = url

    const handleLoadedMetadata = () => {
      const videoDuration = video.duration
      setDuration(videoDuration)

      // 初始化时间范围
      if (config.endTime === 0) {
        setConfig(prev => ({
          ...prev,
          startTime: 0,
          endTime: Math.min(videoDuration, 30), // 默认30秒或视频总长度
        }))
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      URL.revokeObjectURL(url)
    }
  }, [file, config.endTime, setConfig, setDuration])

  // 播放/暂停控制
  const togglePlay = () => {
    const video = videoRef.current
    if (!video)
      return

    if (isPlaying) {
      video.pause()
    }
    else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 处理时间轴点击
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current || duration === 0)
      return

    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const time = percentage * duration

    const video = videoRef.current
    if (video) {
      video.currentTime = Math.max(0, Math.min(time, duration))
    }
  }

  // 处理拖拽开始
  const handleDragStart = (type: 'start' | 'end') => (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRef.current = type

    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current || !isDraggingRef.current || duration === 0)
        return

      const rect = timelineRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(1, x / rect.width))
      const time = percentage * duration

      if (isDraggingRef.current === 'start') {
        setConfig(prev => ({
          ...prev,
          startTime: Math.max(0, Math.min(time, prev.endTime - 1)),
        }))
      }
      else {
        setConfig(prev => ({
          ...prev,
          endTime: Math.max(prev.startTime + 1, Math.min(time, duration)),
        }))
      }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = null
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // 跳转到开始/结束时间
  const seekTo = (time: number) => {
    const video = videoRef.current
    if (video) {
      video.currentTime = time
    }
  }

  if (duration === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            正在加载视频...
          </div>
        </CardContent>
      </Card>
    )
  }

  const startPercentage = (config.startTime / duration) * 100
  const endPercentage = (config.endTime / duration) * 100
  const currentPercentage = (currentTime / duration) * 100
  const selectedDuration = config.endTime - config.startTime

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>时间轴裁剪</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              选中时长:
              {formatTime(selectedDuration)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 隐藏的视频元素 */}
        <video
          ref={videoRef}
          className="hidden"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* 播放控制 */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePlay}
            className="flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? '暂停' : '播放'}
          </Button>
          <div className="text-sm text-muted-foreground">
            {formatTime(currentTime)}
            {' '}
            /
            {formatTime(duration)}
          </div>
        </div>

        {/* 时间轴 */}
        <div className="space-y-2">
          <div
            ref={timelineRef}
            className="relative h-12 bg-muted rounded-lg cursor-pointer overflow-hidden"
            onClick={handleTimelineClick}
          >
            {/* 背景轨道 */}
            <div className="absolute inset-0 bg-muted" />

            {/* 选中区域 */}
            <div
              className="absolute top-0 bottom-0 bg-primary/20 border-l-2 border-r-2 border-primary"
              style={{
                left: `${startPercentage}%`,
                width: `${endPercentage - startPercentage}%`,
              }}
            />

            {/* 当前播放位置 */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              style={{ left: `${currentPercentage}%` }}
            />

            {/* 开始时间拖拽手柄 */}
            <div
              className="absolute top-0 bottom-0 w-3 bg-primary cursor-ew-resize hover:bg-primary/80 transition-colors z-20"
              style={{ left: `${startPercentage}%`, transform: 'translateX(-50%)' }}
              onMouseDown={handleDragStart('start')}
            />

            {/* 结束时间拖拽手柄 */}
            <div
              className="absolute top-0 bottom-0 w-3 bg-primary cursor-ew-resize hover:bg-primary/80 transition-colors z-20"
              style={{ left: `${endPercentage}%`, transform: 'translateX(-50%)' }}
              onMouseDown={handleDragStart('end')}
            />
          </div>

          {/* 时间标签 */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0:00</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 快速操作按钮 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => seekTo(config.startTime)}
          >
            跳转到开始
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => seekTo(config.endTime)}
          >
            跳转到结束
          </Button>
        </div>

        {/* 时间信息 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">开始时间</div>
            <div className="font-mono">{formatTime(config.startTime)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">结束时间</div>
            <div className="font-mono">{formatTime(config.endTime)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
