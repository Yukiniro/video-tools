import type { CompressConfig, Size, VideoCompressParams } from '../types/video'
import { ALL_FORMATS, BlobSource, Input } from 'mediabunny'

/**
 * 根据目标分辨率计算 GIF 输出尺寸
 * @param size 原始尺寸
 * @param resolution 目标分辨率（高度）
 * @returns 目标尺寸
 */
export function getSize(size: Size, resolution: '120P' | '240P' | '480P'): Size {
  const resolutionMap: Record<'120P' | '240P' | '480P', number> = {
    '120P': 120,
    '240P': 240,
    '480P': 480,
  }
  const targetHeight = resolutionMap[resolution]
  const aspectRatio = size.width / size.height
  return {
    width: Math.round(targetHeight * aspectRatio),
    height: targetHeight,
  }
}

/**
 * 根据目标分辨率计算视频输出尺寸
 * @param size 原始尺寸
 * @param resolution 目标分辨率（高度）
 * @returns 目标尺寸
 */
export function getVideoSize(size: Size, resolution: '480P' | '720P' | '1080P'): Size {
  const resolutionMap: Record<'480P' | '720P' | '1080P', number> = {
    '480P': 480,
    '720P': 720,
    '1080P': 1080,
  }
  const targetHeight = resolutionMap[resolution]
  const aspectRatio = size.width / size.height
  
  // 计算宽度并向下取偶
  const width = Math.floor(targetHeight * aspectRatio / 2) * 2
  // 高度向下取偶
  const height = Math.floor(targetHeight / 2) * 2
  
  return {
    width,
    height,
  }
}

/**
 * 获取视频时长（单位：秒）
 * @param file 视频文件
 * @returns 视频时长（秒）
 */
export async function getVideoDuration(file: File): Promise<number> {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new BlobSource(file),
  })
  return await input.computeDuration()
}

/**
 * 获取视频宽高信息
 * @param file 视频文件
 * @returns 包含 width、height、aspectRatio 的对象
 */
export async function getVideoInfo(file: File): Promise<{
  width: number
  height: number
  aspectRatio: number
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      const width = video.videoWidth
      const height = video.videoHeight
      const aspectRatio = width / height

      // 清理对象URL
      URL.revokeObjectURL(video.src)

      resolve({
        width,
        height,
        aspectRatio,
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      reject(new Error('Failed to load video metadata'))
    }

    video.src = URL.createObjectURL(file)
  })
}

/**
 * 根据质量配置计算比特率
 * @param quality 质量等级（high/medium/low/custom）
 * @param customQuality 自定义质量值（百分比，0-100）
 * @param originalBitrate 原始比特率
 * @returns 计算后的比特率
 */
export function calculateBitrate(
  quality: 'high' | 'medium' | 'low' | 'custom',
  customQuality: number | undefined,
  originalBitrate: number,
): number {
  const qualityMap: Record<'high' | 'medium' | 'low', number> = {
    high: 0.8,
    medium: 0.5,
    low: 0.3,
  }

  let qualityRatio: number
  if (quality === 'custom' && customQuality !== undefined) {
    qualityRatio = customQuality / 100
  }
  else if (quality !== 'custom') {
    qualityRatio = qualityMap[quality]
  }
  else {
    qualityRatio = 0.5 // 默认中等质量
  }

  return Math.round(originalBitrate * qualityRatio)
}

/**
 * 根据分辨率配置计算最终尺寸
 * @param resolution 分辨率配置
 * @param customWidth 自定义宽度
 * @param customHeight 自定义高度
 * @param originalWidth 原始宽度
 * @param originalHeight 原始高度
 * @returns 计算后的尺寸对象
 */
export function calculateDimensions(
  resolution: 'original' | '1080P' | '720P' | '480P' | 'custom',
  customWidth: number | undefined,
  customHeight: number | undefined,
  originalWidth: number,
  originalHeight: number,
): Size {
  if (resolution === 'original') {
    return { width: originalWidth, height: originalHeight }
  }

  if (resolution === 'custom' && customWidth && customHeight) {
    return { width: customWidth, height: customHeight }
  }

  const resolutionMap: Record<'1080P' | '720P' | '480P', number> = {
    '1080P': 1080,
    '720P': 720,
    '480P': 480,
  }

  const targetHeight = resolutionMap[resolution as '1080P' | '720P' | '480P']
  const aspectRatio = originalWidth / originalHeight
  const width = Math.round(targetHeight * aspectRatio)

  return { width, height: targetHeight }
}

/**
 * 根据压缩配置计算编码参数
 * @param params 压缩参数
 * @param originalInfo 原始视频信息
 * @param originalInfo.width 原始视频宽度
 * @param originalInfo.height 原始视频高度
 * @param originalInfo.bitrate 原始视频比特率
 * @returns 编码配置对象
 */
export function calculateCompressConfig(
  params: VideoCompressParams,
  originalInfo: { width: number, height: number, bitrate?: number },
): CompressConfig {
  const { config } = params
  const { quality, customQuality, resolution, customWidth, customHeight } = config

  // 计算最终尺寸
  const { width, height } = calculateDimensions(
    resolution,
    customWidth,
    customHeight,
    originalInfo.width,
    originalInfo.height,
  )

  // 计算比特率（如果没有原始比特率，使用默认值）
  const defaultBitrate = 2e6 // 2 Mbps
  const originalBitrate = originalInfo.bitrate || defaultBitrate
  const bitrate = calculateBitrate(quality, customQuality, originalBitrate)

  return { bitrate, width, height }
}

/**
 * 根据分辨率获取视频比特率
 * @param resolution 分辨率
 * @returns 比特率（bps）
 */
export function getVideoBitrate(resolution: '480P' | '720P' | '1080P'): number {
  switch (resolution) {
    case '480P':
      return 1000000 // 1Mbps
    case '720P':
      return 2500000 // 2.5Mbps
    case '1080P':
      return 5000000 // 5Mbps
    default:
      return 2500000
  }
}

/**
 * 根据格式获取视频 MIME 类型
 * @param format 视频格式
 * @returns MIME 类型
 */
export function getVideoMimeType(format: 'mp4' | 'webm' | 'mkv' | 'mov'): string {
  switch (format) {
    case 'mp4':
      return 'video/mp4'
    case 'webm':
      return 'video/webm'
    case 'mkv':
      return 'video/x-matroska'
    case 'mov':
      return 'video/quicktime'
    default:
      return 'video/mp4'
  }
}
