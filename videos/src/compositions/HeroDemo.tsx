import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

/**
 * Placeholder hero — akan diganti animasi mock UI Foto Space di M4
 * (jendela app → foto masuk grid → progress upload → sukses → loop).
 *
 * Palet warna mengikuti app (dark #0d0d0d, primary coral #ff6363).
 */
export const HeroDemo: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const title = spring({ frame, fps, from: 0, to: 1, config: { damping: 200 } })
  const subtitle = spring({ frame: frame - 15, fps, from: 0, to: 1, config: { damping: 200 } })
  const glow = interpolate(frame, [0, durationInFrames / 2, durationInFrames], [0.35, 0.65, 0.35])
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0d0d0d',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,99,99,0.28) 0%, rgba(255,99,99,0) 70%)',
          opacity: glow,
        }}
      />
      <h1
        style={{
          color: '#ffffff',
          fontSize: 140,
          fontWeight: 700,
          letterSpacing: -4,
          transform: `translateY(${interpolate(title, [0, 1], [40, 0])}px)`,
          opacity: title,
          margin: 0,
        }}
      >
        Foto Space
      </h1>
      <p
        style={{
          color: '#7b7b7b',
          fontSize: 40,
          marginTop: 24,
          transform: `translateY(${interpolate(subtitle, [0, 1], [24, 0])}px)`,
          opacity: subtitle,
        }}
      >
        Upload ribuan foto event ke FotoYu, otomatis.
      </p>
    </AbsoluteFill>
  )
}
