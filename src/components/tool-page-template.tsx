'use client'

import { useTranslations } from 'next-intl'

interface ToolPageTemplateProps {
  toolKey: string
  children?: React.ReactNode
}

export function ToolPageTemplate({ toolKey, children }: ToolPageTemplateProps) {
  const t = useTranslations('tools')

  return (
    <div className="bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 sm:mb-10 lg:mb-12 text-center">
            <div className="mb-3 sm:mb-4 flex items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                {t(`${toolKey}.title`)}
              </h1>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              {t(`${toolKey}.description`)}
            </p>
          </div>
          {children }
        </div>
      </div>
    </div>
  )
}
