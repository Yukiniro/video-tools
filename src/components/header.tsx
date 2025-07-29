'use client'

import { ChevronDown, Menu, Video } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LanguageDropdown } from '@/components/language-dropdown'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  locale: string
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations()

  const tools = [
    { key: 'videoToGif', href: '/video-to-gif', comingSoon: false },
    { key: 'gifToVideo', href: '/gif-to-video', comingSoon: false },
    { key: 'videoTranscode', href: '/video-transcode', comingSoon: true },
    { key: 'videoCompress', href: '/video-compress', comingSoon: false },
    { key: 'videoCrop', href: '/video-crop', comingSoon: true },
    { key: 'extractAudio', href: '/extract-audio', comingSoon: true },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <Video className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            {t('common.title')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="mx-6 hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href={`/${locale}`}
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            {t('navigation.home')}
          </Link>

          {/* Tools Dropdown - Simple version without Select */}
          <div className="relative group">
            <Button variant="ghost" className="flex items-center gap-1">
              {t('navigation.tools')}
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                {tools.map(tool => (
                  tool.comingSoon
                    ? (
                        <div
                          key={tool.key}
                          className="block px-4 py-2 text-sm text-muted-foreground cursor-not-allowed opacity-50"
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
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          {t(`tools.${tool.key}.title`)}
                        </Link>
                      )
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Dropdown */}
          <LanguageDropdown />
        </div>
      </div>
    </header>
  )
}
