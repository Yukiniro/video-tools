'use client'

import type { VideoPreviewRef } from '@/components/video-preview'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useRef, useState } from 'react'
import { videoTrimFilesAtom } from '@/atoms'
import { uploadVideoTrimFilesAtom, videoDurationAtom, videoTrimConfigAtom } from '@/atoms/video-trim'
import FileUpload from '@/components/file-upload'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { VideoPreview } from '@/components/video-preview'
import { VideoTrimTimeline } from '@/components/video-timeline'
import { VideoTrimProgressDialog } from '@/components/video-trim-progress-dialog'
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
    setCurrentTime(time)
    videoPreviewRef.current?.seekTo(time)
  }

  const handleStartTimeChange = (time: number) => {
    setConfig(prev => ({ ...prev, startTime: time }))
  }

  const handleEndTimeChange = (time: number) => {
    setConfig(prev => ({ ...prev, endTime: time }))
  }

  const handleRangeMove = (startTime: number, endTime: number) => {
    setConfig(prev => ({ ...prev, startTime, endTime }))
  }

  return (
    <ToolPageTemplate toolKey="videoTrim">
      <div className="space-y-6">
        {showUpload && (
          <FileUpload onFilesChange={uploadVideoTrimFiles} />
        )}
        {showPreview && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:gap-12 lg:justify-center">
              <div className="flex-2">
                <VideoPreview ref={videoPreviewRef} file={files[0]} onTimeUpdate={setCurrentTime} showControls={false} />
              </div>
              <div className="flex-1">
                <VideoTrimSettingPanel />
              </div>
            </div>

            {/* 时间轴裁剪组件 */}
            <div className="max-w-4xl mx-auto">
              <VideoTrimTimeline
                isPlaying={isPlay}
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
          </div>
        )}
      </div>

      {/* 进度对话框 */}
      <VideoTrimProgressDialog />
    </ToolPageTemplate>
  )
}
