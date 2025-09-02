'use client'

import { useCallback, useRef } from 'react'

interface TouchPosition {
  x: number
  y: number
}

interface UseMobileInteractionOptions {
  onStart?: (position: TouchPosition) => void
  onMove?: (position: TouchPosition, delta: TouchPosition) => void
  onEnd?: (position: TouchPosition) => void
  preventDefault?: boolean
  passive?: boolean
}

/**
 * 移动端交互 Hook - 统一处理鼠标和触摸事件
 * 提供跨设备的交互体验，支持触摸和鼠标操作
 */
export function useMobileInteraction(options: UseMobileInteractionOptions = {}) {
  const {
    onStart,
    onMove,
    onEnd,
    preventDefault = true,
    passive = false,
  } = options

  const lastPositionRef = useRef<TouchPosition | null>(null)
  const isDraggingRef = useRef(false)

  const getPosition = useCallback((e: MouseEvent | TouchEvent): TouchPosition => {
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    }
    else if ('clientX' in e) {
      return {
        x: e.clientX,
        y: e.clientY,
      }
    }
    return { x: 0, y: 0 }
  }, [])

  const getDelta = useCallback((current: TouchPosition, last: TouchPosition | null): TouchPosition => {
    if (!last)
      return { x: 0, y: 0 }
    return {
      x: current.x - last.x,
      y: current.y - last.y,
    }
  }, [])

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
      e.stopPropagation()
    }

    const position = getPosition(e.nativeEvent)
    lastPositionRef.current = position
    isDraggingRef.current = true

    onStart?.(position)
  }, [getPosition, onStart, preventDefault])

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingRef.current)
      return

    if (preventDefault) {
      e.preventDefault()
    }

    const position = getPosition(e)
    const delta = getDelta(position, lastPositionRef.current)
    lastPositionRef.current = position

    onMove?.(position, delta)
  }, [getPosition, getDelta, onMove, preventDefault])

  const handleEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingRef.current)
      return

    if (preventDefault) {
      e.preventDefault()
    }

    const position = getPosition(e)
    isDraggingRef.current = false
    lastPositionRef.current = null

    onEnd?.(position)
  }, [getPosition, onEnd, preventDefault])

  const bindEvents = useCallback(() => {
    const moveHandler = (e: MouseEvent | TouchEvent) => handleMove(e)
    const endHandler = (e: MouseEvent | TouchEvent) => handleEnd(e)

    // 添加事件监听器
    document.addEventListener('mousemove', moveHandler, { passive })
    document.addEventListener('mouseup', endHandler, { passive })
    document.addEventListener('touchmove', moveHandler, { passive })
    document.addEventListener('touchend', endHandler, { passive })

    // 返回清理函数
    return () => {
      document.removeEventListener('mousemove', moveHandler)
      document.removeEventListener('mouseup', endHandler)
      document.removeEventListener('touchmove', moveHandler)
      document.removeEventListener('touchend', endHandler)
    }
  }, [handleMove, handleEnd, passive])

  return {
    onMouseDown: handleStart,
    onTouchStart: handleStart,
    bindEvents,
  }
}

/**
 * 检测是否为移动设备
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined')
    return false

  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || ('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0)
  )
}

/**
 * 检测是否为触摸设备
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined')
    return false

  return (
    ('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0)
    // @ts-ignore
    || (window.DocumentTouch && document instanceof window.DocumentTouch)
  )
}
