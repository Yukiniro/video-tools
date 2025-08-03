'use client'

import { useAtom } from 'jotai'
import { filesAtom } from '@/atoms'
import { AudioProgressDialog } from '@/components/audio-progress-dialog'
import FileUpload from '@/components/file-upload'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { VideoPreview } from '@/components/video-preview'
import { VideoToAudioSettingPanel } from './video-to-audio-setting-panel'

export default function VideoToAudioPage() {
  const [files, setFiles] = useAtom(filesAtom)

  const showUpload = files.length === 0
  const showPreview = files.length > 0

  return (
    <ToolPageTemplate toolKey="extractAudio">
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
              <VideoToAudioSettingPanel />
            </div>
          </div>
        )}
      </div>

      {/* 进度对话框 */}
      <AudioProgressDialog />
    </ToolPageTemplate>
  )
}
