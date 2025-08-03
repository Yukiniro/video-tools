'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import React from 'react'
import { gifConfigAtom } from '@/atoms'
import { TimeRangeSettings } from '@/components/time-range-settings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SegmentedControl } from '@/components/ui/segmented-control'

const RESOLUTION_OPTIONS = [
  { value: '120P', label: '120P' },
  { value: '240P', label: '240P' },
  { value: '480P', label: '480P' },
]

const FRAMERATE_OPTIONS = [
  { value: '10FPS', label: '10FPS' },
  { value: '15FPS', label: '15FPS' },
  { value: '25FPS', label: '25FPS' },
]

export function GifConfig() {
  const t = useTranslations('videoToGif')
  const [config, setConfig] = useAtom(gifConfigAtom)

  const handleResolutionChange = (resolution: string) => {
    setConfig({ ...config, resolution })
  }

  const handleFrameRateChange = (fps: string) => {
    setConfig({ ...config, fps })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resolution 选择 */}
        <SegmentedControl
          label={t('resolution')}
          options={RESOLUTION_OPTIONS}
          value={config.resolution}
          onChange={handleResolutionChange}
        />

        {/* FrameRate 选择 */}
        <SegmentedControl
          label={t('frameRate')}
          options={FRAMERATE_OPTIONS}
          value={config.fps}
          onChange={handleFrameRateChange}
        />

        {/* 时间设置 */}
        <TimeRangeSettings className="space-y-4" />

        {/* 配置提示 */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            •
            {t('tips.lowResolution')}
          </p>
          <p>
            •
            {t('tips.chooseAppropriate')}
          </p>
          <p>
            •
            {t('tips.timeSettings')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
