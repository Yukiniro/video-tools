'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface VideoInfoProps {
  file: File
  videoInfo: {
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
  } | null
  isAnalyzing: boolean
  error?: string
}

export function VideoInfoDisplay({ file, videoInfo, isAnalyzing, error }: VideoInfoProps) {
  const t = useTranslations('videoInfo')

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0)
      return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
  }

  const formatBitrate = (bitrate: number): string => {
    if (bitrate >= 1000000) {
      return `${(bitrate / 1000000).toFixed(2)} ${t('mbps')}`
    }
    return `${(bitrate / 1000).toFixed(0)} ${t('kbps')}`
  }

  const formatSampleRate = (sampleRate: number): string => {
    if (sampleRate >= 1000) {
      return `${(sampleRate / 1000).toFixed(1)} ${t('khz')}`
    }
    return `${sampleRate} ${t('hz')}`
  }

  const getChannelDescription = (channels: number): string => {
    switch (channels) {
      case 1: return t('mono')
      case 2: return t('stereo')
      case 6: return `5.1 ${t('surround')}`
      case 8: return `7.1 ${t('surround')}`
      default: return `${channels} ${t('channels')}`
    }
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('videoInformation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('analyzing')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('videoInformation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-2">{t('analysisError')}</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!videoInfo) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('basicInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t('fileName')}</label>
              <p className="text-sm font-mono break-all">{file.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t('fileSize')}</label>
              <p className="text-sm">{formatFileSize(file.size)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t('duration')}</label>
              <p className="text-sm">{formatDuration(videoInfo.duration)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t('format')}</label>
              <p>
                {videoInfo.format || file.type.split('/')[1]?.toUpperCase() || t('unknown')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 技术信息 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('technicalInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t('resolution')}</label>
              <p className="text-sm">
                {videoInfo.width}
                {' '}
                ×
                {' '}
                {videoInfo.height}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t('aspectRatio')}</label>
              <p className="text-sm">{videoInfo.aspectRatio || `${(videoInfo.width / videoInfo.height).toFixed(2)}:1`}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t('frameRate')}</label>
              <p className="text-sm">
                {videoInfo.frameRate.toFixed(2)}
                {' '}
                {t('fps')}
              </p>
            </div>
            {videoInfo.bitrate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('bitrate')}</label>
                <p className="text-sm">{formatBitrate(videoInfo.bitrate)}</p>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videoInfo.videoCodec && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('videoCodec')}</label>
                <p>{videoInfo.videoCodec}</p>

              </div>
            )}
            {videoInfo.pixelFormat && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('pixelFormat')}</label>
                <p className="text-sm">{videoInfo.pixelFormat}</p>
              </div>
            )}
            {videoInfo.colorSpace && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('colorSpace')}</label>
                <p className="text-sm">{videoInfo.colorSpace}</p>
              </div>
            )}
          </div>

          {(videoInfo.audioCodec || videoInfo.audioChannels || videoInfo.audioSampleRate) && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoInfo.audioCodec && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('audioCodec')}</label>
                    <p>{videoInfo.audioCodec}</p>

                  </div>
                )}
                {videoInfo.audioChannels && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('audioChannels')}</label>
                    <p className="text-sm">{getChannelDescription(videoInfo.audioChannels)}</p>
                  </div>
                )}
                {videoInfo.audioSampleRate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('audioSampleRate')}</label>
                    <p className="text-sm">{formatSampleRate(videoInfo.audioSampleRate)}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
