'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUCKET = 'event-assets'

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

export async function createEvent(formData: FormData) {
  const supabase = getSupabase()
  const heroFile = formData.get('hero_image') as File
  const heroUrl = heroFile?.size > 0 ? await uploadFile(heroFile, 'heroes') : null

  const title = formData.get('title') as string
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now()

  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert({
      title,
      slug,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      event_date: formData.get('event_date') as string,
      event_time: formData.get('event_time') as string,
      is_upcoming: formData.get('is_upcoming') === 'true',
      accent_color: formData.get('accent_color') as string || '#18181b',
      hero_image: heroUrl,
    })
    .select()
    .single()

  if (eventError || !event) throw new Error('Failed to create event: ' + eventError?.message)

  const speakerCount = parseInt(formData.get('speaker_count') as string || '0')
  for (let i = 0; i < speakerCount; i++) {
    const name = formData.get(`speakers[${i}][name]`) as string
    if (!name) continue
    const speakerFile = formData.get(`speakers[${i}][image]`) as File
    const speakerImageUrl = speakerFile?.size > 0 ? await uploadFile(speakerFile, 'speakers') : null
    await supabase.from('speakers').insert({
      event_id: event.id,
      name,
      position: formData.get(`speakers[${i}][position]`) as string,
      image_url: speakerImageUrl,
    })
  }

  revalidatePath('/admin/events')
  redirect('/admin/events')
}

export async function updateEvent(eventId: string, formData: FormData) {
  const supabase = getSupabase()
  const heroFile = formData.get('hero_image') as File
  const existingHeroUrl = formData.get('existing_hero_url') as string
  const heroUrl = heroFile?.size > 0 ? await uploadFile(heroFile, 'heroes') : existingHeroUrl || null

  const title = formData.get('title') as string

  const { error: eventError } = await supabase
    .from('events')
    .update({
      title,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      event_date: formData.get('event_date') as string,
      event_time: formData.get('event_time') as string,
      is_upcoming: formData.get('is_upcoming') === 'true',
      accent_color: formData.get('accent_color') as string || '#18181b',
      hero_image: heroUrl,
    })
    .eq('id', eventId)

  if (eventError) throw new Error('Failed to update event: ' + eventError.message)

  await supabase.from('speakers').delete().eq('event_id', eventId)

  const speakerCount = parseInt(formData.get('speaker_count') as string || '0')
  for (let i = 0; i < speakerCount; i++) {
    const name = formData.get(`speakers[${i}][name]`) as string
    if (!name) continue
    const speakerFile = formData.get(`speakers[${i}][image]`) as File
    const existingSpeakerUrl = formData.get(`speakers[${i}][existing_image]`) as string
    const speakerImageUrl = speakerFile?.size > 0
      ? await uploadFile(speakerFile, 'speakers')
      : existingSpeakerUrl || null
    await supabase.from('speakers').insert({
      event_id: eventId,
      name,
      position: formData.get(`speakers[${i}][position]`) as string,
      image_url: speakerImageUrl,
    })
  }

  revalidatePath('/admin/events')
  redirect('/admin/events')
}
