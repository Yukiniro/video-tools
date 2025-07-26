import type { MetadataRoute } from 'next'
import process from 'node:process'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://video-tools.vercel.app'
  const locales = ['en', 'zh', 'ja']
  const pages = ['', '/video-to-gif', '/gif-to-video']

  const sitemap: MetadataRoute.Sitemap = []

  // Add homepage for each locale
  locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: {
            'zh-CN': `${baseUrl}/zh${page}`,
            'en-US': `${baseUrl}/en${page}`,
            'ja-JP': `${baseUrl}/ja${page}`,
          },
        },
      })
    })
  })

  return sitemap
}
