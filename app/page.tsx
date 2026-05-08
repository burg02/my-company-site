import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function HomePage() {
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_upcoming', true)
    .order('event_date', { ascending: true })
    .limit(3)

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: gallery } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    })

  return (
    <main className="bg-white text-zinc-900 font-sans">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em] uppercase">
            Nevertheless
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {([['About', '/about'], ['Events', '/events'], ['Blog', '/blog'], ['Gallery', '/gallery'], ['Contact', '/contact']] as [string, string][]).map(([label, href]) => (
              <Link key={href} href={href} className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
<section className="pt-16 min-h-screen flex flex-col justify-center relative overflow-hidden bg-black">
  {/* 1. The Background Image with low opacity */}
 <div 
  className="absolute inset-0 z-0 opacity-30" 
  style={{ 
    backgroundImage: "url('/images/hero-bg.jpg')", 
    backgroundSize: 'cover',        // This stretches the image to fill the screen
    backgroundPosition: 'center',  // This centers the image
    backgroundRepeat: 'no-repeat'  // This stops the tiling/repeating
  }} 
/>
  
  {/* 2. Dark Gradient Overlay to ensure text readability */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10" />

  {/* 3. Content Layer */}
  <div className="max-w-6xl mx-auto px-6 py-32 relative z-20">
    <div className="max-w-3xl">
      <p className="text-[10px] tracking-[0.4em] uppercase text-blue-400 mb-8">— Corporate Excellence</p>
      
      {/* Updated heading colors to match your reference: White with an Orange/Gold accent */}
      <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tight text-white mb-10">
        Where <span className="text-orange-500">Strategy</span> Meets Precision.
      </h1>
      
      <p className="text-lg text-zinc-300 max-w-2xl leading-relaxed mb-12">
        Our bespoke events are curated with intent, designed to bring together high-level leaders for strategic dialogue and industry-shaping outcomes.
      </p>
      
      <div className="flex items-center gap-6">
        <Link href="/events" className="bg-white text-black text-xs font-bold tracking-widest uppercase px-8 py-4 hover:bg-zinc-200 transition-colors">
          Explore Events
        </Link>
        <Link href="/about" className="text-xs tracking-widest uppercase text-white hover:text-orange-500 transition-colors flex items-center gap-2">
          About Us <span>→</span>
        </Link>
      </div>
    </div>
  </div>

  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
    <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/30" />
    <p className="text-[9px] tracking-[0.3em] uppercase text-white/30">Scroll</p>
  </div>
</section>


      {/* STATS */}
      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols- md:grid-cols-4 gap-8">
          {[{ value: '50+', label: 'Events Hosted' }, { value: '5K+', label: 'Attendees' }, { value: '12+', label: 'Industries' }, { value: '8+', label: 'Years Running' }].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-zinc-900" style={{ fontFamily: 'Georgia, serif' }}>{stat.value}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-3">— What's Coming</p>
              <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Upcoming Events</h2>
            </div>
            <Link href="/events" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors hidden md:block">All Events →</Link>
          </div>

          {!events || events.length === 0 ? (
            <div className="border border-dashed border-zinc-200 p-16 text-center">
              <p className="text-sm text-zinc-400">Events coming soon. Stay tuned.</p>
            </div>
          ) : (
            <div className="space-y-px">
              {events.map((event, i) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group flex items-center gap-8 p-8 bg-zinc-50 hover:bg-zinc-900 transition-colors duration-300 block"
                >
                  <div className="w-16 text-center shrink-0">
                    <p className="text-2xl font-bold group-hover:text-white transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                      {String(i + 1).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 group-hover:text-zinc-500 mb-1 transition-colors">
                      {formatDate(event.event_date)}{event.location ? ` · ${event.location}` : ''}
                    </p>
                    <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-white transition-colors truncate">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-zinc-500 group-hover:text-zinc-400 mt-1 transition-colors line-clamp-1">{event.description}</p>
                    )}
                  </div>
                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs tracking-widest uppercase text-white">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LATEST BLOG */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-3">— Ideas & Insights</p>
              <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Latest Posts</h2>
            </div>
            <Link href="/blog" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors hidden md:block">All Posts →</Link>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="border border-dashed border-zinc-200 p-16 text-center">
              <p className="text-sm text-zinc-400">Blog posts coming soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-px bg-zinc-200">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="bg-zinc-50 p-8 hover:bg-white transition-colors group block">
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden mb-6 bg-zinc-200">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-3">{formatDate(post.created_at)}</p>
                  <h3 className="text-base font-semibold text-zinc-900 leading-snug mb-3">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">{post.excerpt}</p>}
                  <span className="inline-block mt-5 text-[10px] tracking-widest uppercase text-zinc-400 group-hover:text-zinc-900 transition-colors">Read more →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY */}
      {gallery && gallery.length > 0 && (
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-3">— Moments</p>
                <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Gallery</h2>
              </div>
              <Link href="/gallery" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors hidden md:block">View All →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {gallery.map((item) => (
                <div key={item.id} className="aspect-square overflow-hidden bg-zinc-100 group">
                  <img src={item.image_url} alt={item.title || 'Gallery'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-32 bg-zinc-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 mb-6">— Get In Touch</p>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Let's build something<br /><span className="italic font-normal">remarkable.</span>
          </h2>
          <p className="text-zinc-400 text-base max-w-md mx-auto mb-12 leading-relaxed">
            Whether you're interested in partnering, attending an event, or just want to say hello — we'd love to hear from you.
          </p>
          <Link href="/contact" className="inline-block bg-white text-zinc-900 text-xs tracking-widest uppercase px-10 py-5 hover:bg-zinc-100 transition-colors">
            Contact Us
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-900">Nevertheless</p>
          <div className="flex items-center gap-8">
            {(['About', 'Events', 'Blog', 'Gallery', 'Contact'] as string[]).map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-[10px] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors">
                {item}
              </Link>
            ))}
          </div>
          <p className="text-[10px] text-zinc-300">© {new Date().getFullYear()} Nevertheless</p>
        </div>
      </footer>
    </main>
  )
}
