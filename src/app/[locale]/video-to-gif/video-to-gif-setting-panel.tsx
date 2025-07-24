'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { GifConfig } from '@/app/[locale]/video-to-gif/gif-config'
import { convertToGifAtom, gifConversionProgressAtom } from '@/atoms'
import { Button } from '@/components/ui/button'

export default function VideoToGifSettingPanel() {
  const t = useTranslations('gifConfig')
  const [progress] = useAtom(gifConversionProgressAtom)
  const convertToGif = useSetAtom(convertToGifAtom)

  const handleConvertToGif = () => {
    convertToGif(t)
  }

  return (
    <div className="space-y-6">
      <GifConfig />

      {/* 导出按钮 */}
      <div className="space-y-2">
        <Button
          onClick={handleConvertToGif}
          disabled={progress.isConverting}
          className="w-full"
          size="lg"
        >
          {progress.isConverting ? t('converting') : t('exportGif')}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {t('clickToConvert')}
        </p>
      </div>
    </div>
  )
}
