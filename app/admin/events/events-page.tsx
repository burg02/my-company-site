'use client'

import { useEffect, useState } from 'react'
import { eventsService, type Event } from '@/services/events.service'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'upcoming' | 'past' | 'all'>('upcoming')

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    const { data } = await eventsService.getAll()
    setEvents(data ?? [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    await eventsService.delete(id)
    loadEvents()
  }

  const filtered = events.filter((e) => {
    if (tab === 'upcoming') return e.is_upcoming
    if (tab === 'past') return !e.is_upcoming
    return true
  })

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">Nevertheless</p>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Events</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage upcoming and past events.</p>
        </div>
        <a
          href="/admin/events/new"
          className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-5 py-3 hover:bg-zinc-700 transition-colors"
        >
          + Add Event
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-zinc-100">
        {(['upcoming', 'past', 'all'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs tracking-wide pb-3 border-b-2 transition-colors capitalize ${
              tab === t
                ? 'border-zinc-900 text-zinc-900 font-medium'
                : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-xs text-zinc-400 py-8">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-zinc-200 p-16 text-center">
          <p className="text-4xl mb-4">◈</p>
          <p className="text-sm font-medium text-zinc-900 mb-1">No events yet</p>
          <p className="text-xs text-zinc-400 mb-6">Create your first event to get started.</p>
          <a
            href="/admin/events/new"
            className="inline-block bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-700 transition-colors"
          >
            Create Event
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-zinc-100 p-5 flex items-center justify-between hover:border-zinc-300 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-zinc-900">{event.title}</p>
                  <span
                    className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${
                      event.is_upcoming
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {event.is_upcoming ? 'Upcoming' : 'Past'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  {formatDate(event.event_date)}
                  {event.location && ` · ${event.location}`}
                </p>
                {event.description && (
                  <p className="text-xs text-zinc-300 line-clamp-1">{event.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <a
                  href={`/admin/events/${event.id}/edit`}
                  className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
