'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import React from 'react'
import { audioConfigAtom } from '@/atoms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SegmentedControl } from '@/components/ui/segmented-control'

const FORMAT_OPTIONS = [
  { value: 'mp3', label: 'MP3' },
  { value: 'wav', label: 'WAV' },
  { value: 'ogg', label: 'OGG' },
]

const QUALITY_OPTIONS = [
  { value: 'high', label: 'high' },
  { value: 'medium', label: 'medium' },
  { value: 'low', label: 'low' },
]

export function AudioConfig() {
  const t = useTranslations('videoToAudio')
  const [config, setConfig] = useAtom(audioConfigAtom)

  const handleFormatChange = (format: string) => {
    setConfig({ ...config, format: format as 'wav' | 'mp3' | 'ogg' })
  }

  const handleQualityChange = (quality: string) => {
    setConfig({ ...config, quality: quality as 'high' | 'medium' | 'low' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 音频格式选择 */}
        <SegmentedControl
          label={t('format')}
          options={FORMAT_OPTIONS}
          value={config.format}
          onChange={handleFormatChange}
        />

        {/* 音频质量选择 */}
        <SegmentedControl
          label={t('quality')}
          options={QUALITY_OPTIONS.map(opt => ({
            ...opt,
            label: t(`qualityOptions.${opt.value}`),
          }))}
          value={config.quality}
          onChange={handleQualityChange}
        />

        {/* 配置提示 */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            •
            {t('tips.formatCompatibility')}
          </p>
          <p>
            •
            {t('tips.qualityVsSize')}
          </p>
          <p>
            •
            {t('tips.losslessQuality')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
