import type { Metadata } from 'next'
import process from 'node:process'
import { Analytics } from '@vercel/analytics/next'
import { Provider } from 'jotai'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { routing } from '@/i18n/routing'
import '../globals.css'

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://video-tools.vercel.app'
  const currentUrl = `${baseUrl}/${locale}`

  return {
    title: {
      default: t('title'),
      template: `%s | Video Tools`,
    },
    description: t('description'),
    keywords: [
      '视频工具',
      '视频转换',
      'GIF转换',
      '视频压缩',
      '视频裁剪',
      '音频提取',
      'video tools',
      'video converter',
      'gif converter',
      'video compression',
      'video editing',
      'audio extraction',
      'online video tools',
      'free video tools',
      '動画ツール',
      '動画変換',
      'GIF変換',
      '動画圧縮',
    ],
    authors: [{ name: 'Yukiniro', url: 'https://github.com/yukiniro' }],
    creator: 'Yukiniro',
    publisher: 'Video Tools',
    applicationName: 'Video Tools',
    referrer: 'origin-when-cross-origin',
    category: 'Technology',
    classification: 'Video Processing Tools',
    alternates: {
      canonical: currentUrl,
      languages: {
        'zh-CN': `${baseUrl}/zh`,
        'en-US': `${baseUrl}/en`,
        'ja-JP': `${baseUrl}/ja`,
      },
    },
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'android-chrome-192x192',
          url: '/android-chrome-192x192.png',
        },
        {
          rel: 'android-chrome-512x512',
          url: '/android-chrome-512x512.png',
        },
      ],
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: currentUrl,
      siteName: 'Video Tools',
      locale: locale === 'zh' ? 'zh_CN' : locale === 'ja' ? 'ja_JP' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      creator: '@yukiniro',
      site: '@video_tools',
      images: [`${baseUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        'index': true,
        'follow': true,
        'noimageindex': false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
      other: {
        me: process.env.NEXT_PUBLIC_ME_VERIFICATION || '',
      },
    },
    other: {
      'theme-color': '#0f172a',
      'color-scheme': 'dark light',
      'format-detection': 'telephone=no',
    },
  }
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'metadata' })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://video-tools.vercel.app'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': t('title'),
    'description': t('description'),
    'url': `${baseUrl}/${locale}`,
    'applicationCategory': 'MultimediaApplication',
    'operatingSystem': 'Web Browser',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
    'featureList': [
      'Video to GIF conversion',
      'GIF to Video conversion',
      'Video compression',
      'Video cropping',
      'Audio extraction',
      'Online video processing',
    ],
    'creator': {
      '@type': 'Person',
      'name': 'Yukiniro',
      'url': 'https://github.com/yukiniro',
    },
    'inLanguage': locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US',
    'isAccessibleForFree': true,
    'browserRequirements': 'Modern web browser with JavaScript enabled',
    'softwareVersion': '1.0.0',
    'dateModified': new Date().toISOString(),
    'license': 'https://opensource.org/licenses/MIT',
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <div className="relative flex min-h-screen flex-col">
                <Header locale={locale} />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster position="top-center" richColors />
            </NextIntlClientProvider>
          </ThemeProvider>
        </Provider>
        <Analytics />
      </body>
    </html>
  )
}
