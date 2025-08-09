import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'videoTrim' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function VideoTrimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
