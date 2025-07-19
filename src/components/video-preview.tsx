'use client'

interface VideoPreviewProps {
  files: File[]
  title?: string
}

export function VideoPreview({ files, title = '视频预览' }: VideoPreviewProps) {
  if (files.length === 0)
    return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="grid gap-4">
        {files.map(file => (
          <div key={`${file.name}-${file.lastModified}`} className="space-y-2">
            <p className="text-sm text-muted-foreground">{file.name}</p>
            <video
              controls
              className="w-full max-w-md rounded-lg border"
              preload="metadata"
            >
              <source src={URL.createObjectURL(file)} type={file.type} />
              您的浏览器不支持视频播放。
            </video>
          </div>
        ))}
      </div>
    </div>
  )
}
