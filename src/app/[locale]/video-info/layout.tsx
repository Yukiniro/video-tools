import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  const tLayout = await getTranslations('layout')

  return {
    title: `${t('title')} - ${tLayout('keywords.videoInfo')}`,
    description: '查看视频文件的详细信息和元数据，包括分辨率、帧率、编码格式等技术参数。',
  }
}

export default function VideoInfoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
