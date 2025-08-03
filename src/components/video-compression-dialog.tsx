'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { cancelVideoCompressionAtom, closeVideoCompressionDialogAtom, retryVideoCompressionAtom, showVideoCompressionDialogAtom, videoCompressionProgressAtom } from '@/atoms/video-compress'
import { CommonProgressDialog } from './common-progress-dialog'
import { FileSizeInfo } from './file-size-info'

export function VideoCompressionDialog() {
  const t = useTranslations('videoCompress')
  const [showDialog] = useAtom(showVideoCompressionDialogAtom)
  const [progress] = useAtom(videoCompressionProgressAtom)
  const cancelCompression = useSetAtom(cancelVideoCompressionAtom)
  const retryCompression = useSetAtom(retryVideoCompressionAtom)
  const closeDialog = useSetAtom(closeVideoCompressionDialogAtom)

  const handleClose = () => {
    closeDialog()
  }

  const handleCancel = () => {
    cancelCompression()
  }

  const handleRetry = () => {
    retryCompression(t)
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
        compressing: t('pleaseWait'),
        success: t('compressionSuccessDescription'),
        error: t('compressionErrorDescription'),
        cancelled: t('compressionCancelledDescription'),
      }}
      pleaseWaitText={t('pleaseWait')}
      cancelText={t('cancelCompression')}
      closeText={t('close')}
      retryText={t('retryCompression')}
      errorDetailsText={t('errorDetails')}
      onCancel={handleCancel}
      onClose={handleClose}
      onRetry={handleRetry}
      onOpenChange={handleCancel}
      showStatusIcon={true}
      customContent={
        <FileSizeInfo
          originalSize={progress.originalSize}
          compressedSize={progress.compressedSize}
          compressionRatio={progress.compressionRatio}
          originalSizeText={t('originalSize')}
          compressedSizeText={t('compressedSize')}
          compressionRatioText={t('compressionRatio')}
          reducedText={t('reduced')}
        />
      }
    />
  )
}
