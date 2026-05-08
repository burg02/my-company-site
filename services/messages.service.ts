import { supabase } from '@/lib/supabase'

export type Message = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

export const messagesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async markAsRead(id: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
    return { error }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)
    return { error }
  },
}
