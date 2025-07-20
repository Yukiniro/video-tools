'use client'

import { ChevronDown, Globe } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
]

export function LanguageDropdown() {
  const locale = useLocale()
  const router = useRouter()

  const currentLanguage = languages.find(lang => lang.code === locale)

  const handleLanguageChange = (newLocale: string) => {
    // 获取当前路径，移除语言前缀
    const currentPath = window.location.pathname
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '')

    // 导航到新的语言路径
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Globe className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline-block mr-1">
            {currentLanguage?.flag}
          </span>
          <span className="hidden md:inline-block">
            {currentLanguage?.name}
          </span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {languages.map(language => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${
              locale === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
