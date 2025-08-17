'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { activeToolAtom, cancelProcessingAtom, commonProgressAtom, showProgressDialogAtom } from '@/atoms/shared'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

export function VideoProgressDialog() {
  const tVideoToAudio = useTranslations('videoToAudio')
  const tVideoSpeed = useTranslations('videoSpeed')
  const tVideoCompress = useTranslations('videoCompress')
  const tVideoTranscode = useTranslations('videoTranscode')
  const tDialog = useTranslations('common.dialog')
  const [showDialog] = useAtom(showProgressDialogAtom)
  const [progress] = useAtom(commonProgressAtom)
  const [activeTool] = useAtom(activeToolAtom)
  const [, cancelProcessing] = useAtom(cancelProcessingAtom)

  // 根据工具类型获取相应的翻译函数
  const getTranslations = () => {
    switch (activeTool) {
      case 'video-speed':
        return tVideoSpeed
      case 'video-compress':
        return tVideoCompress
      case 'video-transcode':
        return tVideoTranscode
      default:
        return tVideoToAudio
    }
  }

  const t = getTranslations()

  const handleCancel = () => {
    cancelProcessing()
  }

  // 只在当前工具是视频相关工具时显示对话框
  if (!activeTool || !['video', 'video-speed', 'video-compress', 'video-transcode'].includes(activeTool)) {
    return null
  }

  return (
    <Dialog open={showDialog} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{activeTool === 'video-speed' ? t('processing') : t('converting')}</DialogTitle>
          <DialogDescription>
            {activeTool === 'video-speed' ? t('processingInProgress') : t('conversionInProgress')}
          </DialogDescription>
        </DialogHeader>
        <Progress value={progress.progress} className="w-full" />
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {tDialog('cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
