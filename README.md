# 专业视频工具 (Professional Video Tools)

🛡️ **本地处理 · 数据隐私 · 完全免费**

一个基于 Next.js 的专业视频处理工具网站，**完全在浏览器本地运行**，无需上传文件到服务器，保护您的数据隐私。支持多种高质量视频转换和编辑功能，简单易用，快速高效。

## ✨ 核心特性

### 🔒 隐私安全

- 🛡️ **本地处理** - 所有视频处理完全在浏览器本地进行
- 🔐 **数据隐私** - 文件不会上传到任何服务器
- 🚫 **无需注册** - 无需创建账户或提供个人信息

### ⚡ 性能优势

- 🚀 **快速高效** - 利用现代浏览器技术实现高速处理
- 🎯 **高质量输出** - 保持原始视频质量的同时优化文件大小
- 💰 **完全免费** - 所有功能永久免费使用

### 🎨 用户体验

- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🌍 **多语言支持** - 支持中文、英文、日文
- 🌗 **明暗模式** - 支持系统主题切换
- 🎯 **简单易用** - 直观的用户界面，无需专业知识

### 🛠️ 技术特性

- 🚀 **Next.js 15** 使用 App Router 和 Turbopack
- 💎 **TypeScript** 类型安全
- 🎨 **Shadcn/ui** 现代化组件库
- ⚡ **服务端渲染** 优秀的SEO支持
- 🔄 **Jotai** 轻量级状态管理

## 🛠️ 专业工具集合

> 🔒 **所有工具均在本地运行，文件不会离开您的设备**

### 📹 视频转 GIF

- 将任意视频文件转换为高质量 GIF 动图
- 支持自定义分辨率、帧率和时间范围
- 智能优化文件大小，保持视觉质量

### 🎬 GIF 转视频

- 将 GIF 动图转换为标准视频格式
- 支持多种输出格式（MP4、WebM 等）
- 提升画质和压缩效率

### 🔄 视频转码

- 转换视频格式，支持主流编码方式
- H.264、H.265、VP9 等现代编码器
- 批量处理，提高工作效率

### 📦 视频压缩

- 智能压缩视频文件大小
- 支持自定义质量和分辨率设置
- 保持高质量的同时显著减小文件体积

### ✂️ 视频裁剪

- 精确裁剪视频片段
- 支持时间范围选择和预览
- 保持原始视频质量

### 🎵 音频提取

- 从视频文件中提取高质量音频
- 支持多种音频格式输出
- 保持原始音频质量

### 📊 视频信息查看

- 详细显示视频文件信息和元数据
- 技术参数一目了然
- 帮助优化处理参数

### ⚡ 视频变速

- 调整视频播放速度，支持 0.25x 到 4x 范围
- 可选择保留、调整或丢弃音频
- 支持多种输出分辨率

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
│       ├── video-to-gif/  # 视频转GIF
│       ├── gif-to-video/  # GIF转视频
│       ├── video-transcode/ # 视频转码
│       ├── video-compress/  # 视频压缩
│       ├── video-trim/      # 视频裁剪
│       ├── video-to-audio/  # 音频提取
│       ├── video-info/      # 视频信息
│       └── video-speed/     # 视频变速
├── components/            # React 组件
│   ├── ui/               # Shadcn UI 组件
│   ├── video-timeline/   # 视频时间轴组件
│   ├── header.tsx        # 头部导航
│   ├── footer.tsx        # 底部
│   ├── theme-provider.tsx # 主题提供者
│   └── tool-card.tsx     # 工具卡片
├── atoms/                # Jotai 状态管理
├── i18n/                 # 国际化配置
│   ├── locales/          # 语言文件
│   └── routing.ts        # 路由配置
├── lib/                  # 工具函数
├── services/             # 视频处理服务
├── store/                # 状态存储
├── types/                # TypeScript 类型定义
└── utils/                # 工具函数
```

## 🌐 多语言支持

支持以下语言：

- 🇨🇳 **中文** (默认)
- 🇺🇸 **English**
- 🇯🇵 **日本語**

可以通过顶部导航的语言切换器在不同语言间无缝切换，为全球用户提供本地化体验。

## 🎨 主题

支持以下主题模式：

- ☀️ 亮色模式
- 🌙 暗色模式
- 🔄 跟随系统

## 🔧 技术栈

- **框架**: [Next.js 15.1.4](https://nextjs.org/) (App Router + Turbopack)
- **语言**: [TypeScript 5.9.2](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS 4.1.11](https://tailwindcss.com/)
- **组件**: [Shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **国际化**: [next-intl 4.3.4](https://next-intl-docs.vercel.app/)
- **主题**: [next-themes](https://github.com/pacocoursey/next-themes)
- **状态管理**: [Jotai 2.13.0](https://jotai.org/)
- **视频处理**: [MediaBunny](https://github.com/MediaBunny/MediaBunny) + [GIF.js](https://github.com/buzzfeed/libgif-js)
- **音频处理**: [@mediabunny/mp3-encoder](https://github.com/MediaBunny/MediaBunny)
- **通知**: [Sonner](https://sonner.emilkowal.ski/)
- **分析**: [@vercel/analytics](https://vercel.com/analytics)

## 📝 开发进展

### ✅ 已完成功能

- [x] **视频转 GIF** - 高质量转换，支持自定义参数
- [x] **GIF 转视频** - 多格式输出，提升画质
- [x] **视频转码** - 支持主流编码器
- [x] **视频压缩** - 智能压缩算法，支持自定义质量
- [x] **视频裁剪** - 精确时间范围剪辑
- [x] **音频提取** - 高保真音频输出
- [x] **视频信息查看** - 详细元数据展示
- [x] **视频变速** - 0.25x-4x 速度调整
- [x] **文件上传组件** - 拖拽上传，多格式支持
- [x] **进度显示** - 实时处理进度
- [x] **多语言支持** - 中英日三语切换
- [x] **响应式设计** - 完美适配各种设备
- [x] **视频预览** - 处理前预览功能
- [x] **视频时间轴** - 精确时间控制

### 🚧 开发中

- [ ] **批量处理** - 同时处理多个文件
- [ ] **更多输出格式** - 扩展格式支持
- [ ] **视频合并** - 多段视频无缝拼接

### 🔮 未来计划

- [ ] **字幕添加** - 支持多种字幕格式
- [ ] **视频特效** - 滤镜和转场效果

## 🔒 隐私声明

我们非常重视您的隐私和数据安全：

- 🛡️ **完全本地处理** - 所有视频处理操作都在您的浏览器中本地完成
- 🚫 **零数据上传** - 您的文件永远不会被上传到我们的服务器
- 🔐 **无数据收集** - 我们不收集、存储或分析您的个人文件
- 🌐 **开源透明** - 源代码完全开放，可自由审查和验证
- 💾 **本地存储** - 处理结果直接保存到您的设备

> **承诺**：您的隐私是我们的首要考虑，我们永远不会访问您的文件内容。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

### 如何贡献

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'feat: add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 开发规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 配置
- 提交信息使用英文，遵循约定式提交规范
- 组件优先使用函数式写法
- 优先使用服务端组件，减少客户端组件使用

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
