import type { GifConfig } from '@/types/gif'

export interface GifValidationError {
  field: keyof GifConfig
  message: string
}

export function validateGifConfig(config: GifConfig): GifValidationError[] {
  const errors: GifValidationError[] = []

  if (config.width < 16) {
    errors.push({ field: 'width', message: '宽度不能小于 16px' })
  }
  if (config.width > 1920) {
    errors.push({ field: 'width', message: '宽度不能大于 1920px' })
  }

  if (config.fps < 1) {
    errors.push({ field: 'fps', message: '帧率不能小于 1' })
  }
  if (config.fps > 60) {
    errors.push({ field: 'fps', message: '帧率不能大于 60' })
  }

  if (config.quality < 1) {
    errors.push({ field: 'quality', message: '质量不能小于 1' })
  }
  if (config.quality > 100) {
    errors.push({ field: 'quality', message: '质量不能大于 100' })
  }

  return errors
}

export function estimateGifSize(config: GifConfig, durationSeconds: number = 10): string {
  // 简单的文件大小估算（仅作参考）
  // 基于宽度、帧率、质量和时长进行估算
  const baseSize = (config.width * config.width * config.fps * config.quality * durationSeconds) / 10000

  if (baseSize < 100)
    return '小于 100KB'
  if (baseSize < 500)
    return '100-500KB'
  if (baseSize < 1000)
    return '500KB-1MB'
  if (baseSize < 5000)
    return '1-5MB'
  return '大于 5MB'
}

export function getOptimalConfig(videoWidth: number, videoHeight: number): GifConfig {
  // 根据视频尺寸推荐最佳配置
  const aspectRatio = videoWidth / videoHeight
  let recommendedWidth = 480

  if (videoWidth > 1920) {
    recommendedWidth = 800
  }
  else if (videoWidth > 1280) {
    recommendedWidth = 640
  }
  else if (videoWidth > 720) {
    recommendedWidth = 480
  }
  else {
    recommendedWidth = Math.min(videoWidth, 480)
  }

  return {
    width: recommendedWidth,
    fps: Math.min(25, Math.max(10, Math.round(videoWidth / 50))), // 根据宽度调整帧率
    quality: 80,
    loop: true,
  }
}

export function formatConfigSummary(config: GifConfig): string {
  return `${config.width}px × ${Math.round(config.width * 9 / 16)}px, ${config.fps}fps, 质量${config.quality}%`
}
