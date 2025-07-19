import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// 包装Next.js导航API的轻量级封装器，考虑路由配置
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
