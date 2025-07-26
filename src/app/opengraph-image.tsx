import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Video Tools - Professional Online Video Processing'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
              fontSize: 40,
            }}
          >
            🎬
          </div>
          <div style={{ fontSize: 64, fontWeight: 'bold' }}>
            Video Tools
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Professional Online Video Processing Tools
        </div>
        <div
          style={{
            fontSize: 20,
            color: '#64748b',
            marginTop: 20,
            display: 'flex',
            gap: 20,
          }}
        >
          <span>Video ↔ GIF</span>
          <span>•</span>
          <span>Compression</span>
          <span>•</span>
          <span>Editing</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
