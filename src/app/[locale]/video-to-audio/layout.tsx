import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('videoToAudio')

  return {
    title: `${t('pageTitle')} - 在线视频音频提取工具`,
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
