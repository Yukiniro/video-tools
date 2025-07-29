'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { cancelVideoCompressionAtom, closeVideoCompressionDialogAtom, retryVideoCompressionAtom, showVideoCompressionDialogAtom, videoCompressionProgressAtom } from '@/atoms/video-compress'
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
    <Dialog open={showDialog} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {progress.status === 'compressing' && (
              <>
                <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse" />
                {t('compressionInProgress')}
              </>
            )}
            {progress.status === 'success' && (
              <>
                <div className="h-4 w-4 rounded-full bg-green-500" />
                {t('compressionCompleted')}
              </>
            )}
            {progress.status === 'error' && (
              <>
                <div className="h-4 w-4 rounded-full bg-red-500" />
                {t('compressionFailed')}
              </>
            )}
            {progress.status === 'cancelled' && (
              <>
                <div className="h-4 w-4 rounded-full bg-yellow-500" />
                {t('compressionCancelled')}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {progress.status === 'compressing' && t('pleaseWait')}
            {progress.status === 'success' && t('compressionSuccessDescription')}
            {progress.status === 'error' && t('compressionErrorDescription')}
            {progress.status === 'cancelled' && t('compressionCancelledDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 进度条 */}
          {(progress.status === 'compressing' || progress.status === 'success') && (
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
          )}

          {/* 错误信息 */}
          {progress.status === 'error' && progress.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-600">
                <strong>
                  {t('errorDetails')}
                  :
                </strong>
                {' '}
                {progress.error}
              </div>
            </div>
          )}

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

          {/* 按钮区域 */}
          <div className="space-y-2">
            {/* 压缩中 - 显示取消按钮 */}
            {progress.status === 'compressing' && (
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full"
              >
                {t('cancelCompression')}
              </Button>
            )}

            {/* 成功状态 - 显示关闭按钮 */}
            {progress.status === 'success' && (
              <Button onClick={handleClose} className="w-full">
                {t('close')}
              </Button>
            )}

            {/* 错误状态 - 显示重新尝试和关闭按钮 */}
            {progress.status === 'error' && (
              <>
                <Button onClick={handleRetry} className="w-full">
                  {t('retryCompression')}
                </Button>
                <Button variant="outline" onClick={handleClose} className="w-full">
                  {t('close')}
                </Button>
              </>
            )}

            {/* 取消状态 - 显示重新尝试和关闭按钮 */}
            {progress.status === 'cancelled' && (
              <>
                <Button onClick={handleRetry} className="w-full">
                  {t('retryCompression')}
                </Button>
                <Button variant="outline" onClick={handleClose} className="w-full">
                  {t('close')}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
