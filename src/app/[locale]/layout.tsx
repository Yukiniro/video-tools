import type { Metadata } from 'next'
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

  return {
    title: t('title'),
    description: t('description'),
    keywords: ['视频工具', '视频转换', 'GIF转换', '视频压缩', '视频裁剪', '音频提取', 'video tools', 'video converter'],
    authors: [{ name: 'Video Tools Team' }],
    creator: 'Video Tools',
    publisher: 'Video Tools',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://videotools.com'),
    alternates: {
      canonical: '/',
      languages: {
        'zh-CN': '/zh',
        'en-US': '/en',
        'ja-JP': '/ja',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: '/',
      siteName: 'Funny Video Tools',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        'index': true,
        'follow': true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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

  return (
    <html lang={locale} suppressHydrationWarning>
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
      </body>
    </html>
  )
}
