import type { Metadata } from 'next'
import process from 'node:process'
import { getTranslations } from 'next-intl/server'

interface VideoToGifLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gifConfig' })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://video-tools.vercel.app'
  const currentUrl = `${baseUrl}/${locale}/video-to-gif`

  return {
    title: `${t('title')} - Video Tools`,
    description: '免费在线将视频转换为 GIF。支持多种视频格式，可调节分辨率、帧率和时间范围。高质量 GIF 生成工具。',
    keywords: [
      '视频转GIF',
      'video to gif',
      'gif converter',
      '视频转换',
      'online gif maker',
      'video converter',
      'gif generator',
      '動画からGIF',
      'ビデオをGIFに変換',
    ],
    alternates: {
      canonical: currentUrl,
      languages: {
        'zh-CN': `${baseUrl}/zh/video-to-gif`,
        'en-US': `${baseUrl}/en/video-to-gif`,
        'ja-JP': `${baseUrl}/ja/video-to-gif`,
      },
    },
    openGraph: {
      title: `${t('title')} - Video Tools`,
      description: '免费在线将视频转换为 GIF。支持多种视频格式，可调节分辨率、帧率和时间范围。',
      url: currentUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} - Video Tools`,
      description: '免费在线将视频转换为 GIF。支持多种视频格式，可调节分辨率、帧率和时间范围。',
    },
  }
}

export default function VideoToGifLayout({ children }: VideoToGifLayoutProps) {
  return children
}
