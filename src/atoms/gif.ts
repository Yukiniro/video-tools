import { delay } from 'es-toolkit'
import { floor } from 'es-toolkit/compat'
import { atom } from 'jotai'
import { toast } from 'sonner'
import { getVideoDuration, saveAsGif, videoToGif } from '@/store'
import { filesAtom } from './files'

const DEFAULT_GIF_CONFIG = {
  resolution: '240P',
  fps: '15FPS',
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

export const convertStartTimeAtom = atom<number>(0) // 转换开始时间

export const convertEndTimeAtom = atom<number>(5) // 转换结束时间

// GIF 配置状态
export const gifConfigAtom = atom(DEFAULT_GIF_CONFIG)

// GIF 转换进度状态
export const gifConversionProgressAtom = atom(DEFAULT_CONVERSION_PROGRESS)

// 显示进度模态框状态
export const showProgressDialogAtom = atom(false)

// 取消转换的 AbortController
export const conversionAbortControllerAtom = atom<AbortController | null>(null)

// 转换 action atom
export const convertToGifAtom = atom(
  null,
  async (get, set, translations: any) => {
    const files = get(filesAtom)
    const gifConfig = get(gifConfigAtom)

    if (files.length === 0) {
      return
    }

    // 创建新的 AbortController
    const abortController = new AbortController()
    set(conversionAbortControllerAtom, abortController)

    try {
      // 显示进度对话框
      set(showProgressDialogAtom, true)
      set(gifConversionProgressAtom, {
        isConverting: true,
        progress: 0,
        stage: translations('preparingConversion'),
      })

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
          set(gifConversionProgressAtom, prev => ({
            ...prev,
            progress: floor(progressValue * 100, 0), // 将进度映射到 20-80% 区间
            stage: translations('generatingGif'),
          }))
        },
        signal: abortController.signal,
      })

      // 完成
      set(gifConversionProgressAtom, prev => ({
        ...prev,
        progress: 100,
        stage: translations('completed'),
      }))

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
        toast.error(translations('conversionError'))
        console.error('转换失败:', error)
      }
    }
    finally {
      // 清理 AbortController
      set(conversionAbortControllerAtom, null)

      // 隐藏对话框并显示成功提示
      set(showProgressDialogAtom, false)

      // 重置进度状态
      set(gifConversionProgressAtom, {
        isConverting: false,
        progress: 0,
        stage: '',
      })
    }
  },
)

// 取消转换 action atom
export const cancelConversionAtom = atom(
  null,
  (get) => {
    const abortController = get(conversionAbortControllerAtom)
    if (abortController) {
      abortController.abort()
    }
  },
)
