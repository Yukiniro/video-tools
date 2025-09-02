/**
 * 设备检测工具函数
 */

/**
 * 检测是否为移动设备
 * @returns 是否为移动设备
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  // 检查用户代理字符串
  const userAgent = window.navigator.userAgent.toLowerCase()
  const mobileKeywords = [
    'mobile',
    'android',
    'iphone',
    'ipad',
    'ipod',
    'blackberry',
    'windows phone',
    'opera mini',
    'iemobile',
  ]

  // 检查是否包含移动设备关键词
  const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword))

  // 检查屏幕尺寸
  const isSmallScreen = window.innerWidth <= 768

  // 检查触摸支持
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  return isMobileUserAgent || (isSmallScreen && hasTouchSupport)
}

/**
 * 检测是否为触摸设备
 * @returns 是否为触摸设备
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
