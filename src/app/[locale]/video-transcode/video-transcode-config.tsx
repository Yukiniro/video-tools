'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import React from 'react'
import { videoTranscodeConfigAtom } from '@/atoms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SegmentedControl } from '@/components/ui/segmented-control'

const RESOLUTION_OPTIONS = [
  { value: '480P', label: '480P' },
  { value: '720P', label: '720P' },
  { value: '1080P', label: '1080P' },
]

const FORMAT_OPTIONS = [
  { value: 'mp4', label: 'MP4' },
  { value: 'webm', label: 'WebM' },
  { value: 'mkv', label: 'MKV' },
]

export function VideoTranscodeConfig() {
  const t = useTranslations('videoTranscodeConfig')
  const [config, setConfig] = useAtom(videoTranscodeConfigAtom)

  const handleResolutionChange = (resolution: string) => {
    setConfig({ ...config, resolution: resolution as '480P' | '720P' | '1080P' })
  }

  const handleFormatChange = (format: string) => {
    setConfig({ ...config, format: format as 'mp4' | 'webm' | 'mkv' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 分辨率选择 */}
        <SegmentedControl
          label={t('resolution')}
          options={RESOLUTION_OPTIONS}
          value={config.resolution}
          onChange={handleResolutionChange}
        />

        {/* 格式选择 */}
        <SegmentedControl
          label={t('format')}
          options={FORMAT_OPTIONS}
          value={config.format}
          onChange={handleFormatChange}
        />

        {/* 配置提示 */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            •
            {t('tips.resolutionQuality')}
          </p>
          <p>
            •
            {t('tips.formatCompatibility')}
          </p>
          <p>
            •
            {t('tips.processingTime')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
