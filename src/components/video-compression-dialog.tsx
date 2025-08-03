'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { activeToolAtom, cancelProcessingAtom, commonProgressAtom, showProgressDialogAtom } from '@/atoms/shared'
import { CommonProgressDialog } from './common-progress-dialog'
import { FileSizeInfo } from './file-size-info'

export function VideoCompressionDialog() {
  const t = useTranslations('videoCompress')
  const tCommon = useTranslations('common.dialog')
  const [showDialog] = useAtom(showProgressDialogAtom)
  const [progress] = useAtom(commonProgressAtom)
  const [activeTool] = useAtom(activeToolAtom)
  const [, cancelProcessing] = useAtom(cancelProcessingAtom)

  const handleCancel = () => {
    cancelProcessing()
  }

  // 只在当前工具是视频压缩时显示对话框
  if (activeTool !== 'video-compress') {
    return null
  }

  return (
    <CommonProgressDialog
      open={showDialog}
      progress={progress}
      statusTexts={{
        compressing: t('compressionInProgress'),
        success: t('compressionCompleted'),
        error: t('compressionFailed'),
        cancelled: t('compressionCancelled'),
      }}
      statusDescriptions={{
        compressing: tCommon('pleaseWait'),
        success: t('compressionSuccessDescription'),
        error: t('compressionErrorDescription'),
        cancelled: t('compressionCancelledDescription'),
      }}
      pleaseWaitText={tCommon('pleaseWait')}
      cancelText={t('cancelCompression')}
      closeText={tCommon('close')}
      retryText={t('retryCompression')}
      errorDetailsText={tCommon('errorDetails')}
      onCancel={handleCancel}
      onClose={handleCancel}
      onRetry={handleCancel}
      onOpenChange={handleCancel}
      showStatusIcon={true}
      customContent={(
        <FileSizeInfo
          originalSize={progress.originalSize}
          compressedSize={progress.compressedSize}
          compressionRatio={progress.compressionRatio}
          originalSizeText={t('originalSize')}
          compressedSizeText={t('compressedSize')}
          compressionRatioText={t('compressionRatio')}
          reducedText={t('reduced')}
        />
      )}
    />
  )
}
