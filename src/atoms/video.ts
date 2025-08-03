import { delay } from 'es-toolkit'
import { floor } from 'es-toolkit/compat'
import { atom } from 'jotai'
import { toast } from 'sonner'
import { gifToVideo, saveAsVideo } from '@/store'
import { filesAtom } from './files'
import {
  cleanupProcessingAtom,
  completeProcessingAtom,
  handleErrorAtom,
  startProcessingAtom,
  updateProgressAtom,
} from './shared'

export interface VideoConfig {
  fps: '30FPS' | '60FPS'
  resolution: '480P' | '720P' | '1080P'
}

const DEFAULT_VIDEO_CONFIG = {
  fps: '30FPS' as const,
  resolution: '480P' as const,
}

// 视频配置状态
export const videoConfigAtom = atom<VideoConfig>(DEFAULT_VIDEO_CONFIG)

// 重置视频状态
export const resetVideoStateAtom = atom(
  null,
  (get, set) => {
    set(videoConfigAtom, DEFAULT_VIDEO_CONFIG)
  },
)

// 转换 action atom
export const convertToVideoAtom = atom(
  null,
  async (get, set, params: { translations: any, translationsDialog: any }) => {
    const { translations, translationsDialog } = params
    const files = get(filesAtom)
    const videoConfig = get(videoConfigAtom)

    if (files.length === 0) {
      return
    }

    const abortController = set(startProcessingAtom, {
      stage: translations('preparingConversion'),
      toolType: 'video',
    })

    try {
      // 转换过程
      const blob = await gifToVideo({
        file: files[0],
        fps: videoConfig.fps,
        resolution: videoConfig.resolution,
      }, {
        progress: (progressValue: number) => {
          set(updateProgressAtom, {
            progress: floor(progressValue * 100, 0),
            stage: translations('generatingVideo'),
          })
        },
        signal: abortController.signal,
      })

      // 完成
      set(completeProcessingAtom, {
        stage: translationsDialog('completed'),
      })

      saveAsVideo(blob, `${files[0].name}.mp4`)

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
        set(handleErrorAtom, {
          error: translations('conversionError'),
        })
        toast.error(translations('conversionError'))
        console.error('转换失败:', error)
      }
    }
    finally {
      // 清理状态
      set(cleanupProcessingAtom)
    }
  },
)
