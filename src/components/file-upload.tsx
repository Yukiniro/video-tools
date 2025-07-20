'use client'

import { AlertCircleIcon, ImageUpIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'

interface FileUploadProps {
  onFilesChange: (files: File[]) => void
}

export default function FileUpload({ onFilesChange }: FileUploadProps) {
  const t = useTranslations('common')
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files)
      return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith('video/')) {
        setErrors(['请选择视频文件'])
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      setErrors([])
      onFilesChange(validFiles)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // 重置 input 值，允许重复选择同一文件
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop area */}
        <div
          role="button"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-96 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileInputChange}
            className="sr-only"
            aria-label="Upload file"
          />
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageUpIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">
              {t('dropYourVideoHereOrClickToBrowse')}
            </p>
          </div>
        </div>
      </div>
      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}
