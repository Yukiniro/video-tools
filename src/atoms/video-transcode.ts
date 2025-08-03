import { delay } from 'es-toolkit'
import { floor } from 'es-toolkit/compat'
import { atom } from 'jotai'
import { toast } from 'sonner'
import { saveAsVideo, transcodeVideo } from '@/store'
import { filesAtom } from './files'
import {
  cleanupProcessingAtom,
  completeProcessingAtom,
  handleErrorAtom,
  startProcessingAtom,
  updateProgressAtom,
} from './shared'

export interface VideoTranscodeConfig {
  format: 'mp4' | 'webm' | 'mkv'
  resolution: '480P' | '720P' | '1080P'
}

const DEFAULT_VIDEO_TRANSCODE_CONFIG = {
  format: 'mp4' as const,
  resolution: '480P' as const,
}

// 视频转码配置状态
export const videoTranscodeConfigAtom = atom<VideoTranscodeConfig>(DEFAULT_VIDEO_TRANSCODE_CONFIG)

// 重置视频转码状态
export const resetVideoTranscodeStateAtom = atom(
  null,
  (get, set) => {
    set(videoTranscodeConfigAtom, DEFAULT_VIDEO_TRANSCODE_CONFIG)
  },
)

// 转换 action atom
export const convertToVideoTranscodeAtom = atom(
  null,
  async (get, set, params: { translations: any, translationsDialog: any }) => {
    const { translations, translationsDialog } = params
    const files = get(filesAtom)
    const videoTranscodeConfig = get(videoTranscodeConfigAtom)

    if (files.length === 0) {
      return
    }

    const abortController = set(startProcessingAtom, {
      stage: translations('preparingConversion'),
      toolType: 'video-transcode',
    })

    try {
      // 转换过程
      const blob = await transcodeVideo({
        file: files[0],
        format: videoTranscodeConfig.format,
        resolution: videoTranscodeConfig.resolution,
      }, {
        progress: (progressValue: number) => {
          set(updateProgressAtom, {
            progress: floor(progressValue * 100, 0),
            stage: translations('transcoding'),
          })
        },
        signal: abortController.signal,
      })

      // 完成
      set(completeProcessingAtom, {
        stage: translationsDialog('completed'),
      })

      saveAsVideo(blob, videoTranscodeConfig.format)

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
