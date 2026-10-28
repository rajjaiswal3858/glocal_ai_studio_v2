import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { PROJECTS, getProject } from '../data/projects'
import { CASE_STUDIES, CATEGORY_OVERRIDE, CATEGORY_SERVICE } from '../data/caseStudies'
import { SITE_URL, SITE_NAME, WORDMARK } from '../data/site'
import { videoSrc } from '../lib/media'
import usePageMeta from '../lib/usePageMeta'
import { EASE } from '../lib/motion'
import useIsMobile from '../lib/useIsMobile'
import FillImage from '../components/ui/FillImage'
import LazyVideo from '../components/ui/LazyVideo'
import CalendlyLink from '../components/ui/CalendlyLink'
import ShareButtons from '../components/ui/ShareButtons'
import NotFound from './NotFound'

/** Rotating gold badge pinned to the right edge of the viewport. */
function SpinningBadge() {
  // On phones it drops to the bottom corner and shrinks so it doesn't sit on top of the copy.
  const isMobile = useIsMobile()
  const size = isMobile ? '40px' : '52px'
  return (
    <motion.div style={isMobile ? { position: 'fixed', right: '16px', bottom: '16px', zIndex: 50, pointerEvents: 'none' } : { position: 'fixed', right: '20px', top: '50%', translateY: '-50%', zIndex: 50, pointerEvents: 'none' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{ width: size, height: size, backgroundColor: '#DCAB59', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg width={isMobile ? 22 : 28} height={isMobile ? 22 : 28} viewBox="0 0 28 28" fill="none">
          <path d="M14 2L15.5 10.5L22 7L17.5 13L26 14L17.5 15L22 21L15.5 17.5L14 26L12.5 17.5L6 21L10.5 15L2 14L10.5 13L6 7L12.5 10.5Z" fill="#000000" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

export default function WorkProject() {
  const { slug } = useParams()
  const project = getProject(slug)
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  usePageMeta(project ? `${project.title}, ${project.client} | ${SITE_NAME}` : `Work | ${SITE_NAME}`, CASE_STUDIES[slug]?.overview ?? project?.brief)

  if (!project) return <NotFound />

  const study = CASE_STUDIES[project.slug]
  const service = CATEGORY_SERVICE[CATEGORY_OVERRIDE[project.slug] ?? project.category]
  const blocks = study
    ? [
        { label: 'Overview', text: study.overview, highlight: false },
        { label: 'The challenge', text: study.challenge, highlight: false },
        { label: 'What we made', text: study.made, highlight: false },
        { label: 'The AI craft', text: study.craft, highlight: false },
        ...(study.result ? [{ label: 'The result', text: study.result, highlight: true }] : []),
      ]
    : []
  const others = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3)
  const verticalPlayer = project.playerVertical ?? project.vertical
  const shareTitle = `${project.title} — ${project.client}`

  return (
    <>
      <SpinningBadge />

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000000', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {/* Phones: the whole 16:9 frame sits near the top over a blurred fill, clear of the title. */}
          <img
            src={project.heroPoster ?? project.poster}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="md:hidden"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(28px) brightness(0.7)', transform: 'scale(1.2)' }}
          />
          <FillImage src={project.heroPoster ?? project.poster} alt={project.title} sizes="100vw" priority className="object-cover object-center max-md:object-contain max-md:object-[center_12%]" style={{ opacity: 0.92 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.88) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(80px, 8vw, 120px) clamp(28px, 6vw, 72px) clamp(48px, 6vh, 72px)' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }} style={{ marginBottom: '32px' }}>
            <img src={WORDMARK} alt={SITE_NAME} width={800} height={202} decoding="async" style={{ height: '26px', width: 'auto', opacity: 0.85 }} />
          </motion.div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '700px', flex: '1 1 400px' }}>
              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: EASE }}
                style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 700, color: '#F2E4C2', letterSpacing: '-0.025em', lineHeight: 0.92, marginBottom: '20px' }}
              >
                <span style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(13px, 1.1vw, 16px)', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#DCAB59', lineHeight: 1.2, marginBottom: '14px' }}>
                  {project.client}
                </span>
                <span style={{ display: 'block', fontSize: 'clamp(52px, 8vw, 110px)' }}>{project.title}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(242,228,194,0.5)', marginBottom: '24px' }}
              >
                {project.category}
                {'  |  '}
                {project.year}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px, 1.1vw, 17px)', fontWeight: 300, color: 'rgba(242,228,194,0.65)', lineHeight: 1.75, maxWidth: '520px' }}
              >
                {project.brief}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px', flex: '0 0 auto' }}
            >
              <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(36px, 4.5vw, 72px)', fontWeight: 700, fontStyle: 'italic', color: 'rgba(242,228,194,0.55)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                #{project.category.toLowerCase().replace(/ /g, '-')}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Player */}
      <section ref={sectionRef} style={{ backgroundColor: '#000000', padding: 'clamp(48px, 6vw, 80px) clamp(28px, 6vw, 80px)' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: EASE }} style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', padding: '0 4px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/favicon-192.png" alt="" width={22} height={22} decoding="async" style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500, color: '#F2E4C2', lineHeight: 1.3, margin: 0 }}>{project.title} — {project.client}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'rgba(242,228,194,0.35)', margin: 0, marginTop: '2px' }}>{SITE_NAME} · {project.year}</p>
            </div>
          </div>

          {verticalPlayer ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 'min(420px, 100%)', aspectRatio: '9 / 16', backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', position: 'relative' }}>
                <LazyVideo controls src={videoSrc(project.video, '1080')} poster={project.poster} title={shareTitle} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundColor: '#000' }} />
              </div>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <LazyVideo controls src={videoSrc(project.video, '1080')} poster={project.poster} title={shareTitle} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundColor: '#000' }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            {project.tags.map((tag) => (
              <span key={tag} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(242,228,194,0.25)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 12px' }}>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Narrative */}
      {blocks.length > 0 && (
        <section style={{ backgroundColor: '#000000', padding: 'clamp(48px, 7vw, 96px) clamp(28px, 6vw, 80px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(30px, 4vw, 52px)' }}>
            {blocks.map((block, i) => (
              <motion.div
                key={block.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.06 * i, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: block.highlight ? '#DCAB59' : 'rgba(255,255,255,0.35)', margin: 0 }}>{block.label}</h2>
                <p
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: block.highlight ? 'clamp(22px, 2.4vw, 32px)' : 'clamp(18px, 1.8vw, 24px)',
                    fontWeight: block.highlight ? 700 : 400,
                    color: block.highlight ? '#FFFFFF' : 'rgba(255,255,255,0.8)',
                    lineHeight: 1.45,
                    letterSpacing: '-0.01em',
                    margin: 0,
                  }}
                >
                  {block.text}
                </p>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: EASE }} style={{ paddingTop: '8px' }}>
              <Link
                to={service.href}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#DCAB59', textDecoration: 'none', borderBottom: '1px solid rgba(220,171,89,0.35)', paddingBottom: '3px' }}
              >
                Explore our {service.label} →
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* More work */}
      {others.length > 0 && (
        <section style={{ backgroundColor: '#080808', padding: 'clamp(60px, 8vw, 100px) clamp(28px, 6vw, 80px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(32px, 4vh, 48px)', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, color: '#F2E4C2', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>More Work</h2>
              <Link
                to="/work"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,228,194,0.35)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F2E4C2')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(242,228,194,0.35)')}
              >
                View All →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2px' }}>
              {others.map((p) => (
                <Link key={p.slug} to={`/work/${p.slug}`} style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden' }} className="group">
                  <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', backgroundColor: '#0A0A0A' }}>
                    <FillImage
                      src={p.poster}
                      alt={p.title}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      style={{ transition: 'transform 0.7s ease', transform: 'scale(1)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px' }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(242,228,194,0.4)', marginBottom: '4px' }}>{p.client}</p>
                      <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(18px, 1.6vw, 24px)', fontWeight: 700, color: '#F2E4C2', letterSpacing: '-0.01em', lineHeight: 1.1, margin: 0 }}>{p.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section style={{ backgroundColor: '#F5F4F0', padding: 'clamp(80px, 10vw, 130px) clamp(28px, 6vw, 80px)', textAlign: 'center', borderTop: '1px solid rgba(8,8,8,0.07)' }}>
        <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 700, fontStyle: 'italic', color: '#3B2A12', letterSpacing: '-0.025em', lineHeight: 1, marginBottom: '16px' }}>
          Ready to create something cinematic?
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px, 1vw, 17px)', fontWeight: 300, color: 'rgba(59,42,18,0.45)', marginBottom: '40px', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          Brief us on your project and we'll come back with ideas within 24 hours.
        </p>
        <CalendlyLink
          ctaLocation="work_project"
          style={{ display: 'inline-block', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F2E4C2', backgroundColor: '#080808', padding: '18px 48px', textDecoration: 'none', transition: 'opacity 0.25s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Schedule a Call
        </CalendlyLink>
        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
          <ShareButtons title={shareTitle} url={`${SITE_URL}/work/${project.slug}`} contentType="case_study" itemId={project.slug} tone="light" />
        </div>
      </section>
    </>
  )
}
