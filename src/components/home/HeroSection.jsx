import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CalendlyLink from '../ui/CalendlyLink'
import FullFrameMedia from '../ui/FullFrameMedia'
import useIsMobile from '../../lib/useIsMobile'
import { videoSrc } from '../../lib/media'
import { SITE_TAGLINE } from '../../data/site'

/** First-paint frame of the hero clip (also the LCP image). */
const POSTER = '/posters/final-shot-1-1920.webp'

const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Full-bleed 16:9 cover sizing shared by the poster and the video. */
const coverStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '177.78vh',
  minWidth: '100%',
  height: '56.25vw',
  minHeight: '100%',
  transform: 'translate(-50%, -50%)',
  opacity: 0.85,
  pointerEvents: 'none',
  objectFit: 'cover',
}

/** Phones: the whole 16:9 frame, uncropped, inside FullFrameMedia's ambient fill. */
const fitStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  opacity: 0.85,
  pointerEvents: 'none',
  objectFit: 'contain',
}

const EASE = [0.4, 0, 0.2, 1]

export default function HeroSection() {
  const isMobile = useIsMobile()
  // Phones get the 720p muted rendition; everything else the 1080p muted hero cut.
  const src = videoSrc('final-shot-1', isMobile ? '720' : 'hero')
  // Once the video is actually rendering frames, drop the poster underneath it.
  // The video sits at 85% opacity, so leaving the poster (the GLOCAL logo card)
  // behind it bleeds a faint watermark through the footage.
  const [playing, setPlaying] = useState(false)

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: '#080808' }}>
      {isMobile ? (
        <FullFrameMedia poster={POSTER}>
          {REDUCED_MOTION ? (
            <img src={POSTER} alt="" aria-hidden="true" fetchPriority="high" decoding="async" style={fitStyle} />
          ) : (
            <video
              key={src}
              src={src}
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              tabIndex={-1}
              style={fitStyle}
            />
          )}
        </FullFrameMedia>
      ) : (
        <img
          src={POSTER}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          style={{ ...coverStyle, opacity: playing ? 0 : coverStyle.opacity, transition: 'opacity 0.6s ease' }}
        />
      )}
      {!REDUCED_MOTION && !isMobile && (
        <video
          key={src}
          src={src}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          style={coverStyle}
        />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.1) 50%, rgba(8,8,8,0.55) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '180px', background: 'linear-gradient(to bottom, transparent, #080808)', pointerEvents: 'none', zIndex: 5 }} />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-[11px] tracking-[0.25em] uppercase mb-6 md:mb-10"
          style={{ color: 'rgba(242,228,194,0.85)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
        >
          {SITE_TAGLINE}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="font-display font-bold leading-[1.05] tracking-[-0.02em] mb-5 md:mb-8"
          style={{ fontSize: 'clamp(42px, 6.5vw, 96px)', color: '#F2E4C2' }}
        >
          AI video for brands that <em style={{ fontStyle: 'italic', color: 'rgba(242,228,194,0.7)' }}>intend to win.</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          className="text-sm md:text-lg leading-relaxed mb-8 md:mb-12 max-w-xs md:max-w-lg"
          style={{ color: 'rgba(242,228,194,0.75)', fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
        >
          Brand films, performance ads and social content for global brands. Cinema quality in 5–7 days — not three months.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <Link
            to="/work"
            className="px-7 py-3 text-sm tracking-wide transition-all duration-300 hover:opacity-80 w-full sm:w-auto text-center"
            style={{ backgroundColor: '#F5F5F0', color: '#3B2A12', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
          >
            View Our Work
          </Link>
          <CalendlyLink
            ctaLocation="hero"
            className="px-7 py-3 text-sm tracking-wide w-full sm:w-auto text-center"
            style={{
              backgroundColor: '#DCAB59',
              color: '#3B2A12',
              borderRadius: '9999px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              border: '1px solid rgba(220,171,89,0.6)',
              boxShadow: '0 0 14px rgba(220,171,89,0.45), 0 0 4px rgba(220,171,89,0.3)',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E9C36D'
              e.currentTarget.style.boxShadow = '0 0 28px rgba(220,171,89,0.85), 0 0 10px rgba(220,171,89,0.6), 0 0 4px rgba(255,210,120,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#DCAB59'
              e.currentTarget.style.boxShadow = '0 0 14px rgba(220,171,89,0.45), 0 0 4px rgba(220,171,89,0.3)'
            }}
          >
            Schedule a Call
          </CalendlyLink>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.7, ease: EASE }} className="mt-6 md:mt-8">
          <Link
            to="/work/showreel"
            className="inline-flex items-center gap-2 py-2 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
            style={{ color: 'rgba(242,228,194,0.55)', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#DCAB59')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(242,228,194,0.55)')}
          >
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
              <path d="M1 1L9 6L1 11V1Z" fill="currentColor" />
            </svg>
            Watch the showreel with sound
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <motion.div
          className="w-px"
          style={{ height: '40px', background: 'rgba(255,255,255,0.2)', transformOrigin: 'top' }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(242,228,194,0.25)', fontFamily: "'DM Sans', sans-serif" }}>
          Scroll
        </span>
      </motion.div>
    </section>
  )
}
