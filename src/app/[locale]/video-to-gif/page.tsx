'use client'

import { useAtom } from 'jotai'
import { filesAtom } from '@/atoms'
import FileUpload from '@/components/file-upload'
import { GifProgressDialog } from '@/components/gif-progress-dialog'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { VideoPreview } from '@/components/video-preview'
import VideoToGifSettingPanel from './video-to-gif-setting-panel'

export default function VideoToGifPage() {
  const [files, setFiles] = useAtom(filesAtom)

  const showUpload = files.length === 0
  const showPreview = files.length > 0

  return (
    <ToolPageTemplate toolKey="videoToGif">
      <div className="space-y-6">
        {showUpload && (
          <FileUpload onFilesChange={setFiles} />
        )}
        {showPreview && (
          <div className="space-y-6 flex flex-col lg:flex-row lg:gap-12 lg:justify-center">
            <div className="flex-2">
              <VideoPreview file={files[0]} />
            </div>
            <div className="flex-1">
              <VideoToGifSettingPanel />
            </div>
          </div>
        )}
      </div>

      {/* 进度对话框 */}
      <GifProgressDialog />
    </ToolPageTemplate>
  )
}
