'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { AudioConfig } from '@/app/[locale]/video-to-audio/audio-config'
import { audioConversionProgressAtom, convertToAudioAtom } from '@/atoms'
import { Button } from '@/components/ui/button'

export default function VideoToAudioSettingPanel() {
  const t = useTranslations('audioConfig')
  const [progress] = useAtom(audioConversionProgressAtom)
  const convertToAudio = useSetAtom(convertToAudioAtom)

  const handleConvertToAudio = () => {
    convertToAudio(t)
  }

  return (
    <div className="space-y-6">
      <AudioConfig />

      {/* 导出按钮 */}
      <div className="space-y-2">
        <Button
          onClick={handleConvertToAudio}
          disabled={progress.isConverting}
          className="w-full"
          size="lg"
        >
          {progress.isConverting ? t('converting') : t('exportAudio')}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {t('clickToConvert')}
        </p>
      </div>
    </div>
  )
}
