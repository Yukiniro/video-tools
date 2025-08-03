'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { filesAtom } from '@/atoms/files'
import FileUpload from '@/components/file-upload'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { VideoInfoDisplay } from '@/components/video-info-display'
import { VideoPreview } from '@/components/video-preview'

interface VideoInfo {
  duration: number
  width: number
  height: number
  frameRate: number
  bitrate?: number
  videoCodec?: string
  audioCodec?: string
  audioChannels?: number
  audioSampleRate?: number
  format?: string
  size: number
  aspectRatio?: string
  colorSpace?: string
  pixelFormat?: string
}

export default function VideoInfoPage() {
  const t = useTranslations('videoInfo')
  const [files, setFiles] = useAtom(filesAtom)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const showUpload = files.length === 0
  const showPreview = files.length > 0

  // 分析视频信息
  const analyzeVideo = async (file: File) => {
    setIsAnalyzing(true)
    setError(undefined)
    setVideoInfo(null)

    try {
      // 创建video元素来获取基本信息
      const video = document.createElement('video')
      const url = URL.createObjectURL(file)

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          try {
            const info: VideoInfo = {
              duration: video.duration,
              width: video.videoWidth,
              height: video.videoHeight,
              frameRate: 30, // 默认值，实际需要通过其他方式获取
              size: file.size,
              format: file.type.split('/')[1]?.toUpperCase(),
              aspectRatio: `${video.videoWidth}:${video.videoHeight}`,
            }

            // 计算宽高比
            const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
            const divisor = gcd(video.videoWidth, video.videoHeight)
            info.aspectRatio = `${video.videoWidth / divisor}:${video.videoHeight / divisor}`

            setVideoInfo(info)
            resolve()
          }
          catch (err) {
            reject(err)
          }
        }

        video.onerror = () => {
          reject(new Error('Failed to load video metadata'))
        }

        video.src = url
      })

      URL.revokeObjectURL(url)
    }
    catch (err) {
      console.error('Error analyzing video:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    }
    finally {
      setIsAnalyzing(false)
    }
  }

  // 当文件改变时分析视频
  useEffect(() => {
    if (files.length > 0) {
      analyzeVideo(files[0])
    }
    else {
      setVideoInfo(null)
      setError(undefined)
    }
  }, [files])

  return (
    <ToolPageTemplate toolKey="videoInfo">
      <div className="space-y-6">
        {showUpload && (
          <FileUpload
            onFilesChange={setFiles}
            accept="video/*"
            description={t('dropYourVideoHereOrClickToBrowse')}
          />
        )}

        {showPreview && (
          <div className="space-y-6 flex flex-col lg:flex-row lg:gap-12 lg:justify-center">
            <div className="flex-1">
              <VideoPreview file={files[0]} />
            </div>
            <div className="flex-1">
              <VideoInfoDisplay
                file={files[0]}
                videoInfo={videoInfo}
                isAnalyzing={isAnalyzing}
                error={error}
              />
            </div>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  )
}
