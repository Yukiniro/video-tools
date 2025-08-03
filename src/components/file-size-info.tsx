'use client'

import type { ReactNode } from 'react'

interface FileSizeInfoProps {
  originalSize?: number
  compressedSize?: number
  compressionRatio?: number
  originalSizeText: string
  compressedSizeText: string
  compressionRatioText: string
  reducedText: string
  className?: string
  children?: ReactNode
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

export function FileSizeInfo({
  originalSize,
  compressedSize,
  compressionRatio,
  originalSizeText,
  compressedSizeText,
  compressionRatioText,
  reducedText,
  className = '',
  children,
}: FileSizeInfoProps) {
  // 如果没有任何文件大小信息，则不渲染
  if (!originalSize && !compressedSize) {
    return null
  }

  return (
    <div className={`grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg text-sm ${className}`}>
      <div>
        <div className="text-muted-foreground mb-1">{originalSizeText}</div>
        <div className="font-medium">
          {originalSize ? formatFileSize(originalSize) : '--'}
        </div>
      </div>
      <div>
        <div className="text-muted-foreground mb-1">{compressedSizeText}</div>
        <div className="font-medium">
          {compressedSize ? formatFileSize(compressedSize) : '--'}
        </div>
      </div>
      {compressionRatio !== undefined && (
        <div className="col-span-2 pt-2 border-t">
          <div className="text-muted-foreground mb-1">{compressionRatioText}</div>
          <div className="font-medium text-green-600">
            {compressionRatio.toFixed(1)}% {reducedText}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}