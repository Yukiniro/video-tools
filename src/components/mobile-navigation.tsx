'use client'

import { useSetAtom } from 'jotai'
import { Video } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { resetAllStatesAtom } from '@/atoms'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

interface MobileNavigationProps {
  locale: string
}

export function MobileNavigation({ locale }: MobileNavigationProps) {
  const t = useTranslations()
  const resetAllStates = useSetAtom(resetAllStatesAtom)
  const [isOpen, setIsOpen] = useState(false)

  const tools = [
    { key: 'videoToGif', href: '/video-to-gif', comingSoon: false },
    { key: 'gifToVideo', href: '/gif-to-video', comingSoon: false },
    { key: 'videoTranscode', href: '/video-transcode', comingSoon: false },
    { key: 'videoCompress', href: '/video-compress', comingSoon: false },
    { key: 'videoTrim', href: '/video-trim', comingSoon: false },
    { key: 'extractAudio', href: '/video-to-audio', comingSoon: false },
    { key: 'videoInfo', href: '/video-info', comingSoon: false },
    { key: 'videoSpeed', href: '/video-speed', comingSoon: false },
  ]

  const handleLinkClick = () => {
    setIsOpen(false)
    resetAllStates()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 min-h-[44px] min-w-[44px]">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="sr-only">打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-left">
            <Video className="h-5 w-5" />
            {t('common.title')}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* 首页链接 */}
          <div>
            <Link
              href={`/${locale}`}
              onClick={handleLinkClick}
              className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              {t('navigation.home')}
            </Link>
          </div>

          {/* 工具列表 */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t('navigation.tools')}
            </h3>
            <nav className="space-y-1">
              {tools.map(tool => (
                tool.comingSoon
                  ? (
                      <div
                        key={tool.key}
                        className="block px-3 py-2 text-sm text-muted-foreground cursor-not-allowed opacity-50"
                      >
                        <span>{t(`tools.${tool.key}.title`)}</span>
                        <span className="ml-2 text-xs">
                          (
                          {t(`tools.${tool.key}.comingSoon`)}
                          )
                        </span>
                      </div>
                    )
                  : (
                      <Link
                        key={tool.key}
                        href={`/${locale}${tool.href}`}
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                      >
                        {t(`tools.${tool.key}.title`)}
                      </Link>
                    )
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
