import { delay } from 'es-toolkit'
import { floor } from 'es-toolkit/compat'
import { atom } from 'jotai'
import { toast } from 'sonner'
import { saveAsVideo, speedVideo } from '@/store'
import {
  cleanupProcessingAtom,
  completeProcessingAtom,
  handleErrorAtom,
  startProcessingAtom,
  updateProgressAtom,
} from './shared'

// 视频变速工具专用的文件状态
export const videoSpeedFilesAtom = atom<File[]>([])

/**
 * 视频变速配置接口
 */
export interface VideoSpeedConfig {
  /** 播放速度倍率 */
  speed: number
  /** 输出分辨率 */
  resolution: '480P' | '720P' | '1080P'
  /** 是否保留音频 */
  keepAudio: boolean
}

const DEFAULT_VIDEO_SPEED_CONFIG: VideoSpeedConfig = {
  speed: 1.0,
  resolution: '720P',
  keepAudio: true,
}

// 视频变速配置状态
export const videoSpeedConfigAtom = atom<VideoSpeedConfig>(DEFAULT_VIDEO_SPEED_CONFIG)

// 重置视频变速状态
export const resetVideoSpeedStateAtom = atom(
  null,
  (get, set) => {
    set(videoSpeedConfigAtom, DEFAULT_VIDEO_SPEED_CONFIG)
  },
)

// 变速处理 action atom
export const processVideoSpeedAtom = atom(
  null,
  async (get, set, params: { translations: any, translationsDialog: any }) => {
    const { translations, translationsDialog } = params
    const files = get(videoSpeedFilesAtom)
    const _speedConfig = get(videoSpeedConfigAtom)

    if (files.length === 0) {
      return
    }

    const _abortController = set(startProcessingAtom, {
      stage: translations('processingSpeed'),
      toolType: 'video-speed',
    })

    try {
      // 实现视频变速处理逻辑
      const result = await speedVideo({
        file: files[0],
        speed: _speedConfig.speed,
        resolution: _speedConfig.resolution,
        keepAudio: _speedConfig.keepAudio,
        frameRate: 30,
      }, {
        progress: (progress: number) => {
          set(updateProgressAtom, {
            progress: floor(progress * 100),
            stage: translations('processingSpeed'),
          })
        },
        signal: _abortController.signal,
      })

      // 完成
      set(completeProcessingAtom, {
        stage: translationsDialog('completed'),
      })

      // 保存处理后的视频
      const originalExtension = files[0].name.split('.').pop() || 'mp4'
      saveAsVideo(result, originalExtension)

      // 稍等片刻显示完成状态
      await delay(100)

      toast.success(translations('speedChangeSuccess'))
    }
    catch (error) {
      // 检查是否是取消操作
      if (error instanceof Error && error.message === 'Conversion cancelled') {
        toast.info(translations('speedChangeCancelled'))
      }
      else {
        // 显示错误提示
        set(handleErrorAtom, {
          error: translations('speedChangeError'),
        })
        toast.error(translations('speedChangeError'))
        console.error('变速失败:', error)
      }
    }
    finally {
      // 清理状态
      set(cleanupProcessingAtom)
    }
  },
)
