'use client'

import { Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PlayControlButtonProps {
  isPlaying: boolean
  togglePlay: () => void
}

/**
 * 播放控制按钮组件
 * @param isPlaying 是否正在播放
 * @param togglePlay 切换播放状态的回调函数
 */
export function PlayControlButton({ isPlaying, togglePlay }: PlayControlButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={togglePlay}
      className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-primary/10 hover:bg-primary/20 active:bg-primary/30 transition-colors duration-200 group touch-manipulation select-none"
      title={isPlaying ? '暂停' : '播放'}
      style={{ touchAction: 'manipulation' }}
    >
      {isPlaying
        ? (
            <Pause className="w-6 h-6 sm:w-5 sm:h-5 text-primary group-hover:scale-110 group-active:scale-95 transition-transform duration-200" />
          )
        : (
            <Play className="w-6 h-6 sm:w-5 sm:h-5 text-primary group-hover:scale-110 group-active:scale-95 transition-transform duration-200 ml-0.5" />
          )}
    </Button>
  )
}
