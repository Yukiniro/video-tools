import { delay } from 'es-toolkit'
import { floor } from 'es-toolkit/compat'
import { atom } from 'jotai'
import { toast } from 'sonner'
import { gifToVideo, saveAsVideo } from '@/store'
import { filesAtom } from './files'

const DEFAULT_VIDEO_CONFIG = {
  resolution: '720P',
  fps: '30FPS',
}

interface ConversionProgress {
  isConverting: boolean
  progress: number // 0-100
  stage: string // 转换阶段描述
}

const DEFAULT_CONVERSION_PROGRESS: ConversionProgress = {
  isConverting: false,
  progress: 0,
  stage: '',
}

// 视频配置状态
export const videoConfigAtom = atom(DEFAULT_VIDEO_CONFIG)

// 视频转换进度状态
export const videoConversionProgressAtom = atom(DEFAULT_CONVERSION_PROGRESS)

// 显示进度模态框状态
export const showVideoProgressDialogAtom = atom(false)

// 取消转换的 AbortController
export const videoConversionAbortControllerAtom = atom<AbortController | null>(null)

// 转换 action atom
export const convertToVideoAtom = atom(
  null,
  async (get, set, translations: any) => {
    const files = get(filesAtom)
    const videoConfig = get(videoConfigAtom)

    if (files.length === 0) {
      return
    }

    // 创建新的 AbortController
    const abortController = new AbortController()
    set(videoConversionAbortControllerAtom, abortController)

    try {
      // 显示进度对话框
      set(showVideoProgressDialogAtom, true)
      set(videoConversionProgressAtom, {
        isConverting: true,
        progress: 0,
        stage: translations('preparingConversion'),
      })

      // 转换过程
      const blob = await gifToVideo({
        file: files[0],
        resolution: videoConfig.resolution as '480P' | '720P' | '1080P',
        fps: videoConfig.fps as '30FPS' | '60FPS',
      }, {
        progress: (progressValue: number) => {
          set(videoConversionProgressAtom, prev => ({
            ...prev,
            progress: floor(progressValue * 100, 0),
            stage: translations('generatingVideo'),
          }))
        },
        signal: abortController.signal,
      })

      // 完成
      set(videoConversionProgressAtom, prev => ({
        ...prev,
        progress: 100,
        stage: translations('completed'),
      }))

      saveAsVideo(blob, 'mp4') // gif转视频默认输出为mp4格式

      // 稍等片刻显示完成状态
      await delay(100)

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
      set(videoConversionAbortControllerAtom, null)

      // 隐藏对话框
      set(showVideoProgressDialogAtom, false)

      // 重置进度状态
      set(videoConversionProgressAtom, {
        isConverting: false,
        progress: 0,
        stage: '',
      })
    }
  },
)

// 取消转换 action atom
export const cancelVideoConversionAtom = atom(
  null,
  (get) => {
    const abortController = get(videoConversionAbortControllerAtom)
    if (abortController) {
      abortController.abort()
    }
  },
)
