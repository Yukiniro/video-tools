# Next.js Shadcn Starter with Jotai & i18n

这是一个基于 [Next.js](https://nextjs.org) 的项目，使用 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 创建，并集成了 [Shadcn/ui](https://ui.shadcn.com/) 组件、[Jotai](https://jotai.org/) 状态管理和 [next-intl](https://next-intl-docs.vercel.app/) 国际化功能。

## ✨ 特性

- 🚀 **Next.js 15** 使用 App Router
- 💎 **TypeScript** 类型安全
- 🎨 **Shadcn/ui** 组件 + Tailwind CSS
- 🔄 **Jotai** 原子状态管理
- 🌍 **next-intl** 国际化支持 (i18n)
- 📱 **响应式设计** 移动端优先

## 🌍 国际化 (i18n)

本项目使用 next-intl 支持多语言：

### 支持的语言
- 🇨🇳 **中文 (zh)** - 默认语言
- 🇺🇸 **英文 (en)**

### 语言文件
语言文件位于 `src/i18n/locales/` 目录：
- `src/i18n/locales/zh.json` - 中文翻译
- `src/i18n/locales/en.json` - 英文翻译

### 使用示例
```typescript
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('common');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
}
```

### 语言切换
应用包含语言切换组件，用户可以在支持的语言之间切换。语言偏好会反映在 URL 中（例如：`/zh/` 为中文，`/en/` 为英文）。

## 🔄 Jotai 状态管理

本项目演示了使用 Jotai 进行状态管理的简单计数器：

```typescript
import { atom } from 'jotai'

// 基础计数器状态
export const countAtom = atom(0)
```

在组件中使用：
```typescript
import { useAtom } from 'jotai'
import { countAtom } from '@/lib/atoms'

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  )
}
```

## 🚀 快速开始

首先，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。应用会自动重定向到默认语言（中文）。

您也可以直接访问特定语言：
- 中文: [http://localhost:3000/zh](http://localhost:3000/zh)
- 英文: [http://localhost:3000/en](http://localhost:3000/en)

## 📁 项目结构

```
src/
├── app/
│   ├── [locale]/           # 国际化路由
│   │   ├── layout.tsx      # 带 i18n provider 的布局
│   │   └── page.tsx        # 带计数器的主页面
│   └── globals.css         # 全局样式
├── components/
│   ├── ui/                 # Shadcn/ui 组件
│   └── language-switcher.tsx # 语言切换组件
├── i18n/                   # 国际化配置
│   ├── locales/            # 语言文件
│   │   ├── zh.json         # 中文翻译
│   │   └── en.json         # 英文翻译
│   ├── request.ts          # next-intl 请求配置
│   └── routing.ts          # 路由配置
├── lib/
│   ├── atoms.ts            # Jotai atoms 定义
│   └── utils.ts            # 工具函数
├── middleware.ts           # Next.js 中间件 (i18n)
└── types/                  # TypeScript 类型定义
```

## 🔧 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: Shadcn/ui + Radix UI
- **状态管理**: Jotai
- **国际化**: next-intl
- **包管理**: pnpm

## 📦 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

## 🛠️ 开发

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 运行类型检查
pnpm type-check

# 运行代码检查
pnpm lint
```

## 🌐 添加新语言

要添加新语言：

1. 在 `src/i18n/locales/` 中创建新的翻译文件（例如：`fr.json`）
2. 在 `src/i18n/routing.ts` 中的 `locales` 数组添加新语言代码
3. 更新语言切换组件以包含新语言

## 📚 了解更多

要了解本项目中使用的技术：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 特性和 API
- [Shadcn/ui 文档](https://ui.shadcn.com/) - 了解 UI 组件
- [Jotai 文档](https://jotai.org/) - 了解原子状态管理
- [next-intl 文档](https://next-intl-docs.vercel.app/) - 了解国际化
- [Tailwind CSS 文档](https://tailwindcss.com/docs) - 了解实用优先的 CSS

## 🚀 部署到 Vercel

部署 Next.js 应用最简单的方法是使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)，这是 Next.js 的创建者提供的平台。

查看我们的 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。

## 许可证

MIT License
