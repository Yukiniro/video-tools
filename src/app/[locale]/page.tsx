import { getTranslations } from 'next-intl/server'
import { FeaturesSection } from '@/components/features-section'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { ToolsSection } from '@/components/tools-section'

interface HomeProps {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  const t = await getTranslations()
  const tHero = await getTranslations('hero')
  const tToolsSection = await getTranslations('toolsSection')
  const tFeaturesSection = await getTranslations('featuresSection')

  const tools = [
    {
      key: 'videoToGif',
      href: '/video-to-gif',
      comingSoon: false,
    },
    {
      key: 'gifToVideo',
      href: '/gif-to-video',
      comingSoon: false,
    },
    {
      key: 'videoTranscode',
      href: '/video-transcode',
      comingSoon: false,
    },
    {
      key: 'videoCompress',
      href: '/video-compress',
      comingSoon: false,
    },
    {
      key: 'videoCrop',
      href: '/video-crop',
      comingSoon: true,
    },
    {
      key: 'extractAudio',
      href: '/video-to-audio',
      comingSoon: false,
    },
    {
      key: 'videoInfo',
      href: '/video-info',
      comingSoon: false,
    },
  ]

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
      ),
      title: t('common.highQuality'),
      description: t('common.highQualityDesc'),
      colorVariant: 'primary' as const,
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m14 10 7-7" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 10h-6V4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 21 7-7" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h6v6" />
        </svg>
      ),
      title: t('common.fastProcessing'),
      description: t('common.fastProcessingDesc'),
      colorVariant: 'primary' as const,
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="6" cy="6" r="3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.12 8.12 12 12" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4 8.12 15.88" />
          <circle cx="6" cy="18" r="3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.8 14.8 20 20" />
        </svg>
      ),
      title: t('common.easyToUse'),
      description: t('common.easyToUseDesc'),
      colorVariant: 'primary' as const,
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-background">
        <HeroSection
          badge={tHero('badge')}
          title={tHero('title')}
          subtitle={tHero('subtitle')}
          getStarted={tHero('getStarted')}
          features={{
            localProcessing: tHero('features.localProcessing'),
            dataPrivacy: tHero('features.dataPrivacy'),
            fastEfficient: tHero('features.fastEfficient'),
            completelyFree: tHero('features.completelyFree'),
          }}
          stats={{
            videosProcessed: tHero('stats.videosProcessed'),
            successRate: tHero('stats.successRate'),
            avgProcessing: tHero('stats.avgProcessing'),
          }}
        />

        <ToolsSection
          badge={tToolsSection('badge')}
          title={t('navigation.tools')}
          description={tToolsSection('description')}
          tools={tools}
          locale={locale}
        />

        <FeaturesSection
          badge={tFeaturesSection('badge')}
          title={t('common.whyChooseUs')}
          description={tFeaturesSection('description')}
          features={features}
        />
      </div>
      <Footer />
    </>
  )
}
