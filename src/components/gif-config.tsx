'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { gifConfigAtom } from '@/lib/atoms'

const RESOLUTION_OPTIONS = [
  { value: '120P', label: '120P' },
  { value: '240P', label: '240P' },
  { value: '480P', label: '480P' },
]

const FRAMERATE_OPTIONS = [
  { value: '10FPS', label: '10FPS' },
  { value: '15FPS', label: '15FPS' },
  { value: '25FPS', label: '25FPS' },
]

export function GifConfig() {
  const t = useTranslations('gifConfig')
  const [config, setConfig] = useAtom(gifConfigAtom)

  const handleResolutionChange = (resolution: string) => {
    setConfig({ ...config, resolution })
  }

  const handleFrameRateChange = (fps: string) => {
    setConfig({ ...config, fps })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resolution 选择 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t('resolution')}</Label>
          <div className="relative">
            {/* 灰色底色区域 */}
            <div className="bg-muted rounded-lg p-1 relative">
              {/* 移动高亮背景 */}
              <div
                className="absolute top-1 bottom-1 bg-background rounded-md transition-all duration-200 ease-out shadow-sm"
                style={{
                  width: `calc(${100 / RESOLUTION_OPTIONS.length}% - 0.25rem)`,
                  left: `calc(${(RESOLUTION_OPTIONS.findIndex(opt => opt.value === config.resolution) * 100) / RESOLUTION_OPTIONS.length}% + 0.125rem)`,
                }}
              />
              {/* 选项按钮 */}
              <div className="flex relative z-10">
                {RESOLUTION_OPTIONS.map(option => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResolutionChange(option.value)}
                    className={`flex-1 py-2 px-3 text-sm font-medium transition-all duration-200 ${
                      config.resolution === option.value
                        ? 'text-foreground hover:bg-transparent'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FrameRate 选择 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t('frameRate')}</Label>
          <div className="relative">
            {/* 灰色底色区域 */}
            <div className="bg-muted rounded-lg p-1 relative">
              {/* 移动高亮背景 */}
              <div
                className="absolute top-1 bottom-1 bg-background rounded-md transition-all duration-200 ease-out shadow-sm"
                style={{
                  width: `calc(${100 / FRAMERATE_OPTIONS.length}% - 0.25rem)`,
                  left: `calc(${(FRAMERATE_OPTIONS.findIndex(opt => opt.value === config.fps) * 100) / FRAMERATE_OPTIONS.length}% + 0.125rem)`,
                }}
              />
              {/* 选项按钮 */}
              <div className="flex relative z-10">
                {FRAMERATE_OPTIONS.map(option => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFrameRateChange(option.value)}
                    className={`flex-1 py-2 px-3 text-sm font-medium transition-all duration-200 ${
                      config.fps === option.value
                        ? 'text-foreground hover:bg-transparent'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 配置提示 */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            •
            {t('tips.lowResolution')}
          </p>
          <p>
            •
            {t('tips.chooseAppropriate')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
