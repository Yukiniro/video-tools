import { atom } from 'jotai'
import { toast } from 'sonner'
import { saveAsVideo, videoTranscode } from '@/store'
import { filesAtom } from './files'

const DEFAULT_VIDEO_TRANSCODE_CONFIG = {
  resolution: '720P' as '480P' | '720P' | '1080P',
  format: 'mp4' as 'mp4' | 'webm' | 'mkv',
}

interface VideoTranscodeConversionProgress {
  isConverting: boolean
  progress: number // 0-100
  stage: string // 转换阶段描述
}

const DEFAULT_CONVERSION_PROGRESS: VideoTranscodeConversionProgress = {
  isConverting: false,
  progress: 0,
  stage: '',
}

// 视频转码配置状态
export const videoTranscodeConfigAtom = atom(DEFAULT_VIDEO_TRANSCODE_CONFIG)

// 视频转码转换进度状态
export const videoTranscodeConversionProgressAtom = atom(DEFAULT_CONVERSION_PROGRESS)

// 显示进度模态框状态
export const showVideoTranscodeProgressDialogAtom = atom(false)

// 取消转换的 AbortController
export const videoTranscodeConversionAbortControllerAtom = atom<AbortController | null>(null)

// 转换 action atom
export const convertToVideoTranscodeAtom = atom(
  null,
  async (get, set, translations: any) => {
    const files = get(filesAtom)
    const videoTranscodeConfig = get(videoTranscodeConfigAtom)

    if (files.length === 0) {
      return
    }

    // 创建新的 AbortController
    const abortController = new AbortController()
    set(videoTranscodeConversionAbortControllerAtom, abortController)

    try {
      // 显示进度对话框
      set(showVideoTranscodeProgressDialogAtom, true)
      set(videoTranscodeConversionProgressAtom, {
        isConverting: true,
        progress: 0,
        stage: translations('preparingConversion'),
      })

      // 转换过程
      const blob = await videoTranscode({
        file: files[0],
        resolution: videoTranscodeConfig.resolution,
        format: videoTranscodeConfig.format,
      }, {
        progress: (progressValue: number) => {
          set(videoTranscodeConversionProgressAtom, prev => ({
            ...prev,
            progress: Math.floor(progressValue * 100),
            stage: translations('transcoding'),
          }))
        },
        signal: abortController.signal,
      })

      // 完成
      set(videoTranscodeConversionProgressAtom, prev => ({
        ...prev,
        progress: 100,
        stage: translations('completed'),
      }))

      saveAsVideo(blob, videoTranscodeConfig.format)

      toast.success(translations('conversionSuccess'))
    }
    catch (error) {
      // 检查是否是取消操作
      if (error instanceof Error && error.message === 'Conversion cancelled') {
        toast.info(translations('conversionCancelled'))
      }
      else {
        // 显示错误提示
        toast.error(translations('conversionError'))
        console.error('转换失败:', error)
      }
    }
    finally {
      // 清理 AbortController
      set(videoTranscodeConversionAbortControllerAtom, null)

      // 隐藏对话框
      set(showVideoTranscodeProgressDialogAtom, false)

      // 重置进度状态
      set(videoTranscodeConversionProgressAtom, {
        isConverting: false,
        progress: 0,
        stage: '',
      })
    }
  },
)

// 取消转换 action atom
export const cancelVideoTranscodeConversionAtom = atom(
  null,
  (get) => {
    const abortController = get(videoTranscodeConversionAbortControllerAtom)
    if (abortController) {
      abortController.abort()
    }
  },
)
