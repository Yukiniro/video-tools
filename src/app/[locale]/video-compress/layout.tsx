import type { Metadata } from 'next'
import process from 'node:process'
import { getTranslations } from 'next-intl/server'

interface VideoCompressLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'videoCompress' })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://video-tools.vercel.app'
  const currentUrl = `${baseUrl}/${locale}/video-compress`

  return {
    title: `${t('title')} - Video Tools`,
    description: '免费在线视频压缩工具。支持多种压缩质量、分辨率和比特率设置，有效减小视频文件大小而不大幅损失质量。',
    keywords: [
      '视频压缩',
      'video compression',
      'compress video',
      '视频优化',
      'video optimizer',
      'reduce video size',
      'video compressor',
      '動画圧縮',
      'ビデオ圧縮',
    ],
    alternates: {
      canonical: currentUrl,
      languages: {
        'zh-CN': `${baseUrl}/zh/video-compress`,
        'en-US': `${baseUrl}/en/video-compress`,
        'ja-JP': `${baseUrl}/ja/video-compress`,
      },
    },
    openGraph: {
      title: `${t('title')} - Video Tools`,
      description: '免费在线视频压缩工具。支持多种压缩质量、分辨率和比特率设置。',
      url: currentUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} - Video Tools`,
      description: '免费在线视频压缩工具。支持多种压缩质量、分辨率和比特率设置。',
    },
  }
}

export default function VideoCompressLayout({ children }: VideoCompressLayoutProps) {
  return children
}
