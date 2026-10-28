import { useEffect, useRef } from 'react'
import useIsMobile from '../../lib/useIsMobile'
import LazyVideo from '../ui/LazyVideo'
import FullFrameMedia from '../ui/FullFrameMedia'
import { posterSrc, videoSrc } from '../../lib/media'
/**
 * 5x alpha-only mask built from /glocal-logo.png: the logo is scaled up to 5.5x
 * here, so the 600px original would show pixelated edges.
 */
const LOGO_MASK = '/glocal-logo-mask.png'

/** The brushed-steel Möbius loop plays inside the logo silhouette. */
const MASK_VIDEO = 'kinetic-sculpture'
/** Full-bleed clip that plays behind the manifesto line once the logo has dissolved. */
const BG_VIDEO = 'fashion'

/** Text colour runs from the cream-page brown to the champagne used on dark sections. */
const TEXT_DARK = [59, 42, 18]
const TEXT_LIGHT = [242, 228, 194]

/** Manifesto copy, one entry per line (line breaks only apply from md up). */
const LINES = ['An AI studio built for the GenAI era,', 'reimagining how visionary artists create films,', 'series, and new forms of storytelling.']
const WORDS = LINES.flatMap((line, li) => line.split(' ').map((word) => ({ word, line: li })))

/** Scroll progress at which the gold line is fully drawn. */
const LINE_DRAWN = 0.9
/** Extra scroll (px, roughly 1 cm) past the fully drawn line before it fades out. */
const LINE_FADE_AFTER = 40

const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (v) => Math.max(0, Math.min(1, v))
const range = (start, end, v) => clamp01((v - start) / (end - start))

const maskStyle = {
  WebkitMaskImage: `url(${LOGO_MASK})`,
  maskImage: `url(${LOGO_MASK})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
}

/**
 * Sticky logo mask that scales up and fades out as you scroll, revealing the
 * manifesto line underneath. Progress is read straight from scroll position
 * and also drives the word-by-word reveal, the line and the background video.
 */
export default function ManifestoSection() {
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const maskRef = useRef(null)
  const lineRef = useRef(null)
  const bgRef = useRef(null)
  const textRef = useRef(null)
  const wordRefs = useRef([])
  const isMobile = useIsMobile()

  useEffect(() => {
    let lastColor = ''
    const update = () => {
      const section = sectionRef.current
      const sticky = stickyRef.current
      const mask = maskRef.current
      const line = lineRef.current
      const bg = bgRef.current
      const text = textRef.current
      if (!section || !sticky || !mask || !line || !bg || !text) return
      // The sticky frame's height (100vh) stays fixed while a phone's address bar
      // shows and hides, unlike window.innerHeight, so progress never jumps mid-scroll.
      const vh = sticky.offsetHeight
      const rect = section.getBoundingClientRect()
      // Nothing to animate while the section is off screen.
      if (rect.bottom < -vh || rect.top > vh * 2) return
      const progress = clamp01(-rect.top / (section.offsetHeight - vh))
      const small = window.innerWidth < 768
      const maxScale = small ? 3.5 : 5.5
      const maxLift = small ? -400 : -900
      const scale = lerp(1, maxScale, range(0, 0.5, progress))
      const y = lerp(0, maxLift, range(0.15, 0.6, progress))
      const opacity = lerp(1, 0, range(0.28, 0.5, progress))
      mask.style.transform = `translateY(${y}px) scale(${scale})`
      mask.style.opacity = String(opacity)

      // Words brighten one after another while the logo is dissolving away.
      const n = wordRefs.current.length
      wordRefs.current.forEach((el, i) => {
        if (!el) return
        const start = 0.3 + (i / n) * 0.3
        const t = range(start, start + 0.1, progress)
        el.style.opacity = String(lerp(0.14, 1, t))
        el.style.transform = `translateY(${lerp(10, 0, t)}px)`
      })

      // The background clip is uncovered as the logo dissolves, settling from a slow zoom.
      const uncover = range(0.28, 0.5, progress)
      // Phones skip the zoom so the whole uncropped frame stays in view.
      bg.style.transform = `scale(${small ? 1 : lerp(1.12, 1, range(0.28, 0.8, progress))})`
      // Text turns from dark brown to champagne so it stays readable over the video.
      // Recolouring repaints the shadowed text, so only do it when the colour actually changes.
      const color = `rgb(${TEXT_DARK.map((c, k) => Math.round(lerp(c, TEXT_LIGHT[k], uncover))).join(',')})`
      if (color !== lastColor) {
        text.style.color = color
        lastColor = color
      }

      // The gold line draws down beneath the sentence (scaleY avoids a layout per frame).
      line.style.height = `${Math.min(160, vh * 0.18)}px`
      line.style.transform = `scaleY(${range(0.62, LINE_DRAWN, progress)})`
      // Once it is fully drawn, a little more scrolling fades it out on a timed transition.
      const drawnAt = LINE_DRAWN * (section.offsetHeight - vh)
      line.style.opacity = -rect.top > drawnAt + LINE_FADE_AFTER ? '0' : '1'
    }
    // Coalesce scroll events into one update per frame.
    let frame = 0
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <section ref={sectionRef} style={{ backgroundColor: '#F5F4F0', height: isMobile ? '260vh' : '340vh', position: 'relative' }}>
      <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Background video, the same treatment as the homepage hero. */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundColor: '#080808', overflow: 'hidden' }}>
          <div ref={bgRef} style={{ position: 'absolute', inset: 0, transform: 'scale(1.12)', willChange: 'transform' }}>
            {isMobile ? (
              // Phones: the whole, uncropped 16:9 frame inside an ambient fill.
              <FullFrameMedia poster={posterSrc(BG_VIDEO, 'hero')}>
                <LazyVideo
                  persistent
                  src={videoSrc(BG_VIDEO, '720')}
                  poster={posterSrc(BG_VIDEO, 'hero')}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', opacity: 0.85 }}
                />
              </FullFrameMedia>
            ) : (
              <LazyVideo
                persistent
                src={videoSrc(BG_VIDEO, '1080')}
                poster={posterSrc(BG_VIDEO, 'hero')}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />
            )}
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,8,0.45) 0%, rgba(8,8,8,0.35) 50%, rgba(8,8,8,0.6) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(8,8,8,0.35) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '180px', background: 'linear-gradient(to bottom, transparent, #080808)' }} />
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(64px, 9vh, 96px) clamp(32px, 6vw, 96px) clamp(24px, 4vh, 48px)',
          }}
        >
          <p
            ref={textRef}
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: isMobile ? 'clamp(22px, 5.5vw, 63px)' : 'clamp(18px, 3.4vw, 54px)',
              color: '#3B2A12',
              lineHeight: 1.4,
              fontWeight: 400,
              letterSpacing: '-0.01em',
              textAlign: 'center',
              whiteSpace: 'normal',
              textShadow: '0 2px 24px rgba(8,8,8,0.35)',
            }}
          >
            {WORDS.map((w, i) => (
              <span key={i}>
                {i > 0 && WORDS[i - 1].line !== w.line && <br className="hidden md:block" />}
                <span ref={(el) => (wordRefs.current[i] = el)} style={{ display: 'inline-block', opacity: 0.14, willChange: 'opacity, transform' }}>
                  {w.word}
                </span>{' '}
              </span>
            ))}
          </p>

          <div ref={lineRef} style={{ width: '1.5px', height: '0px', transform: 'scaleY(0)', transformOrigin: 'top', transition: 'opacity 0.6s ease', marginTop: 'clamp(20px, 3.5vh, 40px)', background: 'linear-gradient(to bottom, rgba(220,171,89,0.2), #DCAB59)' }} />

        </div>

        <div
          ref={maskRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            backgroundColor: '#F5F4F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformOrigin: 'center center',
            // Desktop skips will-change: it freezes the layer as a scale(1) bitmap that is then stretched up to 5.5x.
            // Phones need it: re-rasterising the masked video at every scale step is what made scrolling stutter,
            // and the logo has faded out before the softer GPU scaling becomes noticeable.
            willChange: isMobile ? 'transform, opacity' : undefined,
          }}
        >
          <div
            style={{
              width: isMobile ? 'min(84vw, 520px)' : 'min(62vw, 900px)',
              aspectRatio: '1689 / 838',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#080808',
              ...maskStyle,
            }}
          >
            <LazyVideo
              persistent
              src={videoSrc(MASK_VIDEO, isMobile ? '720' : '1080')}
              poster={posterSrc(MASK_VIDEO, isMobile ? undefined : 'hero')}
              style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', minWidth: '178%', transform: 'translate(-50%, -50%)', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
