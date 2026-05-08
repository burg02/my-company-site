import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function EventsPage() {
  const { data: upcoming } = await supabase
    .from('events')
    .select('*')
    .eq('is_upcoming', true)
    .order('event_date', { ascending: true })

  const { data: past } = await supabase
    .from('events')
    .select('*')
    .eq('is_upcoming', false)
    .order('event_date', { ascending: false })

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    })

  return (
    <main className="bg-white text-zinc-900 font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em] uppercase">Nevertheless</Link>
          <div className="hidden md:flex items-center gap-8">
            {([['About', '/about'], ['Events', '/events'], ['Blog', '/blog'], ['Gallery', '/gallery'], ['Contact', '/contact']] as [string, string][]).map(([label, href]) => (
              <Link key={href} href={href} className={`text-xs tracking-widest uppercase transition-colors ${href === '/events' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-16 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-4">— Events</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none" style={{ fontFamily: 'Georgia, serif' }}>
            Experiences<br /><span className="italic font-normal">worth attending.</span>
          </h1>
        </div>
      </section>

      {/* UPCOMING */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-10">— Upcoming Events</p>
          {!upcoming || upcoming.length === 0 ? (
            <div className="border border-dashed border-zinc-200 p-16 text-center">
              <p className="text-sm text-zinc-400">No upcoming events at this time. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-px">
              {upcoming.map((event, i) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group flex items-start gap-8 p-8 bg-zinc-50 hover:bg-zinc-900 transition-colors duration-300 block"
                >
                  <div className="w-12 shrink-0 pt-1">
                    <p className="text-xl font-bold group-hover:text-white transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                      {String(i + 1).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                      <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 group-hover:text-zinc-500 transition-colors">
                        {formatDate(event.event_date)}
                      </p>
                      {event.location && (
                        <>
                          <span className="text-zinc-300">·</span>
                          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 group-hover:text-zinc-500 transition-colors">{event.location}</p>
                        </>
                      )}
                      {event.event_time && (
                        <>
                          <span className="text-zinc-300">·</span>
                          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 group-hover:text-zinc-500 transition-colors">{event.event_time}</p>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-white transition-colors">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-zinc-500 group-hover:text-zinc-400 mt-2 transition-colors leading-relaxed line-clamp-2 max-w-2xl">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div
                    className="w-1 self-stretch shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    style={{ backgroundColor: event.accent_color || '#18181b' }}
                  />
                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                    <span className="text-xs tracking-widest uppercase text-white">Details →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PAST */}
      {past && past.length > 0 && (
        <section className="py-24 bg-zinc-50 border-t border-zinc-100">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-10">— Past Events</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200">
              {past.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="bg-zinc-50 p-8 hover:bg-white transition-colors group block"
                >
                  {event.hero_image && (
                    <div className="aspect-video overflow-hidden bg-zinc-200 mb-5">
                      <img src={event.hero_image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-300 mb-3">{formatDate(event.event_date)}</p>
                  <h3 className="text-base font-semibold text-zinc-600 group-hover:text-zinc-900 transition-colors">{event.title}</h3>
                  {event.location && <p className="text-xs text-zinc-400 mt-1">{event.location}</p>}
                  <span className="inline-block mt-4 text-[10px] tracking-widest uppercase text-zinc-300 group-hover:text-zinc-600 transition-colors">View →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
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
