import type { Metadata } from 'next'
import process from 'node:process'
import { getTranslations } from 'next-intl/server'

interface GifToVideoLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'videoConfig' })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://video-tools.vercel.app'
  const currentUrl = `${baseUrl}/${locale}/gif-to-video`

  return {
    title: `${t('title')} - Video Tools`,
    description: '免费在线将 GIF 转换为视频。支持多种分辨率和帧率设置，高质量视频输出。快速、简单、无需注册。',
    keywords: [
      'GIF转视频',
      'gif to video',
      'gif converter',
      'video converter',
      'gif to mp4',
      'online video converter',
      'gif animation to video',
      'GIFから動画',
      'GIFをビデオに変換',
    ],
    alternates: {
      canonical: currentUrl,
      languages: {
        'zh-CN': `${baseUrl}/zh/gif-to-video`,
        'en-US': `${baseUrl}/en/gif-to-video`,
        'ja-JP': `${baseUrl}/ja/gif-to-video`,
      },
    },
    openGraph: {
      title: `${t('title')} - Video Tools`,
      description: '免费在线将 GIF 转换为视频。支持多种分辨率和帧率设置，高质量视频输出。',
      url: currentUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} - Video Tools`,
      description: '免费在线将 GIF 转换为视频。支持多种分辨率和帧率设置，高质量视频输出。',
    },
  }
}

export default function GifToVideoLayout({ children }: GifToVideoLayoutProps) {
  return children
}
