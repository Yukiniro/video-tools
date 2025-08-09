import { registerEncoder } from 'mediabunny'
import Mp3Encoder from '../lib/Mp3Encoder'

// 注册 MP3 编码器
registerEncoder(Mp3Encoder)

// 重新导出音频处理功能
export {
  saveAsAudio,
  videoToAudio,
} from '../services/audio'

// 重新导出 GIF 处理功能
export {
  gifToVideo,
  saveAsGif,
  videoToGif,
} from '../services/gif'

// 重新导出视频处理功能
export {
  compressVideo,
  saveAsVideo,
  transcodeVideo,
} from '../services/video'

// 重新导出类型定义
export type {
  CompressConfig,
  GifToVideoParams,
  Size,
  VideoCompressParams,
  VideoToAudioParams,
  VideoToGifParams,
  VideoTranscodeParams,
} from '../types/video'

// 重新导出工具函数
export {
  getVideoDuration,
  getVideoInfo,
} from '../utils/video'
