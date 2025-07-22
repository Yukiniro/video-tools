import { clamp } from 'es-toolkit'
import { floor } from 'es-toolkit/compat'
import { saveAs } from 'file-saver'
import GIF from 'gif.js'
import { ALL_FORMATS, BlobSource, CanvasSink, Input } from 'mediabunny'
import { nanoid } from 'nanoid'

interface VideoToGifParams {
  file: File
  resolution: '120P' | '240P' | '480P'
  fps: '10FPS' | '15FPS' | '25FPS'
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

  for (let timestamp = start; timestamp < end; timestamp += frameInterval) {
    // 检查是否被取消
    if (signal?.aborted) {
      gif.abort()
      throw new Error('Conversion cancelled')
    }

    const wrappedCanvas = await sink.getCanvas(timestamp)
    if (!wrappedCanvas) {
      continue
    }
    progress(clamp(floor(timestamp / end, 2), 0, 1))
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
