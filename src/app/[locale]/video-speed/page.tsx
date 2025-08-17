'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { commonProgressAtom } from '@/atoms/shared'
import { processVideoSpeedAtom, videoSpeedFilesAtom } from '@/atoms/video-speed'
import FileUpload from '@/components/file-upload'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { VideoPreview } from '@/components/video-preview'
import { VideoProgressDialog } from '@/components/video-progress-dialog'
import { VideoSpeedConfig } from '@/components/video-speed-config'

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

/**
 * 视频变速页面组件
 * @returns 视频变速页面
 */
export default function VideoSpeedPage() {
  const t = useTranslations('videoSpeed')
  const tDialog = useTranslations('common.dialog')
  const [files, setFiles] = useAtom(videoSpeedFilesAtom)
  const [progress] = useAtom(commonProgressAtom)
  const processVideoSpeed = useSetAtom(processVideoSpeedAtom)

  const showUpload = files.length === 0
  const showConfig = files.length > 0

  const handleProcess = () => {
    processVideoSpeed({
      translations: t,
      translationsDialog: tDialog,
    })
  }

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles)
  }

  return (
    <ToolPageTemplate toolKey="videoSpeed">
      <div className="space-y-8">
        {/* 文件上传区域 */}
        {showUpload && (
          <FileUpload
            accept="video/*"
            onFilesChange={handleFilesChange}
            description={t('dropYourVideoHereOrClickToBrowse')}
          />
        )}

        {/* 配置和预览区域 */}
        {showConfig && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧：视频预览 */}
            <div className="space-y-4">
              <VideoPreview file={files[0]} />

              {/* 文件信息 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('fileName')}</span>
                      <span className="font-medium">{files[0].name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('fileSize')}</span>
                      <span className="font-medium">{formatFileSize(files[0].size)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('fileType')}</span>
                      <span className="font-medium">{files[0].type}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：配置选项 */}
            <div className="space-y-4">
              <VideoSpeedConfig />

              {/* 处理按钮 */}
              <Button
                onClick={handleProcess}
                className="w-full"
                size="lg"
                disabled={progress.isProcessing}
              >
                {progress.isProcessing ? t('processing') : t('processVideo')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 进度对话框 */}
      <VideoProgressDialog />
    </ToolPageTemplate>
  )
}
