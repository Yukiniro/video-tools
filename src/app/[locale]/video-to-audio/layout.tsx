import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('videoToAudio')
  const tLayout = await getTranslations('layout')

  return {
    title: `${t('pageTitle')} - ${tLayout('keywords.audioExtract')}`,
    description: t('pageDescription'),
  }
}

export default function VideoToAudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
