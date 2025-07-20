'use client'

import { ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { GithubIcon } from '@/components/icon/github'

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Video Tools</h3>
            <p className="text-sm text-muted-foreground">
              {t('copyright')}
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('resources')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://github.com/Yukiniro/video-tools"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon className="h-4 w-4" />
                  {t('sourceCode')}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{t('contact')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://x.com/Yukiro94317534"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
