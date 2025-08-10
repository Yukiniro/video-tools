import { atom } from 'jotai'
import { audioFilesAtom, resetAudioStateAtom } from './audio'
import { gifFilesAtom, resetGifStateAtom } from './gif'
import { gifToVideoFilesAtom, resetVideoStateAtom } from './video'
import { resetVideoCompressStateAtom, videoCompressFilesAtom } from './video-compress'
import { resetVideoTranscodeStateAtom, videoTranscodeFilesAtom } from './video-transcode'
import { videoTrimFilesAtom } from './video-trim'

// 通用进度状态接口
export interface CommonProgress {
  isProcessing: boolean
  progress: number // 0-100
  stage: string // 处理阶段描述
  status: 'idle' | 'compressing' | 'converting' | 'success' | 'error' | 'cancelled'
  error?: string
  // 视频压缩相关的额外字段
  originalSize?: number
  compressedSize?: number
  compressionRatio?: number
}

// 默认进度状态
export const DEFAULT_PROGRESS: CommonProgress = {
  isProcessing: false,
  progress: 0,
  stage: '',
  status: 'idle',
}

// 当前活跃的工具类型
export type ToolType = 'gif' | 'video' | 'audio' | 'video-transcode' | 'video-compress' | 'video-trim' | null

// 当前活跃工具状态
export const activeToolAtom = atom<ToolType>(null)

// 通用进度状态
export const commonProgressAtom = atom<CommonProgress>(DEFAULT_PROGRESS)

// 通用对话框显示状态
export const showProgressDialogAtom = atom(false)

// 通用取消控制器
export const abortControllerAtom = atom<AbortController | null>(null)

// 重置所有状态的 action
export const resetAllStatesAtom = atom(
  null,
  (get, set) => {
    // 取消当前操作
    const abortController = get(abortControllerAtom)
    if (abortController) {
      abortController.abort()
    }

    // 重置公共状态
    set(commonProgressAtom, DEFAULT_PROGRESS)
    set(showProgressDialogAtom, false)
    set(abortControllerAtom, null)
    set(activeToolAtom, null)

    // 重置文件状态
    const activeTool = get(activeToolAtom)
    switch (activeTool) {
      case 'audio':
        set(audioFilesAtom, [])
        break
      case 'gif':
        set(gifFilesAtom, [])
        break
      case 'video':
        set(gifToVideoFilesAtom, [])
        break
      case 'video-compress':
        set(videoCompressFilesAtom, [])
        break
      case 'video-transcode':
        set(videoTranscodeFilesAtom, [])
        break
      case 'video-trim':
        set(videoTrimFilesAtom, [])
        break
      default:
        // 如果未设置 activeTool，则无需重置具体文件原子
        break
    }

    // 重置所有工具特定状态
    set(resetAudioStateAtom)
    set(resetGifStateAtom)
    set(resetVideoStateAtom)
    set(resetVideoCompressStateAtom)
    set(resetVideoTranscodeStateAtom)
  },
)

// 开始处理的通用 action
export const startProcessingAtom = atom(
  null,
  (get, set, params: { stage: string, toolType: ToolType }) => {
    const { stage, toolType } = params

    // 设置活跃工具
    set(activeToolAtom, toolType)

    // 创建新的 AbortController
    const abortController = new AbortController()
    set(abortControllerAtom, abortController)

    // 根据工具类型设置不同的状态
    const status = toolType === 'video-compress' ? 'compressing' : 'converting'

    // 设置进度状态
    set(commonProgressAtom, {
      isProcessing: true,
      progress: 0,
      stage,
      status,
    })

    // 显示对话框
    set(showProgressDialogAtom, true)

    return abortController
  },
)

// 更新进度的通用 action
export const updateProgressAtom = atom(
  null,
  (get, set, params: {
    progress: number
    stage?: string
    originalSize?: number
    compressedSize?: number
    compressionRatio?: number
  }) => {
    const { progress, stage, originalSize, compressedSize, compressionRatio } = params
    const currentProgress = get(commonProgressAtom)

    set(commonProgressAtom, {
      ...currentProgress,
      progress,
      ...(stage && { stage }),
      ...(originalSize !== undefined && { originalSize }),
      ...(compressedSize !== undefined && { compressedSize }),
      ...(compressionRatio !== undefined && { compressionRatio }),
    })
  },
)

// 完成处理的通用 action
export const completeProcessingAtom = atom(
  null,
  (get, set, params: { stage: string }) => {
    const { stage } = params

    set(commonProgressAtom, prev => ({
      ...prev,
      progress: 100,
      stage,
      status: 'success',
    }))
  },
)

// 处理错误的通用 action
export const handleErrorAtom = atom(
  null,
  (get, set, params: { error: string, stage?: string }) => {
    const { error, stage } = params

    set(commonProgressAtom, prev => ({
      ...prev,
      status: 'error',
      error,
      ...(stage && { stage }),
    }))
  },
)

// 取消处理的通用 action
export const cancelProcessingAtom = atom(
  null,
  (get, set) => {
    const abortController = get(abortControllerAtom)
    if (abortController) {
      abortController.abort()
    }

    set(commonProgressAtom, prev => ({
      ...prev,
      status: 'cancelled',
      isProcessing: false,
    }))
  },
)

// 清理状态的通用 action
export const cleanupProcessingAtom = atom(
  null,
  (get, set) => {
    // 清理 AbortController
    set(abortControllerAtom, null)

    // 隐藏对话框
    set(showProgressDialogAtom, false)

    // 重置进度状态
    set(commonProgressAtom, DEFAULT_PROGRESS)
  },
)
