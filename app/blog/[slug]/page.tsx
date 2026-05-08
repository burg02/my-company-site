import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .single()

  if (!post) return { title: 'Post Not Found — Nevertheless' }
  return {
    title: `${post.title} — Nevertheless`,
    description: post.excerpt || 'Blog post by Nevertheless',
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    })

  return (
    <main className="bg-white text-zinc-900 font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em] uppercase">Nevertheless</Link>
          <div className="hidden md:flex items-center gap-8">
            {([['About', '/about'], ['Events', '/events'], ['Blog', '/blog'], ['Gallery', '/gallery'], ['Contact', '/contact']] as [string, string][]).map(([label, href]) => (
              <Link key={href} href={href} className={`text-xs tracking-widest uppercase transition-colors ${href === '/blog' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-16">
        <div className="relative min-h-[50vh] flex flex-col justify-end overflow-hidden bg-zinc-900">
          {post.cover_image && (
            <div className="absolute inset-0">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative max-w-4xl mx-auto px-6 py-16 w-full">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs tracking-widest uppercase transition-colors mb-8">
              ← All Posts
            </Link>
            {post.category && (
              <div className="mb-4">
                <span className="inline-block text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 bg-white/20 text-white font-medium">
                  {post.category}
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {post.title}
            </h1>
            <p className="text-white/60 text-sm mt-4">{formatDate(post.created_at)}</p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          {post.excerpt && (
            <p className="text-xl text-zinc-500 leading-relaxed mb-12 pb-12 border-b border-zinc-100 font-light">
              {post.excerpt}
            </p>
          )}
          <div className="prose prose-zinc max-w-none">
            {post.content?.split('\n').map((paragraph: string, i: number) =>
              paragraph.trim() ? (
                <p key={i} className="text-base text-zinc-700 leading-relaxed mb-6">{paragraph}</p>
              ) : (
                <br key={i} />
              )
            )}
          </div>
        </div>
      </section>

      {/* BACK */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/blog" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors">
            ← Back to Blog
          </Link>
          <Link href="/contact" className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-700 transition-colors">
            Get In Touch
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-900">Nevertheless</Link>
          <p className="text-[10px] text-zinc-300">© {new Date().getFullYear()} Nevertheless</p>
        </div>
      </footer>
    </main>
  )
}
