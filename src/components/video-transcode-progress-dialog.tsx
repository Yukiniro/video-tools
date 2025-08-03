'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { activeToolAtom, cancelProcessingAtom, commonProgressAtom, showProgressDialogAtom } from '@/atoms/shared'
import { Button } from '@/components/ui/button'
import { CommonProgressDialog } from './common-progress-dialog'

export function VideoTranscodeProgressDialog() {
  const t = useTranslations('videoTranscode')
  const tDialog = useTranslations('common.dialog')
  const [showDialog] = useAtom(showProgressDialogAtom)
  const [progress] = useAtom(commonProgressAtom)
  const [activeTool] = useAtom(activeToolAtom)
  const [, cancelProcessing] = useAtom(cancelProcessingAtom)

  const handleCancel = () => {
    cancelProcessing()
  }

  // 只在当前工具是视频转码时显示对话框
  if (activeTool !== 'video-transcode') {
    return null
  }

  // 自定义取消按钮，放在右侧
  const customActions = (
    <div className="flex justify-end">
      <Button
        variant="outline"
        onClick={handleCancel}
        disabled={!progress.isProcessing}
      >
        {tDialog('cancel')}
      </Button>
    </div>
  )

  return (
    <CommonProgressDialog
      open={showDialog}
      progress={progress}
      title={t('converting')}
      description={t('conversionInProgress')}
      pleaseWaitText={tDialog('pleaseWait')}
      cancelText={tDialog('cancel')}
      closeText={tDialog('close')}
      retryText={tDialog('retry')}
      errorDetailsText={tDialog('errorDetails')}
      onOpenChange={() => {}}
      hideCloseButton={true}
      showCancelButton={false}
      showCloseButton={false}
      showRetryButton={false}
      customActions={customActions}
    />
  )
}
