import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['zh', 'en'],

  // 默认语言设为中文
  defaultLocale: 'zh',
})
