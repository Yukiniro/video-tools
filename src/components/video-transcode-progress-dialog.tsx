'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { cancelVideoTranscodeConversionAtom, showVideoTranscodeProgressDialogAtom, videoTranscodeConversionProgressAtom } from '@/atoms/video-transcode'
import { Button } from '@/components/ui/button'
import { CommonProgressDialog } from './common-progress-dialog'

export function VideoTranscodeProgressDialog() {
  const t = useTranslations('videoTranscodeConfig')
  const [showDialog, setShowDialog] = useAtom(showVideoTranscodeProgressDialogAtom)
  const [progress] = useAtom(videoTranscodeConversionProgressAtom)
  const cancelConversion = useSetAtom(cancelVideoTranscodeConversionAtom)

  const handleCancel = () => {
    cancelConversion()
    setShowDialog(false)
  }

  // 自定义取消按钮，放在右侧
  const customActions = (
    <div className="flex justify-end">
      <Button
        variant="outline"
        onClick={handleCancel}
        disabled={!progress.isConverting}
      >
        {t('cancel')}
      </Button>
    </div>
  )

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
      onOpenChange={setShowDialog}
      hideCloseButton={true}
      showCancelButton={false}
      showCloseButton={false}
      showRetryButton={false}
      customActions={customActions}
    />
  )
}
