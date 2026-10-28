import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TIMELINE } from '../../data/team'
import FillImage from '../ui/FillImage'
import useIsMobile from '../../lib/useIsMobile'

gsap.registerPlugin(ScrollTrigger)

/** Pinned horizontal timeline: vertical scroll is translated into a sideways pan. */
export default function TimelineSection() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  // Phones get wider, shorter cards so the copy isn't squeezed into a sliver.
  const isMobile = useIsMobile()

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    const ctx = gsap.context(() => {
      const distance = () => -(track.scrollWidth - window.innerWidth)
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.abs(distance())}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          gsap.set(track, { x: distance() * self.progress })
        },
      })
      return () => trigger.kill()
    }, section)
    return () => ctx.revert()
  }, [isMobile])

  return (
    <div ref={sectionRef} style={{ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#080808', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div ref={trackRef} style={{ display: 'flex', gap: 'clamp(32px, 4vw, 64px)', paddingLeft: 'clamp(24px, 5vw, 80px)', paddingRight: isMobile ? '11vw' : 'clamp(48vw, 52vw, 56vw)', willChange: 'transform', flexShrink: 0 }}>
        {TIMELINE.map((item) => (
          <div key={item.year} style={{ flexShrink: 0, width: isMobile ? '78vw' : '44vw', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', width: '100%', height: isMobile ? '34vh' : '52vh', overflow: 'hidden', backgroundColor: '#111', marginBottom: isMobile ? '20px' : '28px' }}>
              <FillImage src={item.img} alt={item.title} sizes={isMobile ? '78vw' : '44vw'} className="object-cover" />
            </div>
            <div style={{ paddingRight: isMobile ? 0 : 'clamp(24px, 3vw, 48px)' }}>
              <span style={{ display: 'block', fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(32px, 3.5vw, 52px)', fontWeight: 700, color: '#F2E4C2', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '14px' }}>
                {item.year}
              </span>
              <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(18px, 1.6vw, 24px)', fontWeight: 400, color: 'rgba(242,228,194,0.75)', letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: '16px' }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(13px, 0.95vw, 15px)', fontWeight: 300, color: 'rgba(242,228,194,0.35)', lineHeight: 1.8, margin: 0 }}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
