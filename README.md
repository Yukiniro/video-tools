# 视频工具 (Video Tools)

一个基于 Next.js 的专业在线视频处理工具网站，支持多种视频转换和编辑功能。

## ✨ 特性

- 🚀 **Next.js 15** 使用 App Router
- 💎 **TypeScript** 类型安全
- 🎨 **Shadcn/ui** 现代化组件库
- 🌗 **明暗模式** 支持系统主题切换
- 🌍 **国际化** 支持中文和英文
- 📱 **响应式设计** 完美适配移动设备
- ⚡ **服务端渲染** 优秀的SEO支持

## 🛠️ 工具集合

- 📹 **视频转 GIF** - 将视频文件转换为 GIF 动图
- 🎬 **GIF 转视频** - 将 GIF 动图转换为视频文件
- 🔄 **视频转码** - 转换视频格式，支持多种编码方式
- 📦 **视频压缩** - 压缩视频文件大小，保持高质量
- ✂️ **视频裁剪** - 裁剪视频片段或调整视频尺寸
- 🎵 **视频提取音频** - 从视频文件中提取音频轨道

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 🏗️ 项目结构

```
src/
├── app/                    # Next.js App Router
│   └── [locale]/          # 国际化路由
│       ├── layout.tsx     # 根布局
│       ├── page.tsx       # 首页
│       └── [tools]/       # 工具页面
├── components/            # React 组件
│   ├── ui/               # Shadcn UI 组件
│   ├── header.tsx        # 头部导航
│   ├── footer.tsx        # 底部
│   ├── theme-provider.tsx # 主题提供者
│   └── tool-card.tsx     # 工具卡片
├── i18n/                 # 国际化配置
│   ├── locales/          # 语言文件
│   └── routing.ts        # 路由配置
├── lib/                  # 工具函数
└── types/                # TypeScript 类型定义
```

## 🌐 国际化

支持以下语言：

- 🇨🇳 中文 (默认)
- 🇺🇸 English

可以通过顶部导航的语言切换器在不同语言间切换。

## 🎨 主题

支持以下主题模式：

- ☀️ 亮色模式
- 🌙 暗色模式
- 🔄 跟随系统

## 🔧 技术栈

- **框架**: [Next.js 15](https://nextjs.org/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **组件**: [Shadcn/ui](https://ui.shadcn.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **国际化**: [next-intl](https://next-intl-docs.vercel.app/)
- **主题**: [next-themes](https://github.com/pacocoursey/next-themes)
- **状态管理**: [Jotai](https://jotai.org/)

## 📝 开发计划

- [x] 实现视频转 GIF 功能
- [x] 实现 GIF 转视频功能
- [x] 实现视频转码功能
- [x] 实现视频压缩功能
- [ ] 实现视频裁剪功能
- [ ] 视频信息展示
- [x] 实现音频提取功能
- [x] 添加文件上传组件
- [x] 添加进度显示

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## �� 许可证

MIT License
