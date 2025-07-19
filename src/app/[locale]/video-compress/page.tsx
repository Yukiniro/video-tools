'use client'

import { useAtom } from 'jotai'
import { filesAtom } from '@/atoms'
import FileUpload from '@/components/file-upload'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { VideoPreview } from '@/components/video-preview'

export default function VideoCompressPage() {
  const [files, setFiles] = useAtom(filesAtom)

  return (
    <ToolPageTemplate
      toolKey="videoCompress"
    >
      <div className="space-y-6">
        {files.length > 0
          ? (
              <VideoPreview files={files} />
            )
          : (
              <FileUpload onFilesChange={setFiles} />
            )}
      </div>
    </ToolPageTemplate>
  )
}
