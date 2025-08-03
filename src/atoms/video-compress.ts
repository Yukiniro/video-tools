import { floor } from 'es-toolkit/compat'
import { atom } from 'jotai'
import { toast } from 'sonner'
import { compressVideo, saveAsVideo } from '@/store'
import { filesAtom } from './files'
import {
  cleanupProcessingAtom,
  completeProcessingAtom,
  handleErrorAtom,
  startProcessingAtom,
  switchToolAtom,
  updateProgressAtom,
} from './shared'

export interface VideoCompressConfig {
  quality: 'high' | 'medium' | 'low'
  resolution: 'original' | '1080P' | '720P' | '480P'
  enableAudio: boolean
}

const DEFAULT_VIDEO_COMPRESS_CONFIG: VideoCompressConfig = {
  quality: 'medium',
  resolution: 'original',
  enableAudio: true,
}

// 视频压缩配置状态
export const videoCompressConfigAtom = atom<VideoCompressConfig>(DEFAULT_VIDEO_COMPRESS_CONFIG)

// 重置视频压缩状态
export const resetVideoCompressStateAtom = atom(
  null,
  (get, set) => {
    set(videoCompressConfigAtom, DEFAULT_VIDEO_COMPRESS_CONFIG)
  },
)

// 原始视频信息状态
export const originalVideoInfoAtom = atom<{
  width?: number
  height?: number
  aspectRatio?: number
}>({})

// 压缩预览对比状态
export const videoCompressPreviewAtom = atom<{
  originalPreview?: string
  compressedPreview?: string
  showComparison: boolean
}>({
  showComparison: false,
})

// 压缩 action atom
export const compressVideoAtom = atom(
  null,
  async (get, set, params: { translations: any, translationsDialog: any }) => {
    const { translations, translationsDialog } = params
    const files = get(filesAtom)
    const compressConfig = get(videoCompressConfigAtom)

    if (files.length === 0) {
      return
    }

    const abortController = set(startProcessingAtom, {
      stage: translations('preparingCompression'),
      toolType: 'video-compress',
    })

    try {
      // 压缩过程
      const { blob, metadata: _metadata } = await compressVideo({
        file: files[0],
        config: compressConfig,
      }, {
        progress: (progressValue: number, stage?: string) => {
          set(updateProgressAtom, {
            progress: floor(progressValue * 100, 0),
            stage: stage || translations('compressingVideo'),
          })
        },
        signal: abortController.signal,
      })

      // 完成
      set(completeProcessingAtom, {
        stage: translationsDialog('completed'),
      })

      // 保持原始文件格式
      const originalExtension = files[0].name.split('.').pop() || 'mp4'
      saveAsVideo(blob, originalExtension)

      toast.success(translations('compressionSuccess'))
    }
    catch (error) {
      // 检查是否是取消操作
      if (error instanceof Error && error.message === 'Conversion cancelled') {
        toast.info(translations('compressionCancelled'))
      }
      else {
        // 显示错误提示
        set(handleErrorAtom, {
          error: translations('compressionError'),
        })
        toast.error(translations('compressionError'))
        console.error('压缩失败:', error)
      }
    }
    finally {
      // 清理状态
      set(cleanupProcessingAtom)
    }
  },
)
