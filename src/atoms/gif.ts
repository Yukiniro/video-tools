import { atom } from 'jotai'

const DEFAULT_GIF_CONFIG = {
  resolution: '480P',
  fps: '15FPS',
}

// GIF 配置状态
export const gifConfigAtom = atom(DEFAULT_GIF_CONFIG)
