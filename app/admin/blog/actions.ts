'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUCKET = 'blog-assets'

async function uploadFile(file: File, folder: string): Promise<string | null> {
  const supabase = getSupabase()
  if (!file || file.size === 0) return null
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, { upsert: false })
  if (error) { console.error('Upload error:', error); return null }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
  return data.publicUrl
}

export async function createPost(formData: FormData) {
  const supabase = getSupabase()
  const title = formData.get('title') as string
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now()

  const coverFile = formData.get('cover_image') as File
  const coverUrl = coverFile?.size > 0 ? await uploadFile(coverFile, 'covers') : null

  const { error } = await supabase.from('posts').insert({
    title,
    slug,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    category: formData.get('category') as string || 'General',
    cover_image: coverUrl,
    published: formData.get('published') === 'true',
  })

  if (error) throw new Error('Failed to create post: ' + error.message)

  revalidatePath('/admin/blog')
  redirect('/admin/blog')
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = getSupabase()
  const coverFile = formData.get('cover_image') as File
  const existingCover = formData.get('existing_cover_url') as string
  const coverUrl = coverFile?.size > 0 ? await uploadFile(coverFile, 'covers') : existingCover || null

  const { error } = await supabase.from('posts').update({
    title: formData.get('title') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    category: formData.get('category') as string || 'General',
    cover_image: coverUrl,
    published: formData.get('published') === 'true',
  }).eq('id', postId)

  if (error) throw new Error('Failed to update post: ' + error.message)

  revalidatePath('/admin/blog')
  redirect('/admin/blog')
}
