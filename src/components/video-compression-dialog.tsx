'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { cancelVideoCompressionAtom, showVideoCompressionDialogAtom, videoCompressionProgressAtom } from '@/atoms/video-compress'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

export function VideoCompressionDialog() {
  const t = useTranslations('videoCompress')
  const [showDialog, setShowDialog] = useAtom(showVideoCompressionDialogAtom)
  const [progress] = useAtom(videoCompressionProgressAtom)
  const cancelCompression = useSetAtom(cancelVideoCompressionAtom)

  const handleCancel = () => {
    cancelCompression()
  }

  const handleClose = () => {
    if (!progress.isCompressing) {
      setShowDialog(false)
    }
  }

  return (
    <Dialog open={showDialog} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse" />
            {t('compressionInProgress')}
          </DialogTitle>
          <DialogDescription>
            {t('pleaseWait')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{progress.stage}</span>
              <span className="font-medium">
                {progress.progress.toFixed(0)}
                %
              </span>
            </div>
            <Progress value={progress.progress} className="h-2" />
          </div>

          {/* 文件大小信息 */}
          {(progress.originalSize || progress.compressedSize) && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg text-sm">
              <div>
                <div className="text-muted-foreground mb-1">{t('originalSize')}</div>
                <div className="font-medium">
                  {progress.originalSize ? formatFileSize(progress.originalSize) : '--'}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">{t('compressedSize')}</div>
                <div className="font-medium">
                  {progress.compressedSize ? formatFileSize(progress.compressedSize) : '--'}
                </div>
              </div>
              {progress.compressionRatio !== undefined && (
                <div className="col-span-2 pt-2 border-t">
                  <div className="text-muted-foreground mb-1">{t('compressionRatio')}</div>
                  <div className="font-medium text-green-600">
                    {progress.compressionRatio.toFixed(1)}
                    %
                    {t('reduced')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 取消按钮 */}
          {progress.isCompressing && (
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full"
            >
              {t('cancelCompression')}
            </Button>
          )}

          {/* 完成状态 */}
          {!progress.isCompressing && progress.progress === 100 && (
            <div className="text-center space-y-2">
              <div className="text-green-600 font-medium">
                ✅
                {' '}
                {t('compressionCompleted')}
              </div>
              <Button onClick={() => setShowDialog(false)} className="w-full">
                {t('close')}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
