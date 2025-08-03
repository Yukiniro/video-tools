'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { convertToAudioAtom } from '@/atoms/audio'
import { commonProgressAtom } from '@/atoms/shared'
import { Button } from '@/components/ui/button'
import { AudioConfig } from './audio-config'

export function VideoToAudioSettingPanel() {
  const t = useTranslations('videoToAudio')
  const tDialog = useTranslations('common.dialog')
  const [progress] = useAtom(commonProgressAtom)
  const [, convertToAudio] = useAtom(convertToAudioAtom)

  const handleConvertToAudio = () => {
    convertToAudio({
      translations: t,
      translationsDialog: tDialog,
    })
  }

  return (
    <div className="space-y-6">
      <AudioConfig />

      {/* 导出按钮 */}
      <div className="space-y-2">
        <Button
          onClick={handleConvertToAudio}
          disabled={progress.isProcessing}
          className="w-full"
          size="lg"
        >
          {progress.isProcessing ? t('converting') : t('exportAudio')}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {t('clickToConvert')}
        </p>
      </div>
    </div>
  )
}
