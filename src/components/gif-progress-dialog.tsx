'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { gifConversionProgressAtom, showProgressDialogAtom } from '@/atoms/gif'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

export function GifProgressDialog() {
  const t = useTranslations('gifConfig')
  const [showDialog, setShowDialog] = useAtom(showProgressDialogAtom)
  const [progress] = useAtom(gifConversionProgressAtom)

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
