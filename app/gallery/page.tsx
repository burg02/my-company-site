import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function GalleryPage() {
  const { data: albums } = await supabase
    .from('albums')
    .select('*, photos(count)')
    .order('event_date', { ascending: false })

  const tags = ['All', ...Array.from(new Set(albums?.map((a) => a.tag).filter(Boolean) ?? []))]

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <main className="bg-white text-zinc-900 font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em] uppercase">Nevertheless</Link>
          <div className="hidden md:flex items-center gap-8">
            {([['About', '/about'], ['Events', '/events'], ['Blog', '/blog'], ['Gallery', '/gallery'], ['Contact', '/contact']] as [string, string][]).map(([label, href]) => (
              <Link key={href} href={href} className={`text-xs tracking-widests uppercase transition-colors ${href === '/gallery' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}>{label}</Link>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-16 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-4">— Gallery</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Moments<br /><span className="italic font-normal">captured.</span>
          </h1>
          <p className="text-base text-zinc-500 max-w-lg leading-relaxed">
            Every image tells a story of meaningful exchange, bold leadership, and ideas in action. Explore our collection of moments from exclusive events and executive conversations.
          </p>
        </div>
      </section>

      {/* ALBUMS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          {!albums || albums.length === 0 ? (
            <div className="border border-dashed border-zinc-200 p-24 text-center">
              <p className="text-sm text-zinc-400">Gallery coming soon.</p>
            </div>
          ) : (
            <div className="space-y-px">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/gallery/${album.id}`}
                  className="group flex items-center gap-8 p-6 bg-zinc-50 hover:bg-zinc-900 transition-colors duration-300 block"
                >
                  {/* Thumbnail */}
                  <div className="w-32 h-20 shrink-0 overflow-hidden bg-zinc-200">
                    {album.cover_image ? (
                      <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-zinc-400 text-xs">No cover</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {album.tag && (
                      <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-zinc-400 group-hover:text-zinc-500 mb-1 transition-colors">
                        {album.tag}
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-white transition-colors truncate">
                      {album.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      {album.event_date && (
                        <p className="text-xs text-zinc-400 group-hover:text-zinc-500 transition-colors">
                          {formatDate(album.event_date)}
                        </p>
                      )}
                      <p className="text-xs text-zinc-300 group-hover:text-zinc-500 transition-colors">
                        {(album.photos as any)?.[0]?.count ?? 0} photos
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs tracking-widests uppercase text-white border border-white/30 px-4 py-2">
                      View Album →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-900">Nevertheless</Link>
          <p className="text-[10px] text-zinc-300">© {new Date().getFullYear()} Nevertheless</p>
        </div>
      </footer>
    </main>
  )
}
