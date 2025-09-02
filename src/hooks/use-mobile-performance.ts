'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * 移动端性能优化 Hook
 * 提供移动端特定的性能优化功能
 */
export function useMobilePerformance() {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const rafRef = useRef<number>()

  useEffect(() => {
    // 检测低端设备
    const checkLowEndDevice = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      const memory = (performance as any).memory

      // 基于多个指标判断是否为低端设备
      const isLowEnd
        // 网络连接较慢
        = (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'))
        // 内存不足
          || (memory && memory.jsHeapSizeLimit < 100 * 1024 * 1024) // 小于100MB
        // CPU核心数少
          || navigator.hardwareConcurrency < 4
        // 用户代理检测
          || /Android.*Chrome\/[0-5]\d/.test(navigator.userAgent)
          || /iPhone.*OS \d/.test(navigator.userAgent)

      setIsLowEndDevice(isLowEnd)
    }

    // 检测用户是否偏好减少动画
    const checkReducedMotion = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setIsReducedMotion(prefersReducedMotion)
    }

    checkLowEndDevice()
    checkReducedMotion()

    // 监听网络变化
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', checkLowEndDevice)
    }

    // 监听动画偏好变化
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', checkReducedMotion)

    return () => {
      if (connection) {
        connection.removeEventListener('change', checkLowEndDevice)
      }
      mediaQuery.removeEventListener('change', checkReducedMotion)
    }
  }, [])

  /**
   * 优化的 requestAnimationFrame
   * 在低端设备上降低帧率
   */
  const optimizedRAF = (callback: () => void) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    if (isLowEndDevice) {
      // 低端设备使用 setTimeout 降低帧率
      rafRef.current = window.setTimeout(callback, 16) // ~60fps
    }
    else {
      rafRef.current = requestAnimationFrame(callback)
    }
  }

  /**
   * 清理动画帧
   */
  const cancelOptimizedRAF = () => {
    if (rafRef.current) {
      if (isLowEndDevice) {
        clearTimeout(rafRef.current)
      }
      else {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = undefined
    }
  }

  /**
   * 获取优化的动画持续时间
   */
  const getOptimizedDuration = (baseDuration: number) => {
    if (isReducedMotion)
      return 0
    if (isLowEndDevice)
      return baseDuration * 0.5
    return baseDuration
  }

  /**
   * 获取优化的延迟时间
   */
  const getOptimizedDelay = (baseDelay: number) => {
    if (isLowEndDevice)
      return baseDelay * 2
    return baseDelay
  }

  return {
    isLowEndDevice,
    isReducedMotion,
    optimizedRAF,
    cancelOptimizedRAF,
    getOptimizedDuration,
    getOptimizedDelay,
  }
}

/**
 * 移动端内存管理 Hook
 */
export function useMobileMemoryManagement() {
  const [memoryUsage, setMemoryUsage] = useState<number>(0)
  const cleanupFunctions = useRef<(() => void)[]>([])

  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        setMemoryUsage(usage)
      }
    }

    // 定期检查内存使用情况
    const interval = setInterval(updateMemoryUsage, 5000)
    updateMemoryUsage()

    return () => {
      clearInterval(interval)
      // 清理所有注册的清理函数
      cleanupFunctions.current.forEach(cleanup => cleanup())
    }
  }, [])

  /**
   * 注册清理函数
   */
  const registerCleanup = (cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup)
  }

  /**
   * 检查是否需要清理内存
   */
  const shouldCleanup = memoryUsage > 80

  /**
   * 强制垃圾回收（如果可用）
   */
  const forceGC = () => {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc()
    }
  }

  return {
    memoryUsage,
    shouldCleanup,
    registerCleanup,
    forceGC,
  }
}

/**
 * 移动端网络优化 Hook
 */
export function useMobileNetworkOptimization() {
  const [connectionType, setConnectionType] = useState<string>('unknown')
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown')
        setIsSlowConnection(
          connection.effectiveType === 'slow-2g'
          || connection.effectiveType === '2g'
          || connection.downlink < 1.5, // 小于1.5Mbps
        )
      }
    }

    updateConnectionInfo()

    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo)
    }

    return () => {
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [])

  /**
   * 获取优化的图片质量
   */
  const getOptimizedImageQuality = (baseQuality: number = 0.8) => {
    if (isSlowConnection)
      return Math.min(baseQuality, 0.6)
    return baseQuality
  }

  /**
   * 获取优化的视频质量
   */
  const getOptimizedVideoQuality = (baseQuality: number = 0.8) => {
    if (isSlowConnection)
      return Math.min(baseQuality, 0.5)
    return baseQuality
  }

  return {
    connectionType,
    isSlowConnection,
    getOptimizedImageQuality,
    getOptimizedVideoQuality,
  }
}
