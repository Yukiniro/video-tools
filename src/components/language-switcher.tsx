'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function handleLanguageChange(newLocale: string) {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    const newPath = `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
  }

  return (
    <div className="flex gap-2">
      <Button variant={locale === 'zh' ? 'default' : 'outline'} size="sm" onClick={() => handleLanguageChange('zh')}>
        {t('chinese')}
      </Button>
      <Button variant={locale === 'en' ? 'default' : 'outline'} size="sm" onClick={() => handleLanguageChange('en')}>
        {t('english')}
      </Button>
    </div>
  )
}
