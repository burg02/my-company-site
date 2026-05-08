import EventForm from '@/components/events/EventForm'

export default function NewEventPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">Events</p>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">New Event</h1>
        <p className="text-sm text-zinc-400 mt-1">Fill in the details to create a new event.</p>
      </div>
      <EventForm mode="create" />
    </div>
  )
}
