'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { activeToolAtom, cancelProcessingAtom, commonProgressAtom, showProgressDialogAtom } from '@/atoms/shared'
import { CommonProgressDialog } from './common-progress-dialog'

export function VideoTrimProgressDialog() {
  const t = useTranslations('videoTrim')
  const tCommon = useTranslations('common.dialog')
  const [showDialog] = useAtom(showProgressDialogAtom)
  const [progress] = useAtom(commonProgressAtom)
  const [activeTool] = useAtom(activeToolAtom)
  const [, cancelProcessing] = useAtom(cancelProcessingAtom)

  const handleCancel = () => {
    cancelProcessing()
  }

  // 只在当前工具是视频裁剪时显示对话框
  if (activeTool !== 'video-trim') {
    return null
  }

  return (
    <CommonProgressDialog
      open={showDialog}
      progress={progress}
      statusTexts={{
        converting: t('trimming'),
        success: t('trimCompleted'),
        error: t('trimFailed'),
        cancelled: t('trimCancelled'),
      }}
      statusDescriptions={{
        converting: t('trimmingInProgress'),
        success: t('trimSuccessDescription'),
        error: t('trimErrorDescription'),
        cancelled: t('trimCancelledDescription'),
      }}
      pleaseWaitText={tCommon('pleaseWait')}
      cancelText={t('cancelTrim')}
      closeText={tCommon('close')}
      retryText={t('retryTrim')}
      errorDetailsText={tCommon('errorDetails')}
      onCancel={handleCancel}
      onClose={handleCancel}
      onRetry={handleCancel}
      onOpenChange={handleCancel}
      showStatusIcon={true}
      showCloseButton={false}
      showRetryButton={false}
      hideCloseButton={true}
    />
  )
}
