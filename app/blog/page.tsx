import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const featured = posts?.[0]
  const rest = posts?.slice(1) ?? []

  return (
    <main className="bg-white text-zinc-900 font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em] uppercase">Nevertheless</Link>
          <div className="hidden md:flex items-center gap-8">
            {[['About', '/about'], ['Events', '/events'], ['Blog', '/blog'], ['Gallery', '/gallery'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={href} href={href} className={`text-xs tracking-widest uppercase transition-colors ${href === '/blog' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}>{label}</Link>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-16 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-4">— Blog</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none" style={{ fontFamily: 'Georgia, serif' }}>
            Ideas &<br /><span className="italic font-normal">Insights.</span>
          </h1>
        </div>
      </section>

      {!posts || posts.length === 0 ? (
        <section className="py-32">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-sm text-zinc-400">No posts published yet. Check back soon.</p>
          </div>
        </section>
      ) : (
        <>
          {/* FEATURED POST */}
          {featured && (
            <section className="py-20 border-b border-zinc-100">
              <div className="max-w-6xl mx-auto px-6">
                <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-8">— Featured</p>
                <Link href={`/blog/${featured.slug}`} className="group block md:grid md:grid-cols-2 gap-16 items-center">
                  {featured.cover_image && (
                    <div className="aspect-video overflow-hidden bg-zinc-100 mb-8 md:mb-0">
                      <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className={featured.cover_image ? '' : 'md:col-span-2 max-w-2xl'}>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-4">{formatDate(featured.created_at)}</p>
                    <h2 className="text-4xl font-bold leading-snug tracking-tight group-hover:text-zinc-600 transition-colors mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                      {featured.title}
                    </h2>
                    {featured.excerpt && <p className="text-base text-zinc-500 leading-relaxed mb-6">{featured.excerpt}</p>}
                    <span className="text-xs tracking-widest uppercase text-zinc-400 group-hover:text-zinc-900 transition-colors">Read more →</span>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* REST OF POSTS */}
          {rest.length > 0 && (
            <section className="py-20">
              <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {rest.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                      {post.cover_image && (
                        <div className="aspect-video overflow-hidden bg-zinc-100 mb-5">
                          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                      )}
                      <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-3">{formatDate(post.created_at)}</p>
                      <h3 className="text-lg font-semibold leading-snug group-hover:text-zinc-500 transition-colors mb-2">{post.title}</h3>
                      {post.excerpt && <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">{post.excerpt}</p>}
                      <span className="inline-block mt-4 text-[10px] tracking-widest uppercase text-zinc-400 group-hover:text-zinc-900 transition-colors">Read →</span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

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
