import {
  ALL_FORMATS,
  BlobSource,
  CanvasSink,
  Input,
} from 'mediabunny'
import { useEffect, useRef, useState } from 'react'

export function TimelineThumbnail({
  file,
}: {
  file: File
}) {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  })
  const domRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!domRef.current) {
      return
    }
    const updateFn = () => {
      if (domRef.current) {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setSize({
          width: domRef.current.offsetWidth,
          height: domRef.current.offsetHeight,
        })
      }
    }
    const observer = new MutationObserver(updateFn)
    observer.observe(domRef.current, {
      attributes: true,
      attributeFilter: ['style'],
    })
    updateFn()
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) {
          return
        }
        if (!size.width || !size.height) {
          return
        }
        const input = new Input({
          formats: ALL_FORMATS,
          source: new BlobSource(file),
        })
        const videoTrack = await input.getPrimaryVideoTrack()
        if (!videoTrack) {
          return
        }
        const decodable = await videoTrack.canDecode()
        if (!decodable) {
          throw new Error('Video track is not decodable')
        }
        const sink = new CanvasSink(videoTrack, {
          height: size.height,
        })
        const startTimestamp = await videoTrack.getFirstTimestamp()
        const endTimestamp = await videoTrack.computeDuration()

        // 根据画布宽度计算需要的缩略图数量
        const thumbnailCount = Math.max(1, Math.floor(size.width / size.height))

        // 计算每个缩略图之间的时间间隔
        const timeStep = (endTimestamp - startTimestamp) / thumbnailCount

        // 生成缩略图时间点列表
        const timestamps = Array.from(
          { length: thumbnailCount },
          (_, i) => (i * timeStep + startTimestamp) / endTimestamp,
        )

        let count = 0
        for await (const result of sink.canvasesAtTimestamps(timestamps)) {
          const canvas = result?.canvas
          if (!canvas) {
            continue
          }

          const x = (count++) * canvas.width
          ctx.drawImage(canvas, x, 0, canvas.width, canvas.height)
        }
      }
      finally {
        setIsLoading(false)
      }
    })()
  }, [file, size.width, size.height])

  return (
    <div ref={domRef} className="w-full h-full absolute top-0 left-0">
      <canvas
        width={size.width}
        height={size.height}
        className="w-full h-full"
        ref={canvasRef}
        style={{
          opacity: isLoading ? 0.5 : 1,
        }}
      />
    </div>
  )
}
