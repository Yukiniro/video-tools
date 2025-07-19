'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import FileUpload from '@/components/file-upload'
import { GifConfig } from '@/components/gif-config'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { Button } from '@/components/ui/button'
import { VideoPreview } from '@/components/video-preview'
import { filesAtom, gifConfigAtom } from '@/lib/atoms'

export default function VideoToGifPage() {
  const t = useTranslations('gifConfig')
  const [files, setFiles] = useAtom(filesAtom)
  const [_gifConfig] = useAtom(gifConfigAtom)
  const [isConverting, setIsConverting] = useState(false)

  const showUpload = files.length === 0
  const showPreview = files.length > 0

  const handleConvertToGif = async () => {
    if (files.length === 0)
      return

    setIsConverting(true)
    try {
      // TODO: 实现实际的视频转 GIF 逻辑
      // 这里应该调用实际的转换 API

      // 模拟转换过程
      await new Promise(resolve => setTimeout(resolve, 2000))

      // TODO: 处理转换成功的情况
      // 例如：显示成功消息、下载文件等
    }
    catch {
      // TODO: 实现更好的错误处理
      // 例如：显示错误提示组件
    }
    finally {
      setIsConverting(false)
    }
  }

  return (
    <ToolPageTemplate toolKey="videoToGif">
      <div className="space-y-6">
        {showUpload && (
          <FileUpload onFilesChange={setFiles} />
        )}
        {showPreview && (
          <div className="space-y-6 flex flex-col lg:flex-row lg:gap-12">
            <div className="flex-1">
              <VideoPreview files={files} />
            </div>
            <div className="lg:w-80 space-y-4">
              <GifConfig />

              {/* 导出按钮 */}
              <div className="space-y-2">
                <Button
                  onClick={handleConvertToGif}
                  disabled={isConverting}
                  className="w-full"
                  size="lg"
                >
                  {isConverting ? t('converting') : t('exportGif')}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {t('clickToConvert')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  )
}
