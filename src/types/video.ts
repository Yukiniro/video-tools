/**
 * 视频转 GIF 的参数
 */
export interface VideoToGifParams {
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
export interface GifToVideoParams {
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
export interface VideoCompressParams {
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
export interface VideoToAudioParams {
  /** 视频文件 */
  file: File
  /** 输出音频格式 */
  format: 'wav' | 'mp3' | 'ogg'
  /** 音频质量 */
  quality: 'high' | 'medium' | 'low'
}

/**
 * 视频转码参数
 */
export interface VideoTranscodeParams {
  /** 视频文件 */
  file: File
  /** 输出分辨率 */
  resolution: '480P' | '720P' | '1080P'
  /** 输出格式 */
  format: 'mp4' | 'webm' | 'mkv'
}

/**
 * 视频裁剪参数
 */
export interface VideoTrimParams {
  /** 视频文件 */
  file: File
  /** 开始时间（秒） */
  startTime: number
  /** 结束时间（秒） */
  endTime: number
  /** 输出分辨率 */
  resolution: '480P' | '720P' | '1080P'
  /** 是否保留音频 */
  keepAudio: boolean
  /** 帧率 */
  frameRate: 30 | 60
}

/**
 * 尺寸信息
 */
export interface Size {
  width: number
  height: number
}

/**
 * 压缩配置
 */
export interface CompressConfig {
  bitrate: number
  width: number
  height: number
}
