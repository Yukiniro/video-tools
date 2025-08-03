'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { convertToGifAtom } from '@/atoms/gif'
import { commonProgressAtom } from '@/atoms/shared'
import { Button } from '@/components/ui/button'
import { GifConfig } from './gif-config'

export function VideoToGifSettingPanel() {
  const t = useTranslations('videoToGif')
  const tDialog = useTranslations('common.dialog')
  const [progress] = useAtom(commonProgressAtom)
  const [, convertToGif] = useAtom(convertToGifAtom)

  const handleConvertToGif = () => {
    convertToGif({
      translations: t,
      translationsDialog: tDialog,
    })
  }

  return (
    <div className="space-y-6">
      <GifConfig />

      {/* 导出按钮 */}
      <div className="space-y-2">
        <Button
          onClick={handleConvertToGif}
          disabled={progress.isProcessing}
          className="w-full"
          size="lg"
        >
          {progress.isProcessing ? t('converting') : t('exportGif')}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {t('clickToConvert')}
        </p>
      </div>
    </div>
  )
}
