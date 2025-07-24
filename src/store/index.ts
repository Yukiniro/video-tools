import { clamp } from 'es-toolkit'
import { floor } from 'es-toolkit/compat'
import { saveAs } from 'file-saver'
import GIF from 'gif.js'
import { ALL_FORMATS, BlobSource, BufferTarget, CanvasSink, CanvasSource, Input, Mp4OutputFormat, Output } from 'mediabunny'
import { nanoid } from 'nanoid'

interface VideoToGifParams {
  file: File
  resolution: '120P' | '240P' | '480P'
  fps: '10FPS' | '15FPS' | '25FPS'
}

interface GifToVideoParams {
  file: File
  resolution: '480P' | '720P' | '1080P'
  fps: '30FPS' | '60FPS'
}

interface Size {
  width: number
  height: number
}

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
 * 获取视频时长
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
 * 将视频转换为 GIF
 * @param params 视频转换参数
 * @param params.file 视频文件
 * @param params.resolution 分辨率
 * @param params.fps 帧率
 * @param options 转换选项
 * @param options.start 开始时间
 * @param options.end 结束时间
 * @param options.progress 进度回调
 * @param options.signal 取消信号
 * @returns 转换后的 GIF 文件
 *
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

export function saveAsGif(blob: Blob) {
  const filename = `${nanoid()}.gif`
  saveAs(blob, filename)
}

/**
 * 将 GIF 转换为视频
 * @param params GIF 转换参数
 * @param params.file GIF 文件
 * @param params.resolution 输出视频分辨率
 * @param params.fps 输出视频帧率
 * @param options 转换选项
 * @param options.progress 进度回调
 * @param options.signal 取消信号
 * @returns 转换后的视频文件
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

  for (let timestamp = 0; timestamp <= totalFrames * frameDuration; timestamp += interval) {
    const frame = await getDecodedFrame(Math.floor(timestamp / frameDuration))
    ctx.drawImage(frame, 0, 0, width, height)
    progress(timestamp / (totalFrames * frameDuration))
    source.add(timestamp, frameDuration)
  }

  await output.finalize()
  const buffer = output.target.buffer

  progress(1)

  return new Blob([buffer!], { type: 'video/mp4' })
}

export function saveAsVideo(blob: Blob, format: string) {
  const filename = `${nanoid()}.${format}`
  saveAs(blob, filename)
}
