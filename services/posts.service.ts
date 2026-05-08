import { supabase } from '@/lib/supabase'

export type Post = {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export type PostInput = Omit<Post, 'id' | 'created_at' | 'updated_at'>

export const postsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async create(post: PostInput) {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select()
      .single()
    return { data, error }
  },

  async update(id: string, post: Partial<PostInput>) {
    const { data, error } = await supabase
      .from('posts')
      .update({ ...post, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    return { error }
  },
}
