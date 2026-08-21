import React from 'react'
import { Composition } from 'remotion'
import { HeroDemo } from './compositions/HeroDemo'

/**
 * Daftar komposisi video Foto Space.
 * Render contoh:
 *   npx remotion render HeroDemo --codec vp8 --output ../public/demo/hero.webm
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroDemo"
        component={HeroDemo}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  )
}
