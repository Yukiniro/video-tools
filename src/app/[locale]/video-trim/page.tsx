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

            {/* 移动端提示信息 */}
            {isMobile && (
              <div className="w-full max-w-5xl mx-auto px-2 sm:px-0">
                <div className="bg-muted/50 border border-muted rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">移动端时间轴功能</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        时间轴裁剪功能在移动端暂不可用，请在桌面端使用以获得完整功能体验。
                        <br />
                        您仍可以使用右侧的设置面板来调整开始和结束时间。
                      </p>
                    </div>
                  </div>
                </div>
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
