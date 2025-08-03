'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { activeToolAtom, cancelProcessingAtom, commonProgressAtom, showProgressDialogAtom } from '@/atoms/shared'
import { CommonProgressDialog } from './common-progress-dialog'

export function AudioProgressDialog() {
  const t = useTranslations('videoToAudio')
  const tCommon = useTranslations('common.dialog')
  const [progress] = useAtom(commonProgressAtom)
  const [showDialog] = useAtom(showProgressDialogAtom)
  const [activeTool] = useAtom(activeToolAtom)
  const cancelProcessing = useAtom(cancelProcessingAtom)[1]

  // 只在当前工具是音频时显示对话框
  if (activeTool !== 'audio') {
    return null
  }

  return (
    <CommonProgressDialog
      open={showDialog}
      progress={progress}
      title={t('conversionInProgress')}
      pleaseWaitText={tCommon('pleaseWait')}
      cancelText={t('cancelConversion')}
      closeText={tCommon('close')}
      retryText={tCommon('retry')}
      errorDetailsText={tCommon('errorDetails')}
      onCancel={cancelProcessing}
      onOpenChange={() => {}} // 禁用通过点击外部关闭
      showCloseButton={false}
      showRetryButton={false}
      hideCloseButton={true}
    />
  )
}
