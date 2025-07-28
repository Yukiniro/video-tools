'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import { filesAtom } from '@/atoms/files'
import { originalVideoInfoAtom, videoCompressConfigAtom } from '@/atoms/video-compress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { Separator } from '@/components/ui/separator'
import { getVideoInfo } from '@/store'

const QUALITY_OPTIONS = [
  { value: 'high', label: '高质量' },
  { value: 'medium', label: '中等质量' },
  { value: 'low', label: '低质量' },
  { value: 'custom', label: '自定义' },
]

const RESOLUTION_OPTIONS = [
  { value: 'original', label: '原始分辨率' },
  { value: '1080P', label: '1080P' },
  { value: '720P', label: '720P' },
  { value: '480P', label: '480P' },
  { value: 'custom', label: '自定义' },
]

export function VideoCompressConfig() {
  const t = useTranslations('videoCompress')
  const [files] = useAtom(filesAtom)
  const [config, setConfig] = useAtom(videoCompressConfigAtom)
  const [videoInfo, setVideoInfo] = useAtom(originalVideoInfoAtom)

  // 当文件改变时获取视频信息
  useEffect(() => {
    if (files.length > 0) {
      getVideoInfo(files[0])
        .then((info) => {
          setVideoInfo(info)
          // 如果还没有设置自定义宽高，使用原始宽高
          if (!config.customWidth && !config.customHeight) {
            setConfig(prev => ({
              ...prev,
              customWidth: info.width,
              customHeight: info.height,
            }))
          }
        })
        .catch((error) => {
          console.error('Failed to get video info:', error)
        })
    }
  }, [files, setVideoInfo, config.customWidth, config.customHeight, setConfig])

  const handleQualityChange = (quality: string) => {
    setConfig({ ...config, quality: quality as any })
  }

  const handleResolutionChange = (resolution: string) => {
    setConfig({ ...config, resolution: resolution as any })
  }

  const handleCustomQualityChange = (value: string) => {
    const numValue = Number(value)
    if (numValue >= 1 && numValue <= 100) {
      setConfig({ ...config, customQuality: numValue })
    }
  }

  const handleCustomWidthChange = (value: string) => {
    const numValue = Number(value)
    if (numValue > 0 && videoInfo.aspectRatio) {
      // 强制保持宽高比，自动计算高度
      const newHeight = Math.round(numValue / videoInfo.aspectRatio)
      setConfig(prev => ({
        ...prev,
        customWidth: numValue,
        customHeight: newHeight,
      }))
    }
  }

  const handleCustomHeightChange = (value: string) => {
    const numValue = Number(value)
    if (numValue > 0 && videoInfo.aspectRatio) {
      // 强制保持宽高比，自动计算宽度
      const newWidth = Math.round(numValue * videoInfo.aspectRatio)
      setConfig(prev => ({
        ...prev,
        customHeight: numValue,
        customWidth: newWidth,
      }))
    }
  }

  const handleAudioToggle = (checked: boolean) => {
    setConfig({ ...config, enableAudio: checked })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 压缩质量 */}
        <div className="space-y-3">
          <SegmentedControl
            label={t('quality')}
            options={QUALITY_OPTIONS.map(opt => ({
              ...opt,
              label: t(`qualityOptions.${opt.value}`),
            }))}
            value={config.quality}
            onChange={handleQualityChange}
          />

          {config.quality === 'custom' && (
            <div className="pl-4">
              <Label className="text-sm text-muted-foreground">
                {t('customQuality')}
                {' '}
                (1-100)
              </Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={config.customQuality || 75}
                onChange={e => handleCustomQualityChange(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('qualityTip')}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* 输出分辨率 */}
        <div className="space-y-3">
          <SegmentedControl
            label={t('resolution')}
            options={RESOLUTION_OPTIONS.map(opt => ({
              ...opt,
              label: t(`resolutionOptions.${opt.value}`),
            }))}
            value={config.resolution}
            onChange={handleResolutionChange}
          />

          {config.resolution === 'custom' && (
            <div className="pl-4 space-y-3">
              {/* 显示原始视频宽高比信息 */}
              {videoInfo.aspectRatio && videoInfo.width && videoInfo.height && (
                <div className="text-sm text-muted-foreground">
                  原始尺寸:
                  {' '}
                  {videoInfo.width}
                  {' '}
                  ×
                  {' '}
                  {videoInfo.height}
                  {' '}
                  (宽高比
                  {' '}
                  {(videoInfo.aspectRatio).toFixed(2)}
                  :1)
                </div>
              )}

              <div>
                <Label className="text-sm text-muted-foreground">
                  {t('customWidth')}
                  {' '}
                  (px)
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1920"
                  value={config.customWidth || ''}
                  onChange={e => handleCustomWidthChange(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  {t('customHeight')}
                  {' '}
                  (px)
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1080"
                  value={config.customHeight || ''}
                  onChange={e => handleCustomHeightChange(e.target.value)}
                  className="mt-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('aspectRatioTip')}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* 音频选项 */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="enable-audio"
            checked={config.enableAudio}
            onCheckedChange={handleAudioToggle}
          />
          <Label htmlFor="enable-audio" className="text-sm font-medium">
            {t('enableAudio')}
          </Label>
        </div>

        {/* 配置提示 */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2">
          <p>
            •
            {t('tips.qualityVsSize')}
          </p>
          <p>
            •
            {t('tips.resolutionRecommendation')}
          </p>
          <p>
            •
            {t('tips.originalFormatKept')}
          </p>
          <p>
            •
            {t('tips.bitrateAutoAdjusted')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
