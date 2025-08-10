'use client'

import { useAtom } from 'jotai'
import { videoTrimFilesAtom } from '@/atoms'
import FileUpload from '@/components/file-upload'
import { ToolPageTemplate } from '@/components/tool-page-template'
import { VideoPreview } from '@/components/video-preview'
import { VideoTrimProgressDialog } from '@/components/video-trim-progress-dialog'
import { VideoTrimSettingPanel } from './video-trim-setting-panel'
import { VideoTrimTimeline } from './video-trim-timeline'

export default function VideoTrimPage() {
  const [files, setFiles] = useAtom(videoTrimFilesAtom)

  const showUpload = files.length === 0
  const showPreview = files.length > 0

  return (
    <ToolPageTemplate toolKey="videoTrim">
      <div className="space-y-6">
        {showUpload && (
          <FileUpload onFilesChange={setFiles} />
        )}
        {showPreview && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:gap-12 lg:justify-center">
              <div className="flex-2">
                <VideoPreview file={files[0]} />
              </div>
              <div className="flex-1">
                <VideoTrimSettingPanel />
              </div>
            </div>

            {/* 时间轴裁剪组件 */}
            <div className="max-w-4xl mx-auto">
              <VideoTrimTimeline file={files[0]} />
            </div>
          </div>
        )}
      </div>

      {/* 进度对话框 */}
      <VideoTrimProgressDialog />
    </ToolPageTemplate>
  )
}
