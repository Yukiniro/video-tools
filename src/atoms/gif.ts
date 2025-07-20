import { delay } from 'es-toolkit'
import { atom } from 'jotai'
import { toast } from 'sonner'
import { saveAsGif, videoToGif } from '@/store'
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

// GIF 配置状态
export const gifConfigAtom = atom(DEFAULT_GIF_CONFIG)

// GIF 转换进度状态
export const gifConversionProgressAtom = atom(DEFAULT_CONVERSION_PROGRESS)

// 显示进度模态框状态
export const showProgressDialogAtom = atom(false)

// 转换 action atom
export const convertToGifAtom = atom(
  null,
  async (get, set, translations: any) => {
    const files = get(filesAtom)
    const gifConfig = get(gifConfigAtom)

    if (files.length === 0) {
      return
    }

    try {
      // 显示进度对话框
      set(showProgressDialogAtom, true)
      set(gifConversionProgressAtom, {
        isConverting: true,
        progress: 0,
        stage: translations('preparingConversion'),
      })

      // 更新进度：开始处理
      set(gifConversionProgressAtom, prev => ({
        ...prev,
        progress: 20,
        stage: translations('processingVideo'),
      }))

      // 模拟转换过程
      const blob = await videoToGif({
        file: files[0],
        resolution: gifConfig.resolution as '120P' | '240P' | '480P',
        fps: gifConfig.fps as '10FPS' | '15FPS' | '25FPS',
      }, {
        start: 0,
        end: 2,
        progress: (progressValue: number) => {
          set(gifConversionProgressAtom, prev => ({
            ...prev,
            progress: Math.min(20 + progressValue * 0.6, 80), // 将进度映射到 20-80% 区间
          }))
        },
      })

      // 更新进度：生成 GIF
      set(gifConversionProgressAtom, prev => ({
        ...prev,
        progress: 80,
        stage: translations('generatingGif'),
      }))

      // 完成
      set(gifConversionProgressAtom, prev => ({
        ...prev,
        progress: 100,
        stage: translations('completed'),
      }))

      saveAsGif(blob)

      // 稍等片刻显示完成状态
      await delay(100)

      // 隐藏对话框并显示成功提示
      set(showProgressDialogAtom, false)
      toast.success(translations('conversionSuccess'))
    }
    catch (error) {
      // 隐藏对话框并显示错误提示
      set(showProgressDialogAtom, false)
      toast.error(translations('conversionError'))
      console.error('转换失败:', error)
    }
    finally {
      // 重置进度状态
      set(gifConversionProgressAtom, {
        isConverting: false,
        progress: 0,
        stage: '',
      })
    }
  },
)
