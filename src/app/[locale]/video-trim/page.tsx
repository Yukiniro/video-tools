'use client'

import type { VideoPreviewRef } from '@/components/video-preview'
import { clamp } from 'es-toolkit'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useRef, useState } from 'react'
import { videoTrimFilesAtom } from '@/atoms'
import { uploadVideoTrimFilesAtom, videoDurationAtom, videoTrimConfigAtom } from '@/atoms/video-trim'
import FileUpload from '@/components/file-upload'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { VideoPreview } from '@/components/video-preview'
import { VideoTrimTimeline } from '@/components/video-timeline'
import { VideoTrimProgressDialog } from '@/components/video-trim-progress-dialog'
import { isMobileDevice } from '@/utils/device-detection'
import { VideoTrimSettingPanel } from './video-trim-setting-panel'

export default function VideoTrimPage() {
  const files = useAtomValue(videoTrimFilesAtom)
  const uploadVideoTrimFiles = useSetAtom(uploadVideoTrimFilesAtom)
  const [config, setConfig] = useAtom(videoTrimConfigAtom)
  const duration = useAtomValue(videoDurationAtom)
  const [isPlay, setIsPlay] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const showUpload = files.length === 0
  const showPreview = files.length > 0
  const isMobile = isMobileDevice()

  const videoPreviewRef = useRef<VideoPreviewRef | null>(null)

  const handleTogglePlay = () => {
    setIsPlay(!isPlay)
    if (isPlay) {
      videoPreviewRef.current?.pause()
    }
    else {
      videoPreviewRef.current?.play()
    }
  }

  const handleCurrentTimeChange = (time: number) => {
    const nextCurrentTime = clamp(time, config.startTime, config.endTime)
    setCurrentTime(nextCurrentTime)
    videoPreviewRef.current?.seekTo(nextCurrentTime)
  }

  const handleStartTimeChange = (time: number) => {
    setConfig(prev => ({ ...prev, startTime: time }))
    const nextCurrentTime = clamp(currentTime, time, config.endTime)
    setCurrentTime(nextCurrentTime)
    videoPreviewRef.current?.seekTo(nextCurrentTime)
  }

  const handleEndTimeChange = (time: number) => {
    const nextCurrentTime = clamp(currentTime, config.startTime, time)
    setConfig(prev => ({ ...prev, endTime: time }))
    setCurrentTime(nextCurrentTime)
    videoPreviewRef.current?.seekTo(nextCurrentTime)
  }

  const handleRangeMove = (startTime: number, endTime: number) => {
    const nextCurrentTime = clamp(currentTime, startTime, endTime)
    setConfig(prev => ({ ...prev, startTime, endTime }))
    setCurrentTime(nextCurrentTime)
    videoPreviewRef.current?.seekTo(nextCurrentTime)
  }

  return (
    <ToolPageTemplate toolKey="videoTrim">
      <div className="space-y-6">
        {showUpload && (
          <FileUpload onFilesChange={uploadVideoTrimFiles} />
        )}
        {showPreview && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col xl:flex-row xl:gap-8 xl:justify-center">
              <div className="w-full xl:flex-2 xl:max-w-2xl">
                <VideoPreview ref={videoPreviewRef} file={files[0]} onTimeUpdate={setCurrentTime} showControls={false} />
              </div>
              <div className="w-full xl:flex-1 xl:max-w-md mt-4 xl:mt-0">
                <VideoTrimSettingPanel />
              </div>
            </div>

            {/* 时间轴裁剪组件 - 移动端隐藏 */}
            {!isMobile && (
              <div className="w-full max-w-5xl mx-auto px-2 sm:px-0">
                <VideoTrimTimeline
                  isPlaying={isPlay}
                  file={files[0]}
                  currentTime={currentTime}
                  duration={duration}
                  startTime={config.startTime}
                  endTime={config.endTime}
                  onCurrentTimeChange={handleCurrentTimeChange}
                  onStartTimeChange={handleStartTimeChange}
                  onEndTimeChange={handleEndTimeChange}
                  onRangeMove={handleRangeMove}
                  togglePlay={handleTogglePlay}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 进度对话框 */}
      <VideoTrimProgressDialog />
    </ToolPageTemplate>
  )
}
