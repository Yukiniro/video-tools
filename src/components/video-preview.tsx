'use client'

import { useTranslations } from 'next-intl'
import { useImperativeHandle, useRef } from 'react'

interface VideoPreviewProps {
  file: File
  title?: string
  showControls?: boolean
}

export interface VideoPreviewRef {
  play: () => Promise<void>
  pause: () => Promise<void>
  seekTo: (time: number) => Promise<void>
  getCurrentTime: () => number
  getDuration: () => number
  setVolume: (volume: number) => void
  getVideoElement: () => HTMLVideoElement | null
}

interface VideoPreviewProps {
  ref?: React.RefObject<VideoPreviewRef | null>
  file: File
  title?: string
  showControls?: boolean
  onTimeUpdate?: (time: number) => void
}

export function VideoPreview({ ref, file, title, showControls = true, onTimeUpdate }: VideoPreviewProps & { ref?: React.RefObject<VideoPreviewRef | null> }) {
  const t = useTranslations('common.videoPreview')
  const videoRef = useRef<HTMLVideoElement>(null)

  useImperativeHandle(ref, () => ({
    play: async () => {
      if (videoRef.current) {
        await videoRef.current.play()
      }
    },
    pause: async () => {
      if (videoRef.current) {
        videoRef.current.pause()
        // 等待下一帧确保暂停状态已更新
        await new Promise(resolve => requestAnimationFrame(resolve))
      }
    },
    seekTo: async (time: number) => {
      if (videoRef.current) {
        const video = videoRef.current
        video.currentTime = time

        // 监听跳转是否成功
        return new Promise<void>((resolve, reject) => {
          let handleSeeked = () => {}
          let handleError = () => {}

          handleSeeked = () => {
            video.removeEventListener('seeked', handleSeeked)
            video.removeEventListener('error', handleError)
            resolve()
          }

          handleError = () => {
            video.removeEventListener('seeked', handleSeeked)
            video.removeEventListener('error', handleError)
            reject(new Error('Failed to seek to the specified time'))
          }

          video.addEventListener('seeked', handleSeeked)
          video.addEventListener('error', handleError)
        })
      }
    },
    getCurrentTime: () => {
      return videoRef.current?.currentTime || 0
    },
    getDuration: () => {
      return videoRef.current?.duration || 0
    },
    setVolume: (volume: number) => {
      if (videoRef.current) {
        videoRef.current.volume = Math.max(0, Math.min(1, volume))
      }
    },
    getVideoElement: () => videoRef.current,
  }), [])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title || t('title')}</h3>
      <div key={`${file.name}-${file.lastModified}`} className="space-y-2">
        <p className="text-sm text-muted-foreground">{file.name}</p>
        <video
          ref={videoRef}
          {...(showControls && { controls: true })}
          onTimeUpdate={(e) => {
            if (onTimeUpdate) {
              onTimeUpdate((e.target as HTMLVideoElement).currentTime)
            }
          }}
          className="w-full rounded-lg border"
          preload="metadata"
        >
          <source src={URL.createObjectURL(file)} type={file.type} />
          {t('browserNotSupported')}
        </video>
      </div>
    </div>
  )
}

VideoPreview.displayName = 'VideoPreview'
