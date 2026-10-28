import { useEffect, useRef } from 'react'

/** Ambient fill resolution: the whole frame, tiny, then stretched and blurred by CSS. */
const FILL_W = 48
const FILL_H = 27
const FILL_INTERVAL = 80

/**
 * Feathers the top and bottom edges of the centred 16:9 band (56.25vw tall on a
 * portrait screen) so the sharp frame melts into the fill instead of ending on a line.
 */
const BAND = 'calc(50% - 28.125vw)'
const BAND_END = 'calc(50% + 28.125vw)'
const FEATHER = `linear-gradient(to bottom, transparent ${BAND}, #000 calc(${BAND} + 36px), #000 calc(${BAND_END} - 36px), transparent ${BAND_END})`

/**
 * Full-bleed wrapper for a 16:9 <video> on portrait screens. The child video
 * is shown whole (object-fit: contain) and a soft glow sampled from the entire
 * playing frame fills the rest of the screen, so nothing is cropped and there
 * are no flat bars. The glow is painted from the same <video>, so the clip is
 * only downloaded and decoded once. Until playback starts it shows `poster`.
 */
export default function FullFrameMedia({ poster, children }) {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const video = boxRef.current?.querySelector('video')
    const ctx = canvasRef.current?.getContext('2d')
    if (!video || !ctx) return undefined
    const draw = () => {
      if (video.readyState >= 2 && !video.paused && !document.hidden) ctx.drawImage(video, 0, 0, FILL_W, FILL_H)
    }
    video.addEventListener('loadeddata', draw)
    const timer = setInterval(draw, FILL_INTERVAL)
    return () => {
      clearInterval(timer)
      video.removeEventListener('loadeddata', draw)
    }
  }, [])

  return (
    <div ref={boxRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        width={FILL_W}
        height={FILL_H}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: `url(${poster}) center / 100% 100%`,
          filter: 'blur(28px) brightness(1.15) saturate(1.25)',
          transform: 'scale(1.25)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: FEATHER, maskImage: FEATHER }}>{children}</div>
    </div>
  )
}
