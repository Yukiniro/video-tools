'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { audioConversionProgressAtom, cancelAudioConversionAtom, showAudioProgressDialogAtom } from '@/atoms'
import { CommonProgressDialog } from './common-progress-dialog'

export function AudioProgressDialog() {
  const t = useTranslations('audioConfig')
  const [progress] = useAtom(audioConversionProgressAtom)
  const [showDialog] = useAtom(showAudioProgressDialogAtom)
  const cancelConversion = useAtom(cancelAudioConversionAtom)[1]

  return (
    <CommonProgressDialog
      open={showDialog}
      progress={progress}
      title={t('conversionInProgress')}
      pleaseWaitText={t('pleaseWait')}
      cancelText={t('cancelConversion')}
      closeText={t('close')}
      retryText={t('retry')}
      errorDetailsText={t('errorDetails')}
      onCancel={cancelConversion}
      onOpenChange={() => {}} // 禁用通过点击外部关闭
      showCloseButton={false}
      showRetryButton={false}
      hideCloseButton={true}
    />
  )
}
