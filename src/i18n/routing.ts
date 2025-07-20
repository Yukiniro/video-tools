import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['en', 'zh', 'ja'],

  // 默认语言设为英文
  defaultLocale: 'en',
})
