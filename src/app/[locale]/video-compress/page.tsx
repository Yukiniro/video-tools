'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { commonProgressAtom } from '@/atoms/shared'
import { compressVideoAtom, videoCompressFilesAtom } from '@/atoms/video-compress'
import FileUpload from '@/components/file-upload'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { VideoCompressConfig } from '@/components/video-compress-config'
import { VideoCompressionDialog } from '@/components/video-compression-dialog'
import { VideoPreview } from '@/components/video-preview'

function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

export default function VideoCompressPage() {
  const t = useTranslations('videoCompress')
  const tDialog = useTranslations('common.dialog')
  const [files, setFiles] = useAtom(videoCompressFilesAtom)
  const [progress] = useAtom(commonProgressAtom)
  const compressVideo = useSetAtom(compressVideoAtom)

  const showUpload = files.length === 0
  const showConfig = files.length > 0

  const handleCompress = () => {
    compressVideo({
      translations: t,
      translationsDialog: tDialog,
    })
  }

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles)
  }

  return (
    <ToolPageTemplate toolKey="videoCompress">
      <div className="space-y-8">
        {/* 文件上传区域 */}
        {showUpload && (
          <FileUpload
            onFilesChange={handleFilesChange}
            accept="video/*"
            description={t('dropYourVideoHereOrClickToBrowse')}
          />
        )}

        {showConfig && (
          <div className="space-y-6 flex flex-col lg:flex-row lg:gap-12 lg:justify-center">
            {/* 视频预览和信息 */}
            <div className="flex-2 space-y-6">
              <VideoPreview file={files[0]} />

              {/* 原始文件信息 */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">{t('originalFileInfo')}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">{t('fileName')}</div>
                      <div className="font-medium truncate">{files[0].name}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t('fileSize')}</div>
                      <div className="font-medium">{formatFileSize(files[0].size)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t('fileType')}</div>
                      <div className="font-medium">{files[0].type}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t('lastModified')}</div>
                      <div className="font-medium">
                        {new Date(files[0].lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 压缩配置面板 */}
            <div className="flex-1 space-y-6">
              <VideoCompressConfig />

              {/* 压缩按钮 */}
              <div className="space-y-2">
                <Button
                  onClick={handleCompress}
                  disabled={progress.isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {progress.isProcessing ? t('compressing') : t('startCompression')}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {t('clickToStartCompression')}
                </p>
              </div>

              {/* 压缩预估信息 */}
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2 text-sm">{t('compressionEstimate')}</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      •
                      {t('estimateInfo.processingTime')}
                    </p>
                    <p>
                      •
                      {t('estimateInfo.sizeReduction')}
                    </p>
                    <p>
                      •
                      {t('estimateInfo.qualityImpact')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* 压缩进度对话框 */}
      <VideoCompressionDialog />
    </ToolPageTemplate>
  )
}
