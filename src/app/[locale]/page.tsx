import { getTranslations } from 'next-intl/server'
import { ToolCard } from '@/components/tool-card'

interface HomeProps {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  const t = await getTranslations()

  const tools = [
    {
      key: 'videoToGif',
      href: '/video-to-gif',
      comingSoon: false,
    },
    {
      key: 'gifToVideo',
      href: '/gif-to-video',
      comingSoon: true,
    },
    {
      key: 'videoTranscode',
      href: '/video-transcode',
      comingSoon: true,
    },
    {
      key: 'videoCompress',
      href: '/video-compress',
      comingSoon: true,
    },
    {
      key: 'videoCrop',
      href: '/video-crop',
      comingSoon: true,
    },
    {
      key: 'extractAudio',
      href: '/extract-audio',
      comingSoon: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container px-4 py-24 md:py-32 mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {t('common.title')}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            {t('common.subtitle')}
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container px-4 pb-24 mx-auto">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            {t('navigation.tools')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map(tool => (
              <ToolCard
                key={tool.key}
                toolKey={tool.key}
                href={tool.href}
                locale={locale}
                comingSoon={tool.comingSoon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 mx-auto">
        <div className="px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              {t('common.whyChooseUs')}
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="space-y-4">
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                    <rect x="2" y="6" width="14" height="12" rx="2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{t('common.highQuality')}</h3>
                <p className="text-muted-foreground">
                  {t('common.highQualityDesc')}
                </p>
              </div>
              <div className="space-y-4">
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m14 10 7-7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 10h-6V4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 21 7-7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h6v6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{t('common.fastProcessing')}</h3>
                <p className="text-muted-foreground">
                  {t('common.fastProcessingDesc')}
                </p>
              </div>
              <div className="space-y-4">
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="6" cy="6" r="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.12 8.12 12 12" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4 8.12 15.88" />
                    <circle cx="6" cy="18" r="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.8 14.8 20 20" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{t('common.easyToUse')}</h3>
                <p className="text-muted-foreground">
                  {t('common.easyToUseDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
