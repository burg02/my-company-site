'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BUCKET = 'Gallery'

async function uploadFile(file: File, folder: string): Promise<string | null> {
  if (!file || file.size === 0) return null
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, { upsert: false })
  if (error) { console.error('Upload error:', error); return null }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
  return data.publicUrl
}

export async function createAlbum(formData: FormData) {
  const coverFile = formData.get('cover_image') as File
  const coverUrl = coverFile?.size > 0 ? await uploadFile(coverFile, 'covers') : null

  const { data: album, error } = await supabase
    .from('albums')
    .insert({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      tag: formData.get('tag') as string || 'General',
      event_date: formData.get('event_date') as string || null,
      cover_image: coverUrl,
    })
    .select()
    .single()

  if (error || !album) throw new Error('Failed to create album: ' + error?.message)

  // Upload multiple photos
  const photoCount = parseInt(formData.get('photo_count') as string || '0')
  for (let i = 0; i < photoCount; i++) {
    const photoFile = formData.get(`photos[${i}][file]`) as File
    if (!photoFile || photoFile.size === 0) continue
    const photoUrl = await uploadFile(photoFile, `albums/${album.id}`)
    if (!photoUrl) continue
    await supabase.from('photos').insert({
      album_id: album.id,
      image_url: photoUrl,
      caption: formData.get(`photos[${i}][caption]`) as string || '',
    })
  }

  revalidatePath('/admin/gallery')
  redirect('/admin/gallery')
}

export async function deleteAlbum(albumId: string) {
  // Get all photos to delete from storage
  const { data: photos } = await supabase
    .from('photos')
    .select('image_url')
    .eq('album_id', albumId)

  if (photos) {
    const paths = photos.map((p) => {
      const parts = p.image_url.split('/')
      return parts[parts.length - 1]
    })
    if (paths.length > 0) {
      await supabase.storage.from(BUCKET).remove(paths)
    }
  }

  await supabase.from('albums').delete().eq('id', albumId)
  revalidatePath('/admin/gallery')
}

export async function addPhotosToAlbum(albumId: string, formData: FormData) {
  const photoCount = parseInt(formData.get('photo_count') as string || '0')
  for (let i = 0; i < photoCount; i++) {
    const photoFile = formData.get(`photos[${i}][file]`) as File
    if (!photoFile || photoFile.size === 0) continue
    const photoUrl = await uploadFile(photoFile, `albums/${albumId}`)
    if (!photoUrl) continue
    await supabase.from('photos').insert({
      album_id: albumId,
      image_url: photoUrl,
      caption: formData.get(`photos[${i}][caption]`) as string || '',
    })
  }
  revalidatePath('/admin/gallery')
  redirect(`/admin/gallery/${albumId}`)
}

export async function deletePhoto(photoId: string, albumId: string) {
  const { data: photo } = await supabase.from('photos').select('image_url').eq('id', photoId).single()
  if (photo) {
    const parts = photo.image_url.split('/')
    const fileName = parts[parts.length - 1]
    await supabase.storage.from(BUCKET).remove([fileName])
  }
  await supabase.from('photos').delete().eq('id', photoId)
  revalidatePath(`/admin/gallery/${albumId}`)
}
