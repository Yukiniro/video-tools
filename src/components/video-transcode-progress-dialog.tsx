'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import {
  cancelVideoTranscodeConversionAtom,
  showVideoTranscodeProgressDialogAtom,
  videoTranscodeConversionProgressAtom,
} from '@/atoms'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

export function VideoTranscodeProgressDialog() {
  const t = useTranslations('videoTranscodeConfig')
  const [showDialog, setShowDialog] = useAtom(showVideoTranscodeProgressDialogAtom)
  const [progress] = useAtom(videoTranscodeConversionProgressAtom)
  const cancelConversion = useSetAtom(cancelVideoTranscodeConversionAtom)

  const handleCancel = () => {
    cancelConversion()
    setShowDialog(false)
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('converting')}</DialogTitle>
          <DialogDescription>
            {t('conversionInProgress')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progress.stage}</span>
              <span>{progress.progress}%</span>
            </div>
            <Progress value={progress.progress} className="w-full" />
          </div>

          {/* 取消按钮 */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={!progress.isConverting}
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}