'use client'

import {
  ArrowRight,
  AudioLines,
  FileVideo,
  Image,
  Info,
  Minimize2,
  Scissors,
  Video,
  Zap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ToolCardProps {
  toolKey: string
  href: string
  locale: string
  comingSoon?: boolean
}

const iconMap = {
  videoToGif: Image,
  gifToVideo: Video,
  videoTranscode: FileVideo,
  videoCompress: Minimize2,
  videoTrim: Scissors,
  extractAudio: AudioLines,
  videoInfo: Info,
  videoSpeed: Zap,
}

export function ToolCard({ toolKey, href, locale, comingSoon = true }: ToolCardProps) {
  const t = useTranslations('tools')
  const tCommon = useTranslations('common')

  const Icon = iconMap[toolKey as keyof typeof iconMap] || Video

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            {comingSoon && (
              <Badge dotColor="secondary" className="text-xs border-secondary/20 bg-secondary/10 flex-shrink-0">
                {t(`${toolKey}.comingSoon`)}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg sm:text-xl leading-tight">{t(`${toolKey}.title`)}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {t(`${toolKey}.description`)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {comingSoon
          ? (
              <Button variant="outline" disabled className="w-full h-10 sm:h-9 min-h-[40px] sm:min-h-[36px]">
                {t(`${toolKey}.comingSoon`)}
              </Button>
            )
          : (
              <Button asChild className="w-full group h-10 sm:h-9 min-h-[40px] sm:min-h-[36px]">
                <Link href={`/${locale}${href}`}>
                  {tCommon('startUsing')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            )}
      </CardContent>
    </Card>
  )
}
