import { supabase } from '@/lib/supabase'

export type Event = {
  id: string
  title: string
  description: string | null
  location: string | null
  event_date: string
  event_time: string | null
  is_upcoming: boolean
  image_url: string | null
  created_at: string
}

export type EventInput = Omit<Event, 'id' | 'created_at'>

export const eventsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false })
    return { data, error }
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async create(event: EventInput) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single()
    return { data, error }
  },

  async update(id: string, event: Partial<EventInput>) {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    return { error }
  },
}
