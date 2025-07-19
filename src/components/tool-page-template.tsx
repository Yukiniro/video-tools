'use client'

import {
  AudioLines,
  FileVideo,
  Image,
  Minimize2,
  Scissors,
  Video,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ToolPageTemplateProps {
  toolKey: string
  children?: React.ReactNode
}

const iconMap = {
  videoToGif: Image,
  gifToVideo: Video,
  videoTranscode: FileVideo,
  videoCompress: Minimize2,
  videoCrop: Scissors,
  extractAudio: AudioLines,
}

export function ToolPageTemplate({ toolKey, children }: ToolPageTemplateProps) {
  const t = useTranslations('tools')
  const tCommon = useTranslations('common')

  const Icon = iconMap[toolKey as keyof typeof iconMap] || Video

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-24">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Icon className="h-10 w-10 text-primary" />
            </div>
            <div className="mb-4 flex items-center justify-center gap-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {t(`${toolKey}.title`)}
              </h1>
              <Badge variant="secondary">
                {t(`${toolKey}.comingSoon`)}
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground">
              {t(`${toolKey}.description`)}
            </p>
          </div>

          {/* Main Content */}
          {children || (
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle className="text-center">
                  {tCommon('featureInDevelopment') || '功能开发中'}
                </CardTitle>
                <CardDescription className="text-center">
                  {tCommon('developmentMessage') || '我们正在努力开发这个功能，敬请期待！'}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="rounded-lg bg-muted p-8">
                  <Icon className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    {t(`${toolKey}.comingSoon`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tCommon('stayTuned') || '这个工具正在开发中，很快就会与您见面。请关注我们的更新！'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
