'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import React from 'react'
import { videoSpeedConfigAtom } from '@/atoms/video-speed'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

const RESOLUTION_OPTIONS = [
  { value: '480P', label: '480P' },
  { value: '720P', label: '720P' },
  { value: '1080P', label: '1080P' },
]

const SPEED_PRESETS = [
  { value: 0.5, label: '0.5x' },
  { value: 1.0, label: '1.0x' },
  { value: 1.5, label: '1.5x' },
  { value: 2.0, label: '2.0x' },
]

/**
 * 视频变速配置组件
 * @returns 视频变速配置组件
 */
export function VideoSpeedConfig() {
  const t = useTranslations('videoSpeed')
  const [config, setConfig] = useAtom(videoSpeedConfigAtom)

  const handleSpeedChange = (value: number[]) => {
    setConfig({ ...config, speed: value[0] })
  }

  const handlePresetClick = (speed: number) => {
    setConfig({ ...config, speed })
  }

  const handleResolutionChange = (resolution: string) => {
    setConfig({ ...config, resolution: resolution as any })
  }

  const handleKeepAudioChange = (checked: boolean) => {
    setConfig({ ...config, keepAudio: checked })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 速度滑动条 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{t('speed')}</Label>
            <span className="text-sm text-muted-foreground">
              {config.speed.toFixed(1)}
              x
            </span>
          </div>
          <Slider
            value={[config.speed]}
            onValueChange={handleSpeedChange}
            min={0.25}
            max={4.0}
            step={0.05}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.25x</span>
            <span>4.0x</span>
          </div>
        </div>

        {/* 预设速度按钮 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('preset')}</Label>
          <div className="grid grid-cols-4 gap-2">
            {SPEED_PRESETS.map(preset => (
              <Button
                key={preset.value}
                variant={config.speed === preset.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePresetClick(preset.value)}
                className="h-8"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* 输出分辨率 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('resolution')}</Label>
          <SegmentedControl
            options={RESOLUTION_OPTIONS}
            value={config.resolution}
            onChange={handleResolutionChange}
          />
        </div>

        <Separator />

        {/* 音频选项 */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="keep-audio"
            checked={config.keepAudio}
            onCheckedChange={handleKeepAudioChange}
          />
          <Label htmlFor="keep-audio" className="text-sm font-medium">
            {t('keepAudio')}
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}
