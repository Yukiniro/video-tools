'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { cancelConversionAtom, gifConversionProgressAtom, showProgressDialogAtom } from '@/atoms/gif'
import { CommonProgressDialog } from './common-progress-dialog'

export function GifProgressDialog() {
  const t = useTranslations('videoConfig')
  const tCommon = useTranslations('common.dialog')
  const [showDialog, setShowDialog] = useAtom(showProgressDialogAtom)
  const [progress] = useAtom(gifConversionProgressAtom)
  const cancelConversion = useSetAtom(cancelConversionAtom)

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
      pleaseWaitText={tCommon('pleaseWait')}
      cancelText={t('cancelConversion')}
      closeText={tCommon('close')}
      retryText={tCommon('retry')}
      errorDetailsText={tCommon('errorDetails')}
      onOpenChange={handleOpenChange}
      showCancelButton={false}
      showCloseButton={false}
      showRetryButton={false}
    />
  )
}
