'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { commonProgressAtom } from '@/atoms/shared'
import { trimVideoAtom, videoTrimConfigAtom } from '@/atoms/video-trim'
import { Button } from '@/components/ui/button'
import { VideoTrimConfig } from './video-trim-config'

export function VideoTrimSettingPanel() {
  const t = useTranslations('videoTrim')
  const tDialog = useTranslations('common.dialog')
  const [progress] = useAtom(commonProgressAtom)
  const [, trimVideo] = useAtom(trimVideoAtom)
  const [config] = useAtom(videoTrimConfigAtom)

  const handleTrimVideo = () => {
    trimVideo({
      translations: t,
      translationsDialog: tDialog,
    })
  }

  const isValidTimeRange = config.startTime < config.endTime && config.endTime > 0

  return (
    <div className="space-y-6">
      <VideoTrimConfig />

      {/* 导出按钮 */}
      <div className="space-y-2">
        <Button
          onClick={handleTrimVideo}
          disabled={progress.isProcessing || !isValidTimeRange}
          className="w-full"
          size="lg"
        >
          {progress.isProcessing ? t('trimming') : t('exportVideo')}
        </Button>
      </div>
    </div>
  )
}
