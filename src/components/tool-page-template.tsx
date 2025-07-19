'use client'

import { useTranslations } from 'next-intl'

interface ToolPageTemplateProps {
  toolKey: string
  children?: React.ReactNode
}

export function ToolPageTemplate({ toolKey, children }: ToolPageTemplateProps) {
  const t = useTranslations('tools')

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {t(`${toolKey}.title`)}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              {t(`${toolKey}.description`)}
            </p>
          </div>
          {children }
        </div>
      </div>
    </div>
  )
}
