import type { VideoCompressParams, VideoInfo, VideoTranscodeParams, VideoTrimParams } from '../types/video'
import { saveAs } from 'file-saver'
import { ALL_FORMATS, BlobSource, BufferTarget, Conversion, Input, MkvOutputFormat, Mp4OutputFormat, Output, WebMOutputFormat } from 'mediabunny'
import { nanoid } from 'nanoid'
import { calculateCompressConfig, getVideoBitrate, getVideoInfo, getVideoMimeType, getVideoSize } from '../utils/video'

/**
 * 压缩视频
 * @param _params 压缩参数
 * @param _options 选项
 * @param _options.progress 进度回调函数，参数为进度（0-1）和阶段
 * @param _options.signal 可选，取消信号
 * @returns 包含压缩后视频 Blob 及元数据的对象
 */
export async function compressVideo(
  _params: VideoCompressParams,
  _options: {
    progress: (progress: number, stage?: 'compressing') => void
    signal?: AbortSignal
  },
): Promise<{ blob: Blob, metadata: any }> {
  const originalInfo = await getVideoInfo(_params.file)
  const { bitrate, width, height } = calculateCompressConfig(_params, originalInfo)

  const input = new Input({
    formats: ALL_FORMATS,
    source: new BlobSource(_params.file),
  })

  const output = new Output({
    format: new Mp4OutputFormat(),
    target: new BufferTarget(),
  })

  const conversion = await Conversion.init({
    input,
    output,
    video: {
      width,
      height,
      bitrate,
      fit: 'contain',
    },
    audio: {
      discard: !_params.config.enableAudio,
    },
  })

  let cancelReject: (reason?: any) => void
  conversion.onProgress = (progress) => {
    if (_options.signal?.aborted) {
      cancelReject?.(new Error('Conversion cancelled'))
      conversion.cancel()
    }

    _options.progress(progress, 'compressing')
  }

  await Promise.race([
    conversion.execute(),
    new Promise((_, reject) => {
      cancelReject = reject
    }),
  ])

  const buffer = output.target.buffer

  return {
    blob: new Blob([buffer!], { type: 'video/mp4' }),
    metadata: {
      width,
      height,
    },
  }
}

/**
 * 视频转码
 * @param params 转码参数
 * @param params.file 视频文件
 * @param params.resolution 目标分辨率
 * @param params.format 目标格式
 * @param options 选项
 * @param options.progress 进度回调函数，参数为进度（0-1）
 * @param options.signal 可选，取消信号
 * @returns 转码后的视频 Blob
 */
export async function transcodeVideo(
  params: VideoTranscodeParams,
  options: {
    progress: (progress: number) => void
    signal?: AbortSignal
  },
): Promise<Blob> {
  const { file, resolution, format } = params
  const { progress, signal } = options

  // 获取视频信息
  const videoInfo = await getVideoInfo(file)
  const targetSize = getVideoSize(videoInfo, resolution)

  // 创建输入和输出
  const target = new BufferTarget()
  const source = new BlobSource(file)

  // 根据格式选择输出配置
  let outputFormat
  switch (format) {
    case 'mp4':
      outputFormat = new Mp4OutputFormat()
      break
    case 'webm':
      // WebM 使用 MP4 格式作为容器（Mediabunny 的实现方式）
      outputFormat = new WebMOutputFormat()
      break
    case 'mkv':
      // MKV 使用 MP4 格式作为容器（Mediabunny 的实现方式）
      outputFormat = new MkvOutputFormat()
      break
    default:
      throw new Error(`Unsupported format: ${format}`)
  }

  const input = new Input({
    formats: ALL_FORMATS,
    source,
  })

  const output = new Output({
    format: outputFormat,
    target,

  })

  // 执行转码
  const conversion = await Conversion.init({
    input,
    output,
    video: {
      bitrate: getVideoBitrate(resolution),
      width: targetSize.width,
      height: targetSize.height,
      fit: 'contain',
    },
  })

  let cancelReject: (reason?: any) => void
  conversion.onProgress = (value) => {
    if (signal?.aborted) {
      cancelReject?.(new Error('Conversion cancelled'))
      return
    }
    progress(value)
  }

  await Promise.race([
    conversion.execute(),
    new Promise((_, reject) => {
      cancelReject = reject
    }),
  ])

  const buffer = (target as any).buffer
  const mimeType = getVideoMimeType(format)
  const blob = new Blob([buffer!], { type: mimeType })

  return blob
}

/**
 * 保存视频文件到本地
 * @param blob 视频 Blob 文件
 * @param format 文件扩展名（如 mp4）
 */
export function saveAsVideo(blob: Blob, format: string) {
  const filename = `${nanoid()}.${format}`
  saveAs(blob, filename)
}

/**
 * 裁剪视频
 * @param params 裁剪参数
 * @param params.file 视频文件
 * @param params.startTime 开始时间
 * @param params.endTime 结束时间
 * @param params.resolution 分辨率
 * @param params.frameRate 帧率
 * @param params.keepAudio 是否保留音频
 * @param options 选项
 * @param options.progress 进度回调函数，参数为进度（0-1）
 * @param options.signal 可选，取消信号
 * @returns 裁剪后的视频 Blob
 */
export async function trimVideo(
  params: VideoTrimParams,
  options: {
    progress: (progress: number) => void
    signal?: AbortSignal
  },
): Promise<Blob> {
  const { startTime, endTime, file, resolution, keepAudio, frameRate } = params
  const { progress, signal } = options

  // 获取分辨率尺寸
  const getResolutionSize = (res: string) => {
    switch (res) {
      case '480P': return { width: 854, height: 480 }
      case '720P': return { width: 1280, height: 720 }
      case '1080P': return { width: 1920, height: 1080 }
      default: return { width: 1280, height: 720 }
    }
  }

  const { width, height } = getResolutionSize(resolution)

  // 创建输入源
  const source = new BlobSource(file)
  const input = new Input({
    formats: ALL_FORMATS,
    source,
  })

  // 创建输出目标
  const target = new BufferTarget()
  const output = new Output({
    format: new Mp4OutputFormat(),
    target,
  })

  // 创建转换任务
  const conversion = await Conversion.init({
    input,
    output,
    video: {
      width,
      height,
      fit: 'contain',
      frameRate,
    },
    audio: {
      discard: !keepAudio,
    },
    trim: {
      start: startTime,
      end: endTime,
    },
  })

  let cancelReject: ((reason?: any) => void) | null = null

  // 监听进度
  conversion.onProgress = (value: number) => {
    if (signal?.aborted) {
      cancelReject?.(new Error('Conversion cancelled'))
      return
    }
    progress(value)
  }

  await Promise.race([
    conversion.execute(),
    new Promise((_, reject) => {
      cancelReject = reject
    }),
  ])

  const buffer = (target as any).buffer
  const blob = new Blob([buffer!], { type: 'video/mp4' })

  return blob
}

/**
 * 分析视频信息
 * @param file 视频文件
 * @returns 视频信息对象
 * @throws 当分析失败时抛出错误
 */
export async function analyzeVideo(file: File): Promise<VideoInfo> {
  try {
    const input = new Input({
      formats: ALL_FORMATS,
      source: new BlobSource(file),
    })

    const duration = await input.computeDuration()
    const mimeType = await input.getMimeType()
    const videoTrack = await input.getPrimaryVideoTrack()
    const audioTrack = await input.getPrimaryAudioTrack()

    const info: Partial<VideoInfo> = {
      mediaType: mimeType,
      duration,
      size: file.size,
    }

    if (videoTrack) {
      const codec = await videoTrack.getCodecParameterString()
      const { averagePacketRate: fps } = await videoTrack.computePacketStats(100)
      const { codedWidth, codedHeight, displayWidth, displayHeight } = videoTrack
      const rotation = videoTrack.rotation

      Object.assign(info, {
        codedWidth,
        codedHeight,
        displayWidth,
        displayHeight,
        frameRate: fps,
        videoCodec: codec || undefined,
        rotation: rotation || undefined,
        aspectRatio: `${codedWidth}:${codedHeight}`,
      })
    }

    if (audioTrack) {
      const codec = await audioTrack.getCodecParameterString()
      Object.assign(info, {
        audioCodec: codec || undefined,
        audioChannels: audioTrack.numberOfChannels || undefined,
        audioSampleRate: audioTrack.sampleRate || undefined,
      })
    }

    return info as VideoInfo
  }
  catch (error) {
    console.error('Error analyzing video:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}
