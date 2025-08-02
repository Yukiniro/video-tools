import { clamp } from 'es-toolkit'
import { floor } from 'es-toolkit/compat'
import { saveAs } from 'file-saver'
import GIF from 'gif.js'
import { ALL_FORMATS, AudioSample, AudioSampleSink, AudioSampleSource, BlobSource, BufferTarget, CanvasSink, CanvasSource, Conversion, Input, Mp3OutputFormat, Mp4OutputFormat, OggOutputFormat, Output, QUALITY_HIGH, QUALITY_LOW, QUALITY_MEDIUM, WavOutputFormat } from 'mediabunny'
import { nanoid } from 'nanoid'

/**
 * 视频转 GIF 的参数
 */
interface VideoToGifParams {
  /** 视频文件 */
  file: File
  /** 输出分辨率 */
  resolution: '120P' | '240P' | '480P'
  /** 输出帧率 */
  fps: '10FPS' | '15FPS' | '25FPS'
}

/**
 * GIF 转视频的参数
 */
interface GifToVideoParams {
  /** GIF 文件 */
  file: File
  /** 输出分辨率 */
  resolution: '480P' | '720P' | '1080P'
  /** 输出帧率 */
  fps: '30FPS' | '60FPS'
}

/**
 * 视频压缩参数
 */
interface VideoCompressParams {
  /** 视频文件 */
  file: File
  /** 压缩配置 */
  config: {
    /** 质量等级 */
    quality: 'high' | 'medium' | 'low' | 'custom'
    /** 自定义质量（百分比） */
    customQuality?: number
    /** 分辨率 */
    resolution: 'original' | '1080P' | '720P' | '480P' | 'custom'
    /** 自定义宽度 */
    customWidth?: number
    /** 自定义高度 */
    customHeight?: number
    /** 是否保留音频 */
    enableAudio: boolean
  }
}

/**
 * 视频转音频的参数
 */
interface VideoToAudioParams {
  /** 视频文件 */
  file: File
  /** 输出音频格式 */
  format: 'wav' | 'mp3' | 'ogg'
  /** 音频质量 */
  quality: 'high' | 'medium' | 'low'
}

/**
 * 尺寸信息
 */
interface Size {
  width: number
  height: number
}

/**
 * 压缩配置
 */
interface CompressConfig {
  bitrate: number
  width: number
  height: number
}

/**
 * 根据目标分辨率计算 GIF 输出尺寸
 * @param size 原始尺寸
 * @param resolution 目标分辨率（高度）
 * @returns 目标尺寸
 */
function getSize(size: Size, resolution: '120P' | '240P' | '480P'): Size {
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
function getVideoSize(size: Size, resolution: '480P' | '720P' | '1080P'): Size {
  const resolutionMap: Record<'480P' | '720P' | '1080P', number> = {
    '480P': 480,
    '720P': 720,
    '1080P': 1080,
  }
  const targetHeight = resolutionMap[resolution]
  const aspectRatio = size.width / size.height
  return {
    width: Math.round(targetHeight * aspectRatio),
    height: targetHeight,
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
 * 将视频转换为 GIF
 * @param params 视频转换参数
 * @param params.file 视频文件
 * @param params.resolution 输出分辨率
 * @param params.fps 输出帧率
 * @param options 转换选项
 * @param options.start 开始时间（秒）
 * @param options.end 结束时间（秒）
 * @param options.progress 进度回调函数，参数为进度（0-1）
 * @param options.signal 可选，取消信号
 * @returns 转换后的 GIF Blob 文件
 */
export async function videoToGif(
  params: VideoToGifParams,
  options: {
    start: number
    end: number
    progress: (progress: number) => void
    signal?: AbortSignal
  },
): Promise<Blob> {
  const { file, resolution, fps } = params
  const { start, end, progress, signal } = options
  const input = new Input({
    formats: ALL_FORMATS,
    source: new BlobSource(file),
  })
  const track = await input.getPrimaryVideoTrack()
  if (!track) {
    throw new Error('No video track found')
  }

  const { width, height } = getSize({ width: track.displayWidth, height: track.displayHeight }, resolution)

  const sink = new CanvasSink(track, {
    width,
    height,
    fit: 'fill',
  })
  //   const sink = new VideoSampleSink(track)

  const frameRate = Number(fps.replace('FPS', ''))
  const frameInterval = 1 / frameRate
  const delay = 1000 / frameRate

  const gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: '/gif.worker.js',
  })

  progress(0)

  const timestamps = Array.from({ length: Math.floor((end - start) / frameInterval) }, (_, i) => start + i * frameInterval)

  const generator = sink.canvasesAtTimestamps(timestamps)

  for await (const wrappedCanvas of generator) {
    // 检查是否被取消
    if (signal?.aborted) {
      gif.abort()
      throw new Error('Conversion cancelled')
    }

    if (!wrappedCanvas) {
      continue
    }

    progress(clamp(floor((wrappedCanvas.timestamp - start) / (end - start), 2), 0, 1))
    gif.addFrame(wrappedCanvas.canvas, { delay })
  }

  gif.render()

  progress(1)

  return await new Promise((resolve, reject) => {
    // 监听取消信号
    if (signal) {
      signal.addEventListener('abort', () => {
        gif.abort()
        reject(new Error('Conversion cancelled'))
      })
    }

    gif.on('finished', resolve)
  })
}

/**
 * 保存 GIF 文件到本地
 * @param blob GIF Blob 文件
 */
export function saveAsGif(blob: Blob) {
  const filename = `${nanoid()}.gif`
  saveAs(blob, filename)
}

/**
 * 将 GIF 转换为 MP4 视频
 * @param params GIF 转换参数
 * @param params.file GIF 文件
 * @param params.resolution 输出视频分辨率
 * @param params.fps 输出视频帧率
 * @param options 转换选项
 * @param options.progress 进度回调函数，参数为进度（0-1）
 * @param options.signal 可选，取消信号
 * @returns 转换后的视频 Blob 文件（MP4 格式）
 */
export async function gifToVideo(
  params: GifToVideoParams,
  options: {
    progress: (progress: number) => void
    signal?: AbortSignal
  },
): Promise<Blob> {
  const { file, resolution, fps } = params
  const { progress, signal } = options

  // 检查是否被取消
  if (signal?.aborted) {
    throw new Error('Conversion cancelled')
  }

  progress(0)

  const output = new Output({
    format: new Mp4OutputFormat(),
    target: new BufferTarget(),
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  const source = new CanvasSource(canvas, {
    codec: 'avc',
    bitrate: 1e6,
  })

  const frameRate = Number(fps.replace('FPS', ''))

  output.addVideoTrack(source, { frameRate })

  await output.start()

  // 使用 ImageDecoder 解码 GIF
  const decoder = new (window as any).ImageDecoder({
    data: file.stream(),
    type: file.type,
  })

  await decoder.tracks.ready
  const track = decoder.tracks.selectedTrack
  if (!track)
    throw new Error('No track found in GIF')

  const totalFrames = decoder.tracks.selectedTrack.frameCount
  if (!totalFrames || totalFrames <= 0)
    throw new Error('No frames in GIF')

  /**
   * 解码指定帧
   * @param index 帧索引
   * @returns VideoFrame
   */
  const getDecodedFrame = async (index: number): Promise<VideoFrame> => {
    while (true) {
      const result = await decoder.decode({ frameIndex: index, completeFramesOnly: true })
      if (result.complete) {
        return result.image
      }
    }
  }

  const firstFrame = await getDecodedFrame(0)
  const frameDuration = (firstFrame.duration ?? 0) / 1e6
  const { width, height } = getVideoSize(
    { width: firstFrame.displayWidth, height: firstFrame.displayHeight },
    resolution,
  )
  canvas.width = width
  canvas.height = height

  const interval = 1 / frameRate

  let lastFrameInfo = null as { index: number, frame: VideoFrame } | null
  for (let timestamp = 0; timestamp <= totalFrames * frameDuration; timestamp += interval) {
    const index = Math.floor(timestamp / frameDuration)

    let frame: VideoFrame | null = null
    if (index === lastFrameInfo?.index && !!lastFrameInfo?.frame) {
      frame = lastFrameInfo.frame
    }
    else {
      frame = await getDecodedFrame(index)
      lastFrameInfo?.frame.close()
      lastFrameInfo = { index, frame }
    }

    if (!frame) {
      continue
    }

    ctx.drawImage(frame, 0, 0, width, height)
    progress(timestamp / (totalFrames * frameDuration))
    source.add(timestamp, frameDuration)
  }

  // 清理最后一帧
  if (lastFrameInfo?.frame) {
    lastFrameInfo.frame.close()
  }

  await output.finalize()
  const buffer = output.target.buffer

  progress(1)

  return new Blob([buffer!], { type: 'video/mp4' })
}

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
  const { bitrate, width, height } = _calculateCompressConfig(_params, originalInfo)

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
 * 根据质量配置计算比特率
 * @param quality 质量等级（high/medium/low/custom）
 * @param customQuality 自定义质量值（百分比，0-100）
 * @param originalBitrate 原始比特率
 * @returns 计算后的比特率
 */
function calculateBitrate(
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
function calculateDimensions(
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
function _calculateCompressConfig(
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
 * 将视频转换为音频
 * @param params 视频转音频参数
 * @param params.file 视频文件
 * @param params.format 输出音频格式
 * @param params.quality 音频质量
 * @param options 转换选项
 * @param options.progress 进度回调函数，参数为进度（0-1）
 * @param options.signal 可选，取消信号
 * @returns 转换后的音频 Blob 文件
 */
export async function videoToAudio(
  params: VideoToAudioParams,
  options: {
    progress: (progress: number) => void
    signal?: AbortSignal
  },
): Promise<Blob> {
  const { file: _file, format, quality: _quality } = params
  const { progress, signal } = options

  // 检查是否被取消
  if (signal?.aborted) {
    throw new Error('Conversion cancelled')
  }

  const input = new Input({
    formats: ALL_FORMATS,
    source: new BlobSource(_file),
  })

  let outputFormat = null
  switch (format) {
    case 'mp3':
      outputFormat = new Mp3OutputFormat()
      break
    case 'wav':
      outputFormat = new WavOutputFormat()
      break
    case 'ogg':
      outputFormat = new OggOutputFormat()
      break
    default:
      throw new Error('Unsupported audio format')
  }

  const output = new Output({
    format: outputFormat,
    target: new BufferTarget(),
  })

  let audioBitrate = QUALITY_MEDIUM
  switch (_quality) {
    case 'high':
      audioBitrate = QUALITY_LOW
      break
    case 'medium':
      audioBitrate = QUALITY_MEDIUM
      break
    case 'low':
      audioBitrate = QUALITY_HIGH
      break
  }

  await (async () => {
    if (format === 'mp3') {
      const audioTrack = await input.getPrimaryAudioTrack()
      if (!audioTrack) {
        throw new Error('No audio track found')
      }
      const audioSink = new AudioSampleSink(audioTrack)

      const sampleSource = new AudioSampleSource({
        codec: 'aac',
        bitrate: audioBitrate,
      })
      output.addAudioTrack(sampleSource)

      await output.start()

      for await (const sample of audioSink.samples()) {
        sampleSource.add(sample.clone())
      }

      await output.finalize()
    }
    else {
      const conversion = await Conversion.init({
        input,
        output,
        video: { discard: true },
        audio: { bitrate: audioBitrate },
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
    }
  })()

  const buffer = output.target.buffer
  const blob = new Blob([buffer!], { type: `audio/${format}` })

  return blob
}

/**
 * 保存音频文件到本地
 * @param blob 音频 Blob 文件
 * @param format 文件扩展名（如 mp3, wav, ogg）
 */
export function saveAsAudio(blob: Blob, format: string) {
  const filename = `${nanoid()}.${format}`
  saveAs(blob, filename)
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
