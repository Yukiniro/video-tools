import type { VideoTrimParams } from '@/store'
import { floor } from 'es-toolkit/compat'
import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { ALL_FORMATS, BlobSource, Input } from 'mediabunny'
import { trimVideo } from '@/store'
import { activeToolAtom, commonProgressAtom, showProgressDialogAtom } from './shared'

// 视频裁剪工具专用的文件状态
export const videoTrimFilesAtom = atom<File[]>([])

// 视频裁剪配置状态
export const videoTrimConfigAtom = atomWithReset({
  startTime: 0,
  endTime: 0,
  resolution: '720P' as '480P' | '720P' | '1080P',
  keepAudio: true,
  frameRate: 30 as 30 | 60,
})

// 视频时长状态
export const videoDurationAtom = atom(0)

// 视频裁剪操作原子
export const trimVideoAtom = atom(
  null,
  async (
    get,
    set,
    options: {
      translations: any
      translationsDialog: any
    },
  ) => {
    const files = get(videoTrimFilesAtom)
    const config = get(videoTrimConfigAtom)
    const { translations: _t, translationsDialog: _tDialog } = options

    if (files.length === 0) {
      return
    }

    const file = files[0]

    // 验证时间范围
    if (config.startTime >= config.endTime) {
      console.error('Start time must be less than end time')
      return
    }

    const params: VideoTrimParams = {
      file,
      startTime: config.startTime,
      endTime: config.endTime,
      resolution: config.resolution,
      keepAudio: config.keepAudio,
      frameRate: config.frameRate,
    }

    // 设置活跃工具和显示进度对话框
    set(activeToolAtom, 'video-trim')
    set(showProgressDialogAtom, true)

    // 设置进度状态
    set(commonProgressAtom, {
      isProcessing: true,
      progress: 0,
      stage: 'trimming',
      status: 'converting' as const,
    })

    try {
      const abortController = new AbortController()

      const blob = await trimVideo(params, {
        progress: (progress) => {
          set(commonProgressAtom, prev => ({
            ...prev,
            progress: floor(progress * 100, 0),
          }))
        },
        signal: abortController.signal,
      })

      // 下载文件
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `trimmed-video-${Date.now()}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // 重置进度状态
      set(commonProgressAtom, {
        isProcessing: false,
        progress: 100,
        stage: 'completed',
        status: 'success' as const,
      })

      // 延迟关闭对话框
      setTimeout(() => {
        set(showProgressDialogAtom, false)
        set(activeToolAtom, null)
      }, 2000)
    }
    catch (error) {
      console.error('Video trimming failed:', error)

      // 重置进度状态
      set(commonProgressAtom, {
        isProcessing: false,
        progress: 0,
        stage: 'error',
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      // 延迟关闭对话框
      setTimeout(() => {
        set(showProgressDialogAtom, false)
        set(activeToolAtom, null)
      }, 3000)

      if (error instanceof Error && error.message !== 'Conversion cancelled') {
        console.error('视频裁剪失败，请重试', error)
      }
    }
  },
)

export const uploadVideoTrimFilesAtom = atom(null, async (get, set, update: File[]) => {
  set(videoTrimFilesAtom, update)
  const input = new Input({
    formats: ALL_FORMATS,
    source: new BlobSource(update[0]),
  })

  // 计算视频时长
  const duration = await input.computeDuration()

  // 初始化裁剪配置
  set(videoTrimConfigAtom, {
    ...get(videoTrimConfigAtom),
    startTime: 0,
    endTime: duration,
  })

  // 初始化视频时长
  set(videoDurationAtom, duration)
})
