'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { VideoTranscodeConfig } from '@/app/[locale]/video-transcode/video-transcode-config'
import { convertToVideoTranscodeAtom, videoTranscodeConversionProgressAtom } from '@/atoms'
import { Button } from '@/components/ui/button'

export default function VideoTranscodeSettingPanel() {
  const t = useTranslations('videoTranscodeConfig')
  const tDialog = useTranslations('common.dialog')
  const [progress] = useAtom(videoTranscodeConversionProgressAtom)
  const convertToVideoTranscode = useSetAtom(convertToVideoTranscodeAtom)

  const handleConvertToVideoTranscode = () => {
    convertToVideoTranscode({
      translations: t,
      translationsDialog: tDialog,
    })
  }

  return (
    <div className="space-y-6">
      <VideoTranscodeConfig />

      {/* 导出按钮 */}
      <div className="space-y-2">
        <Button
          onClick={handleConvertToVideoTranscode}
          disabled={progress.isConverting}
          className="w-full"
          size="lg"
        >
          {progress.isConverting ? t('converting') : t('exportVideo')}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {t('clickToConvert')}
        </p>
      </div>
    </div>
  )
}
