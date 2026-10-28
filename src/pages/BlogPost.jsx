import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { BLOG_POSTS, getPost } from '../data/blogPosts'
import { SITE_URL } from '../data/site'
import usePageMeta from '../lib/usePageMeta'
import { FadeInUp, StaggerContainer, StaggerItem } from '../components/ui/Motion'
import { staggerItemVariants } from '../lib/motion'
import FillImage from '../components/ui/FillImage'
import ShareButtons from '../components/ui/ShareButtons'
import CTASection from '../components/ui/CTASection'
import NotFound from './NotFound'

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="font-display font-bold text-white text-2xl md:text-3xl tracking-[-0.01em] mt-6 mb-2 leading-[1.2]">{block.text}</h2>
    case 'h3':
      return <h3 className="font-display font-bold text-white text-xl tracking-[-0.01em] mt-4 mb-1 leading-[1.3]">{block.text}</h3>
    case 'quote':
      return (
        <blockquote className="border-l-2 border-white/20 pl-6 py-2 my-4">
          <p className="font-display font-bold italic text-white/70 text-xl md:text-2xl leading-relaxed tracking-[-0.01em]">{block.text}</p>
        </blockquote>
      )
    default:
      return <p className="font-body text-white/60 text-base leading-[1.8]">{block.text}</p>
  }
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)
  usePageMeta(post ? `${post.title} | Glocal AI Studio` : 'Journal | Glocal AI Studio', post?.excerpt)
  if (!post) return <NotFound />

  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <div className="bg-bg-primary pt-28 pb-0">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <FadeInUp>
            <Link to="/blog" className="inline-flex items-center gap-2 font-body text-white/30 hover:text-white text-xs uppercase tracking-[0.18em] transition-colors duration-300">
              <ArrowLeft size={13} strokeWidth={1.5} />
              All Articles
            </Link>
          </FadeInUp>
        </div>
      </div>

      <header className="bg-bg-primary pt-12 pb-0">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <FadeInUp>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
              <span className="font-body text-white/20 text-xs uppercase tracking-[0.18em] border border-white/[0.08] px-3 py-1">{post.category}</span>
              <span className="font-body text-white/20 text-xs whitespace-nowrap">By Glocal AI Studio</span>
              <span className="font-body text-white/20 text-xs whitespace-nowrap">{post.date}</span>
              <span className="font-body text-white/20 text-xs whitespace-nowrap">{post.readTime}</span>
            </div>
            <h1 className="font-display font-bold text-white text-3xl md:text-5xl tracking-[-0.02em] leading-[1.1] mb-6">{post.title}</h1>
            <p className="font-body text-white/40 text-lg leading-relaxed max-w-2xl">{post.excerpt}</p>
          </FadeInUp>
        </div>
        <div className="mt-12 relative aspect-[16/7] overflow-hidden">
          <FillImage src={post.poster} alt={post.title} priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </header>

      <article className="bg-bg-secondary py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-6 md:px-10">
          <StaggerContainer className="flex flex-col gap-6">
            {post.content.map((block, i) => (
              <StaggerItem key={i} variants={staggerItemVariants}>
                <Block block={block} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="mt-16 pt-8 border-t border-white/[0.07]">
            <ShareButtons title={post.title} url={`${SITE_URL}/blog/${post.slug}`} contentType="article" itemId={post.slug} />
          </div>
        </div>
      </article>

      <section className="bg-bg-primary py-20 md:py-28 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeInUp className="mb-10">
            <h2 className="font-display font-bold text-white text-2xl">More from the Journal</h2>
          </FadeInUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05]">
            {more.map((p) => (
              <StaggerItem key={p.slug} variants={staggerItemVariants} className="bg-bg-primary">
                <Link to={`/blog/${p.slug}`} className="group block">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <FillImage src={p.poster} alt={p.title} sizes="100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  </div>
                  <div className="p-5">
                    <p className="font-body text-white/20 text-xs uppercase tracking-[0.15em] mb-2">{p.category}</p>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display font-bold text-white text-base leading-[1.3] group-hover:text-white/60 transition-colors duration-300">{p.title}</h3>
                      <ArrowUpRight size={13} strokeWidth={1.5} className="text-white/20 group-hover:text-white transition-colors duration-300 shrink-0 mt-0.5" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CTASection />
    </>
  )
}
