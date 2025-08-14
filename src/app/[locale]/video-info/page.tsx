'use client'

import type { VideoInfo } from '@/types/video'
import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { videoInfoFilesAtom } from '@/atoms/video-info'
import FileUpload from '@/components/file-upload'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { VideoInfoDisplay } from '@/components/video-info-display'
import { VideoPreview } from '@/components/video-preview'
import { analyzeVideo } from '@/services/video'

export default function VideoInfoPage() {
  const t = useTranslations('videoInfo')
  const [files, setFiles] = useAtom(videoInfoFilesAtom)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const showUpload = files.length === 0
  const showPreview = files.length > 0

  // 当文件改变时分析视频
  useEffect(() => {
    if (files.length > 0) {
      const handleAnalyzeVideo = async () => {
        setIsAnalyzing(true)
        setError(undefined)
        setVideoInfo(null)

        try {
          const info = await analyzeVideo(files[0])
          setVideoInfo(info)
        }
        catch (err) {
          console.error('Error analyzing video:', err)
          setError(err instanceof Error ? err.message : 'Unknown error occurred')
        }
        finally {
          setIsAnalyzing(false)
        }
      }

      handleAnalyzeVideo()
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
