'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { countAtom } from '@/lib/atoms'

export default function Home() {
  const [count, setCount] = useAtom(countAtom)
  const t = useTranslations('common')

  return (
    <div className="min-h-screen bg-background font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold">{t('title')}</h1>
          <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="text-4xl font-bold font-mono">{count}</div>

          <div className="flex gap-4">
            <Button onClick={() => setCount(count - 1)} variant="outline" size="lg">
              {t('decrement')}
            </Button>
            <Button onClick={() => setCount(0)} variant="outline" size="lg">
              {t('reset')}
            </Button>
            <Button onClick={() => setCount(count + 1)} variant="outline" size="lg">
              {t('increment')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
