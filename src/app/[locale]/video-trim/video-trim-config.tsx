'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { videoTrimConfigAtom } from '@/atoms/video-trim'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export function VideoTrimConfig() {
  const t = useTranslations('videoTrim.config')
  const [config, setConfig] = useAtom(videoTrimConfigAtom)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const parseTime = (timeStr: string) => {
    const [mins, secs] = timeStr.split(':').map(Number)
    return (mins || 0) * 60 + (secs || 0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 时间设置 */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">{t('startTime')}</Label>
              <Input
                id="startTime"
                type="text"
                placeholder="00:00"
                value={formatTime(config.startTime)}
                onChange={(e) => {
                  const time = parseTime(e.target.value)
                  setConfig(prev => ({ ...prev, startTime: time }))
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">{t('endTime')}</Label>
              <Input
                id="endTime"
                type="text"
                placeholder="00:00"
                value={formatTime(config.endTime)}
                onChange={(e) => {
                  const time = parseTime(e.target.value)
                  setConfig(prev => ({ ...prev, endTime: time }))
                }}
              />
            </div>
          </div>
        </div>

        {/* 分辨率设置 */}
        <div className="space-y-2">
          <Label>{t('resolution')}</Label>
          <Select
            value={config.resolution}
            onValueChange={(value: '480P' | '720P' | '1080P') =>
              setConfig(prev => ({ ...prev, resolution: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="480P">{t('480P')}</SelectItem>
              <SelectItem value="720P">{t('720P')}</SelectItem>
              <SelectItem value="1080P">{t('1080P')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 帧率设置 */}
        <div className="space-y-2">
          <Label>{t('frameRate')}</Label>
          <Select
            value={config.frameRate.toString()}
            onValueChange={value =>
              setConfig(prev => ({ ...prev, frameRate: Number.parseInt(value) as 30 | 60 }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">{t('30FPS')}</SelectItem>
              <SelectItem value="60">{t('60FPS')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 音频设置 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="keepAudio" className="text-sm font-medium">
            {t('enableAudio')}
          </Label>
          <Switch
            id="keepAudio"
            checked={config.keepAudio}
            onCheckedChange={checked =>
              setConfig(prev => ({ ...prev, keepAudio: checked }))}
          />
        </div>
      </CardContent>
    </Card>
  )
}
