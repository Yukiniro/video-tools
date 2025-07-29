import { delay } from 'es-toolkit'
import { floor } from 'es-toolkit/compat'
import { atom } from 'jotai'
import { toast } from 'sonner'
import { compressVideo, saveAsVideo } from '@/store'
import { filesAtom } from './files'

// 压缩配置接口
interface VideoCompressConfig {
  quality: 'high' | 'medium' | 'low' | 'custom'
  customQuality?: number // 1-100
  resolution: 'original' | '1080P' | '720P' | '480P' | 'custom'
  customWidth?: number
  customHeight?: number
  enableAudio: boolean
}

// 压缩进度接口
interface CompressionProgress {
  isCompressing: boolean
  progress: number // 0-100
  stage: string // 压缩阶段描述
  originalSize?: number // 原始文件大小(bytes)
  compressedSize?: number // 压缩后大小(bytes)
  compressionRatio?: number // 压缩比例(%)
  status: 'idle' | 'compressing' | 'success' | 'error' | 'cancelled' // 压缩状态
  error?: string // 错误信息
}

// 默认配置
const DEFAULT_COMPRESS_CONFIG: VideoCompressConfig = {
  quality: 'medium',
  resolution: '720P',
  enableAudio: true,
}

// 默认进度状态
const DEFAULT_COMPRESSION_PROGRESS: CompressionProgress = {
  isCompressing: false,
  progress: 0,
  stage: '',
  status: 'idle',
}

// 视频压缩配置状态
export const videoCompressConfigAtom = atom(DEFAULT_COMPRESS_CONFIG)

// 视频压缩进度状态
export const videoCompressionProgressAtom = atom(DEFAULT_COMPRESSION_PROGRESS)

// 显示进度模态框状态
export const showVideoCompressionDialogAtom = atom(false)

// 取消压缩的 AbortController
export const videoCompressionAbortControllerAtom = atom<AbortController | null>(null)

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
  async (get, set, translations: any) => {
    const files = get(filesAtom)
    const compressConfig = get(videoCompressConfigAtom)

    if (files.length === 0) {
      return
    }

    // 创建新的 AbortController
    const abortController = new AbortController()
    set(videoCompressionAbortControllerAtom, abortController)

    try {
      // 显示进度对话框
      set(showVideoCompressionDialogAtom, true)
      set(videoCompressionProgressAtom, {
        isCompressing: true,
        progress: 0,
        stage: translations('preparingCompression'),
        originalSize: files[0].size,
        status: 'compressing',
      })

      // 压缩过程
      const { blob, metadata: _metadata } = await compressVideo({
        file: files[0],
        config: compressConfig,
      }, {
        progress: (progressValue: number, stage?: string) => {
          set(videoCompressionProgressAtom, prev => ({
            ...prev,
            progress: floor(progressValue * 100, 0),
            stage: stage || translations('compressingVideo'),
          }))
        },
        signal: abortController.signal,
      })

      // 计算压缩比例
      const compressionRatio = ((files[0].size - blob.size) / files[0].size) * 100

      // 完成
      set(videoCompressionProgressAtom, prev => ({
        ...prev,
        isCompressing: false,
        progress: 100,
        stage: translations('completed'),
        compressedSize: blob.size,
        compressionRatio: Math.max(0, compressionRatio),
        status: 'success',
      }))

      // 保持原始文件格式
      const originalExtension = files[0].name.split('.').pop() || 'mp4'
      saveAsVideo(blob, originalExtension)

      toast.success(translations('compressionSuccess'))
    }
    catch (error) {
      // 检查是否是取消操作
      if (error instanceof Error && error.message === 'Conversion cancelled') {
        set(videoCompressionProgressAtom, prev => ({
          ...prev,
          isCompressing: false,
          status: 'cancelled',
          stage: translations('compressionCancelled'),
        }))
        toast.info(translations('compressionCancelled'))
      }
      else {
        // 设置错误状态
        const errorMessage = error instanceof Error ? error.message : translations('compressionError')
        set(videoCompressionProgressAtom, prev => ({
          ...prev,
          isCompressing: false,
          status: 'error',
          stage: translations('compressionError'),
          error: errorMessage,
        }))
        toast.error(translations('compressionError'))
        console.error('压缩失败:', error)
      }
    }
    finally {
      // 清理 AbortController
      set(videoCompressionAbortControllerAtom, null)
    }
  },
)

// 取消压缩 action atom
export const cancelVideoCompressionAtom = atom(
  null,
  (get, set) => {
    const abortController = get(videoCompressionAbortControllerAtom)
    if (abortController) {
      abortController.abort()
    }
    set(showVideoCompressionDialogAtom, false)
    set(videoCompressionProgressAtom, DEFAULT_COMPRESSION_PROGRESS)
  },
)

// 重新尝试压缩 action atom
export const retryVideoCompressionAtom = atom(
  null,
  async (get, set, translations: any) => {
    // 重置为初始状态，但保持对话框打开
    set(videoCompressionProgressAtom, {
      ...DEFAULT_COMPRESSION_PROGRESS,
      originalSize: get(videoCompressionProgressAtom).originalSize,
    })

    // 直接调用压缩逻辑，避免循环引用
    const files = get(filesAtom)
    const compressConfig = get(videoCompressConfigAtom)

    if (files.length === 0) {
      return
    }

    // 创建新的 AbortController
    const abortController = new AbortController()
    set(videoCompressionAbortControllerAtom, abortController)

    try {
      set(videoCompressionProgressAtom, {
        isCompressing: true,
        progress: 0,
        stage: translations('preparingCompression'),
        originalSize: files[0].size,
        status: 'compressing',
      })

      // 压缩过程
      const { blob, metadata: _metadata } = await compressVideo({
        file: files[0],
        config: compressConfig,
      }, {
        progress: (progressValue: number, stage?: string) => {
          set(videoCompressionProgressAtom, prev => ({
            ...prev,
            progress: floor(progressValue * 100, 0),
            stage: stage || translations('compressingVideo'),
          }))
        },
        signal: abortController.signal,
      })

      // 计算压缩比例
      const compressionRatio = ((files[0].size - blob.size) / files[0].size) * 100

      // 完成
      set(videoCompressionProgressAtom, prev => ({
        ...prev,
        isCompressing: false,
        progress: 100,
        stage: translations('completed'),
        compressedSize: blob.size,
        compressionRatio: Math.max(0, compressionRatio),
        status: 'success',
      }))

      // 保持原始文件格式
      const originalExtension = files[0].name.split('.').pop() || 'mp4'
      saveAsVideo(blob, originalExtension)

      toast.success(translations('compressionSuccess'))
    }
    catch (error) {
      // 检查是否是取消操作
      if (error instanceof Error && error.message === 'Compression cancelled') {
        set(videoCompressionProgressAtom, prev => ({
          ...prev,
          isCompressing: false,
          status: 'cancelled',
          stage: translations('compressionCancelled'),
        }))
        toast.info(translations('compressionCancelled'))
      }
      else {
        // 设置错误状态
        const errorMessage = error instanceof Error ? error.message : translations('compressionError')
        set(videoCompressionProgressAtom, prev => ({
          ...prev,
          isCompressing: false,
          status: 'error',
          stage: translations('compressionError'),
          error: errorMessage,
        }))
        toast.error(translations('compressionError'))
        console.error('压缩失败:', error)
      }
    }
    finally {
      // 清理 AbortController
      set(videoCompressionAbortControllerAtom, null)
    }
  },
)

// 关闭压缩对话框 action atom
export const closeVideoCompressionDialogAtom = atom(
  null,
  (get, set) => {
    set(showVideoCompressionDialogAtom, false)
    set(videoCompressionProgressAtom, DEFAULT_COMPRESSION_PROGRESS)
  },
)

// 重置压缩状态 action atom
export const resetVideoCompressionAtom = atom(
  null,
  (get, set) => {
    set(videoCompressConfigAtom, DEFAULT_COMPRESS_CONFIG)
    set(videoCompressionProgressAtom, DEFAULT_COMPRESSION_PROGRESS)
    set(showVideoCompressionDialogAtom, false)
    set(videoCompressPreviewAtom, { showComparison: false })
  },
)
