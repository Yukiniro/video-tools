'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { commonProgressAtom } from '@/atoms/shared'
import { convertToVideoTranscodeAtom } from '@/atoms/video-transcode'
import { Button } from '@/components/ui/button'
import { VideoTranscodeConfig } from './video-transcode-config'

export function VideoTranscodeSettingPanel() {
  const t = useTranslations('videoTranscodeConfig')
  const tDialog = useTranslations('common.dialog')
  const [progress] = useAtom(commonProgressAtom)
  const [, convertToVideoTranscode] = useAtom(convertToVideoTranscodeAtom)

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
          disabled={progress.isProcessing}
          className="w-full"
          size="lg"
        >
          {progress.isProcessing ? t('converting') : t('exportVideo')}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {t('clickToConvert')}
        </p>
      </div>
    </div>
  )
}
