'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { videoConfigAtom } from '@/atoms/video'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SegmentedControl } from '@/components/ui/segmented-control'
import type { VideoConfig } from '@/atoms/video'

const RESOLUTION_OPTIONS = [
  { value: '480P', label: '480P' },
  { value: '720P', label: '720P' },
  { value: '1080P', label: '1080P' },
]

const FRAMERATE_OPTIONS = [
  { value: '30FPS', label: '30FPS' },
  { value: '60FPS', label: '60FPS' },
]

export function VideoConfig() {
  const t = useTranslations('gifToVideo')
  const [config, setConfig] = useAtom(videoConfigAtom)

  const handleResolutionChange = (resolution: string) => {
    setConfig(prev => ({ ...prev, resolution: resolution as VideoConfig['resolution'] }))
  }

  const handleFrameRateChange = (fps: string) => {
    setConfig(prev => ({ ...prev, fps: fps as VideoConfig['fps'] }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 视频尺寸 */}
        <SegmentedControl
          label={t('resolution')}
          options={RESOLUTION_OPTIONS}
          value={config.resolution}
          onChange={handleResolutionChange}
        />

        {/* 视频帧率 */}
        <SegmentedControl
          label={t('frameRate')}
          options={FRAMERATE_OPTIONS}
          value={config.fps}
          onChange={handleFrameRateChange}
        />

        {/* 提示信息 */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            •
            {t('tips.resolutionQuality')}
          </p>
          <p>
            •
            {t('tips.frameRateSmooth')}
          </p>
          <p>
            •
            {t('tips.conversionTime')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
