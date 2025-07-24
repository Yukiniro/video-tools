import { getTranslations } from 'next-intl/server'
import { GifToVideoContent } from './gif-to-video-content'

export default async function GifToVideoPage() {
  const t = await getTranslations()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('tools.gifToVideo.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t('tools.gifToVideo.description')}
          </p>
        </div>
        <GifToVideoContent />
      </div>
    </div>
  )
}
