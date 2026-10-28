import { motion } from 'framer-motion'
import { STATS } from '../data/team'
import { SITE_NAME } from '../data/site'
import usePageMeta from '../lib/usePageMeta'
import FillImage from '../components/ui/FillImage'
import CategoryMarquee from '../components/ui/CategoryMarquee'
import { EASE } from '../lib/motion'
import CTASection from '../components/ui/CTASection'
import TimelineSection from '../components/about/TimelineSection'
import useIsMobile from '../lib/useIsMobile'

const fadeUp = (y, delay = 0) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.85, delay, ease: EASE },
})

function MissionBlock({ num, label, title, body }) {
  return (
    <>
      <div>
        <span style={{ display: 'block', fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: '#F2E4C2', lineHeight: 1, marginBottom: '10px' }}>{num}</span>
        <span style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(242,228,194,0.3)', marginBottom: '20px' }}>{label}</span>
        <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 400, color: '#F2E4C2', lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ paddingTop: '6px' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px, 1.1vw, 17px)', fontWeight: 300, color: 'rgba(242,228,194,0.45)', lineHeight: 1.85, margin: 0 }}>{body}</p>
      </div>
    </>
  )
}

export default function About() {
  usePageMeta(
    `About ${SITE_NAME} | AI Content Studio for Global Brands`,
    `${SITE_NAME} is an AI-native content studio for global brands. We build AI-native film, brand films, micro dramas, animation and social content, every frame in-house.`,
  )
  const isMobile = useIsMobile()
  // Mission and history sit side by side on desktop and stack on phones.
  const missionGrid = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '24px 0' : '0 clamp(40px, 6vw, 120px)', alignItems: 'start' }

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans overflow-x-hidden antialiased">
      {/* Hero quote + studio */}
      <section className="w-full min-h-screen flex flex-col">
        <div className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
          <FillImage src="/posters/surreal-vfx-hero.webp" alt="" priority className="object-cover object-[center_40%]" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to bottom, transparent, #080808)' }} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE }} className="relative z-10 max-w-3xl px-6 text-center mt-14 md:mt-20">
            <h1 className="text-2xl md:text-[1.75rem] font-normal leading-[1.5] tracking-tight text-white/90" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
              “We saw the entire world of production changing in real time. The only question was, are you going to watch it happen, or are you going to build what comes next?”
            </h1>
          </motion.div>
        </div>

        <div className="flex-1 px-8 md:px-16 py-12 md:py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center h-full">
            <div className="w-full h-[38vh] md:h-[42vh] relative overflow-hidden">
              <FillImage src="/posters/showreel-hero.webp" alt={`${SITE_NAME} showreel end card`} className="object-cover object-center" />
              <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.7), transparent)' }}>
                <div className="h-px bg-white/10 mb-3" />
                <p className="text-xs uppercase tracking-[0.25em] text-white/30">The Studio</p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-5">
              <motion.p {...fadeUp(20)} className="text-xl md:text-2xl font-medium leading-snug">
                {SITE_NAME} was built on a shared conviction, that AI is rewriting the content space, so we decided to write it ourselves.
              </motion.p>
              <motion.p {...fadeUp(16, 0.1)} className="text-base text-white/50 font-light leading-relaxed">
                A tech-integrated studio with teams in the USA and India, bringing marketing and technology together at the precise intersection where storytelling meets artificial intelligence.
              </motion.p>
              <motion.p {...fadeUp(16, 0.2)} className="text-base text-white/50 font-light leading-relaxed">
                We don't assist productions. We lead them. With capabilities spanning brand films, performance marketing, micro dramas, animation, social content and cinematic productions, every video we make is AI-native, from concept to final frame. Work that couldn't have existed any other way.
              </motion.p>
              <motion.div {...fadeUp(12, 0.3)} className="pt-2 space-y-1">
                <p className="text-xs uppercase tracking-[0.15em] text-white/30 mb-2">Where We Work</p>
                <p className="text-sm text-white/50">Wilmington, Delaware, USA</p>
                <p className="text-sm text-white/50">India</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats + category strip */}
      <section className="w-full border-t border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-8 mb-0">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.85, delay: 0.1 * i, ease: EASE }}
                style={{ padding: 'clamp(48px, 7vh, 88px) clamp(24px, 4vw, 56px)', borderRight: 'none', display: 'flex', flexDirection: 'column', gap: '18px' }}
              >
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(242,228,194,0.6)', fontWeight: 600 }}>{stat.label}</span>
                <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(56px, 7vw, 100px)', fontWeight: 400, color: '#F2E4C2', lineHeight: 1, letterSpacing: '-0.03em' }}>{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div
          className="relative w-full overflow-hidden py-10"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          }}
        >
          <CategoryMarquee size="clamp(22px, 2.6vw, 40px)" duration={44} />
        </div>
      </section>

      {/* Mission + history */}
      <section style={{ width: '100%', backgroundColor: '#080808', padding: 'clamp(80px, 10vw, 140px) clamp(24px, 8vw, 120px) clamp(24px, 3vw, 36px)' }}>
        <div style={{ ...missionGrid, paddingBottom: 'clamp(64px, 8vw, 100px)', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 'clamp(64px, 8vw, 100px)' }}>
          <MissionBlock
            num="01"
            label="Focus"
            title="Our mission"
            body={`We exist to prove that the best videos in the world don't have to cost the most or take the longest. AI-native production is not a shortcut, it's a new standard. At ${SITE_NAME}, we push every frame, every story, and every brief toward what's now possible, not what was previously practical.`}
          />
        </div>
        <div style={missionGrid}>
          <MissionBlock
            num="02"
            label="Looking Back"
            title="Our History"
            body="Our journey began with a simple but bold hypothesis: offline, traditional production is being replaced, and the studios that understand AI first will define the next decade of visual storytelling."
          />
        </div>
      </section>

      <TimelineSection />

      <CTASection />
    </div>
  )
}
