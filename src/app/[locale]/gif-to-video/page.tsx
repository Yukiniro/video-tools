'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { VideoConfig } from './video-config'
import { filesAtom } from '@/atoms/files'
import { convertToVideoAtom } from '@/atoms/video'
import FileUpload from '@/components/file-upload'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { Button } from '@/components/ui/button'
import { VideoProgressDialog } from '@/components/video-progress-dialog'

export default function GifToVideoPage() {
  const t = useTranslations('gifToVideo')
  const tDialog = useTranslations('common.dialog')
  const [files, setFiles] = useAtom(filesAtom)
  const convertToVideo = useSetAtom(convertToVideoAtom)

  const handleConvert = () => {
    convertToVideo({
      translations: t,
      translationsDialog: tDialog,
    })
  }

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles)
  }

  const showUpload = useAtomValue(filesAtom).length === 0
  const showConfig = useAtomValue(filesAtom).length > 0

  return (
    <ToolPageTemplate toolKey="gifToVideo">
      <div className="space-y-8">
        {/* 文件上传区域 */}
        {showUpload && (
          <FileUpload
            onFilesChange={handleFilesChange}
            accept="image/gif"
            description={t('dropYourGifHereOrClickToBrowse')}
          />
        )}

        {showConfig && (
          <div className="space-y-6 flex flex-col lg:flex-row lg:gap-12 lg:justify-center">
            <div className="flex-2">
              <Image className="w-full h-auto" src={URL.createObjectURL(files[0])} alt="GIF" width={100} height={100} />
            </div>
            <div className="flex-1 space-y-6">
              {/* 视频配置 */}
              <VideoConfig />

              {/* 转换按钮 */}
              <div className="flex justify-center">
                <Button onClick={handleConvert} size="lg" className="px-8">
                  {t('exportVideo')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 进度对话框 */}
        <VideoProgressDialog />
      </div>
    </ToolPageTemplate>
  )
}
