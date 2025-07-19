import { atom } from 'jotai'

const DEFAULT_GIF_CONFIG = {
  resolution: '480P',
  fps: '15FPS',
}

// 计数器状态
export const countAtom = atom(0)

// 文件状态
export const filesAtom = atom<File[]>([])

// GIF 配置状态
export const gifConfigAtom = atom(DEFAULT_GIF_CONFIG)
