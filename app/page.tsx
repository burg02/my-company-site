import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export const revalidate = 0
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function HomePage() {
  const { data: events } = await supabase
    .from('events').select('*').eq('is_upcoming', true)
    .order('event_date', { ascending: true }).limit(3)

  const { data: posts } = await supabase
    .from('posts').select('*').eq('published', true)
    .order('created_at', { ascending: false }).limit(3)

  const { data: gallery } = await supabase
    .from('albums').select('*')
    .order('created_at', { ascending: false }).limit(6)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <main className="bg-white text-zinc-900 font-sans">
      <Navbar />

      {/* HERO */}
      <section className="pt-16 min-h-screen flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "url('/images/press-conference-event-stockcake.jpg')", 
              backgroundSize: 'cover',        // This stretches the image to fill the screen
               backgroundPosition: 'center',  // This centers the image
                backgroundRepeat: 'no-repeat'  // This stops the tiling/repeating
        }} />
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-6 md:mb-8">— Corporate Excellence</p>
            <h1 className="text-5xl md:text-8xl font-bold leading-[0.95] tracking-tight text-zinc-900 mb-8 md:mb-10" style={{ fontFamily: 'Georgia, serif' }}>
              Moving<br /><span className="italic font-normal">forward,</span><br />together.
            </h1>
            <p className="text-base text-zinc-500 max-w-md leading-relaxed mb-10 md:mb-12">
              Nevertheless is a corporate platform connecting leaders, curating events, and sharing ideas that drive meaningful progress.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Link href="/events" className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-8 py-4 hover:bg-zinc-700 transition-colors w-full sm:w-auto text-center">
                Explore Events
              </Link>
              <Link href="/about" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2">
                About Us <span>→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden md:flex">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-zinc-300" />
          <p className="text-[9px] tracking-[0.3em] uppercase text-zinc-300">Scroll</p>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: '50+', label: 'Events Hosted' },
            { value: '5K+', label: 'Attendees' },
            { value: '12+', label: 'Industries' },
            { value: '8+', label: 'Years Running' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-zinc-900" style={{ fontFamily: 'Georgia, serif' }}>{stat.value}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-2 md:mb-3">— What's Coming</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Upcoming Events</h2>
            </div>
            <Link href="/events" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors shrink-0 ml-4">
              All →
            </Link>
          </div>

          {!events || events.length === 0 ? (
            <div className="border border-dashed border-zinc-200 p-12 text-center">
              <p className="text-sm text-zinc-400">Events coming soon.</p>
            </div>
          ) : (
            <div className="space-y-px">
              {events.map((event, i) => (
                <Link key={event.id} href={`/events/${event.slug}`}
                  className="group flex items-start gap-4 md:gap-8 p-5 md:p-8 bg-zinc-50 hover:bg-zinc-900 transition-colors duration-300 block">
                  <div className="w-8 md:w-16 shrink-0 pt-0.5">
                    <p className="text-lg md:text-2xl font-bold group-hover:text-white transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                      {String(i + 1).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 group-hover:text-zinc-500 mb-1 transition-colors">
                      {formatDate(event.event_date)}{event.location ? ` · ${event.location}` : ''}
                    </p>
                    <h3 className="text-base md:text-lg font-semibold text-zinc-900 group-hover:text-white transition-colors">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-zinc-500 group-hover:text-zinc-400 mt-1 transition-colors line-clamp-1 hidden sm:block">{event.description}</p>
                    )}
                  </div>
                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pt-1 hidden sm:block">
                    <span className="text-xs tracking-widest uppercase text-white">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LATEST BLOG */}
      {posts && posts.length > 0 && (
        <section className="py-16 md:py-24 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10 md:mb-14">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-2 md:mb-3">— Ideas & Insights</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Latest Posts</h2>
              </div>
              <Link href="/blog" className="text-xs tracking-widests uppercase text-zinc-400 hover:text-zinc-900 transition-colors shrink-0 ml-4">All →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-zinc-200">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="bg-zinc-50 p-6 md:p-8 hover:bg-white transition-colors group block">
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden mb-5 bg-zinc-200">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-2">{formatDate(post.created_at)}</p>
                  <h3 className="text-sm md:text-base font-semibold text-zinc-900 leading-snug mb-2">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{post.excerpt}</p>}
                  <span className="inline-block mt-4 text-[10px] tracking-widests uppercase text-zinc-400 group-hover:text-zinc-900 transition-colors">Read →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery && gallery.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10 md:mb-14">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-2 md:mb-3">— Moments</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Gallery</h2>
              </div>
              <Link href="/gallery" className="text-xs tracking-widests uppercase text-zinc-400 hover:text-zinc-900 transition-colors shrink-0 ml-4">All →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {gallery.map((album) => (
                <Link key={album.id} href={`/gallery/${album.id}`} className="aspect-square overflow-hidden bg-zinc-100 group block relative">
                  {album.cover_image ? (
                    <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-200">
                      <p className="text-zinc-400 text-xs">No cover</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                    <p className="text-white text-xs font-medium px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity truncate">{album.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-32 bg-zinc-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 mb-6">— Get In Touch</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Let's build something<br /><span className="italic font-normal">remarkable.</span>
          </h2>
          <p className="text-zinc-400 text-base max-w-md mx-auto mb-10 md:mb-12 leading-relaxed">
            Whether you're interested in partnering, attending an event, or just want to say hello — we'd love to hear from you.
          </p>
          <Link href="/contact" className="inline-block bg-white text-zinc-900 text-xs tracking-widests uppercase px-8 md:px-10 py-4 md:py-5 hover:bg-zinc-100 transition-colors">
            Contact Us
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-900">Nevertheless</p>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
              {['About', 'Events', 'Blog', 'Gallery', 'Contact'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="text-[10px] tracking-widests uppercase text-zinc-400 hover:text-zinc-900 transition-colors">
                  {item}
                </Link>
              ))}
            </div>
            <p className="text-[10px] text-zinc-300">© {new Date().getFullYear()} Nevertheless</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
