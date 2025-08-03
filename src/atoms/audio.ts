import { delay } from 'es-toolkit'
import { floor } from 'es-toolkit/compat'
import { atom } from 'jotai'
import { toast } from 'sonner'
import { saveAsAudio, videoToAudio } from '@/store'
import { filesAtom } from './files'
import {
  cleanupProcessingAtom,
  completeProcessingAtom,
  handleErrorAtom,
  startProcessingAtom,
  switchToolAtom,
  updateProgressAtom,
} from './shared'

interface AudioConfig {
  format: 'mp3' | 'wav' | 'ogg'
  quality: 'high' | 'medium' | 'low'
}

const DEFAULT_AUDIO_CONFIG = {
  format: 'wav' as const,
  quality: 'medium' as const,
}

// 音频配置状态
export const audioConfigAtom = atom<AudioConfig>(DEFAULT_AUDIO_CONFIG)

// 重置音频状态
export const resetAudioStateAtom = atom(
  null,
  (get, set) => {
    set(audioConfigAtom, DEFAULT_AUDIO_CONFIG)
  },
)

// 转换 action atom
export const convertToAudioAtom = atom(
  null,
  async (get, set, params: { translations: any, translationsDialog: any }) => {
    const { translations, translationsDialog } = params
    const files = get(filesAtom)
    const audioConfig = get(audioConfigAtom)

    if (files.length === 0) {
      return
    }

    // 切换到音频工具并开始处理
    set(switchToolAtom, 'audio')
    const abortController = set(startProcessingAtom, {
      stage: translations('preparingConversion'),
      toolType: 'audio',
    })

    try {
      // 转换过程
      const blob = await videoToAudio({
        file: files[0],
        format: audioConfig.format,
        quality: audioConfig.quality,
      }, {
        progress: (progressValue: number) => {
          set(updateProgressAtom, {
            progress: floor(progressValue * 100, 0),
            stage: translations('extractingAudio'),
          })
        },
        signal: abortController.signal,
      })

      // 完成
      set(completeProcessingAtom, {
        stage: translationsDialog('completed'),
      })

      saveAsAudio(blob, audioConfig.format)

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
