'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { activeToolAtom, cancelProcessingAtom, commonProgressAtom, showProgressDialogAtom } from '@/atoms/shared'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

export function GifProgressDialog() {
  const t = useTranslations('videoToGif')
  const [showDialog] = useAtom(showProgressDialogAtom)
  const [progress] = useAtom(commonProgressAtom)
  const [activeTool] = useAtom(activeToolAtom)
  const [, cancelProcessing] = useAtom(cancelProcessingAtom)

  const handleCancel = () => {
    cancelProcessing()
  }

  // 只在当前工具是 GIF 时显示对话框
  if (activeTool !== 'gif') {
    return null
  }

  return (
    <Dialog open={showDialog} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('converting')}</DialogTitle>
          <DialogDescription>{t('conversionInProgress')}</DialogDescription>
        </DialogHeader>
        <Progress value={progress.progress} className="w-full" />
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t('cancelConversion')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
