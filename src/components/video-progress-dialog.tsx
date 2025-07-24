'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { cancelVideoConversionAtom, showVideoProgressDialogAtom, videoConversionProgressAtom } from '@/atoms/video'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

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
    <Dialog open={showDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('converting')}</DialogTitle>
          <DialogDescription>
            {t('conversionInProgress')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progress.stage}</span>
              <span>
                {progress.progress}
                %
              </span>
            </div>
            <Progress value={progress.progress} className="w-full" />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {t('pleaseWait')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
