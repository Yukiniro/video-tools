import { delay } from 'es-toolkit'
import { floor } from 'es-toolkit/compat'
import { atom } from 'jotai'
import { toast } from 'sonner'
import { getVideoDuration, saveAsGif, videoToGif } from '@/store'
import {
  cleanupProcessingAtom,
  completeProcessingAtom,
  handleErrorAtom,
  startProcessingAtom,
  updateProgressAtom,
} from './shared'

// GIF 工具专用的文件状态
export const gifFilesAtom = atom<File[]>([])

const DEFAULT_GIF_CONFIG = {
  resolution: '240P',
  fps: '15FPS',
}

export const convertStartTimeAtom = atom<number>(0) // 转换开始时间

export const convertEndTimeAtom = atom<number>(5) // 转换结束时间

// GIF 配置状态
export const gifConfigAtom = atom(DEFAULT_GIF_CONFIG)

// 重置 GIF 状态
export const resetGifStateAtom = atom(
  null,
  (get, set) => {
    set(gifConfigAtom, DEFAULT_GIF_CONFIG)
    set(convertStartTimeAtom, 0)
    set(convertEndTimeAtom, 5)
  },
)

// 转换 action atom
export const convertToGifAtom = atom(
  null,
  async (get, set, params: { translations: any, translationsDialog: any }) => {
    const { translations, translationsDialog } = params
    const files = get(gifFilesAtom)
    const gifConfig = get(gifConfigAtom)

    if (files.length === 0) {
      return
    }

    const abortController = set(startProcessingAtom, {
      stage: translations('preparingConversion'),
      toolType: 'gif',
    })

    try {
      // 获取时间设置
      const startTime = get(convertStartTimeAtom)
      const endTime = get(convertEndTimeAtom)

      if (startTime >= endTime) {
        toast.error(translations('startTimeGreaterThanEndTime'))
        return
      }

      const duration = await getVideoDuration(files[0])
      if (endTime > duration) {
        toast.error(translations('endTimeGreaterThanDuration'))
        return
      }

      // 转换过程
      const blob = await videoToGif({
        file: files[0],
        resolution: gifConfig.resolution as '120P' | '240P' | '480P',
        fps: gifConfig.fps as '10FPS' | '15FPS' | '25FPS',
      }, {
        start: startTime,
        end: endTime === Infinity ? 2 : endTime, // 如果没有设置结束时间，默认使用2秒
        progress: (progressValue: number) => {
          set(updateProgressAtom, {
            progress: floor(progressValue * 100, 0), // 将进度映射到 20-80% 区间
            stage: translations('generatingGif'),
          })
        },
        signal: abortController.signal,
      })

      // 完成
      set(completeProcessingAtom, {
        stage: translationsDialog('completed'),
      })

      saveAsGif(blob)

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
