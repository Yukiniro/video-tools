import { atom } from 'jotai'
import { toast } from 'sonner'
import { saveAsAudio, videoToAudio } from '@/store'
import { filesAtom } from './files'

const DEFAULT_AUDIO_CONFIG = {
  format: 'mp3' as 'wav' | 'mp3' | 'ogg',
  quality: 'medium' as 'high' | 'medium' | 'low',
}

interface AudioConversionProgress {
  isConverting: boolean
  progress: number // 0-100
  stage: string // 转换阶段描述
}

const DEFAULT_CONVERSION_PROGRESS: AudioConversionProgress = {
  isConverting: false,
  progress: 0,
  stage: '',
}

// 音频配置状态
export const audioConfigAtom = atom(DEFAULT_AUDIO_CONFIG)

// 音频转换进度状态
export const audioConversionProgressAtom = atom(DEFAULT_CONVERSION_PROGRESS)

// 显示进度模态框状态
export const showAudioProgressDialogAtom = atom(false)

// 取消转换的 AbortController
export const audioConversionAbortControllerAtom = atom<AbortController | null>(null)

// 转换 action atom
export const convertToAudioAtom = atom(
  null,
  async (get, set, translations: any) => {
    const files = get(filesAtom)
    const audioConfig = get(audioConfigAtom)

    if (files.length === 0) {
      return
    }

    // 创建新的 AbortController
    const abortController = new AbortController()
    set(audioConversionAbortControllerAtom, abortController)

    try {
      // 显示进度对话框
      set(showAudioProgressDialogAtom, true)
      set(audioConversionProgressAtom, {
        isConverting: true,
        progress: 0,
        stage: translations('preparingConversion'),
      })

      // 转换过程
      const blob = await videoToAudio({
        file: files[0],
        format: audioConfig.format,
        quality: audioConfig.quality,
      }, {
        progress: (progressValue: number) => {
          set(audioConversionProgressAtom, prev => ({
            ...prev,
            progress: Math.floor(progressValue * 100),
            stage: translations('extractingAudio'),
          }))
        },
        signal: abortController.signal,
      })

      // 完成
      set(audioConversionProgressAtom, prev => ({
        ...prev,
        progress: 100,
        stage: translations('completed'),
      }))

      saveAsAudio(blob, audioConfig.format)

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
      set(audioConversionAbortControllerAtom, null)

      // 隐藏对话框
      set(showAudioProgressDialogAtom, false)

      // 重置进度状态
      set(audioConversionProgressAtom, {
        isConverting: false,
        progress: 0,
        stage: '',
      })
    }
  },
)

// 取消转换 action atom
export const cancelAudioConversionAtom = atom(
  null,
  (get) => {
    const abortController = get(audioConversionAbortControllerAtom)
    if (abortController) {
      abortController.abort()
    }
  },
)
