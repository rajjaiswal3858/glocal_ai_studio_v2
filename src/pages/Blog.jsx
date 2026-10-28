import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { BLOG_POSTS } from '../data/blogPosts'
import usePageMeta from '../lib/usePageMeta'
import { FadeInUp, StaggerContainer, StaggerItem, TextReveal } from '../components/ui/Motion'
import { staggerItemVariants } from '../lib/motion'
import FillImage from '../components/ui/FillImage'
import CTASection from '../components/ui/CTASection'

function BlogList({ posts }) {
  const featured = posts.find((p) => p.featured)
  const categories = useMemo(() => ['All', ...Array.from(new Set(posts.map((p) => p.category)))], [posts])
  const [active, setActive] = useState('All')
  const visible = active === 'All' ? posts.filter((p) => !p.featured) : posts.filter((p) => p.category === active)

  return (
    <>
      {active === 'All' && featured && (
        <section className="bg-bg-secondary border-t border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
            <FadeInUp>
              <Link to={`/blog/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <FillImage src={featured.poster} alt={featured.title} priority className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                </div>
                <div className="bg-bg-primary border border-white/[0.05] border-l-0 p-8 md:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-body text-white/30 text-xs uppercase tracking-[0.18em] border border-white/10 px-3 py-1">{featured.category}</span>
                      <span className="font-body text-white/20 text-xs">Featured</span>
                    </div>
                    <h2 className="font-display font-bold text-white text-2xl md:text-3xl tracking-[-0.01em] leading-[1.15] mb-4 group-hover:text-white/70 transition-colors duration-300">{featured.title}</h2>
                    <p className="font-body text-white/40 text-sm leading-relaxed">{featured.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-white/[0.05]">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 min-w-0">
                      <span className="font-body text-white/20 text-xs whitespace-nowrap">By Glocal AI Studio</span>
                      <span className="font-body text-white/20 text-xs whitespace-nowrap">{featured.date}</span>
                      <span className="font-body text-white/20 text-xs whitespace-nowrap">{featured.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.18em] text-white/30 group-hover:text-white transition-colors duration-300">
                      Read
                      <ArrowUpRight size={12} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeInUp>
          </div>
        </section>
      )}

      <section className="bg-bg-primary py-20 md:py-28 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`font-body text-xs uppercase tracking-[0.18em] px-4 py-2 border transition-colors duration-300 ${
                  active === c ? 'bg-white text-[#3B2A12] border-white' : 'text-white/40 border-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <StaggerContainer key={active} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
            {visible.map((post) => (
              <StaggerItem key={post.slug} variants={staggerItemVariants} className="bg-bg-primary">
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <FillImage src={post.poster} alt={post.title} className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  </div>
                  <div className="p-6 md:p-7">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-body text-white/20 text-[10px] uppercase tracking-[0.18em] border border-white/[0.08] px-2.5 py-1">{post.category}</span>
                    </div>
                    <h3 className="font-display font-bold text-white text-lg leading-[1.25] mb-3 group-hover:text-white/60 transition-colors duration-300">{post.title}</h3>
                    <p className="font-body text-white/30 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-white/[0.05]">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                        <span className="font-body text-white/20 text-xs whitespace-nowrap">By Glocal AI Studio</span>
                        <span className="font-body text-white/20 text-xs whitespace-nowrap">{post.date}</span>
                        <span className="font-body text-white/20 text-xs whitespace-nowrap">{post.readTime}</span>
                      </div>
                      <ArrowUpRight size={12} strokeWidth={1.5} className="text-white/20 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  )
}

export default function Blog() {
  usePageMeta(
    'The Glocal Journal | AI Video & Brand Content Insights',
    'Ideas on AI video production, brand storytelling & the creative economy in India — playbooks, industry analysis and operating notes from the studio.',
  )
  return (
    <>
      <section className="bg-bg-primary pt-40 pb-24 md:pt-48 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeInUp>
            <span className="accent-line" />
            <span className="section-label block mb-6">The Glocal Journal</span>
          </FadeInUp>
          <h1 style={{ display: 'contents' }} aria-label="Thinking out loud.">
            <TextReveal text="Thinking out loud." className="font-display font-bold text-display text-white tracking-[-0.025em] leading-[0.95]" stagger={0.08} />
          </h1>
          <FadeInUp className="mt-8 max-w-xl">
            <p className="font-body text-white/40 text-lg leading-relaxed">Ideas on AI production, brand storytelling, and the creative economy in India.</p>
          </FadeInUp>
        </div>
      </section>
      <BlogList posts={BLOG_POSTS} />
      <CTASection />
    </>
  )
}
