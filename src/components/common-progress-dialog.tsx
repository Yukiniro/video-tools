'use client'

import type { ReactNode } from 'react'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

export interface ProgressState {
  progress: number
  stage: string
  isConverting?: boolean
  status?: 'idle' | 'compressing' | 'converting' | 'success' | 'error' | 'cancelled'
  error?: string
  originalSize?: number
  compressedSize?: number
  compressionRatio?: number
}

export interface ProgressDialogConfig {
  // 基础配置
  open: boolean
  progress: ProgressState

  // 文本配置
  title?: string
  description?: string
  pleaseWaitText: string
  cancelText: string
  closeText: string
  retryText: string
  errorDetailsText: string

  // 状态文本配置
  statusTexts?: {
    compressing?: string
    converting?: string
    success?: string
    error?: string
    cancelled?: string
  }

  // 状态描述配置
  statusDescriptions?: {
    compressing?: string
    converting?: string
    success?: string
    error?: string
    cancelled?: string
  }

  // 行为配置
  onCancel?: () => void
  onClose?: () => void
  onRetry?: () => void
  onOpenChange?: (open: boolean) => void

  // 显示配置
  showCancelButton?: boolean
  showCloseButton?: boolean
  showRetryButton?: boolean
  showStatusIcon?: boolean
  hideCloseButton?: boolean

  // 自定义内容
  customContent?: ReactNode
  customActions?: ReactNode
}

function getStatusIcon(status?: string, showIcon: boolean = true) {
  if (!showIcon)
    return null

  switch (status) {
    case 'compressing':
    case 'converting':
      return <Loader2 className="h-5 w-5 animate-spin" />
    case 'success':
      return <div className="h-4 w-4 rounded-full bg-green-500" />
    case 'error':
      return <div className="h-4 w-4 rounded-full bg-red-500" />
    case 'cancelled':
      return <div className="h-4 w-4 rounded-full bg-yellow-500" />
    default:
      return <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse" />
  }
}

export function CommonProgressDialog({
  open,
  progress,
  title,
  description,
  pleaseWaitText,
  cancelText,
  closeText,
  retryText,
  errorDetailsText,
  statusTexts = {},
  statusDescriptions = {},
  onCancel,
  onClose,
  onRetry,
  onOpenChange,
  showCancelButton = true,
  showCloseButton = true,
  showRetryButton = true,
  showStatusIcon = true,
  hideCloseButton = false,
  customContent,
  customActions,
}: ProgressDialogConfig) {
  const currentStatus = progress.status || 'converting'
  const isProcessing = currentStatus === 'compressing' || currentStatus === 'converting'

  // 获取当前状态的标题和描述
  const currentTitle = title || statusTexts[currentStatus as keyof typeof statusTexts]
  const currentDescription = description || statusDescriptions[currentStatus as keyof typeof statusDescriptions]
  const currentProgessStageText = statusTexts[progress.stage as keyof typeof statusTexts]

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
    else if (!newOpen && onCancel) {
      onCancel()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!hideCloseButton}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(currentStatus, showStatusIcon)}
            {currentTitle}
          </DialogTitle>
          {currentDescription && (
            <DialogDescription>
              {currentDescription}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* 进度条 */}
          {(isProcessing || currentStatus === 'success') && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{currentProgessStageText}</span>
                <span className="font-medium">
                  {progress.progress.toFixed(0)}
                  %
                </span>
              </div>
              <Progress value={progress.progress} className="h-2" />
            </div>
          )}

          {/* 错误信息 */}
          {currentStatus === 'error' && progress.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-600">
                <strong>
                  {errorDetailsText}
                  :
                </strong>
                {' '}
                {progress.error}
              </div>
            </div>
          )}

          {/* 等待提示 */}
          {isProcessing && (
            <p className="text-sm text-muted-foreground text-center">
              {pleaseWaitText}
            </p>
          )}

          {/* 自定义内容 */}
          {customContent}

          {/* 按钮区域 */}
          {!customActions && (
            <div className="space-y-2">
              {/* 处理中 - 显示取消按钮 */}
              {isProcessing && showCancelButton && onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="w-full"
                  disabled={!isProcessing}
                >
                  <X className="mr-2 h-4 w-4" />
                  {cancelText}
                </Button>
              )}

              {/* 成功状态 - 显示关闭按钮 */}
              {currentStatus === 'success' && showCloseButton && onClose && (
                <Button onClick={onClose} className="w-full">
                  {closeText}
                </Button>
              )}

              {/* 错误/取消状态 - 显示重试和关闭按钮 */}
              {(currentStatus === 'error' || currentStatus === 'cancelled') && (
                <>
                  {showRetryButton && onRetry && (
                    <Button onClick={onRetry} className="w-full">
                      {retryText}
                    </Button>
                  )}
                  {showCloseButton && onClose && (
                    <Button variant="outline" onClick={onClose} className="w-full">
                      {closeText}
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          {/* 自定义操作按钮 */}
          {customActions}
        </div>
      </DialogContent>
    </Dialog>
  )
}
