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
  const { data: event } = await supabase
    .from('events')
    .select('title, description')
    .eq('slug', slug)
    .single()

  if (!event) return { title: 'Event Not Found — Nevertheless' }
  return {
    title: `${event.title} — Nevertheless`,
    description: event.description || 'Event by Nevertheless',
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!event) notFound()

  const { data: speakers } = await supabase
    .from('speakers')
    .select('*')
    .eq('event_id', event.id)
    .order('created_at', { ascending: true })

  const accent = event.accent_color || '#18181b'

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    })

  return (
    <main className="bg-white text-zinc-900 font-sans">
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

      <section className="pt-16">
        <div className="relative min-h-[65vh] flex flex-col justify-end overflow-hidden" style={{ backgroundColor: accent }}>
          {event.hero_image && (
            <div className="absolute inset-0">
              <img src={event.hero_image} alt={event.title} className="w-full h-full object-cover opacity-25" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="relative max-w-6xl mx-auto px-6 py-20 w-full">
            <Link href="/events" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs tracking-widest uppercase transition-colors mb-8">
              ← All Events
            </Link>
            <div className="mb-6">
              <span className="inline-block text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 text-white font-medium" style={{ backgroundColor: `${accent}cc` }}>
                {event.is_upcoming ? 'Upcoming' : 'Past Event'}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight max-w-4xl" style={{ fontFamily: 'Georgia, serif' }}>
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
            <div className="py-8 md:pr-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-2">Date</p>
              <p className="text-sm font-medium text-zinc-900">{formatDate(event.event_date)}</p>
            </div>
            {event.event_time && (
              <div className="py-8 md:px-8">
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-2">Time</p>
                <p className="text-sm font-medium text-zinc-900">{event.event_time}</p>
              </div>
            )}
            {event.location && (
              <div className="py-8 md:pl-8">
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-2">Location</p>
                <p className="text-sm font-medium text-zinc-900">{event.location}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {event.description && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-zinc-100" />
                <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 shrink-0">About This Event</p>
                <div className="h-px flex-1 bg-zinc-100" />
              </div>
              <p className="text-lg text-zinc-600 leading-relaxed">{event.description}</p>
            </div>
          </div>
        </section>
      )}

      <div className="h-1 w-full" style={{ backgroundColor: accent }} />

      {speakers && speakers.length > 0 && (
        <section className="py-24 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-14">
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-3">— Speakers</p>
              <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Meet the speakers.
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {speakers.map((speaker) => (
                <div key={speaker.id} className="group">
                  <div className="aspect-square overflow-hidden bg-zinc-200 mb-4">
                    {speaker.image_url ? (
                      <img src={speaker.image_url} alt={speaker.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: accent }}>
                        {speaker.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="h-0.5 w-8 mb-3 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: accent }} />
                  <p className="text-sm font-semibold text-zinc-900">{speaker.name}</p>
                  {speaker.position && <p className="text-xs text-zinc-400 mt-0.5">{speaker.position}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24" style={{ backgroundColor: accent }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Interested in attending?
          </h2>
          <p className="text-white/70 mb-10 max-w-md mx-auto text-sm leading-relaxed">
            Get in touch with us to learn more about this event and how to register.
          </p>
          <Link href="/contact" className="inline-block bg-white text-zinc-900 text-xs tracking-widest uppercase px-10 py-4 hover:bg-zinc-100 transition-colors">
            Contact Us
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-900">Nevertheless</Link>
          <Link href="/events" className="text-[10px] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors">← Back to Events</Link>
          <p className="text-[10px] text-zinc-300">© {new Date().getFullYear()} Nevertheless</p>
        </div>
      </footer>
    </main>
  )
}
