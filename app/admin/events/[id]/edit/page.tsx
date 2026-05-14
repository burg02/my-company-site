import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import EventForm from '@/components/events/EventForm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Update params to be a Promise
export default async function EditEventPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await params here
  const { id } = await params;

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) notFound()

  const { data: speakers } = await supabase
    .from('speakers')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">Events</p>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Edit Event</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Update the details for <span className="text-zinc-700">{event.title}</span>
        </p>
      </div>
      <EventForm
        mode="edit"
        eventId={event.id}
        defaultValues={{
          title: event.title,
          description: event.description || '',
          location: event.location || '',
          event_date: event.event_date,
          event_time: event.event_time || '',
          is_upcoming: event.is_upcoming ? 'true' : 'false',
          accent_color: event.accent_color || '#18181b',
          existing_hero_url: event.hero_image || '',
          speakers: (speakers || []).map((s) => ({
          name: s.name,
          position: s.position || '',
          image: null as any,
          existing_image: s.image_url || '',
  })),
        }}
      />
    </div>
  )
}
