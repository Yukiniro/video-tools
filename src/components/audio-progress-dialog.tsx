'use client'

import { useAtom } from 'jotai'
import { Loader2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { audioConversionProgressAtom, cancelAudioConversionAtom, showAudioProgressDialogAtom } from '@/atoms'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

export function AudioProgressDialog() {
  const t = useTranslations('audioConfig')
  const [progress] = useAtom(audioConversionProgressAtom)
  const [showDialog] = useAtom(showAudioProgressDialogAtom)
  const cancelConversion = useAtom(cancelAudioConversionAtom)[1]

  const handleCancel = () => {
    cancelConversion()
  }

  return (
    <Dialog open={showDialog} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            {t('conversionInProgress')}
          </DialogTitle>
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
            <Progress value={progress.progress} className="h-2" />
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {t('pleaseWait')}
          </p>

          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-full"
            disabled={!progress.isConverting}
          >
            <X className="mr-2 h-4 w-4" />
            {t('cancelConversion')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
