'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { cancelVideoConversionAtom, showVideoProgressDialogAtom, videoConversionProgressAtom } from '@/atoms/video'
import { CommonProgressDialog } from './common-progress-dialog'

export function VideoProgressDialog() {
  const t = useTranslations('videoConfig')
  const [showDialog, setShowDialog] = useAtom(showVideoProgressDialogAtom)
  const [progress] = useAtom(videoConversionProgressAtom)
  const cancelConversion = useSetAtom(cancelVideoConversionAtom)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      cancelConversion()
    }
    setShowDialog(open)
  }

  return (
    <CommonProgressDialog
      open={showDialog}
      progress={progress}
      title={t('converting')}
      description={t('conversionInProgress')}
      pleaseWaitText={t('pleaseWait')}
      cancelText={t('cancel')}
      closeText={t('close')}
      retryText={t('retry')}
      errorDetailsText={t('errorDetails')}
      onOpenChange={handleOpenChange}
      showCancelButton={false}
      showCloseButton={false}
      showRetryButton={false}
    />
  )
}
