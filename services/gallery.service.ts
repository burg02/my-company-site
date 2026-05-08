import { supabase } from '@/lib/supabase'

export type GalleryItem = {
  id: string
  title: string | null
  image_url: string
  description: string | null
  created_at: string
}

export type GalleryInput = Omit<GalleryItem, 'id' | 'created_at'>

export const galleryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async create(item: GalleryInput) {
    const { data, error } = await supabase
      .from('gallery')
      .insert([item])
      .select()
      .single()
    return { data, error }
  },

  async update(id: string, item: Partial<GalleryInput>) {
    const { data, error } = await supabase
      .from('gallery')
      .update(item)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id)
    return { error }
  },
}
