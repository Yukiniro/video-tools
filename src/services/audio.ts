import type { VideoToAudioParams } from '../types/video'
import { saveAs } from 'file-saver'
import { ALL_FORMATS, BlobSource, BufferTarget, Conversion, Input, Mp3OutputFormat, OggOutputFormat, Output, QUALITY_HIGH, QUALITY_LOW, QUALITY_MEDIUM, WavOutputFormat } from 'mediabunny'
import { nanoid } from 'nanoid'

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
  })()

  const buffer = output.target.buffer
  const blob = new Blob([buffer!], { type: `audio/${format}` })

  return blob
}

/**
 * 保存音频文件到本地
 * @param blob 音频 Blob 文件
 * @param format 文件扩展名（如 mp3、wav、ogg）
 */
export function saveAsAudio(blob: Blob, format: string) {
  const filename = `viidoo--${nanoid()}.${format}`
  saveAs(blob, filename)
}
